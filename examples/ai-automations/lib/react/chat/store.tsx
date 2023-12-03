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

import {
  isAbortError,
  type ChatMessage,
  type FileSectionReference,
  submitChatGenerator,
  type FunctionCall,
} from '@/lib/core';

import type { MarkpromptOptions } from '../types';
import { isPresent } from '../utils';

export type ChatLoadingState =
  | 'indeterminate'
  | 'preload'
  | 'streaming-answer'
  | 'done'
  | 'cancelled';

// export interface ChatViewMessage {
//   id: string;
//   answer?: string;
//   functionCall?: FunctionCall & { response?: string };
//   prompt: string;
//   promptId?: string;
//   references: FileSectionReference[];
//   state: ChatLoadingState;
// }

export interface ChatViewMessage extends ChatMessage {
  state: ChatLoadingState;
  references?: FileSectionReference[];
  promptId?: string;
}

// function toApiMessages(messages: ChatViewMessage[]): ChatMessage[] {
//   return messages
//     .map((message) => [
//       {
//         content: message.prompt,
//         role: "user" as const,
//       },
//       message.functionCall
//         ? {
//             role: "function" as const,
//             name: message.functionCall.name,
//             content: message.functionCall.response!,
//           }
//         : undefined,
//       message.answer
//         ? {
//             content: message.answer,
//             role: "assistant" as const,
//           }
//         : undefined,
//     ])
//     .flat()
//     .filter(isPresent) satisfies ChatMessage[];
// }

type Options = NonNullable<MarkpromptOptions['chat']>;

export interface ChatStoreState {
  abort?: () => void;
  projectKey: string;
  conversationId?: string;
  setConversationId: (conversationId: string) => void;
  selectConversation: (conversationId?: string) => void;
  messages: ChatViewMessage[];
  setMessages: (messages: ChatViewMessage[]) => void;
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
  submitChat: (
    prompt: string,
    role?: 'user' | 'function',
    name?: string,
  ) => void;
  submitFunctionCall: (functionCall: FunctionCall) => void;
  options: Options;
  setOptions: (options: Options) => void;
  regenerateLastAnswer: () => void;
}

export interface CreateChatOptions {
  debug?: boolean;
  projectKey: string;
  persistChatHistory?: boolean;
  chatOptions?: Options;
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
  projectKey,
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
          setConversationId: (conversationId: string) => {
            set((state) => {
              // set the conversation id for this session
              state.conversationId = conversationId;

              // save the conversation id for this project, for later sessions
              state.conversationIdsByProjectKey[projectKey] ??= [];
              state.conversationIdsByProjectKey[projectKey] = [
                ...new Set([
                  ...state.conversationIdsByProjectKey[projectKey]!,
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
          submitFunctionCall: async (functionCall: FunctionCall) => {
            const fn = get().options?.functions?.find(
              (f) => f.name === functionCall.name,
            );
            if (!fn) return;
            // console.log(functionCall);
            const response = await fn.actual(functionCall.arguments);
            get().submitChat(response, 'function', functionCall.name);
          },
          submitChat: async (
            prompt: string,
            role: 'user' | 'function' = 'user',
            name?: string,
          ) => {
            // abort any pending or ongoing requests
            get().abort?.();

            set((state) => {
              state.messages.push({
                role,
                content: prompt,
                state: 'indeterminate',
                name,
                received: new Date().toISOString(),
              });
            });

            const currentMessageIndex = get().messages.length - 1;
            const prevMessageIndex = currentMessageIndex - 1;

            if (prevMessageIndex >= 0) {
              const prevMessage = get().messages[prevMessageIndex];
              if (
                prevMessage &&
                ['indeterminate', 'preload', 'streaming-answer'].includes(
                  prevMessage.state,
                )
              ) {
                get().setMessageByIndex(prevMessageIndex, {
                  state: 'cancelled',
                });
              }
            }

            // create a new abort controller
            const controller = new AbortController();
            const abort = (): void => {
              controller.abort();
              get().setMessageByIndex(currentMessageIndex, {
                state: 'cancelled',
              });
            };

            set((state) => {
              state.abort = abort;
            });

            get().setMessageByIndex(currentMessageIndex, {
              state: 'preload',
            });

            try {
              for await (const value of submitChatGenerator(
                get().messages,
                get().projectKey,
                {
                  conversationId: get().conversationId,
                  signal: controller.signal,
                  ...get().options,
                  functions:
                    get().options?.functions?.map(
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      ({ actual, ...definition }) => definition,
                    ) ?? [],
                },
                debug,
              )) {
                if (value.conversationId) {
                  get().setConversationId(value.conversationId);
                }

                get().setMessageByIndex(currentMessageIndex, {
                  state: 'streaming-answer',
                });

                // console.log(value);

                get().setMessageByIndex(currentMessageIndex + 1, value);
              }
            } catch (error) {
              get().setMessageByIndex(currentMessageIndex, {
                state: 'cancelled',
              });

              if (isAbortError(error)) return;

              // eslint-disable-next-line no-console
              console.error(error);
            }

            // we're done, clear the abort controller
            if (get().abort === abort) {
              set((state) => {
                state.abort = undefined;
              });
            }

            const currentMessage = get().messages[currentMessageIndex];
            if (currentMessage?.state === 'cancelled') return;
            if (controller.signal.aborted) return;

            // set state of current message to done
            get().setMessageByIndex(currentMessageIndex, {
              state: 'done',
            });
          },
          options: chatOptions ?? {},
          setOptions: (
            options: Omit<CreateChatOptions['chatOptions'], 'signal'>,
          ) => {
            set((state) => {
              state.options = options;
            });
          },
          regenerateLastAnswer: () => {
            const messages = [...get().messages];
            const lastPromptIndex = messages.findLastIndex(
              (m) => m.role === 'user',
            );
            const lastPromptMessage = messages[lastPromptIndex];
            get().setMessages(messages.slice(0, lastPromptIndex));
            get().submitChat(lastPromptMessage.content!);
          },
        }),
        {
          name: 'markprompt',
          version: 2,
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
