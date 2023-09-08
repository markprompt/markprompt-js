import {
  isAbortError,
  submitChat as submitChatToMarkprompt,
  type FileSectionReference,
  type ChatMessage,
  type SubmitChatOptions,
} from '@markprompt/core';
import { useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  useFeedback,
  type UseFeedbackResult,
} from '../feedback/useFeedback.js';
import type { MarkpromptOptions } from '../types.js';
import { useAbortController } from '../useAbortController.js';
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

export interface UseChatOptions {
  chatOptions?: Omit<SubmitChatOptions, 'signal'>;
  debug?: boolean;
  feedbackOptions?: MarkpromptOptions['feedback'];
  projectKey: string;
}

export interface UseChatResult {
  conversationId?: string;
  messages: ChatViewMessage[];
  abort: () => void;
  abortFeedbackRequest: UseFeedbackResult['abort'];
  submitChat: (prompt: string) => void;
  submitFeedback: UseFeedbackResult['submitFeedback'];
  regenerateLastAnswer: () => void;
}

function updateMessageById(
  messages: ChatViewMessage[],
  id: string,
  message: Partial<ChatViewMessage>,
): ChatViewMessage[] {
  const index = messages.findIndex((message) => message.id === id);
  const nextMessages = [...messages];
  nextMessages.splice(index, 1, {
    ...nextMessages[index],
    ...message,
  });
  return nextMessages;
}

export const useChatStore = create<{
  conversationId?: string;
  setConversationId: (conversationId: string) => void;
  messages: ChatViewMessage[];
  setMessages: (
    updater: (messages: ChatViewMessage[]) => ChatViewMessage[],
  ) => void;
  messagesByConversationId: Record<string, ChatViewMessage[]>;
  setMessagesByConversationId: (
    conversationId: string,
    messages: ChatViewMessage[],
  ) => void;
}>()(
  persist(
    (set, get) => ({
      conversationId: undefined,
      setConversationId: (conversationId: string) => {
        set({
          conversationId,
          messages: get().messagesByConversationId[conversationId] ?? [],
        });
      },
      messages: [],
      setMessages: (
        updater: (messages: ChatViewMessage[]) => ChatViewMessage[],
      ) => {
        const messages = updater(get().messages);

        const conversationId = get().conversationId;

        if (!conversationId) return set({ messages });

        return set({
          messages,
          messagesByConversationId: {
            ...get().messagesByConversationId,
            [conversationId]: messages,
          },
        });
      },
      messagesByConversationId: {},
      setMessagesByConversationId: (
        conversationId: string,
        messages: ChatViewMessage[],
      ) => {
        set((state) => ({
          messagesByConversationId: {
            ...state.messagesByConversationId,
            [conversationId]: messages,
          },
        }));
      },
    }),
    {
      name: 'markprompt-chat-history',
      version: 1,
    },
  ),
);

export function useChat({
  chatOptions,
  debug,
  feedbackOptions,
  projectKey,
}: UseChatOptions): UseChatResult {
  if (!projectKey) {
    throw new Error(
      'Markprompt: a project key is required. Make sure to pass the projectKey to useMarkprompt.',
    );
  }

  const conversationId = useChatStore((state) => state.conversationId);
  const setConversationId = useChatStore((state) => state.setConversationId);
  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);

  // const [messages, setMessages] = useState<ChatViewMessage[]>([]);

  const { submitFeedback, abort: abortFeedbackRequest } = useFeedback({
    projectKey,
    feedbackOptions,
  });

  const { ref: controllerRef, abort } = useAbortController();

  const submitMessagesToApi = async (
    messages: ChatViewMessage[],
    currentMessageId: string,
  ): Promise<void> => {
    // if a user submits a new prompt while the previous prompt answer is still
    // streaming, abort the previous request, and show a message that the previous
    // answer request was cancelled
    abort();

    const currentMessageIndex = messages.findIndex(
      (message) => message.id === currentMessageId,
    );
    const previousMessageIndex = currentMessageIndex - 1;
    const previousMessage = messages[previousMessageIndex];

    if (
      previousMessage &&
      (previousMessage.state === 'preload' ||
        previousMessage.state === 'streaming-answer')
    ) {
      setMessages((messages) =>
        updateMessageById(messages, previousMessage.id, {
          state: 'cancelled',
        }),
      );
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    const apiMessages = messages
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

    setMessages((messages) =>
      updateMessageById(messages, currentMessageId, {
        state: 'preload',
      }),
    );

    // we use callback style setState here to make sure we are using the latest
    // messages array, and not the messages array that was passed in to this
    const promise = submitChatToMarkprompt(
      apiMessages,
      projectKey,
      (chunk) => {
        setMessages((messages) => {
          const currentMessage = messages.find(
            (message) => message.id === currentMessageId,
          );
          return updateMessageById(messages, currentMessageId, {
            answer: (currentMessage?.answer ?? '') + chunk,
            state: 'streaming-answer',
          });
        });

        return true;
      },
      (references) => {
        setMessages((messages) =>
          updateMessageById(messages, currentMessageId, {
            references,
          }),
        );
      },
      (conversationId) => {
        setConversationId(conversationId);
      },
      (promptId) => {
        setMessages((messages) =>
          updateMessageById(messages, currentMessageId, {
            promptId,
          }),
        );
      },
      (error) => {
        setMessages((messages) =>
          updateMessageById(messages, currentMessageId, {
            state: 'cancelled',
          }),
        );

        if (isAbortError(error)) return;

        // eslint-disable-next-line no-console
        console.error(error);
      },
      {
        ...chatOptions,
        signal: controller.signal,
        conversationId,
      },
      debug,
    );

    promise.then(() => {
      if (controller.signal.aborted) return;
      // set state of current message to done
      setMessages((messages) =>
        updateMessageById(messages, currentMessageId, {
          state: 'done',
        }),
      );

      console.log(conversationId, messages);

      if (!conversationId) return;

      // save messages to local storage
      // setMessagesByConversationId(conversationId, messages);
    });

    promise.finally(() => {
      if (controllerRef.current === controller) {
        controllerRef.current = undefined;
      }
    });
  };

  // user types a messages in an input and submits the form
  // the messages is added to the messages array with role `user`
  // then the updated messages array is sent to the server
  const submitChat = (prompt: string): void => {
    const id = crypto.randomUUID();

    const nextMessages = [
      ...messages,
      {
        id,
        prompt,
        state: 'indeterminate',
        references: [],
      },
    ] satisfies ChatViewMessage[];

    setMessages(nextMessages);

    // send messages to server
    submitMessagesToApi(nextMessages, id);
  };

  const regenerateLastAnswer = (): void => {
    const lastMessage = messages[messages.length - 1];
    submitChat(lastMessage.prompt);
  };

  return {
    abort,
    abortFeedbackRequest,
    messages,
    conversationId,
    regenerateLastAnswer,
    submitChat,
    submitFeedback,
  };
}
