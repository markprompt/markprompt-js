import React, { type ReactElement } from 'react';

import { ChatViewForm } from './ChatViewForm.js';
import { Messages } from './Messages.js';
import { ChatProvider } from './store.js';
import type { MarkpromptOptions } from '../types.js';
import type { View } from '../useViews.js';

export interface ChatViewProps {
  activeView?: View;
  chatOptions?: MarkpromptOptions['chat'];
  close?: MarkpromptOptions['close'];
  feedbackOptions?: MarkpromptOptions['feedback'];
  onDidSelectReference?: () => void;
  projectKey: string;
  referencesOptions?: MarkpromptOptions['references'];
  debug?: boolean;
}

export function ChatView(props: ChatViewProps): ReactElement {
  const {
    activeView,
    chatOptions,
    close,
    debug,
    feedbackOptions,
    projectKey,
    referencesOptions,
  } = props;

  return (
    <ChatProvider
      chatOptions={chatOptions}
      debug={debug}
      projectKey={projectKey}
    >
      <div className="MarkpromptChatView">
        <Messages
          projectKey={projectKey}
          feedbackOptions={feedbackOptions}
          referencesOptions={referencesOptions}
        />
        <ChatViewForm
          activeView={activeView}
          close={close}
          chatOptions={chatOptions}
        />
      </div>
    </ChatProvider>
  );
}
