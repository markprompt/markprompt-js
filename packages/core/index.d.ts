/**
 * @typedef {'gpt-4' | 'gpt-4-0314' | 'gpt-4-32k' | 'gpt-4-32k-0314' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-0301'} OpenAIChatCompletionsModelId
 * @typedef {'text-davinci-003' | 'text-davinci-002' | 'text-curie-001' | 'text-babbage-001' | 'text-ada-001' | 'davinci' | 'curie' | 'babbage' | 'ada'} OpenAICompletionsModelId
 * @typedef {OpenAIChatCompletionsModelId | OpenAICompletionsModelId} OpenAIModelId
 */
/**
 * @type {OpenAIModelId}
 */
export const DEFAULT_MODEL: OpenAIModelId;
export const I_DONT_KNOW_MESSAGE: "Sorry, I am not sure how to answer that.";
export const MARKPROMPT_COMPLETIONS_URL: "https://api.markprompt.com/v1/completions";
export const STREAM_SEPARATOR: "___START_RESPONSE_STREAM___";
export function submitPrompt(prompt: string, projectKey: string, onAnswerChunk: (answerChunk: string) => void, onReferences: (references: string[]) => void, options?: Options): Promise<string>;
export type OpenAIChatCompletionsModelId = 'gpt-4' | 'gpt-4-0314' | 'gpt-4-32k' | 'gpt-4-32k-0314' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-0301';
export type OpenAICompletionsModelId = 'text-davinci-003' | 'text-davinci-002' | 'text-curie-001' | 'text-babbage-001' | 'text-ada-001' | 'davinci' | 'curie' | 'babbage' | 'ada';
export type OpenAIModelId = OpenAIChatCompletionsModelId | OpenAICompletionsModelId;
export type Options = {
    /**
     * - URL at which to fetch completions
     */
    completionsUrl?: string;
    /**
     * - Message returned when the model does not have an answer
     */
    iDontKnowMessage?: string;
    /**
     * - The model to use
     */
    model?: OpenAIModelId;
};
//# sourceMappingURL=index.d.ts.map