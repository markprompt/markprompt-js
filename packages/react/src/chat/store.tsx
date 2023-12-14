import {
  isAbortError,
  isToolCalls,
  submitChatGenerator,
  type ChatCompletionAssistantMessageParam,
  type ChatCompletionMessageParam,
  type ChatCompletionSystemMessageParam,
  type ChatCompletionToolMessageParam,
  type SubmitChatGeneratorOptions,
  type SubmitChatYield,
} from '@markprompt/core';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { createStore, useStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { MarkpromptOptions } from '../types.js';
import { isIterable, isPresent } from '../utils.js';

export type ChatLoadingState =
  | 'indeterminate'
  | 'preload'
  | 'streaming-answer'
  | 'done'
  | 'cancelled';

export interface ChatViewMessage
  extends Omit<SubmitChatYield, 'conversationId'> {
  id: string;
  state: ChatLoadingState;
  name?: string;
}

function toApiMessages(
  messages: (ChatViewMessage & { tool_call_id?: string })[],
): ChatCompletionMessageParam[] {
  return messages
    .map(({ content, role, tool_calls, tool_call_id, name }) => {
      switch (role) {
        case 'assistant': {
          const msg: ChatCompletionAssistantMessageParam = {
            content: content ?? null,
            role,
          };

          if (isToolCalls(tool_calls)) msg.tool_calls = tool_calls;

          return msg;
        }
        case 'system': {
          return {
            content: content ?? null,
            role,
          } satisfies ChatCompletionSystemMessageParam;
        }
        case 'tool': {
          if (!tool_call_id) throw new Error('tool_call_id is required');
          return {
            content: content ?? null,
            role,
            tool_call_id,
          } satisfies ChatCompletionToolMessageParam;
        }
        case 'user': {
          return {
            content: content ?? null,
            role,
            ...(name ? { name } : {}),
          } satisfies ChatCompletionMessageParam;
        }
      }
    })
    .filter(isPresent);
}

export type UserConfigurableOptions = Omit<
  SubmitChatGeneratorOptions,
  'signal' | 'tools' | 'tool_choice'
>;

export interface ChatStoreState {
  abort?: () => void;
  projectKey: string;
  conversationId?: string;
  error?: string;
  setError: (error?: string) => void;
  setConversationId: (conversationId: string) => void;
  selectConversation: (conversationId?: string) => void;
  messages: ChatViewMessage[];
  setMessages: (messages: ChatViewMessage[]) => void;
  setMessageById(id: string, next: Partial<ChatViewMessage>): void;
  setMessageByIndex: (index: number, next: Partial<ChatViewMessage>) => void;
  conversationIdsByProjectKey: {
    [projectKey: string]: string[];
  };
  messagesByConversationId: {
    [conversationId: string]: {
      lastUpdated: string;
      messages: ChatViewMessage[];
    };
  };
  submitChat: (prompt: string) => void;
  options?: UserConfigurableOptions;
  setOptions: (options: UserConfigurableOptions) => void;
  regenerateLastAnswer: () => void;
}

export interface CreateChatOptions {
  debug?: boolean;
  projectKey: string;
  persistChatHistory?: boolean;
  chatOptions?: UserConfigurableOptions;
}

/**
 * Creates a chat store for a given project key.
 * Keeps track of messages by project key and conversation id.
 *
 * @param projectKey - Markprompt project key
 * @param persistChatHistory - Should chat history be persisted in local storage?
 */
export const createChatStore = ({
  chatOptions,
  debug,
  persistChatHistory,
  projectKey, // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
          projectKey,
          messages: [],
          conversationIdsByProjectKey: {
            [projectKey]: [],
          },
          messagesByConversationId: {},
          error: undefined,
          setError: (error?: string) => {
            set((state) => {
              state.error = error;
            });
          },
          setConversationId: (conversationId: string) => {
            set((state) => {
              // set the conversation id for this session
              state.conversationIdsByProjectKey[projectKey] ??= [];
              state.conversationId = conversationId;

              if (!isIterable(state.conversationIdsByProjectKey[projectKey])) {
                // Backward-compatibility
                state.conversationIdsByProjectKey[projectKey] = [];
              }

              // save the conversation id for this project, for later sessions
              state.conversationIdsByProjectKey[projectKey] = [
                ...new Set([
                  ...state.conversationIdsByProjectKey[projectKey],
                  conversationId,
                ]),
              ];

              // save the messages for this conversation
              state.messagesByConversationId[conversationId] = {
                lastUpdated: new Date().toISOString(),
                messages: state.messages,
              };
            });
          },
          selectConversation: (conversationId?: string) => {
            set((state) => {
              if (!conversationId) {
                // start a new conversation
                state.conversationId = undefined;
                state.messages = [];
                return;
              }

              // restore an existing conversation
              state.conversationId = conversationId;
              state.messages =
                state.messagesByConversationId[conversationId]?.messages ?? [];
            });
          },
          setMessages: (messages: ChatViewMessage[]) => {
            set((state) => {
              state.messages = messages;

              const conversationId = state.conversationId;
              if (!conversationId) return;

              // save the message to local storage
              state.messagesByConversationId[conversationId] = {
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

              const conversationId = state.conversationId;
              if (!conversationId) return;

              // save the message to local storage
              state.messagesByConversationId[conversationId] = {
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
              currentMessage = { ...currentMessage, ...next };
              state.messages[index] = currentMessage;

              const conversationId = state.conversationId;
              if (!conversationId) return;

              // save the message to local storage
              state.messagesByConversationId[conversationId] = {
                lastUpdated: new Date().toISOString(),
                messages: state.messages,
              };
            });
          },
          submitChat: async (prompt: string) => {
            const promptId = crypto.randomUUID();
            const responseId = crypto.randomUUID();

            get().setError(undefined);

            set((state) => {
              state.messages.push(
                {
                  id: promptId,
                  role: 'user',
                  content: prompt,
                  state: 'indeterminate',
                  references: [],
                },
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
                m.id !== promptId,
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
              for (const id of [promptId, responseId]) {
                get().setMessageById(id, {
                  state: 'cancelled',
                });
              }
            };
            set((state) => {
              state.abort = abort;
            });

            // get ready to do the request
            const apiMessages = toApiMessages(get().messages);
            for (const id of [promptId, responseId]) {
              get().setMessageById(id, {
                state: 'preload',
              });
            }

            // do the chat completion request
            try {
              for await (const chunk of submitChatGenerator(
                apiMessages,
                projectKey,
                {
                  conversationId: get().conversationId,
                  signal: controller.signal,
                  debug,
                  ...get().options,
                },
              )) {
                if (chunk.conversationId) {
                  get().setConversationId(chunk.conversationId);
                }
                get().setMessageById(promptId, {
                  state: 'streaming-answer',
                });
                get().setMessageById(responseId, {
                  state: 'streaming-answer',
                  ...chunk,
                });
              }
            } catch (error) {
              for (const id of [promptId, responseId]) {
                get().setMessageById(id, {
                  state: 'cancelled',
                });
              }

              if (isAbortError(error)) return;

              // eslint-disable-next-line no-console
              get().setError(
                error instanceof Error ? error.message : String(error),
              );
            }

            if (get().abort === abort) {
              set((state) => {
                state.abort = undefined;
              });
            }

            const currentMessage = get().messages.find(
              (m) => m.id === promptId,
            );

            if (currentMessage?.state === 'cancelled') return;
            if (controller.signal.aborted) return;

            for (const id of [promptId, responseId]) {
              get().setMessageById(id, {
                state: 'done',
              });
            }
          },
          options: chatOptions ?? {},
          setOptions: (options) => {
            set((state) => {
              state.options = options;
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
            get().submitChat(lastUserMessage.content!);
          },
        }),
        {
          name: 'markprompt',
          version: 1,
          storage: createJSONStorage(() =>
            persistChatHistory ? localStorage : sessionStorage,
          ),
          // only store conversationsByProjectKey in local storage
          partialize: (state) => ({
            conversationIdsByProjectKey: state.conversationIdsByProjectKey,
            messagesByConversationId: state.messagesByConversationId,
          }),
          // restore the last conversation for this project if it's < 4 hours old
          onRehydrateStorage: () => (state) => {
            if (!state || typeof state !== 'object') return;

            const { conversationIdsByProjectKey, messagesByConversationId } =
              state;

            const conversationIds =
              conversationIdsByProjectKey?.[projectKey] ?? [];

            const now = new Date();
            const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);

            const projectConversations = Object.entries(
              messagesByConversationId,
            )
              // filter out conversations that are not in the list of conversations for this project
              .filter(([id]) => conversationIds.includes(id))
              // filter out conversations older than 4 hours
              .filter(([, { lastUpdated }]) => {
                const lastUpdatedDate = new Date(lastUpdated);
                return lastUpdatedDate > fourHoursAgo;
              })
              // sort by last updated date, descending
              .sort(([, { lastUpdated: a }], [, { lastUpdated: b }]) =>
                b.localeCompare(a),
              );

            if (
              projectConversations.length === 0 ||
              !isPresent(projectConversations[0])
            )
              return;

            const [conversationId, { messages }] = projectConversations[0];

            state.setConversationId(conversationId);
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

interface ChatProviderProps {
  chatOptions: MarkpromptOptions['chat'];
  children: ReactNode;
  debug?: boolean;
  projectKey: string;
}

export function ChatProvider(props: ChatProviderProps): JSX.Element {
  const { chatOptions, children, debug, projectKey } = props;

  const store = useRef<ChatStore>();

  if (!store.current) {
    store.current = createChatStore({
      projectKey,
      chatOptions,
      debug,
      persistChatHistory: chatOptions?.history,
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

export const selectProjectConversations = (
  state: ChatStoreState,
): [
  conversationId: string,
  { lastUpdated: string; messages: ChatViewMessage[] },
][] => {
  const projectKey = state.projectKey;

  const conversationIds = state.conversationIdsByProjectKey[projectKey];
  if (!conversationIds || conversationIds.length === 0) return [];

  const messagesByConversationId = Object.entries(
    state.messagesByConversationId,
  )
    .filter(([id]) => conversationIds.includes(id))
    // ascending order, so the newest conversation will be closest to the dropdown toggle
    .sort(([, { lastUpdated: a }], [, { lastUpdated: b }]) =>
      a.localeCompare(b),
    );

  if (!messagesByConversationId) return [];

  return messagesByConversationId;
};
