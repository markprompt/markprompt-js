/** 
 * @typedef {'gpt-4' | 'gpt-4-0314' | 'gpt-4-32k' | 'gpt-4-32k-0314' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-0301'} OpenAIChatCompletionsModelId
 * @typedef {'text-davinci-003' | 'text-davinci-002' | 'text-curie-001' | 'text-babbage-001' | 'text-ada-001' | 'davinci' | 'curie' | 'babbage' | 'ada'} OpenAICompletionsModelId
 * @typedef {OpenAIChatCompletionsModelId | OpenAICompletionsModelId} OpenAIModelId
 */

/**
 * @type {OpenAIModelId}
 */
export const DEFAULT_MODEL = 'gpt-3.5-turbo';
export const I_DONT_KNOW_MESSAGE = 'Sorry, I am not sure how to answer that.';
export const MARKPROMPT_COMPLETIONS_URL =
  'https://api.markprompt.com/v1/completions';
export const STREAM_SEPARATOR = '___START_RESPONSE_STREAM___';


/**
 * @typedef {Object} Options
 * @property {string} [completionsUrl] - URL at which to fetch completions
 * @property {string} [iDontKnowMessage] - Message returned when the model does not have an answer
 * @property {OpenAIModelId} [model] - The model to use
 */

/**
 * @param {string} prompt - Prompt to submit to the model
 * @param {string} projectKey - The key of your project
 * @param {(answerChunk: string) => void} onAnswerChunk - Answers come in via streaming. This function is called when a new chunk arrives
 * @param {(references: string[]) => void} onReferences - This function is called when a chunk includes references.
 * @param {Options} [options] - Optional options object
 */
export const submitPrompt = async function (
  prompt,
  projectKey,
  onAnswerChunk,
  onReferences,
  options,
) {
  if (!projectKey) {
    throw new Error('A projectKey is required.');
  }

  if (!prompt) return;

  options = {
    model: DEFAULT_MODEL,
    completionsUrl: MARKPROMPT_COMPLETIONS_URL,
    iDontKnowMessage: I_DONT_KNOW_MESSAGE,
    ...(options ?? {}),
  };

  try {
    const res = await fetch(options.completionsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        model: options.model,
        iDontKnowMessage: options.iDontKnowMessage,
        projectKey,
      }),
    });

    if (!res.ok || !res.body) {
      const text = await res.text();
      console.error('Error:', text);
      return I_DONT_KNOW_MESSAGE;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let done = false;
    let startText = '';
    let didHandleHeader = false;

    /** @type {string[]} */
    let refs = [];
    let answer = '';

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      if (!didHandleHeader) {
        startText = startText + chunkValue;
        if (startText.includes(STREAM_SEPARATOR)) {
          const parts = startText.split(STREAM_SEPARATOR);
          try {
            refs = JSON.parse(parts[0]);
          } catch {}
          onAnswerChunk(parts[1]);
          didHandleHeader = true;
        }
      } else {
        onAnswerChunk(chunkValue);
      }
    }
    onReferences(refs);
  } catch (e) {
    console.error('Error', e);
    onAnswerChunk(options.iDontKnowMessage);
  }
};
