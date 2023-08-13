import {
  type PromptMessage,
  type FileSectionReference,
  type SubmitPromptOptions,
  submitPrompt as submitPromptToMarkprompt,
  isAbortError,
} from '@markprompt/core';
import { useState } from 'react';

import { useAbortController } from './useAbortController.js';

interface UseChatOptions {
  projectKey: string;
  promptOptions?: Omit<SubmitPromptOptions, 'signal'>;
  debug?: boolean;
}

interface UseChatResult {
  submitChat: (prompt: string) => void;
}

interface ChatViewMessage extends PromptMessage {
  state?:
    | 'indeterminate'
    | 'preload'
    | 'streaming-answer'
    | 'done'
    | 'cancelled';
  references?: FileSectionReference[];
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

  const [messages, setMessages] = useState<ChatViewMessage[]>([]);

  const { ref: controllerRef, abort } = useAbortController();

  const submitMessagesToApi = async (
    messages: ChatViewMessage[],
  ): Promise<void> => {
    // if a user submits a new prompt while the previous prompt answer is still
    // streaming, abort the previous request, and show a message that the previous
    // prompt answer was aborted
    abort();

    const currentMessageIndex = messages.length - 1;
    const previousMessageIndex = currentMessageIndex - 1;

    if (
      messages[previousMessageIndex].role === 'assistant' &&
      (messages[previousMessageIndex].state === 'preload' ||
        messages[previousMessageIndex].state === 'streaming-answer')
    ) {
      const previousMessage = {
        ...messages[previousMessageIndex],
        state: 'cancelled',
      } satisfies ChatViewMessage;

      const nextMessages = [...messages];
      nextMessages[previousMessageIndex] = previousMessage;

      setMessages(nextMessages);
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    const promise = submitPromptToMarkprompt(
      messages,
      projectKey,
      (chunk) => {
        // todo: handle chunked responses
        // possible that messages is out of date, use nextMessages to update state? Maintain a local copy?
        // make sure we update the answer of the correct message from the array, eg. currentMessageIndex + 1
        // if (messages)
        //   // setState('streaming-answer');
        //   // setAnswer((prev) => prev + chunk);
        //   return true;
      },
      (refs) => {
        // references should be per assistant response
        // setReferences(refs)
      },
      (pid) => {
        // should we also have a onConversationId callback? or can it be merged with this?
        // setPromptId(pid)
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
      // set state of next message to done
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
    const nextMessages = [
      ...messages,
      { message: prompt, role: 'user', state: 'indeterminate' },
    ] satisfies ChatViewMessage[];

    setMessages(nextMessages);

    // send messages to server
    submitMessagesToApi(nextMessages);
  };

  return { submitChat };
}
