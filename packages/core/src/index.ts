import type { OpenAIModelId } from './types.js';

export type { OpenAIModelId };

export type Options = {
  /** URL at which to fetch completions */
  completionsUrl?: string;
  /** Message returned when the model does not have an answer */
  iDontKnowMessage?: string;
  /** The OpenAI model to use */
  model?: OpenAIModelId;
  /** The prompt template */
  promptTemplate?: string;
  /** The model temperature */
  temperature?: number;
  /** The model top P */
  topP?: number;
  /** The model frequency penalty */
  frequencyPenalty?: number;
  /** The model present penalty */
  presencePenalty?: number;
  /** The max number of tokens to include in the response */
  maxTokens?: number;
  /** 	The number of sections to include in the prompt context */
  sectionsMatchCount?: number;
  /** The similarity threshold between the input question and selected sections */
  sectionsMatchThreshold?: number;
  /** AbortController signal */
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
          promptTemplate: options.promptTemplate,
          temperature: options.temperature,
          topP: options.topP,
          frequencyPenalty: options.frequencyPenalty,
          presencePenalty: options.presencePenalty,
          maxTokens: options.maxTokens,
          sectionsMatchCount: options.sectionsMatchCount,
          sectionsMatchThreshold: options.sectionsMatchThreshold,
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
