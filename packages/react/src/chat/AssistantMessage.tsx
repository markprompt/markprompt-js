import { isToolCalls } from '@markprompt/core/chat';
import { DEFAULT_OPTIONS } from '@markprompt/core/constants';
import { getMessageTextContent } from '@markprompt/core/utils';
import { useMemo, type ComponentType, type JSX } from 'react';

import { DefaultToolCallsConfirmation } from './DefaultToolCallsConfirmation.js';
import { MessageAnswer } from './MessageAnswer.js';
import { useChatStore } from './store.js';
import { Feedback } from '../feedback/Feedback.js';
import { useFeedback } from '../feedback/useFeedback.js';
import { SparklesIcon } from '../icons.js';
import type { ChatViewAssistantMessage, MarkpromptOptions } from '../types.js';

export interface AssistantMessageProps {
  apiUrl?: string;
  chatOptions: NonNullable<MarkpromptOptions['chat']>;
  feedbackOptions: NonNullable<MarkpromptOptions['feedback']>;
  message: ChatViewAssistantMessage;
  projectKey: string;
  linkAs?: string | ComponentType<unknown>;
  messageOnly?: boolean;
  showFeedbackAlways?: boolean;
}

export function AssistantMessage(props: AssistantMessageProps): JSX.Element {
  const {
    apiUrl,
    feedbackOptions,
    message,
    projectKey,
    chatOptions,
    messageOnly,
    showFeedbackAlways,
  } = props;

  const toolCalls = useMemo(() => {
    if (message.role !== 'assistant') return;
    return isToolCalls(message.tool_calls) ? message.tool_calls : undefined;
  }, [message]);

  const messages = useChatStore((state) => state.messages);
  const submitToolCalls = useChatStore((state) => state.submitToolCalls);
  const toolCallsByToolCallId = useChatStore((state) =>
    Object.fromEntries(
      Object.entries(state.toolCallsByToolCallId).filter(([id]) =>
        toolCalls?.some((x) => x.id === id),
      ),
    ),
  );

  const { submitFeedback, abort: abortFeedbackRequest } = useFeedback({
    apiUrl: apiUrl || DEFAULT_OPTIONS.apiUrl,
    projectKey,
    feedbackOptions,
  });

  const confirmToolCalls = () => {
    void submitToolCalls(message);
  };

  const ToolCallConfirmation = useMemo(
    () => chatOptions.ToolCallsConfirmation ?? DefaultToolCallsConfirmation,
    [chatOptions.ToolCallsConfirmation],
  );

  if (message.error) {
    const ErrorText = chatOptions.errorText;
    return (
      <div className="MarkpromptError">
        {ErrorText && <ErrorText error={message.error} />}
      </div>
    );
  }

  return (
    <div
      className="MarkpromptMessageAnswerContainer"
      data-compact={messageOnly}
    >
      {chatOptions?.avatars?.visible && (
        <div className="MarkpromptMessageAvatarContainer" data-role="assistant">
          {!chatOptions.avatars?.assistant ? (
            <SparklesIcon
              className="MarkpromptMessageAvatar"
              data-type="icon"
              role="img"
              aria-label="Markprompt"
            />
          ) : typeof chatOptions.avatars?.assistant === 'string' ? (
            <img
              src={chatOptions.avatars.assistant}
              className="MarkpromptMessageAvatarImage"
              alt="Markprompt"
            />
          ) : (
            <div className="MarkpromptMessageAvatar">
              <chatOptions.avatars.assistant
                className="MarkpromptMessageAvatar"
                aria-label="Markprompt"
              />
            </div>
          )}
        </div>
      )}
      <div style={{ width: '100%', overflow: 'hidden' }}>
        <MessageAnswer message={message} linkAs={props.linkAs} />
        {/*
        If this message has any tool calls, and those tool calls require a
        confirmation, and that confirmation has not already been given, show
        either the default or user-provided confirmation
      */}
        {Array.isArray(toolCalls) && (
          <ToolCallConfirmation
            toolCalls={toolCalls}
            tools={chatOptions.tools}
            toolCallsStatus={toolCallsByToolCallId}
            confirmToolCalls={confirmToolCalls}
          />
        )}
        {!messageOnly &&
          (chatOptions.showCopy || feedbackOptions?.enabled) &&
          message.state === 'done' && (
            <Feedback
              message={getMessageTextContent(message)}
              variant="icons"
              data-show-feedback-always={showFeedbackAlways}
              className="MarkpromptPromptFeedback"
              submitFeedback={async (feedback, messageId) => {
                await submitFeedback(feedback, messageId);
                feedbackOptions.onFeedbackSubmit?.(
                  feedback,
                  messages,
                  messageId,
                );
              }}
              abortFeedbackRequest={abortFeedbackRequest}
              messageId={message.messageId}
              heading={feedbackOptions.heading}
              showFeedback={!!feedbackOptions?.enabled}
              showVotes={feedbackOptions.votes}
              showCopy={chatOptions.showCopy}
            />
          )}
      </div>
    </div>
  );
}
