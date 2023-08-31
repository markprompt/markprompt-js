import {
  isAbortError,
  submitChat as submitChatToMarkprompt,
  type FileSectionReference,
  type ChatMessage,
  type SubmitChatOptions,
} from '@markprompt/core';
import { useState } from 'react';

import type { MarkpromptOptions } from './types.js';
import { useAbortController } from './useAbortController.js';
import { useFeedback, type UseFeedbackResult } from './useFeedback.js';
import { isPresent } from './utils.js';

export type ChatLoadingState =
  | 'indeterminate'
  | 'preload'
  | 'streaming-answer'
  | 'done'
  | 'cancelled';

export interface ChatViewMessage {
  prompt: string;
  answer?: string;
  id: string;
  state: ChatLoadingState;
  references: FileSectionReference[];
}

export interface UseChatOptions {
  debug?: boolean;
  feedbackOptions?: MarkpromptOptions['feedback'];
  projectKey: string;
  options?: Omit<SubmitChatOptions, 'signal'>;
}

export interface UseChatResult {
  messages: ChatViewMessage[];
  promptId?: string;
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

export function useChat({
  debug,
  feedbackOptions,
  projectKey,
  options,
}: UseChatOptions): UseChatResult {
  if (!projectKey) {
    throw new Error(
      'Markprompt: a project key is required. Make sure to pass the projectKey to useMarkprompt.',
    );
  }

  const [promptId, setPromptId] = useState<string>('');
  const [messages, setMessages] = useState<ChatViewMessage[]>([]);

  const { submitFeedback, abort: abortFeedbackRequest } = useFeedback({
    projectKey,
    promptId,
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
      (pid) => {
        setPromptId(pid);
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
        ...options,
        signal: controller.signal,
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
        prompt,
        state: 'indeterminate',
        id,
        references: [],
      },
    ] satisfies ChatViewMessage[];

    setMessages(nextMessages);

    // send messages to server
    submitMessagesToApi(nextMessages, id);
  };

  const regenerateLastAnswer = (): void => {
    const lastMessage = messages[messages.length - 1];

    const nextMessages = updateMessageById(messages, lastMessage.id, {
      ...lastMessage,
      answer: '',
      references: [],
      state: 'indeterminate',
    });

    setMessages(nextMessages);

    // send messages to server
    submitMessagesToApi(nextMessages, lastMessage.id);
  };

  return {
    abort,
    abortFeedbackRequest,
    messages,
    promptId,
    regenerateLastAnswer,
    submitChat,
    submitFeedback,
  };
}
