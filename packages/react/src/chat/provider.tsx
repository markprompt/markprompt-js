import { useEffect, useRef, type JSX, type ReactNode } from 'react';

import { createChatStore, ChatContext, type ChatStore } from './store.js';
import type { MarkpromptOptions } from '../types.js';

export interface ChatProviderProps {
  chatOptions?: MarkpromptOptions['chat'];
  children: ReactNode;
  debug?: boolean;
  projectKey: string;
  storeKey?: string;
  apiUrl?: string;
  headers?: { [key: string]: string };
}

export function ChatProvider(props: ChatProviderProps): JSX.Element {
  const {
    chatOptions,
    children,
    debug,
    projectKey,
    storeKey,
    apiUrl,
    headers,
  } = props;

  const store = useRef<{
    storeKey: string | undefined;
    store: ChatStore | null;
  }>({
    storeKey: undefined,
    store: null,
  });

  if (!store.current?.store || store.current?.storeKey !== storeKey) {
    store.current = {
      storeKey,
      store: createChatStore({
        apiUrl,
        headers,
        projectKey,
        chatOptions,
        debug,
        persistChatHistory: chatOptions?.history,
        storeKey,
      }),
    };
  }

  // update chat options when they change
  useEffect(() => {
    if (!chatOptions) return;
    store.current?.store?.getState().setOptions(chatOptions);
  }, [chatOptions]);

  return (
    <ChatContext.Provider value={store.current?.store}>
      {children}
    </ChatContext.Provider>
  );
}
