import React, { type ReactElement } from 'react';

import { ChatViewForm } from './ChatViewForm.js';
import { Messages } from './Messages.js';
import { useChat } from './useChat.js';
import type { MarkpromptOptions } from '../types.js';
import type { View } from '../useViews.js';

export interface ChatViewProps {
  activeView: View;
  projectKey: string;
  chatOptions?: MarkpromptOptions['chat'];
  feedbackOptions?: MarkpromptOptions['feedback'];
  referencesOptions?: MarkpromptOptions['references'];
  close?: MarkpromptOptions['close'];
  onDidSelectReference?: () => void;
}

export function ChatView(props: ChatViewProps): ReactElement {
  const { close, projectKey, chatOptions, feedbackOptions, referencesOptions } =
    props;

  const {
    abortFeedbackRequest,
    messages,
    submitChat,
    submitFeedback,
    abort: abortSubmitChat,
    regenerateLastAnswer,
  } = useChat({ projectKey, chatOptions, feedbackOptions });

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
