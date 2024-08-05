import {
  submitChat,
  type ChatCompletionMessageParam,
} from '@markprompt/core/chat';
import { isAbortError } from '@markprompt/core/utils';
import {
  createContext,
  useContext,
  type ReactNode,
  useRef,
  useEffect,
} from 'react';
import { createStore, useStore, type StoreApi } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { toValidApiMessages } from './chat/utils.js';
import type { ChatViewMessage } from './index.js';
import type { MarkpromptOptions, View } from './types.js';
import { getDefaultView } from './utils.js';

function getInitialView(options: MarkpromptOptions): View {
  if (options.defaultView) {
    return getDefaultView(options.defaultView, options);
  }

  if (options?.search?.enabled) {
    return 'search';
  }

  return 'chat';
}

function getEnabledViews(options: MarkpromptOptions): View[] {
  const views: View[] = ['chat'];

  if (options?.search?.enabled) {
    views.push('search');
  }

  if (typeof options?.integrations?.createTicket === 'string') {
    views.push('ticket');
  }

  return views;
}

export type GlobalOptions = MarkpromptOptions & { projectKey: string };

interface State {
  options: GlobalOptions;
  activeView: View;
  setActiveView: (view: View) => void;

  tickets?: {
    summaryByThreadId: { [threadId: string]: ChatViewMessage };
    createTicketSummary: (
      threadId: string,
      messages: ChatViewMessage[],
    ) => void;
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
              state.tickets!.summaryByThreadId[threadId] = {
                id: summaryId,
                references: [],
                state: 'indeterminate',
              };
            });

            const options = {
              threadId: threadId,
              ...get().options.chat,
              apiUrl: get().options.apiUrl,
              tools: get().options?.chat?.tools?.map((x) => x.tool),
              systemPrompt:
                get().options?.integrations?.createTicket?.prompt ??
                'You are an expert summarizer. Your task is to summarize a conversation between a user and an AI. Your summary is concise, and allows a human support agent to quickly inspect what is going on. You should only output the summary, nothing else. You output the content in plain text.',
              excludeFromInsights: true,
              doNotInjectContext: true,
              allowFollowUpQuestions: true,
            };

            const conversation = toValidApiMessages(messages)
              .map((m) => {
                return `${m.role === 'user' ? 'User' : 'AI'}:\n\n${m.content}`;
              })
              .join('\n\n==============================\n\n');

            const apiMessages = [
              {
                role: 'user',
                content: `Here is the full transcript of the conversation:\n\n${conversation}`,
              } as const,
            ] as ChatCompletionMessageParam[];

            set((state) => {
              state.tickets!.summaryByThreadId[threadId].state = 'preload';
            });

            try {
              for await (const chunk of submitChat(
                apiMessages,
                get().options.projectKey,
                options,
              )) {
                set((state) => {
                  state.tickets!.summaryByThreadId[threadId] = {
                    ...state.tickets!.summaryByThreadId[threadId],
                    state: 'streaming-answer',
                    ...chunk,
                  };
                });
              }
            } catch (error) {
              set((state) => {
                state.tickets!.summaryByThreadId[threadId] = {
                  ...state.tickets!.summaryByThreadId[threadId],
                  state: 'cancelled',
                };
              });

              if (isAbortError(error)) return;

              // eslint-disable-next-line no-console
              console.error({ error });

              return;
            }

            set((state) => {
              state.tickets!.summaryByThreadId[threadId].state = 'done';
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

interface GlobalStoreProviderProps {
  options: GlobalOptions;
  children: ReactNode;
}

function updateStateOnOptionsChange(
  store: GlobalStore,
  nextOptions: GlobalOptions,
): void {
  const activeView = store.getState().activeView;
  const nextInitialView = getInitialView(nextOptions);
  const nextEnabledViews = getEnabledViews(nextOptions);

  // only change the active view to the nextInitialView if the current view is no longer enabled
  store?.setState({
    activeView: nextEnabledViews.includes(activeView)
      ? activeView
      : nextInitialView,
    options: nextOptions,
  });
}

export function GlobalStoreProvider(
  props: GlobalStoreProviderProps,
): JSX.Element {
  const { options, children } = props;

  const store = useRef<GlobalStore>();

  if (!store.current) {
    store.current = createGlobalStore(options);
  }

  useEffect(() => {
    if (!store.current) return;
    updateStateOnOptionsChange(store.current, options);
  }, [options]);

  return (
    <GlobalStoreContext.Provider value={store.current}>
      {children}
    </GlobalStoreContext.Provider>
  );
}

export function useGlobalStore<T>(selector: (state: State) => T): T {
  const store = useContext(GlobalStoreContext);
  if (!store) {
    throw new Error(
      'Missing GlobalStoreProvider. Make sure to wrap your component tree with <GlobalStoreProvider />.',
    );
  }
  return useStore(store, selector);
}
