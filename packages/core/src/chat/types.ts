import type {
  ChatCompletionMessageToolCall,
  ChatCompletionTool,
  ChatCompletionToolChoiceOption,
} from 'openai/resources/chat/completions';

import type { FileSectionReference } from '../types.js';
import type { ArrayToUnion } from '../utils.js';

export type {
  ChatCompletion,
  ChatCompletionAssistantMessageParam,
  ChatCompletionChunk,
  ChatCompletionContentPart,
  ChatCompletionContentPartRefusal,
  ChatCompletionFunctionMessageParam,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
  ChatCompletionSystemMessageParam,
  ChatCompletionTool,
  ChatCompletionToolChoiceOption,
  ChatCompletionToolMessageParam,
  ChatCompletionUserMessageParam,
} from 'openai/resources/chat/completions';

export const CHAT_COMPLETIONS_MODELS = [
  'claude-3-5-sonnet-20240620',
  'gpt-3.5-turbo',
  'gpt-4-1106-preview',
  'gpt-4-32k',
  'gpt-4-turbo-preview',
  'gpt-4',
  'gpt-4o',
  'gpt-4o-mini',
  'meta-llama-3-70b-instruct',
  'meta-llama-3-8b-instruct',
  'mixtral-8x7b-instruct-v0.1',
] as const;

export type ChatCompletionsModel = ArrayToUnion<typeof CHAT_COMPLETIONS_MODELS>;

export const COMPLETIONS_MODELS = [
  'ada',
  'babbage',
  'curie',
  'davinci',
  'text-ada-001',
  'text-babbage-001',
  'text-curie-001',
  'text-davinci-002',
  'text-davinci-003',
] as const;

export type CompletionsModel = ArrayToUnion<typeof COMPLETIONS_MODELS>;

export const EMBEDDINGS_MODEL = 'text-embedding-ada-002';

export type EmbeddingsModel = typeof EMBEDDINGS_MODEL;

export type Model = ChatCompletionsModel | CompletionsModel | EmbeddingsModel;

export type SystemActionName =
  | 'AskQuestionToUser'
  | 'RespondToUser'
  | 'RetrieveKnowledge'
  | 'LookupInfoInFiles'
  | 'ReportStatus'
  | 'ChooseCategory'
  | 'LookupCategories'
  | 'LookupExamples'
  | 'Think'
  | 'Observe'
  | 'ExtractFeedback'
  | 'AnalyzeFile';

export interface SystemAction {
  function: {
    name: SystemActionName;
    arguments: string;
  };
  type: 'function';
}

export interface ChatEvent {
  message: string;
  capabilityId?: string;
  level?: 'info' | 'detail' | 'data';
}

export interface ChatCompletionMetadata {
  threadId?: string;
  messageId?: string;
  references?: FileSectionReference[];
  steps?: (SystemAction | ChatCompletionMessageToolCall)[];
  /**
   * @deprecated Use `messageId` instead.
   */
  promptId?: string;
  events?: ChatEvent[];
}

export interface NoStreamingData {
  text: string;
  references?: FileSectionReference[];
  steps?: ChatCompletionMessageToolCall[];
  responseId: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface PoliciesOptions {
  /**
   * If true, enable the use of policies.
   * @default true
   **/
  enabled?: boolean;
  /**
   * Only use specific policies for retrieval.
   * @default []
   **/
  ids?: string[];
}

export interface MessageTagOptions {
  /**
   * If true, enable the use of message tags.
   * @default true
   **/
  enabled?: boolean;
  /**
   * If true, use all message tags added in the project.
   * Otherwise, only use the ones explicitly specified
   * in the `ids` list.
   * @default true
   **/
  useAll?: boolean;
  /**
   * Only use specific message tags for retrieval.
   * @default []
   **/
  ids?: string[];
}

export interface RetrievalOptions {
  /**
   * If true, enable retrieval.
   * @default true
   **/
  enabled?: boolean;
  /**
   * Only use specific sources for retrieval.
   * @default []
   **/
  ids?: string[];
}

export interface SubmitChatOptions {
  /**
   * The assistant ID.
   **/
  assistantId?: string;
  /**
   * The assistant version ID. If not provided, the default version of
   * the assistant will be used.
   **/
  assistantVersionId?: string;
  /**
   * The system prompt.
   **/
  systemPrompt?: string;
  /**
   * Context to use for template variable replacements in the system prompt.
   * @default {}
   **/

  context?: any;
  /**
   * The OpenAI model to use.
   * @default "gpt-4o"
   **/
  model?: ChatCompletionsModel;
  /**
   * Options for the use of policies.
   **/
  policiesOptions?: PoliciesOptions;
  /**
   * Options for the use of message tags.
   **/
  messageTagOptions?: MessageTagOptions;
  /**
   * Options for retrieval.
   **/
  retrievalOptions?: RetrievalOptions;
  /**
   * The output format of the response.
   * @default "markdown"
   */
  outputFormat?: 'markdown' | 'slack' | 'html';
  /**
   * If true, output the response in JSON format.
   * @default false
   */
  jsonOutput?: boolean;
  /**
   * Storage and PII redaction options for user input and model output.
   * @default { input: 'store', output: 'store' }
   */
  redact?: {
    input?: 'store' | 'redact_pii' | 'no_store';
    output?: 'store' | 'redact_pii' | 'no_store';
  };
  /**
   * The model temperature.
   * @default 0.1
   **/
  temperature?: number;
  /**
   * The model top P.
   * @default 1
   **/
  topP?: number;
  /**
   * The model frequency penalty.
   * @default 0
   **/
  frequencyPenalty?: number;
  /**
   * The model present penalty.
   * @default 0
   **/
  presencePenalty?: number;
  /**
   * The max number of tokens to include in the response.
   * @default 500
   * */
  maxTokens?: number;
  /**
   * Settings that determine the agent's capabilities.
   * @default undefined
   * */
  agentSettings?: {
    type: string;
    data: { [key: string]: unknown };
  };
  /**
   * Whether or not to rerank retrieved context sections
   * @default false
   * */
  useReranker?: boolean;
  /**
   * The number of sections to include in the prompt context.
   * @default 10
   * */
  sectionsMatchCount?: number;
  /**
   * The similarity threshold between the input question and selected sections.
   * @default 0.5
   * */
  sectionsMatchThreshold?: number;
  /**
   * Thread ID. Returned with the first, and every subsequent, chat response. Used to continue a thread.
   * @default undefined
   */
  threadId?: string;
  /**
   * Metadata to attach to the thread.
   * @default undefined
   */

  threadMetadata?: any;
  /**
   * A list of tools the model may call. Currently, only functions are
   * supported as a tool. Use this to provide a list of functions the model may
   * generate JSON inputs for.
   */
  tools?: ChatCompletionTool[];
  /**
   * Controls which (if any) function is called by the model. `none` means the
   * model will not call a function and instead generates a message. `auto`
   * means the model can pick between generating a message or calling a
   * function. Specifying a particular function via
   * `{"type: "function", "function": {"name": "my_function"}}` forces the
   * model to call that function. `none` is the default when no functions are present. `auto` is the default if functions are present.
   */
  toolChoice?: ChatCompletionToolChoiceOption;
  /**
   * Whether or not to inject context relevant to the query.
   * @default false
   **/
  doNotInjectContext?: boolean;
  /**
   * Whether or not to skip system instructions.
   * @default false
   **/
  skipSystemInstructions?: boolean;
  /**
   * If true, the bot may encourage the user to ask a follow-up question, for instance to gather additional information.
   * @default true
   **/
  allowFollowUpQuestions?: boolean;
  /**
   * Whether or not to include message in insights.
   * @default false
   **/
  excludeFromInsights?: boolean;
  /**
   * AbortController signal.
   * @default undefined
   **/
  signal?: AbortSignal;
  /**
   * Enabled debug mode. This will log debug and error information to the console.
   * @default false
   */
  debug?: boolean;
  /**
   * Message returned when the model does not have an answer.
   * @default "Sorry, I am not sure how to answer that."
   * @deprecated Will be removed.
   **/
  iDontKnowMessage?: string;
  /**
   * Disable streaming and return the entire response at once.
   */
  stream?: boolean;
  additionalMetadata?: { [key: string]: unknown };
  /**
   * Live chat options.
   **/
  liveChatOptions?: {
    enabled: boolean;
  };
  /**
   * Whether or not to use conversations.
   * @default false
   **/
  useConversations?: boolean;
  user?: {
    name: string;
    email: string;
  };
}
