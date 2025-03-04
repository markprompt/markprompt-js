import {
  isToolCall,
  submitChat,
  type ChatCompletionContentPart,
  type ChatCompletionMessageToolCall,
} from '@markprompt/core/chat';
import { isAbortError } from '@markprompt/core/utils';
import { createContext, useContext } from 'react';
// eslint-disable-next-line import-x/no-deprecated
import { createStore, useStore, type StoreApi } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { deepMerge, toValidApiMessages } from './utils.js';
import type {
  ChatViewMessage,
  ChatViewUserMessage,
  MarkpromptOptions,
  ToolCall,
  UserConfigurableOptions,
} from '../types.js';
import {
  hasPresentKey,
  hasValueAtKey,
  isIterable,
  isPresent,
  isStoredError,
} from '../utils.js';

export type SubmitChatMessage =
  | {
      content: string | ChatCompletionContentPart[];
      role: 'user';
      name?: string;
    }
  | {
      role: 'assistant';
      tool_calls: ChatCompletionMessageToolCall[];
    }
  | {
      // todo: this one is just for live chat. maybe there is a cleaner way
      role: 'assistant' | 'user';
      content: string | ChatCompletionContentPart[];
    }
  | { content: string; role: 'tool'; name: string; tool_call_id?: string };

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
   * Headers to pass along the request.
   */
  headers?: { [key: string]: string };
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
  /**
   * Set the live chat connection callback.
   * @private
   */
  setLiveChatConnectionCallback: (
    callback?: (state: 'connected' | 'disconnected') => void,
  ) => void;
  /**
   * Callback for live chat connection state
   * @private
   */
  liveChatConnectionCallback?: (state: 'connected' | 'disconnected') => void;
  /**
   * Caps the messages by thread. Call after updates to messagesByThreadId.
   * @private do not use this method directly.
   **/
  capMessagesByThreadId: () => void;
  /**
   * EventSource for live chat functionality
   * @private
   */
  liveChatEventSource?: EventSource;
  /**
   * Sets up a connection to the live chat API
   * @private
   */
  setupLiveChat: () => void;
  /**
   * Closes the live chat connection
   * @private
   */
  closeLiveChat: () => void;
}

export interface CreateChatOptions {
  debug?: boolean;
  projectKey: string;
  apiUrl?: string;
  headers?: { [key: string]: string };
  persistChatHistory?: boolean;
  /**
   * maximum number of threads to keep, based on when threads were last updated.
   * @example 100
   */
  maxHistorySize?: number;
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
  maxHistorySize,
  projectKey,
  storeKey,
  apiUrl,
  headers,
}: CreateChatOptions): StoreApi<ChatStoreState> => {
  if (!projectKey) {
    throw new Error(
      'Markprompt: a project key is required. Make sure to pass your Markprompt project key to createChatStore.',
    );
  }

  if (
    maxHistorySize &&
    (!Number.isSafeInteger(maxHistorySize) || maxHistorySize < 0)
  ) {
    throw new Error(
      'Markprompt: chatOptions.maxHistorySize must be a positive integer',
    );
  }

  return createStore<ChatStoreState>()(
    immer(
      persist(
        (set, get) => ({
          apiUrl,
          headers,
          projectKey,
          messages: [],
          didAcceptDisclaimer: false,
          threadIdsByProjectKey: {
            [projectKey]: [],
          },
          messagesByThreadId: {},
          toolCallsByToolCallId: {},
          didAcceptDisclaimerByProjectKey: {},
          capMessagesByThreadId: () => {
            set((state) => {
              if (!maxHistorySize || maxHistorySize <= 0) return state;

              const threadIdsToRemove = Object.entries(state.messagesByThreadId)
                .sort(
                  (
                    [_, { lastUpdated: lastUpdatedA }],
                    [__, { lastUpdated: lastUpdatedB }],
                  ) =>
                    new Date(lastUpdatedB).getTime() -
                    new Date(lastUpdatedA).getTime(),
                )
                .slice(maxHistorySize)
                .map(([id]) => id);

              for (const id of threadIdsToRemove) {
                delete state.messagesByThreadId[id];
              }

              const threadIds = Object.keys(state.messagesByThreadId);

              state.threadIdsByProjectKey[projectKey] =
                state.threadIdsByProjectKey[projectKey].filter((t) =>
                  threadIds.includes(t),
                );

              // Additional precaution
              purgeStorageIfNeeded(
                state,
                projectKey,
                persistChatHistory ? 'localStorage' : 'sessionStorage',
              );
            });
          },
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
              state.capMessagesByThreadId();
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

            // If live chat is enabled, make sure the connection is active
            if (get().options?.liveChatOptions) {
              get().setupLiveChat();
            }
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

              state.capMessagesByThreadId();
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
              } as ChatViewMessage;
              state.messages[index] = currentMessage;

              const threadId = state.threadId;
              if (!threadId) return;

              // save the message to local storage
              state.messagesByThreadId[threadId] = {
                lastUpdated: new Date().toISOString(),
                messages: state.messages,
              };

              purgeStorageIfNeeded(
                state,
                projectKey,
                persistChatHistory ? 'localStorage' : 'sessionStorage',
              );
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
            console.log('submitChat messages', messages);
            const liveChatOptions = get().options?.liveChatOptions;
            if (liveChatOptions) {
              const latestMessage = messages[messages.length - 1];
              if (!latestMessage || !('content' in latestMessage)) return;

              set((state) => {
                state.messages.push({
                  id: self.crypto.randomUUID(),
                  role: liveChatOptions.role,
                  content: latestMessage.content,
                  metadata: {
                    email: liveChatOptions.sendAsEmail ?? false,
                  },
                  state: 'done' as const,
                } as ChatViewMessage);
              });

              console.log('submitChat live chat', latestMessage.content);

              const baseUrl = get().apiUrl || 'https://api.markprompt.com';
              const url = `${baseUrl}/chat/live`;
              console.log('submitChat live chat url', url);

              const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  projectKey: get().projectKey,
                  threadId: get().threadId,
                  content: latestMessage.content,
                  // todo: this is a little hacky because we override the role provided
                  role: liveChatOptions.role,
                  sendAsEmail: liveChatOptions.sendAsEmail,
                }),
              });

              console.log('submitChat live chat response', response);
              return;
            }

            console.log('doing normal submit chat');

            const messageIds = Array.from({ length: messages.length }, () =>
              self.crypto.randomUUID(),
            );
            const responseId = self.crypto.randomUUID();

            set((state) => {
              state.messages.push(
                ...messages.map(
                  (message, i) =>
                    ({
                      ...message,
                      id: messageIds[i],
                      references: [],
                      state: 'indeterminate' as const,
                    }) as ChatViewMessage,
                ),
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

            console.log('submitChat messages', get().messages);

            // Get ready to do the request
            const apiMessages = toValidApiMessages(get().messages);

            console.log('submitChat apiMessages', apiMessages);

            for (const id of [...messageIds, responseId]) {
              get().setMessageById(id, {
                state: 'preload',
              });
            }

            // In case submitChat() passes specific additional metadata,
            // merge the general provided values with the specific ones.
            const allAdditionalMetadata = deepMerge(
              get().options?.additionalMetadata ?? {},
              additionalMetadata || {},
            );

            const options = {
              apiUrl: get().apiUrl,
              headers: get().headers,
              threadId: get().threadId,
              signal: controller.signal,
              debug,
              ...get().options,
              tools: get().options?.tools?.map((x) => x.tool),
              additionalMetadata: allAdditionalMetadata,
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
                } as ChatViewMessage);
              }
            } catch (error) {
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

            // make sure we cap the amount of threads stored to maxHistorySize
            get().capMessagesByThreadId();

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

            if (
              !(
                responseMessage?.role === 'assistant' &&
                responseMessage?.tool_calls
              )
            )
              return;

            const tools = get().options?.tools;
            if (!tools) return;

            if (
              responseMessage.tool_calls.every((x) => {
                const name = x.function?.name;
                const tool = tools.find((x) => x.tool.function.name === name);
                return tool?.requireConfirmation === false;
              })
            ) {
              await get().submitToolCalls(responseMessage);
            }
          },
          async submitToolCalls(message: ChatViewMessage) {
            if (!(message.role === 'assistant' && message.tool_calls)) return;

            const tools = get().options?.tools;
            if (!tools) return;

            const toolCallResults = await Promise.allSettled(
              message.tool_calls.filter(isToolCall).map(async (tool_call) => {
                const tool = tools.find(
                  (x) => x.tool.function.name === tool_call.function?.name,
                );

                if (!tool) throw new Error('Tool not found');

                try {
                  get().setToolCallById(tool_call.id, {
                    status: 'loading',
                  });

                  const threadId = get().threadId;

                  // should never happen, just appeasing the TS gods.
                  if (!threadId) throw new Error('No Thread ID');

                  const result = await tool.call(
                    tool_call.function?.arguments || '{}',
                    { threadId },
                  );

                  if (!result) {
                    return;
                  }

                  console.log('submitToolCalls result', result);

                  get().setToolCallById(tool_call.id, {
                    result,
                    status: 'done',
                  });

                  return { result, tool_call, tool };
                } catch (error) {
                  get().setToolCallById(tool_call.id, {
                    status: 'error',
                    error:
                      error instanceof Error ? error.message : String(error),
                  });
                }
              }),
            );

            console.log('submitToolCalls toolCallResults', toolCallResults);

            const mappedToolCalls = toolCallResults
              .filter(isPresent)
              .filter(hasValueAtKey('status', 'fulfilled' as const))
              .filter(hasPresentKey('value'))
              .map((x) => ({
                role: 'tool' as const,
                name: x.value?.tool.tool.function.name,
                tool_call_id: x.value.tool_call.id,
                content: x.value?.result,
              }));

            console.log('submitToolCalls mappedToolCalls', mappedToolCalls);

            if (mappedToolCalls.length > 0) {
              get().submitChat(mappedToolCalls);
            }
          },
          options: chatOptions ?? {},
          setOptions: (options) => {
            const prevLiveChat = get().options?.liveChatOptions;

            set((state) => {
              state.options = options;
            });

            // Handle live chat setup/teardown when the option changes
            const newLiveChat = options.liveChatOptions;
            if (newLiveChat && !prevLiveChat) {
              // Live chat was enabled
              get().setupLiveChat();
            } else if (!newLiveChat && prevLiveChat) {
              // Live chat was disabled
              get().closeLiveChat();
            }
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

            const lastUserMessage = messages[
              lastUserMessageIndex
            ] as ChatViewUserMessage;
            if (!lastUserMessage.content) return;

            get().setMessages(messages.slice(0, lastUserMessageIndex));
            get().submitChat([
              {
                role: 'user',
                content: lastUserMessage.content,
              },
            ]);
          },
          liveChatEventSource: undefined,
          setupLiveChat: () => {
            // Close any existing connection first
            get().closeLiveChat();
            const liveChatOptions = get().options?.liveChatOptions;

            if (liveChatOptions) {
              // Setup the new connection
              const subscribeToRole =
                liveChatOptions.role === 'assistant' ? 'user' : 'assistant';
              const baseUrl = get().apiUrl || 'https://api.markprompt.com';
              const url = `${baseUrl}/chat/live?threadId=${get().threadId}&subscribeToRole=${subscribeToRole}&projectKey=${get().projectKey}`;
              try {
                const eventSource = new EventSource(url);
                console.log('SETTING UP LIVE CHAT', url);

                eventSource.onmessage = (event) => {
                  try {
                    const data = JSON.parse(event.data);
                    console.log('live chat data', data);

                    if (data.eventType === 'initial_messages') {
                      // todo: make this more robust/formalized
                      get().liveChatConnectionCallback?.('connected');
                      set((state) => {
                        state.messages = data.data
                          .map((message: any) => {
                            const messageId = self.crypto.randomUUID();
                            return {
                              id: messageId,
                              role: message.role,
                              content: message.content,
                              state: 'done' as const,
                              references: message.references || [],
                              metadata: message.metadata || {},
                            } satisfies ChatViewMessage;
                          })
                          .filter((m: ChatViewMessage) => m.content);

                        if (state.threadId) {
                          state.messagesByThreadId[state.threadId] = {
                            lastUpdated: new Date().toISOString(),
                            messages: state.messages,
                          };
                        }

                        return state;
                      });
                    } else if (data.eventType === 'live_chat_message') {
                      const newMessageData = data.data;
                      // Create a new message
                      const messageId = self.crypto.randomUUID();
                      const newMessage = {
                        id: messageId,
                        role: newMessageData.role,
                        content: newMessageData.content,
                        state: 'done' as const,
                        references: newMessageData.references || [],
                        metadata: newMessageData.metadata || {},
                      } satisfies ChatViewMessage;

                      // Update the store
                      set((state) => {
                        state.messages.push(newMessage);

                        if (state.threadId) {
                          state.messagesByThreadId[state.threadId] = {
                            lastUpdated: new Date().toISOString(),
                            messages: state.messages,
                          };
                        }

                        return state;
                      });
                    }
                  } catch (error) {
                    console.error('Error parsing live chat message:', error);
                  }
                };

                eventSource.onerror = (error) => {
                  console.error('Live chat connection error:', error);
                  // Try to reconnect after a delay
                  setTimeout(() => get().setupLiveChat(), 5000);
                };

                // Store the event source
                set((state) => {
                  state.liveChatEventSource = eventSource;
                  return state;
                });
              } catch (error) {
                console.error('Failed to set up live chat:', error);
              }
            }
          },
          setLiveChatConnectionCallback: (
            callback?: (state: 'connected' | 'disconnected') => void,
          ) => {
            set((state) => {
              state.liveChatConnectionCallback = callback;
              return state;
            });
          },
          closeLiveChat: () => {
            const eventSource = get().liveChatEventSource;
            if (eventSource) {
              eventSource.close();
              set((state) => {
                state.liveChatEventSource = undefined;
                return state;
              });
            }
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
                  ) as { [key: string]: string };
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

            if (maxHistorySize && maxHistorySize > 0) {
              // make sure we evict old messages from the cache
              state.capMessagesByThreadId();
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

            // Setup live chat if enabled in options
            if (chatOptions?.liveChatOptions) {
              setTimeout(() => {
                state.setupLiveChat();
              }, 0);
            }
          },
        },
      ),
    ),
  );
};

export type ChatStore = ReturnType<typeof createChatStore>;

export const ChatContext = createContext<ChatStore | null>(null);

export function useChatStore<T>(selector: (state: ChatStoreState) => T): T {
  const store = useContext(ChatContext);
  if (!store) throw new Error('Missing ChatContext.Provider in the tree');
  // eslint-disable-next-line import-x/no-deprecated
  return useStore(store, selector);
}

export const selectProjectThreads = (
  state: ChatStoreState,
): [threadId: string, ThreadData][] => {
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

// Chrome has a 5MB storage limit
const MAX_STORAGE_BYTES = 4_000_000;

function purgeStorageIfNeeded(
  state: ChatStoreState,
  projectKey: string,
  storageType: 'localStorage' | 'sessionStorage',
) {
  try {
    const storage =
      storageType === 'localStorage' ? localStorage : sessionStorage;
    const storageSize = new Blob(Object.values(storage)).size;

    if (storageSize < MAX_STORAGE_BYTES) {
      return;
    }

    console.warn('Storage limit exceeded, purging old threads...');

    const sortedThreads = Object.entries(state.messagesByThreadId).sort(
      ([, a], [, b]) =>
        new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime(),
    );

    while (new Blob(Object.values(storage)).size > MAX_STORAGE_BYTES) {
      if (sortedThreads.length === 0) break;

      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const [oldestThreadId] = sortedThreads.shift()!;
      delete state.messagesByThreadId[oldestThreadId];

      state.threadIdsByProjectKey[projectKey] = state.threadIdsByProjectKey[
        projectKey
      ].filter((t) => t !== oldestThreadId);
    }
  } catch (e) {
    console.error('Error purging storage:', e);
  }
}
