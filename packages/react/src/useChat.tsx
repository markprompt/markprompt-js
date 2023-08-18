import {
  type PromptMessage,
  type FileSectionReference,
  type SubmitPromptOptions,
  submitPrompt as submitPromptToMarkprompt,
  isAbortError,
} from '@markprompt/core';
import { useState } from 'react';

import { useAbortController } from './useAbortController.js';

export interface ChatViewMessage {
  prompt: string;
  answer: string;
  id: string;
  state?:
    | 'indeterminate'
    | 'preload'
    | 'streaming-answer'
    | 'done'
    | 'cancelled';
  references?: FileSectionReference[];
}

export interface UseChatOptions {
  projectKey: string;
  promptOptions?: Omit<SubmitPromptOptions, 'signal'>;
  debug?: boolean;
}

export interface UseChatResult {
  messages: ChatViewMessage[];
  promptId?: string;
  submitChat: (prompt: string) => void;
}

export function useChat({
  projectKey,
  promptOptions,
  debug,
}: UseChatOptions): UseChatResult {
  if (!projectKey) {
    throw new Error(
      'Markprompt: a project key is required. Make sure to pass the projectKey to useMarkprompt.',
    );
  }

  const [promptId, setPromptId] = useState<string>('');
  const [messages, setMessages] = useState<ChatViewMessage[]>([]);

  const { ref: controllerRef, abort } = useAbortController();

  const submitMessagesToApi = async (
    messages: ChatViewMessage[],
    currentMessageId: string,
  ): Promise<void> => {
    // if a user submits a new prompt while the previous prompt answer is still
    // streaming, abort the previous request, and show a message that the previous
    // answer request was cancelled
    abort();

    let nextMessages = [...messages];

    const currentMessageIndex = messages.findIndex(
      (message) => message.id === currentMessageId,
    );
    const currentMessage = messages[currentMessageIndex];
    const previousMessageIndex = currentMessageIndex - 1;
    const previousMessage = messages[previousMessageIndex];

    if (
      previousMessage &&
      (previousMessage.state === 'preload' ||
        previousMessage.state === 'streaming-answer')
    ) {
      const cancelledPreviousMessage = {
        ...previousMessage,
        state: 'cancelled',
      } satisfies ChatViewMessage;

      nextMessages = nextMessages.splice(
        previousMessageIndex,
        1,
        cancelledPreviousMessage,
      );

      setMessages(nextMessages);
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    const apiMessages = messages
      .map((message) => [
        {
          message: message.prompt,
          role: 'user' as const,
        },
        {
          message: message.answer,
          role: 'assistant' as const,
        },
      ])
      .flat() satisfies PromptMessage[];

    const promise = submitPromptToMarkprompt(
      apiMessages,
      projectKey,
      (chunk) => {
        // todo: handle chunked responses
        // possible that messages is out of date, use nextMessages to update state? Maintain a local copy?
        // make sure we update the answer of the correct message from the array, eg. currentMessageIndex + 1
        nextMessages = nextMessages.splice(currentMessageIndex, 1, {
          ...currentMessage,
          answer: currentMessage.answer + chunk,
          state: 'streaming-answer',
        } satisfies ChatViewMessage);

        setMessages(nextMessages);

        return true;
      },
      (references) => {
        // references should be per assistant response
        nextMessages = nextMessages.splice(currentMessageIndex, 1, {
          ...currentMessage,
          references,
        } satisfies ChatViewMessage);

        setMessages(nextMessages);
      },
      (pid) => {
        setPromptId(pid);
      },
      (error) => {
        // ignore abort errors
        if (isAbortError(error)) return;

        // todo: surface errors to the user
        // eslint-disable-next-line no-console
        console.error(error);
      },
      {
        ...promptOptions,
        signal: controller.signal,
      },
      debug,
    );

    promise.then(() => {
      if (controller.signal.aborted) return;
      // set state of current message to done
      // setState('done');
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
        answer: '',
        references: [],
      },
    ] satisfies ChatViewMessage[];

    setMessages(nextMessages);

    // send messages to server
    submitMessagesToApi(nextMessages, id);
  };

  return { submitChat, messages, promptId };
}
