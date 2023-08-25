import type { OpenAIModelId } from './types.js';

export interface CompletionsOptions {
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
   * @default "You are a very enthusiastic company representative who loves to help people! Given the following sections from the documentation (preceded by a section id), answer the question using only that information, outputted in Markdown format. If you are unsure and the answer is not explicitly written in the documentation, say \"{{I_DONT_KNOW}}\".\n\nContext sections:\n---\n{{CONTEXT}}\n\nQuestion: \"{{PROMPT}}\"\n\nAnswer (including related code snippets if available):\n"
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
}

export const DEFAULT_COMPLETIONS_OPTIONS = {
  iDontKnowMessage: 'Sorry, I am not sure how to answer that.',
  model: 'gpt-3.5-turbo',
  promptTemplate: `You are a very enthusiastic company representative who loves to help people! Given the following sections from the documentation (preceded by a section id), answer the question using only that information, outputted in Markdown format. If you are unsure and the answer is not explicitly written in the documentation, say "{{I_DONT_KNOW}}".\n\nContext sections:\n---\n{{CONTEXT}}\n\nQuestion: "{{PROMPT}}"\n\nAnswer (including related code snippets if available):`,
  temperature: 0.1,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
  maxTokens: 500,
  sectionsMatchCount: 10,
  sectionsMatchThreshold: 0.5,
} satisfies CompletionsOptions;
