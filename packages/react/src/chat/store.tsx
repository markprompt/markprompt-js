import {
  isAbortError,
  isToolCall,
  submitChat,
  type ChatCompletionMessageToolCall,
  type ChatCompletionTool,
  type SubmitChatOptions,
  type SubmitChatYield,
  type ChatCompletionChunk,
} from '@markprompt/core';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { createStore, useStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { toValidApiMessages } from './utils.js';
import type { MarkpromptOptions } from '../types.js';
import {
  hasValueAtKey,
  isIterable,
  isPresent,
  isStoredError,
} from '../utils.js';

export type ChatLoadingState =
  | 'indeterminate'
  | 'preload'
  | 'streaming-answer'
  | 'done'
  | 'cancelled';

export interface ToolCall {
  status: 'loading' | 'done' | 'error';
  error?: string;
  result?: string;
}

export interface ChatViewMessage extends Omit<SubmitChatYield, 'threadId'> {
  /**
   * Message id.
   */
  id: ReturnType<typeof crypto.randomUUID>;
  /**
   * The loading state.
   */
  state: ChatLoadingState;
  /**
   * Message name.
   */
  name?: string;
  /**
   * Error associated to the message.
   */
  error?: Error;
}

export interface ConfirmationProps {
  /**
   * Tool calls as returned by the model
   */
  toolCalls: ChatCompletionMessageToolCall[];
  /**
   * Status and results of tool calls
   */
  toolCallsStatus: { [key: string]: ToolCall };
  /**
   * Tools as provided by the user
   */
  tools?: ChatViewTool[];
  confirmToolCalls: () => void;
}

export interface ChatViewTool {
  /**
   * OpenAI tool definition.
   */
  tool: ChatCompletionTool;
  /**
   * The actual function to call. Called with a JSON string as returned from
   * OpenAI. Should validate the JSON for correctness as OpenAI can hallucinate
   * arguments. Must return a string to feed the result back into OpenAI.
   **/
  call: (args: string) => Promise<string>;
  /**
   * Whether user needs to confirm a call to this function or function calls
   * will be executed right away.
   * @default true
   */
  requireConfirmation?: boolean;
  /**
   * If true, show a message when the tool is automatically triggered.
   * @default true
   */
  showDefaultAutoTriggerMessage?: boolean;
}

export interface ToolsOptions {
  /**
   * A list of tool definitions.
   */
  tools?: ChatViewTool[];
  /**
   * An optional user-provided confirmation message component that takes the
   * tool calls provided by OpenAI and a confirm function that should be called
   * when the user confirms the tool calls.
   */
  ToolCallsConfirmation?: (props: ConfirmationProps) => JSX.Element;
}

export type UserConfigurableOptions = Omit<
  SubmitChatOptions,
  'signal' | 'tools'
> &
  ToolsOptions;

export type SubmitChatMessage =
  | { content: string; role: 'user'; name?: string }
  | {
      role: 'assistant';
      tool_calls: ChatCompletionChunk.Choice.Delta.ToolCall[];
    }
  | { content: string; role: 'tool'; name: string; tool_call_id: string };

export interface ThreadData {
  lastUpdated: string;
  messages: ChatViewMessage[];
}

export interface ChatStoreState {
  /**
   * The project key associated to the project.
   **/
  projectKey: string;
  /**
   * The base API URL.
   **/
  apiUrl?: string;
  /**
   * Abort handler.
   **/
  abort?: () => void;
  /**
   * The current thread id.
   **/
  threadId?: string;
  /**
   * Set a thread id.
   **/
  setThreadId: (threadId: string) => void;
  /**
   * Select a thread.
   **/
  selectThread: (threadId?: string) => void;
  /**
   * The messages in the current thread.
   **/
  messages: ChatViewMessage[];
  /**
   * Set messages.
   **/
  setMessages: (messages: ChatViewMessage[]) => void;
  /**
   * Set a message by id.
   **/
  setMessageById(id: string, next: Partial<ChatViewMessage>): void;
  /**
   * Set a message by index.
   **/
  setMessageByIndex: (index: number, next: Partial<ChatViewMessage>) => void;
  /**
   * Set a tool call by id.
   **/
  setToolCallById: (toolCallId: string, next: Partial<ToolCall>) => void;
  /**
   * Dictionary of threads by project id.
   **/
  threadIdsByProjectKey: { [projectKey: string]: string[] };
  /**
   * Dictionary of messages by thread id.
   **/
  messagesByThreadId: { [threadId: string]: ThreadData };
  /**
   * Dictionary of tool calls by id.
   **/
  toolCallsByToolCallId: { [tool_call_id: string]: ToolCall };
  /**
   * Submit a list of new messages.
   **/
  submitChat: (
    messages: SubmitChatMessage[],
    additionalMetadata?: {
      [key: string]: unknown;
    },
  ) => void;
  /**
   * Submit tool calls.
   **/
  submitToolCalls: (message: ChatViewMessage) => Promise<void>;
  /**
   * User configurable chat options.
   **/
  options?: MarkpromptOptions['chat'];
  /**
   * Set the chat options for this session.
   **/
  setOptions: (options: UserConfigurableOptions) => void;
  /**
   * Dictionary of disclaimer acceptance by project id.
   **/
  didAcceptDisclaimerByProjectKey: { [projectKey: string]: boolean };
  /**
   * Acceptance state of the disclaimer.
   **/
  didAcceptDisclaimer: boolean;
  /**
   * Set the acceptance state of the disclaimer.
   **/
  setDidAcceptDisclaimer: (accept: boolean) => void;
  /**
   * Trigger a regeneration of the last answer.
   **/
  regenerateLastAnswer: () => void;
}

export interface CreateChatOptions {
  debug?: boolean;
  projectKey: string;
  apiUrl?: string;
  persistChatHistory?: boolean;
  chatOptions?: MarkpromptOptions['chat'];
  storeKey?: string;
}

/**
 * Creates a chat store for a given project key.
 * Keeps track of messages by project key and thread id.
 *
 * @param projectKey - Markprompt project key
 * @param persistChatHistory - Should chat history be persisted in local storage?
 */
export const createChatStore = ({
  chatOptions,
  debug,
  persistChatHistory,
  projectKey,
  storeKey,
  apiUrl, // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
}: CreateChatOptions) => {
  if (!projectKey) {
    throw new Error(
      `Markprompt: a project key is required. Make sure to pass your Markprompt project key to createChatStore.`,
    );
  }

  return createStore<ChatStoreState>()(
    immer(
      persist(
        (set, get) => ({
          apiUrl,
          projectKey,
          messages: [],
          didAcceptDisclaimer: false,
          threadIdsByProjectKey: {
            [projectKey]: [],
          },
          messagesByThreadId: {},
          toolCallsByToolCallId: {},
          didAcceptDisclaimerByProjectKey: {},
          setThreadId: (threadId: string) => {
            set((state) => {
              // Set the thread id for this session
              state.threadIdsByProjectKey[projectKey] ??= [];
              state.threadId = threadId;

              if (!isIterable(state.threadIdsByProjectKey[projectKey])) {
                // Backward-compatibility
                state.threadIdsByProjectKey[projectKey] = [];
              }

              // Save the thread id for this project, for later sessions
              state.threadIdsByProjectKey[projectKey] = [
                ...new Set([
                  ...state.threadIdsByProjectKey[projectKey],
                  threadId,
                ]),
              ];

              // Save the messages for this thread
              state.messagesByThreadId[threadId] = {
                lastUpdated: new Date().toISOString(),
                messages: state.messages,
              };
            });
          },
          selectThread: (threadId?: string) => {
            if (threadId && threadId === get().threadId) {
              return;
            }

            // abort the current request, if any
            get().abort?.();

            set((state) => {
              if (!threadId) {
                // Start a new thread
                state.threadId = undefined;
                state.messages = [];
                return;
              }

              // Restore an existing thread
              state.threadId = threadId;
              state.messages =
                state.messagesByThreadId[threadId]?.messages ?? [];
            });
          },
          setMessages: (messages: ChatViewMessage[]) => {
            set((state) => {
              state.messages = messages;

              const threadId = state.threadId;
              if (!threadId) return;

              // save the message to local storage
              state.messagesByThreadId[threadId] = {
                lastUpdated: new Date().toISOString(),
                messages,
              };
            });
          },
          setMessageByIndex: (
            index: number,
            next: Partial<ChatViewMessage>,
          ) => {
            set((state) => {
              let currentMessage = state.messages[index] ?? {};

              // update the current message
              currentMessage = { ...currentMessage, ...next };
              state.messages[index] = currentMessage;

              const threadId = state.threadId;
              if (!threadId) return;

              // save the message to local storage
              state.messagesByThreadId[threadId] = {
                lastUpdated: new Date().toISOString(),
                messages: state.messages,
              };
            });
          },
          setMessageById: (id: string, next: Partial<ChatViewMessage>) => {
            set((state) => {
              let index = state.messages.findIndex((m) => m.id === id);
              index = index === -1 ? state.messages.length : index;

              let currentMessage = state.messages[index] ?? {};
              currentMessage = {
                ...currentMessage,
                ...next,
              };
              state.messages[index] = currentMessage;

              const threadId = state.threadId;
              if (!threadId) return;

              // save the message to local storage
              state.messagesByThreadId[threadId] = {
                lastUpdated: new Date().toISOString(),
                messages: state.messages,
              };
            });
          },
          setToolCallById(toolCallId, next) {
            set((state) => {
              state.toolCallsByToolCallId[toolCallId] = {
                ...state.toolCallsByToolCallId[toolCallId],
                ...next,
              };
            });
          },
          submitChat: async (messages, additionalMetadata) => {
            const messageIds = Array.from({ length: messages.length }, () =>
              self.crypto.randomUUID(),
            );
            const responseId = self.crypto.randomUUID();

            set((state) => {
              state.messages.push(
                ...messages.map((message, i) => ({
                  ...message,
                  id: messageIds[i],
                  references: [],
                  state: 'indeterminate' as const,
                })),
                // also create a placeholder message for the assistants response
                {
                  id: responseId,
                  role: 'assistant',
                  state: 'indeterminate',
                },
              );
            });

            // abort any pending or ongoing requests
            get().abort?.();

            const prevMessageId = get().messages.findLast(
              (m) =>
                m.role === 'user' &&
                m.state !== 'done' &&
                m.state !== 'cancelled' &&
                !messageIds.includes(m.id),
            )?.id;

            if (prevMessageId) {
              get().setMessageById(prevMessageId, {
                state: 'cancelled',
              });
            }

            // create a new abort controller
            const controller = new AbortController();
            const abort = (): void => {
              controller.abort();
              for (const id of [...messageIds, responseId]) {
                get().setMessageById(id, {
                  state: 'cancelled',
                });
              }
            };

            set((state) => {
              state.abort = abort;
            });

            // Get ready to do the request
            const apiMessages = toValidApiMessages(get().messages);

            for (const id of [...messageIds, responseId]) {
              get().setMessageById(id, {
                state: 'preload',
              });
            }

            const options = {
              apiUrl: get().apiUrl,
              threadId: get().threadId,
              signal: controller.signal,
              debug,
              ...get().options,
              tools: get().options?.tools?.map((x) => x.tool),
              additionalMetadata,
            };

            // do the chat completion request
            try {
              for await (const chunk of submitChat(
                apiMessages,
                projectKey,
                options,
              )) {
                if (controller.signal.aborted) continue;

                if (chunk.threadId) {
                  get().setThreadId(chunk.threadId);
                }

                for (const id of messageIds) {
                  get().setMessageById(id, {
                    state: 'streaming-answer',
                  });
                }

                get().setMessageById(responseId, {
                  state: 'streaming-answer',
                  ...chunk,
                });
              }
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error(error);

              if (isAbortError(error)) return;

              for (const id of [...messageIds, responseId]) {
                get().setMessageById(id, {
                  state: 'cancelled',
                });
              }

              get().setMessageById(responseId, {
                error:
                  error instanceof Error ? error : new Error(String(error)),
              });
            }

            if (get().abort === abort) {
              set((state) => {
                state.abort = undefined;
              });
            }

            if (controller.signal.aborted) return;

            for (const id of [...messageIds, responseId]) {
              const message = get().messages.find((m) => m.id === id);

              if (!message) continue;
              if (message.state === 'cancelled') continue;

              get().setMessageById(id, {
                state: 'done',
              });
            }

            /**
             * Submit automatic tool calls if none of the tool calls require
             * confirmation.
             *
             * We do this so that we can return the result of all tool calls to
             * OpenAI simultaneously and OpenAI can generate a single response in return.
             *
             * If we have some calls that require confirmation and some that do not, we will
             * do all calls simultaneously after the user has confirmed.
             **/
            const responseMessage = get().messages.find(
              (m) => m.id === responseId,
            );

            if (!responseMessage?.tool_calls) return;

            const tools = get().options?.tools;
            if (!tools) return;

            if (
              responseMessage.tool_calls.every((x) => {
                const name = x.function?.name;
                const tool = tools.find((x) => x.tool.function.name === name);
                return tool?.requireConfirmation === false;
              })
            ) {
              get().submitToolCalls(responseMessage);
            }
          },
          async submitToolCalls(message: ChatViewMessage) {
            if (!message.tool_calls) return;

            const tools = get().options?.tools;
            if (!tools) return;

            const toolCallResults = await Promise.allSettled(
              message.tool_calls.filter(isToolCall).map(async (tool_call) => {
                const tool = tools.find(
                  (x) => x.tool.function.name === tool_call.function?.name,
                );

                if (!tool) throw new Error('Tool not found');

                try {
                  get().setToolCallById(tool_call.id!, {
                    status: 'loading',
                  });

                  const result = await tool.call(
                    tool_call.function?.arguments || '{}',
                  );

                  get().setToolCallById(tool_call.id!, {
                    result,
                    status: 'done',
                  });

                  return { result, tool_call, tool };
                } catch (error) {
                  get().setToolCallById(tool_call.id!, {
                    status: 'error',
                    error:
                      error instanceof Error ? error.message : String(error),
                  });
                }
              }),
            );

            get().submitChat(
              toolCallResults
                .filter(hasValueAtKey('status', 'fulfilled' as const))
                .filter((x) => x.value)
                .map((x) => ({
                  role: 'tool',
                  name: x.value!.tool.tool.function.name,
                  tool_call_id: x.value!.tool_call.id!,
                  content: x.value!.result,
                })),
            );
          },
          options: chatOptions ?? {},
          setOptions: (options) => {
            set((state) => {
              state.options = options;
            });
          },
          setDidAcceptDisclaimer: (accept: boolean) => {
            set((state) => {
              if (!state.projectKey) {
                return;
              }
              state.didAcceptDisclaimerByProjectKey[state.projectKey] = accept;
              state.didAcceptDisclaimer = accept;
            });
          },
          regenerateLastAnswer: () => {
            const messages = [...get().messages];

            const lastUserMessageIndex = messages.findLastIndex(
              (m) => m.role === 'user',
            );
            if (lastUserMessageIndex < 0) return;

            const lastUserMessage = messages[lastUserMessageIndex];
            if (!lastUserMessage.content) return;

            get().setMessages(messages.slice(0, lastUserMessageIndex));
            get().submitChat([
              {
                role: 'user',
                content: lastUserMessage.content,
              },
            ]);
          },
        }),
        {
          name: storeKey ?? 'markprompt',
          version: 1,
          storage: createJSONStorage(
            () => (persistChatHistory ? localStorage : sessionStorage),
            {
              reviver: (_, value) => {
                if (value && isStoredError(value)) {
                  const error = new Error(value.message);
                  error.name = value.name;
                  if (value.stack) error.stack = value.stack;
                  if (value.cause) error.cause = value.cause;
                  return error;
                }

                return value;
              },
              replacer: (_, value) => {
                if (value instanceof Error) {
                  return Object.fromEntries(
                    [
                      ['type', 'error'],
                      ['name', value.name],
                      ['message', value.message],
                      ['cause', value.cause],
                    ].filter(([, v]) => v !== undefined),
                  );
                }
                return value;
              },
            },
          ),
          // Only store threadsByProjectKey in local storage
          partialize: (state) => {
            return {
              threadIdsByProjectKey: state.threadIdsByProjectKey,
              messagesByThreadId: state.messagesByThreadId,
              toolCallsByToolCallId: state.toolCallsByToolCallId,
              didAcceptDisclaimerByProjectKey:
                state.didAcceptDisclaimerByProjectKey,
            };
          },
          // Restore the last thread for this project if it's < 4 hours old
          onRehydrateStorage: () => (state) => {
            if (!state || typeof state !== 'object') return;

            if (
              !state.options?.disclaimerView ||
              (projectKey &&
                state.didAcceptDisclaimerByProjectKey?.[projectKey])
            ) {
              state.setDidAcceptDisclaimer(true);
            }

            const { threadIdsByProjectKey, messagesByThreadId } = state;

            const threadIds = threadIdsByProjectKey?.[projectKey] ?? [];

            const now = new Date();
            const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);

            const projectThreads = Object.entries(messagesByThreadId)
              // Filter out threads that are not in the list of threads for
              // this project
              .filter(([id]) => threadIds.includes(id))
              // Filter out threads older than 4 hours
              .filter(([, { lastUpdated }]) => {
                const lastUpdatedDate = new Date(lastUpdated);
                return lastUpdatedDate > fourHoursAgo;
              })
              // sort by last updated date, descending
              .sort(([, { lastUpdated: a }], [, { lastUpdated: b }]) =>
                b.localeCompare(a),
              );

            if (projectThreads.length === 0 || !isPresent(projectThreads[0])) {
              return;
            }
            const [threadId, { messages }] = projectThreads[0];

            state.setThreadId(threadId);
            state.setMessages(
              messages.map((x) => ({
                ...x,
                state:
                  // cancel any pending or streaming requests
                  x.state === 'preload' || x.state === 'streaming-answer'
                    ? 'cancelled'
                    : x.state,
              })),
            );
          },
        },
      ),
    ),
  );
};

type ChatStore = ReturnType<typeof createChatStore>;

export const ChatContext = createContext<ChatStore | null>(null);

export interface ChatProviderProps {
  chatOptions?: MarkpromptOptions['chat'];
  children: ReactNode;
  debug?: boolean;
  projectKey: string;
  storeKey?: string;
  apiUrl?: string;
}

export function ChatProvider(props: ChatProviderProps): JSX.Element {
  const { chatOptions, children, debug, projectKey, storeKey, apiUrl } = props;

  const store = useRef<ChatStore>();

  if (!store.current) {
    store.current = createChatStore({
      apiUrl,
      projectKey,
      chatOptions,
      debug,
      persistChatHistory: chatOptions?.history,
      storeKey,
    });
  }

  // update chat options when they change
  useEffect(() => {
    if (!chatOptions) return;
    store.current?.getState().setOptions(chatOptions);
  }, [chatOptions]);

  return (
    <ChatContext.Provider value={store.current}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatStore<T>(selector: (state: ChatStoreState) => T): T {
  const store = useContext(ChatContext);
  if (!store) throw new Error('Missing ChatContext.Provider in the tree');
  return useStore(store, selector);
}

export const selectProjectThreads = (
  state: ChatStoreState,
): [
  threadId: string,
  { lastUpdated: string; messages: ChatViewMessage[] },
][] => {
  const projectKey = state.projectKey;

  const threadIds = state.threadIdsByProjectKey[projectKey];
  if (!threadIds || threadIds.length === 0) return [];

  const messagesByThreadId = Object.entries(state.messagesByThreadId)
    .filter(([id]) => threadIds.includes(id))
    // Ascending order, so the newest thread will be closest to the
    // dropdown toggle
    .sort(([, { lastUpdated: a }], [, { lastUpdated: b }]) =>
      a.localeCompare(b),
    );

  if (!messagesByThreadId) return [];

  return messagesByThreadId;
};
