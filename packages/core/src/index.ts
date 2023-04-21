import type { OpenAIModelId } from './types.js';

export type { OpenAIModelId };

type Options = {
  /** URL at which to fetch completions */
  completionsUrl?: string;
  /** Message returned when the model does not have an answer */
  iDontKnowMessage?: string;
  /** The OpenAI model to use */
  model?: OpenAIModelId;
  /** The prompt template */
  promptTemplate?: string;
  /** AbortController signal */
  signal?: AbortSignal;
};

export const DEFAULT_MODEL: OpenAIModelId = 'gpt-3.5-turbo';
export const I_DONT_KNOW_MESSAGE = 'Sorry, I am not sure how to answer that.';
export const MARKPROMPT_COMPLETIONS_URL =
  'https://api.markprompt.com/v1/completions';
export const STREAM_SEPARATOR = '___START_RESPONSE_STREAM___';

/**
 * @param {string} prompt - Prompt to submit to the model
 * @param {string} projectKey - The key of your project
 * @param {(answerChunk: string) => void} onAnswerChunk - Answers come in via streaming. This function is called when a new chunk arrives
 * @param {(references: string[]) => void} onReferences - This function is called when a chunk includes references.
 * @param {(error: Error) => void} onError - called when an error occurs
 * @param {Options} [options] - Optional options object
 */
export async function submitPrompt(
  prompt: string,
  projectKey: string,
  onAnswerChunk: (answerChunk: string) => boolean | undefined | void,
  onReferences: (references: string[]) => void,
  onError: (error: Error) => void,
  options: Options = {},
) {
  if (!projectKey) {
    throw new Error('A projectKey is required.');
  }

  if (!prompt) return;

  const iDontKnowMessage = options.iDontKnowMessage ?? I_DONT_KNOW_MESSAGE;

  try {
    const res = await fetch(
      options.completionsUrl ?? MARKPROMPT_COMPLETIONS_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          projectKey: projectKey,
          iDontKnowMessage,
          model: options?.model ?? DEFAULT_MODEL,
          promptTemplate: options.promptTemplate,
        }),
        signal: options.signal,
      },
    );

    if (!res.ok || !res.body) {
      const text = await res.text();
      onAnswerChunk(iDontKnowMessage);
      onError(new Error(text));
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let done = false;
    let startText = '';
    let didHandleHeader = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      if (!didHandleHeader) {
        startText = startText + chunkValue;
        if (startText.includes(STREAM_SEPARATOR)) {
          const parts = startText.split(STREAM_SEPARATOR);
          try {
            onReferences(JSON.parse(parts[0]));
          } catch {
            // do nothing
          }
          onAnswerChunk(parts[1]);
          didHandleHeader = true;
        }
      } else {
        const shouldContinue = onAnswerChunk(chunkValue);
        if (!shouldContinue) {
          // If callback returns false, it means it wishes
          // to interrupt the streaming.
          done = true;
        }
      }
    }
  } catch (error) {
    onAnswerChunk(iDontKnowMessage);
    onError(error instanceof Error ? error : new Error(`${error}`));
  }
}
