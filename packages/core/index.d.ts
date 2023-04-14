/**
 * @typedef {Object} Options
 * @property {string} [completionsUrl] - URL at which to fetch completions
 * @property {string} [iDontKnowMessage] - Message returned when the model does not have an answer
 * @property {OpenAIModelId} [model] - The model to use
 * @property {string} [promptTemplate] - The prompt template
 * @property {AbortSignal} [signal] - Abort signal
 */
/**
 * @param {string} prompt - Prompt to submit to the model
 * @param {string} projectKey - The key of your project
 * @param {(answerChunk: string) => void} onAnswerChunk - Answers come in via streaming. This function is called when a new chunk arrives
 * @param {(references: string[]) => void} onReferences - This function is called when a chunk includes references.
 * @param {(error: Error) => void} onError - called when an error occurs
 * @param {Options} [options] - Optional options object
 */
export function submitPrompt(prompt: string, projectKey: string, onAnswerChunk: (answerChunk: string) => void, onReferences: (references: string[]) => void, onError: (error: Error) => void, options?: Options): Promise<void>;
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
    /**
     * - The prompt template
     */
    promptTemplate?: string;
    /**
     * - Abort signal
     */
    signal?: AbortSignal;
};
export type OpenAIChatCompletionsModelId = 'gpt-4' | 'gpt-4-0314' | 'gpt-4-32k' | 'gpt-4-32k-0314' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-0301';
export type OpenAICompletionsModelId = 'text-davinci-003' | 'text-davinci-002' | 'text-curie-001' | 'text-babbage-001' | 'text-ada-001' | 'davinci' | 'curie' | 'babbage' | 'ada';
export type OpenAIModelId = OpenAIChatCompletionsModelId | OpenAICompletionsModelId;
//# sourceMappingURL=index.d.ts.map