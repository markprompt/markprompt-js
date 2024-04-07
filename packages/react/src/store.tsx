import { isAbortError, submitChat } from '@markprompt/core';
import {
  createContext,
  useContext,
  type ReactNode,
  useRef,
  useEffect,
} from 'react';
import { createStore, useStore, type StoreApi } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { toApiMessages } from './chat/utils.js';
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

type GlobalOptions = MarkpromptOptions & { projectKey: string };

interface State {
  options: GlobalOptions;
  activeView: View;
  setActiveView: (view: View) => void;

  tickets?: {
    summaryByConversationId: { [conversationId: string]: ChatViewMessage };
    createTicketSummary: (
      conversationId: string,
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
          summaryByConversationId: {},
          createTicketSummary: async (
            conversationId: string,
            messages: ChatViewMessage[],
          ) => {
            const summaryId = crypto.randomUUID();

            set((state) => {
              state.tickets!.summaryByConversationId[conversationId] = {
                id: summaryId,
                references: [],
                state: 'indeterminate',
              };
            });

            const options = {
              conversationId: conversationId,
              ...get().options.chat,
              tools: get().options?.chat?.tools?.map((x) => x.tool),
            };

            const apiMessages = [
              ...toApiMessages(messages),
              {
                role: 'user',
                content:
                  get().options?.integrations?.createTicket?.prompt ??
                  'I want to create a support case. Please summarize the conversation so far in first-person, from my point of view, for sending it to a support agent. Return only the summary itself, nothing else. Use short paragraphs. Include relevant code snippets. Respond in plain text.',
              } as const,
            ];

            set((state) => {
              state.tickets!.summaryByConversationId[conversationId].state =
                'preload';
            });

            try {
              for await (const chunk of submitChat(
                apiMessages,
                get().options.projectKey,
                options,
              )) {
                set((state) => {
                  state.tickets!.summaryByConversationId[conversationId] = {
                    ...state.tickets!.summaryByConversationId[conversationId],
                    state: 'streaming-answer',
                    ...chunk,
                  };
                });
              }
            } catch (error) {
              set((state) => {
                state.tickets!.summaryByConversationId[conversationId] = {
                  ...state.tickets!.summaryByConversationId[conversationId],
                  state: 'cancelled',
                };
              });

              if (isAbortError(error)) return;

              // eslint-disable-next-line no-console
              console.error({ error });

              return;
            }

            set((state) => {
              state.tickets!.summaryByConversationId[conversationId].state =
                'done';
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
