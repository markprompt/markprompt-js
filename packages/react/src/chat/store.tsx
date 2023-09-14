import {
  submitChat,
  type ChatMessage,
  isAbortError,
  type SubmitChatOptions,
  type FileSectionReference,
} from '@markprompt/core';
import { createContext, useRef, type ReactNode, useContext } from 'react';
import React from 'react';
import { createStore, useStore } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants.js';
import type { MarkpromptOptions } from '../types.js';
import { isPresent } from '../utils.js';

export type ChatLoadingState =
  | 'indeterminate'
  | 'preload'
  | 'streaming-answer'
  | 'done'
  | 'cancelled';

export interface ChatViewMessage {
  id: string;
  prompt: string;
  promptId?: string;
  answer?: string;
  state: ChatLoadingState;
  references: FileSectionReference[];
}

function toApiMessages(messages: ChatViewMessage[]): ChatMessage[] {
  return messages
    .map((message) => [
      {
        content: message.prompt,
        role: 'user' as const,
      },
      message.answer
        ? {
            content: message.answer,
            role: 'assistant' as const,
          }
        : undefined,
    ])
    .flat()
    .filter(isPresent) satisfies ChatMessage[];
}

interface State {
  abortController?: AbortController;
  projectKey: string;
  conversationId?: string;
  setConversationId: (conversationId: string) => void;
  selectConversation: (conversationId?: string) => void;
  messages: ChatViewMessage[];
  setMessages: (messages: ChatViewMessage[]) => void;
  setMessageByIndex: (index: number, next: Partial<ChatViewMessage>) => void;
  conversationsByProjectKey: {
    [projectKey: string]: {
      conversationId?: string;
      messagesByConversationId: {
        [conversationId: string]: ChatViewMessage[];
      };
    };
  };
  submitChat: (prompt: string) => void;
  regenerateLastAnswer: () => void;
}

export interface CreateChatOptions {
  debug?: boolean;
  projectKey: string;
  persistChatHistory?: boolean;
  chatOptions?: Omit<SubmitChatOptions, 'signal'>;
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
  const optionalPersist = (
    persistChatHistory ? persist : (x) => x
  ) as typeof persist;

  return createStore<State>()(
    immer(
      optionalPersist(
        (set, get) => ({
          projectKey,
          messages: [],
          conversationsByProjectKey: {
            [projectKey]: {
              messagesByConversationId: {},
            },
          },
          setConversationId: (conversationId: string) => {
            set((state) => {
              // set the conversation id for this session
              state.conversationId = conversationId;

              // save the conversation id for this project, for later sessions
              // and associate it to the messages already in state
              state.conversationsByProjectKey[projectKey]!.conversationId =
                conversationId;

              state.conversationsByProjectKey[
                projectKey
              ]!.messagesByConversationId[conversationId] = state.messages;
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
                state.conversationsByProjectKey[projectKey]
                  ?.messagesByConversationId[conversationId ?? ''] ?? [];
            });
          },
          setMessages: (messages: ChatViewMessage[]) => {
            set((state) => {
              state.messages = messages;

              const conversationId = state.conversationId;
              if (!conversationId) return;

              const project = state.conversationsByProjectKey[state.projectKey];
              if (!project) return;

              // save the message to local storage
              project.messagesByConversationId[conversationId] = messages;
            });
          },
          setMessageByIndex: (
            index: number,
            next: Partial<ChatViewMessage>,
          ) => {
            set((state) => {
              let currentMessage = state.messages[index];
              if (!currentMessage) return;

              // update the current message
              currentMessage = { ...currentMessage, ...next };
              state.messages[index] = currentMessage;

              const conversationId = state.conversationId;
              if (!conversationId) return;

              const project = state.conversationsByProjectKey[state.projectKey];
              if (!project) return;

              // save the message to local storage
              project.messagesByConversationId[conversationId] = state.messages;
            });
          },
          submitChat: (prompt: string) => {
            const id = crypto.randomUUID();

            set((state) => {
              state.messages.push({
                id,
                prompt,
                state: 'indeterminate',
                references: [],
              });
            });

            // abort any pending or ongoing requests
            get().abortController?.abort();

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
            set((state) => {
              state.abortController = controller;
            });

            // get ready to do the request
            const apiMessages = toApiMessages(get().messages);

            set((state) => {
              const currentMessage = state.messages[currentMessageIndex];

              if (!currentMessage) return;
              currentMessage.state = 'preload';

              if (!state.conversationId) return;

              const project = state.conversationsByProjectKey[projectKey];
              if (!project) return;

              project.messagesByConversationId[state.conversationId] =
                state.messages;
            });

            const promise = submitChat(
              apiMessages,
              get().projectKey,
              (chunk) => {
                if (controller.signal.aborted) return false;

                const currentMessage = get().messages[currentMessageIndex];
                if (!currentMessage) return;

                get().setMessageByIndex(currentMessageIndex, {
                  answer: (currentMessage.answer ?? '') + chunk,
                  state: 'streaming-answer',
                });

                return true;
              },
              (references) => {
                get().setMessageByIndex(currentMessageIndex, { references });
              },
              (conversationId) => {
                get().setConversationId(conversationId);
              },
              (promptId) => {
                get().setMessageByIndex(currentMessageIndex, { promptId });
              },
              (error) => {
                get().setMessageByIndex(currentMessageIndex, {
                  state: 'cancelled',
                });

                if (isAbortError(error)) return;

                // eslint-disable-next-line no-console
                console.error(error);
              },
              {
                conversationId: get().conversationId,
                signal: controller.signal,
                ...chatOptions,
              },
              debug,
            );

            promise.then(() => {
              if (controller.signal.aborted) return;

              // don't overwrite the state of cancelled messages with done when the promise resolves
              const currentMessage = get().messages[currentMessageIndex];
              if (currentMessage?.state === 'cancelled') return;

              // set state of current message to done
              get().setMessageByIndex(currentMessageIndex, {
                state: 'done',
              });
            });

            promise.finally(() => {
              if (get().abortController === controller) {
                set((state) => {
                  state.abortController = undefined;
                });
              }
            });
          },
          regenerateLastAnswer: () => {
            // eslint-disable-next-line prefer-const
            let messages = [...get().messages];
            const lastMessage = messages.pop();
            if (!lastMessage) return;
            get().setMessages(messages);
            get().submitChat(lastMessage.prompt);
          },
        }),
        {
          name: 'markprompt',
          version: 1,
          // only store conversationsByProjectKey in local storage
          partialize: (state) => ({
            conversationsByProjectKey: state.conversationsByProjectKey,
          }),
          // rehydrate messages based on the stored conversationId
          onRehydrateStorage: () => (state) => {
            if (!state || typeof state !== 'object') return;

            const { conversationsByProjectKey } = state;

            const conversationId =
              conversationsByProjectKey?.[projectKey]?.conversationId;

            if (!conversationId) return;

            state.setConversationId(conversationId);

            const messages =
              conversationsByProjectKey?.[projectKey]
                ?.messagesByConversationId?.[conversationId];

            if (!messages || !Array.isArray(messages) || messages.length === 0)
              return;

            state.setMessages(messages);
          },
        },
      ),
    ),
  );
};

type ChatStore = ReturnType<typeof createChatStore>;

export const ChatContext = createContext<ChatStore | null>(null);

interface ChatProviderProps {
  chatOptions?: MarkpromptOptions['chat'];
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
      persistChatHistory:
        chatOptions?.history ?? DEFAULT_MARKPROMPT_OPTIONS.chat.history,
    });
  }

  return (
    <ChatContext.Provider value={store.current}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatStore<T>(selector: (state: State) => T): T {
  const store = useContext(ChatContext);
  if (!store) throw new Error('Missing ChatContext.Provider in the tree');
  return useStore(store, selector);
}
