import { useEffect, useRef, type ReactNode } from 'react';

import { ChatContext, type ChatStore } from './store.js';
import { createChatStore, type MarkpromptOptions } from '../index.js';

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

  const store = useRef<ChatStore>();

  if (!store.current) {
    store.current = createChatStore({
      apiUrl,
      headers,
      projectKey,
      chatOptions,
      debug,
      persistChatHistory: chatOptions?.history,
      storeKey,
    });
  }

  // update chat options when they change
  useEffect(() => {
    if (!chatOptions) return;
    store.current?.getState().setOptions(chatOptions);
  }, [chatOptions]);

  return (
    <ChatContext.Provider value={store.current}>
      {children}
    </ChatContext.Provider>
  );
}
