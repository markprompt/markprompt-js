import { isToolCalls } from '@markprompt/core';
import { useMemo } from 'react';

import { DefaultToolCallsConfirmation } from './DefaultToolCallsConfirmation.js';
import { MessageAnswer } from './MessageAnswer.js';
import { useChatStore, type ChatViewMessage } from './store.js';
import { Feedback } from '../feedback/Feedback.js';
import { useFeedback } from '../feedback/useFeedback.js';
import type { MarkpromptOptions } from '../types.js';
import { BotIcon, ClipboardIcon } from '../icons.js';
import { AccessibleIcon } from '@radix-ui/react-accessible-icon';

interface AssistantMessageProps {
  chatOptions: NonNullable<MarkpromptOptions['chat']>;
  feedbackOptions: NonNullable<MarkpromptOptions['feedback']>;
  message: ChatViewMessage;
  projectKey: string;
}

export function AssistantMessage(props: AssistantMessageProps): JSX.Element {
  const { feedbackOptions, message, projectKey, chatOptions } = props;

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
    <div className="MarkpromptMessageAnswerContainer">
      {chatOptions?.avatars?.visible && (
        <>
          {!chatOptions.avatars?.assistant ? (
            <BotIcon className="MarkpromptMessageAvatar" />
          ) : typeof chatOptions.avatars?.assistant === 'string' ? (
            <img
              src={chatOptions.avatars.assistant}
              className="MarkpromptMessageAvatar MarkpromptMessageAvatarImage"
            />
          ) : (
            <div className="MarkpromptMessageAvatar">
              <chatOptions.avatars.assistant className="MarkpromptMessageAvatar" />
            </div>
          )}
        </>
      )}
      <div>
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
            toolCallsStatus={toolCallsByToolCallId}
            confirmToolCalls={confirmToolCalls}
          />
        )}
        {(chatOptions.showCopy || feedbackOptions?.enabled) &&
          message.state === 'done' && (
            <Feedback
              message={message.content ?? ''}
              variant="icons"
              className="MarkpromptPromptFeedback"
              submitFeedback={(feedback, promptId) => {
                submitFeedback(feedback, promptId);
                feedbackOptions.onFeedbackSubmit?.(
                  feedback,
                  messages,
                  promptId,
                );
              }}
              abortFeedbackRequest={abortFeedbackRequest}
              promptId={message.promptId}
              heading={feedbackOptions.heading}
              showFeedback={!!feedbackOptions?.enabled}
              showCopy={chatOptions.showCopy}
            />
          )}
      </div>
    </div>
  );
}
