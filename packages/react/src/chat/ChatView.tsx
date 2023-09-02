import React, { useEffect } from 'react';

import { ChatViewForm } from './ChatViewForm.js';
import { Messages } from './Messages.js';
import { useChat } from './useChat.js';
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

export function ChatView(props: ChatViewProps): JSX.Element {
  const {
    activeView,
    chatOptions,
    close,
    debug,
    feedbackOptions,
    projectKey,
    referencesOptions,
  } = props;

  const {
    abort: abortSubmitChat,
    abortFeedbackRequest,
    messages,
    regenerateLastAnswer,
    submitChat,
    submitFeedback,
  } = useChat({ projectKey, chatOptions, feedbackOptions, debug });

  // Abort any pending chat requests when the view changes.
  useEffect(() => {
    if (activeView && activeView !== 'chat') {
      abortSubmitChat();
    }

    return () => {
      abortSubmitChat();
    };
  }, [activeView, abortSubmitChat]);

  return (
    <div className="MarkpromptChatView">
      <Messages
        messages={messages}
        feedbackOptions={feedbackOptions}
        abortFeedbackRequest={abortFeedbackRequest}
        submitFeedback={submitFeedback}
        referencesOptions={referencesOptions}
      />
      <ChatViewForm
        close={close}
        chatOptions={chatOptions}
        submitChat={submitChat}
        lastMessageState={messages[messages.length - 1]?.state}
        abortSubmitChat={abortSubmitChat}
        regenerateLastAnswer={regenerateLastAnswer}
      />
    </div>
  );
}
