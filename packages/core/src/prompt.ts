import type { OpenAIModelId } from './types.js';

export type SubmitPromptOptions = {
  /**
   * URL at which to fetch completions
   * @default "https://api.markprompt.com/v1/completions"
   * */
  completionsUrl?: string;
  /**
   * Message returned when the model does not have an answer
   * @default "Sorry, I am not sure how to answer that."
   **/
  iDontKnowMessage?: string;
  /**
   * The OpenAI model to use
   * @default "gpt-3.5-turbo"
   **/
  model?: OpenAIModelId;
  /**
   * The prompt template
   * @default "You are a very enthusiastic company representative who loves to help people! Given the following sections from the documentation (preceded by a section id), answer the question using only that information, outputted in Markdown format. If you are unsure and the answer is not explicitly written in the documentation, you can say 'I don't know' and the question will be passed to the OpenAI model.""
   **/
  promptTemplate?: string;
  /**
   * The model temperature
   * @default 0.1
   **/
  temperature?: number;
  /**
   * The model top P
   * @default 1
   **/
  topP?: number;
  /**
   * The model frequency penalty
   * @default 0
   **/
  frequencyPenalty?: number;
  /**
   * The model present penalty
   * @default 0
   **/
  presencePenalty?: number;
  /**
   * The max number of tokens to include in the response
   * @default 500
   * */
  maxTokens?: number;
  /**
   * The number of sections to include in the prompt context
   * @default 10
   * */
  sectionsMatchCount?: number;
  /**
   * The similarity threshold between the input question and selected sections
   * @default 0.5
   * */
  sectionsMatchThreshold?: number;
  /**
   * AbortController signal
   * @default undefined
   **/
  signal?: AbortSignal;
};

export const MARKPROMPT_COMPLETIONS_URL =
  'https://api.markprompt.com/v1/completions';
export const STREAM_SEPARATOR = '___START_RESPONSE_STREAM___';
export const DEFAULT_MODEL: OpenAIModelId = 'gpt-3.5-turbo';
export const DEFAULT_I_DONT_KNOW_MESSAGE =
  'Sorry, I am not sure how to answer that.';
export const DEFAULT_REFERENCES_HEADING =
  'Answer generated from the following pages:';
export const DEFAULT_LOADING_HEADING = 'Fetching relevant pages...';
export const DEFAULT_PROMPT_TEMPLATE = `You are a very enthusiastic company representative who loves to help people! Given the following sections from the documentation (preceded by a section id), answer the question using only that information, outputted in Markdown format. If you are unsure and the answer is not explicitly written in the documentation, say "{{I_DONT_KNOW}}".

Context sections:
---
{{CONTEXT}}

Question: "{{PROMPT}}"

Answer (including related code snippets if available):`;
export const DEFAULT_TEMPERATURE = 0.1;
export const DEFAULT_TOP_P = 1;
export const DEFAULT_FREQUENCY_PENALTY = 0;
export const DEFAULT_PRESENCE_PENALTY = 0;
export const DEFAULT_MAX_TOKENS = 500;
export const DEFAULT_SECTIONS_MATCH_COUNT = 10;
export const DEFAULT_SECTIONS_MATCH_THRESHOLD = 0.5;

/**
 * Submit a prompt the the Markprompt API.
 *
 * @param prompt - Prompt to submit to the model
 * @param projectKey - The key of your project
 * @param onAnswerChunk - Answers come in via streaming. This function is called when a new chunk arrives
 * @param onReferences - This function is called when a chunk includes references.
 * @param onError - called when an error occurs
 * @param [options] - Optional options object
 */
export async function submitPrompt(
  prompt: string,
  projectKey: string,
  onAnswerChunk: (answerChunk: string) => boolean | undefined | void,
  onReferences: (references: string[]) => void,
  onError: (error: Error) => void,
  options: SubmitPromptOptions = {},
): Promise<void> {
  if (!projectKey) {
    throw new Error('A projectKey is required.');
  }

  if (!prompt) return;

  const iDontKnowMessage =
    options.iDontKnowMessage ?? DEFAULT_I_DONT_KNOW_MESSAGE;

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
          promptTemplate: options.promptTemplate ?? DEFAULT_PROMPT_TEMPLATE,
          temperature: options.temperature ?? DEFAULT_TEMPERATURE,
          topP: options.topP ?? DEFAULT_TOP_P,
          frequencyPenalty:
            options.frequencyPenalty ?? DEFAULT_FREQUENCY_PENALTY,
          presencePenalty: options.presencePenalty ?? DEFAULT_PRESENCE_PENALTY,
          maxTokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
          sectionsMatchCount:
            options.sectionsMatchCount ?? DEFAULT_SECTIONS_MATCH_COUNT,
          sectionsMatchThreshold:
            options.sectionsMatchThreshold ?? DEFAULT_SECTIONS_MATCH_THRESHOLD,
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
          if (parts[1]) {
            onAnswerChunk(parts[1]);
          }
          didHandleHeader = true;
        }
      } else if (chunkValue) {
        const shouldContinue = onAnswerChunk(chunkValue);
        if (!shouldContinue) {
          // If callback returns false, it means it wishes
          // to interrupt the streaming.
          done = true;
        }
      }
    }
  } catch (error) {
    onError(error instanceof Error ? error : new Error(`${error}`));
  }
}
