import { isToolCalls } from '@markprompt/core';
import React, { useMemo } from 'react';

import { DefaultToolCallsConfirmation } from './DefaultToolCallsConfirmation.js';
import { MessageAnswer } from './MessageAnswer.js';
import { useChatStore, type ChatViewMessage } from './store.js';
import { Feedback } from '../feedback/Feedback.js';
import { useFeedback } from '../feedback/useFeedback.js';
import type { MarkpromptOptions } from '../types.js';

interface AssistantMessageProps {
  chatOptions: NonNullable<MarkpromptOptions['chat']>;
  feedbackOptions: NonNullable<MarkpromptOptions['feedback']>;
  message: ChatViewMessage;
  projectKey: string;
}
export function AssistantMessage(props: AssistantMessageProps): JSX.Element {
  const { feedbackOptions, message, projectKey, chatOptions } = props;

  const messages = useChatStore((state) => state.messages);
  const submitToolCalls = useChatStore((state) => state.submitToolCalls);

  const { submitFeedback, abort: abortFeedbackRequest } = useFeedback({
    projectKey,
    feedbackOptions,
  });

  const confirmToolCalls = (): void => {
    submitToolCalls(message);
  };

  const toolCalls = useMemo(
    () => (isToolCalls(message.tool_calls) ? message.tool_calls : undefined),
    [message.tool_calls],
  );

  const ToolCallConfirmation = useMemo(
    () => chatOptions.ToolCallsConfirmation ?? DefaultToolCallsConfirmation,
    [chatOptions.ToolCallsConfirmation],
  );

  return (
    <div className="MarkpromptMessageAnswerContainer">
      <MessageAnswer state={message.state}>
        {message.content ?? ''}
      </MessageAnswer>

      {/*
        if this message has any tool calls, and those tool calls require a
        confirmation, and that confirmation has not already been given, show
        either the default or user-provided confirmation
      */}
      {Array.isArray(toolCalls) && (
        <ToolCallConfirmation
          toolCalls={toolCalls}
          tools={chatOptions.tools}
          confirmToolCalls={confirmToolCalls}
        />
      )}

      {feedbackOptions?.enabled && message.state === 'done' && (
        <Feedback
          variant="icons"
          className="MarkpromptPromptFeedback"
          submitFeedback={(feedback, promptId) => {
            submitFeedback(feedback, promptId);
            feedbackOptions.onFeedbackSubmit?.(feedback, messages, promptId);
          }}
          abortFeedbackRequest={abortFeedbackRequest}
          promptId={message.promptId}
          heading={feedbackOptions.heading}
        />
      )}
    </div>
  );
}
