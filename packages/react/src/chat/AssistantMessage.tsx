import { isToolCalls } from '@markprompt/core/chat';
import { DEFAULT_OPTIONS } from '@markprompt/core/constants';
import { useMemo, type ComponentType } from 'react';

import { DefaultToolCallsConfirmation } from './DefaultToolCallsConfirmation.js';
import { MessageAnswer } from './MessageAnswer.js';
import { useChatStore, type ChatViewMessage } from './store.js';
import { Feedback } from '../feedback/Feedback.js';
import { useFeedback } from '../feedback/useFeedback.js';
import { SparklesIcon } from '../icons.js';
import type { MarkpromptOptions } from '../types.js';

export interface AssistantMessageProps {
  apiUrl?: string;
  chatOptions: NonNullable<MarkpromptOptions['chat']>;
  feedbackOptions: NonNullable<MarkpromptOptions['feedback']>;
  message: ChatViewMessage;
  projectKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  linkAs?: string | ComponentType<any>;
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

  const toolCalls = useMemo(
    () => (isToolCalls(message.tool_calls) ? message.tool_calls : undefined),
    [message.tool_calls],
  );

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

  const confirmToolCalls = (): void => {
    submitToolCalls(message);
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
        <MessageAnswer state={message.state} linkAs={props.linkAs}>
          {message.content ?? ''}
        </MessageAnswer>
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
              message={message.content ?? ''}
              variant="icons"
              data-show-feedback-always={showFeedbackAlways}
              className="MarkpromptPromptFeedback"
              submitFeedback={(feedback, messageId) => {
                submitFeedback(feedback, messageId);
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
