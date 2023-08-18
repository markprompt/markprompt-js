import {
  isAbortError,
  submitPrompt as submitPromptToMarkprompt,
  type FileSectionReference,
  type PromptMessage,
  type SubmitPromptOptions,
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

const mockData: ChatViewMessage[] = [
  {
    prompt: 'What is your name?',
    answer:
      'My name is John. I am a software developer with over 5 years of experience. I specialize in building web applications using React and Node.js. Here is an example of a React component I recently built:\n\n```jsx\nfunction MyComponent() {\n  return <div>Hello, world!</div>;\n}\n```',
    id: '1',
    state: 'done',
    references: [
      {
        file: {
          path: 'file1.ts',
          source: {
            type: 'website',
          },
        },
      },
      {
        file: {
          path: 'file2.ts',
          source: {
            type: 'website',
          },
        },
      },
      {
        file: {
          path: 'file1.ts',
          source: {
            type: 'website',
          },
        },
      },
      {
        file: {
          path: 'file2.ts',
          source: {
            type: 'website',
          },
        },
      },
      {
        file: {
          path: 'file1.ts',
          source: {
            type: 'website',
          },
        },
      },
      {
        file: {
          path: 'file2.ts',
          source: {
            type: 'website',
          },
        },
      },
      {
        file: {
          path: 'file1.ts',
          source: {
            type: 'website',
          },
        },
      },
      {
        file: {
          path: 'file2.ts',
          source: {
            type: 'website',
          },
        },
      },
      {
        file: {
          path: 'file1.ts',
          source: {
            type: 'website',
          },
        },
      },
      {
        file: {
          path: 'file2.ts',
          source: {
            type: 'website',
          },
        },
      },
      {
        file: {
          path: 'file1.ts',
          source: {
            type: 'website',
          },
        },
      },
      {
        file: {
          path: 'file2.ts',
          source: {
            type: 'website',
          },
        },
      },
      {
        file: {
          path: 'file1.ts',
          source: {
            type: 'website',
          },
        },
      },
      {
        file: {
          path: 'file2.ts',
          source: {
            type: 'website',
          },
        },
      },
    ],
  },
  {
    prompt: 'What is your favorite color?',
    answer:
      'My favorite color is blue. I find it calming and peaceful. It reminds me of the ocean and the sky. Here is a picture of a beautiful blue sky:\n\n![Blue Sky](https://www.example.com/blue-sky.jpg)',
    id: '2',
    state: 'done',
    references: [
      {
        file: {
          path: 'file4.ts',
          source: {
            type: 'website',
          },
        },
      },
    ],
  },
  {
    prompt: 'What is your favorite food?',
    answer:
      'My favorite food is pizza. I love the combination of cheese, sauce, and toppings on a crispy crust. Here is a recipe for a delicious homemade pizza:\n\n```javascript\nfunction makePizza() {\n  const crust = makeCrust();\n  const sauce = makeSauce();\n  const cheese = makeCheese();\n  const toppings = makeToppings();\n  const pizza = [crust, sauce, cheese, ...toppings];\n  return pizza;\n}\n```\n\nBake it in the oven at 240°C for 10-15 minu',
    id: '3',
    state: 'cancelled',
    references: [
      {
        file: {
          path: 'file3.ts',
          source: {
            type: 'website',
          },
        },
      },
    ],
  },
  {
    prompt: 'What is your favorite animal?',
    answer:
      'My favorite animal is a dog. I love their loyalty, playfulness, and affection. Here is a picture of my dog:\n\n![My Dog](https://www.example.com/my-dog.jpg)',
    id: '4',
    state: 'done',
    references: [
      {
        file: {
          path: 'file5.ts',
          source: {
            type: 'website',
          },
        },
      },
    ],
  },
  {
    prompt: 'What is your favorite hobby?',
    answer:
      'My favorite hobby is playing video games. I enjoy the challenge, the immersion, and the social aspect of gaming. Here is a list of my favorite games:\n\n- The Legend of Zelda: Breath of the Wild\n- Dark Souls\n- Super Mario Odyssey\n- The Witcher 3: Wild Hunt\n- Red Dead Redemption 2',
    id: '5',
    state: 'done',
    references: [
      {
        file: {
          path: 'file6.ts',
          source: {
            type: 'website',
          },
        },
      },
    ],
  },
  {
    prompt: 'What is your favorite movie?',
    answer:
      'My favorite movie is The Shawshank Redemption. I love the story, the characters, and the themes of hope and redemption. Here is a quote from the movie:\n\n> "Get busy living, or get busy dying."\n\nAnd here is a clip from the movie:\n\n[![The Shawshank Redemption](https://www.example.com/shawshank-redemption.jpg)](https://www.youtube.com/watch?v=6hB3S9bIaco)',
    id: '6',
    state: 'done',
    references: [
      {
        file: {
          path: 'file2.ts',
          source: {
            type: 'website',
          },
        },
      },
    ],
  },
];

export interface UseChatOptions {
  debug?: boolean;
  feedbackOptions?: MarkpromptOptions['feedback'];
  projectKey: string;
  promptOptions?: Omit<SubmitPromptOptions, 'signal'>;
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

export function useChat({
  debug,
  feedbackOptions,
  projectKey,
  promptOptions,
}: UseChatOptions): UseChatResult {
  if (!projectKey) {
    throw new Error(
      'Markprompt: a project key is required. Make sure to pass the projectKey to useMarkprompt.',
    );
  }

  const [promptId, setPromptId] = useState<string>('');
  const [messages, setMessages] = useState<ChatViewMessage[]>(mockData);

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
        message.answer
          ? {
              message: message.answer,
              role: 'assistant' as const,
            }
          : undefined,
      ])
      .flat()
      .filter(isPresent) satisfies PromptMessage[];

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
        references: [],
      },
    ] satisfies ChatViewMessage[];

    setMessages(nextMessages);

    // send messages to server
    submitMessagesToApi(nextMessages, id);
  };

  const regenerateLastAnswer = (): void => {
    const nextMessages = [...messages].splice(messages.length - 1, 1, {
      ...messages[messages.length - 1],
      state: 'indeterminate',
      references: [],
    }) satisfies ChatViewMessage[];

    setMessages(nextMessages);

    // send messages to server
    submitMessagesToApi(nextMessages, nextMessages[nextMessages.length - 1].id);
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
