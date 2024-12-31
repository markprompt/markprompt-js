import {
  submitChat,
  type ChatCompletionMessageParam,
} from '@markprompt/core/chat';
import { isAbortError, getMessageTextContent } from '@markprompt/core/utils';
import { createContext, useContext } from 'react';
import { createStore, type StoreApi } from 'zustand';
// eslint-disable-next-line import-x/no-deprecated
import { useStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { getInitialView } from './utils.js';
import { toValidApiMessages } from '../../chat/utils.js';
import type { ChatViewMessage, MarkpromptOptions, View } from '../../types.js';
import { isPresent } from '../../utils.js';

export type GlobalOptions = MarkpromptOptions & { projectKey: string };

interface State {
  options: GlobalOptions;
  activeView: View;
  setActiveView: (view: View) => void;
  tickets?: {
    summaryByThreadId: {
      [threadId: string]: ChatViewMessage;
    };
    createTicketSummary: (
      threadId: string,
      messages: ChatViewMessage[],
    ) => Promise<void>;
  };
}

export type GlobalStore = StoreApi<State>;

export const createGlobalStore = (options: GlobalOptions): GlobalStore => {
  return createStore(
    immer((set, get) => ({
      options,
      activeView: getInitialView(options),
      setActiveView: (view: View) => set({ activeView: view }),
      ...(options.integrations?.createTicket && {
        tickets: {
          summaryByThreadId: {},
          createTicketSummary: async (
            threadId: string,
            messages: ChatViewMessage[],
          ) => {
            const summaryId = crypto.randomUUID();

            set((state) => {
              if (!state.tickets) return;
              state.tickets.summaryByThreadId[threadId] = {
                id: summaryId,
                references: [],
                state: 'indeterminate',
              };
            });

            const options = {
              model: 'gpt-4o-mini' as const,
              threadId: threadId,
              apiUrl: get().options.apiUrl,
              headers: get().options.headers,
              systemPrompt:
                get().options?.integrations?.createTicket?.prompt ??
                `You act as an expert summarizer.

- You are analyzing a conversation between a customer and an AI support assistant.
- Your tasks is to summarize the conversation in a subject matter and a summary.
- The summary must be short and precise, and relate to the user's input only.
- You must write in the first person, as if you were the user writing a support ticket. Failure to do so will result in severe penalties.
- You focus on the user message, and omit assistant messages unless strictly needed.
- You must not include any references to creating a support ticket.
- You must write a neutral summary, with no greetings or other extra text.
- The summary must not be longer than the user messages. You will be penalized if it is longer.
- You must strictly adhere to these rules to avoid penalties.

## Output format

You must output your response as JSON with two entries: "subject" and "fullSummary", i.e. a JSON object of the form:

\`\`\`
{
  "subject": "...",
  "fullSummary": "...",
}
\`\`\`

- Do not include backticks in the response, just the JSON object.

## Examples

Input: "Hi, I am having an issue configuring my payment processor. It is..."
Output:

\`\`\`
{
  "subject": "Issue with payment processor",
  "fullSummary": "I am having an issue with setting up my payment processor. I cannot configure (...)"
}
\`\`\``,
              excludeFromInsights: true,
              doNotInjectContext: true,
              allowFollowUpQuestions: true,
              jsonOutput: true,
            };

            const conversation = toValidApiMessages(messages)
              .map((m) => {
                const content = getMessageTextContent(m);
                if (!content) return;
                return `${m.role === 'user' ? 'User' : 'AI'}: ${content}`;
              })
              .filter(isPresent)
              .join('\n\n==============================\n\n');

            const apiMessages = [
              {
                role: 'user',
                content: `Full transcript:\n\n${conversation}\n\nSummary info:`,
              } as const,
            ] as ChatCompletionMessageParam[];

            set((state) => {
              if (!state.tickets) return;
              state.tickets.summaryByThreadId[threadId].state = 'preload';
            });

            try {
              for await (const chunk of submitChat(
                apiMessages,
                get().options.projectKey,
                options,
              )) {
                set((state) => {
                  if (!state.tickets) return;
                  state.tickets.summaryByThreadId[threadId] = {
                    ...state.tickets?.summaryByThreadId[threadId],
                    state: 'streaming-answer',
                    ...chunk,
                  };
                });
              }
            } catch (error) {
              set((state) => {
                if (!state.tickets) return;
                state.tickets.summaryByThreadId[threadId] = {
                  ...state.tickets?.summaryByThreadId[threadId],
                  state: 'cancelled',
                };
              });

              if (isAbortError(error)) return;

              console.error({ error });

              return;
            }

            set((state) => {
              if (!state.tickets) return;
              state.tickets.summaryByThreadId[threadId].state = 'done';
            });
          },
        },
      }),
    })),
  );
};

export const GlobalStoreContext = createContext<GlobalStore | undefined>(
  undefined,
);

export function useGlobalStore<T>(selector: (state: State) => T): T {
  const store = useContext(GlobalStoreContext);
  if (!store) {
    throw new Error(
      'Missing GlobalStoreProvider. Make sure to wrap your component tree with <GlobalStoreProvider />.',
    );
  }
  // eslint-disable-next-line import-x/no-deprecated
  return useStore(store, selector);
}
