import {
  isToolCalls,
  type ChatCompletionMessageToolCall,
} from '@markprompt/core';
import React, { Fragment, useMemo, type ReactElement } from 'react';

import { MessageAnswer } from './MessageAnswer.js';
import { MessagePrompt } from './MessagePrompt.js';
import {
  useChatStore,
  type ChatViewMessage,
  type ChatViewTool,
} from './store.js';
import { Feedback } from '../feedback/Feedback.js';
import { useFeedback } from '../feedback/useFeedback.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import { DefaultView } from '../prompt/DefaultView.js';
import { References } from '../prompt/References.js';
import type { MarkpromptOptions } from '../types.js';

interface MessagesProps {
  chatOptions: NonNullable<MarkpromptOptions['chat']>;
  feedbackOptions: NonNullable<MarkpromptOptions['feedback']>;
  referencesOptions: NonNullable<MarkpromptOptions['references']>;
  projectKey: string;
}

export function Messages(props: MessagesProps): ReactElement {
  const { chatOptions, feedbackOptions, referencesOptions, projectKey } = props;

  const messages = useChatStore((state) => state.messages);
  const submitChat = useChatStore((state) => state.submitChat);

  if (!messages || messages.length === 0) {
    return (
      <DefaultView
        {...chatOptions.defaultView}
        onDidSelectPrompt={(prompt) =>
          submitChat([{ role: 'user', content: prompt }])
        }
      />
    );
  }

  return (
    <div className="MarkpromptMessages">
      <BaseMarkprompt.AutoScroller
        className="MarkpromptAutoScroller"
        scrollTrigger={messages}
        discreteScrollTrigger={messages.length}
      >
        {messages.map((message) => (
          <Fragment key={message.id}>
            {message.role === 'user' && (
              <MessagePrompt
                state={message.state}
                referencesOptions={referencesOptions}
              >
                {message.content ?? ''}
              </MessagePrompt>
            )}

            {message.role === 'assistant' && (
              <AssistantMessage
                message={message}
                projectKey={projectKey}
                feedbackOptions={feedbackOptions}
                chatOptions={chatOptions}
              />
            )}

            {(!referencesOptions?.display ||
              referencesOptions?.display === 'end') &&
              message.references &&
              message.references?.length > 0 && (
                <div className="MarkpromptReferences">
                  {(message.state === 'streaming-answer' ||
                    message.state === 'done') && (
                    <>
                      <References
                        references={message.references}
                        getHref={referencesOptions?.getHref}
                        getLabel={referencesOptions?.getLabel}
                        loadingText={referencesOptions?.loadingText}
                        heading={referencesOptions?.heading}
                        state={message.state}
                      />
                    </>
                  )}
                </div>
              )}
          </Fragment>
        ))}
      </BaseMarkprompt.AutoScroller>
    </div>
  );
}

interface AssistantMessageProps {
  chatOptions: NonNullable<MarkpromptOptions['chat']>;
  feedbackOptions: NonNullable<MarkpromptOptions['feedback']>;
  message: ChatViewMessage;
  projectKey: string;
}

function AssistantMessage(props: AssistantMessageProps): JSX.Element {
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

      {/* if this message has any tool calls, and those tool calls require a confirmation, and that confirmation has not already been given, show either the default or user-provided confirmation */}
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

interface DefaultToolCallsConfirmationProps {
  toolCalls: ChatCompletionMessageToolCall[];
  tools?: ChatViewTool[];
  confirmToolCalls: () => void;
}

function DefaultToolCallsConfirmation(
  props: DefaultToolCallsConfirmationProps,
): JSX.Element {
  const { toolCalls, tools, confirmToolCalls } = props;

  const toolCallsByToolCallId = useChatStore(
    (state) => state.toolCallsByToolCallId,
  );

  const toolCallsRequiringConfirmation = useMemo(() => {
    return toolCalls.filter((toolCall) => {
      const tool = tools?.find(
        (tool) => tool.tool.function.name === toolCall.function?.name,
      );

      return tool?.requireConfirmation ?? true;
    });
  }, [toolCalls, tools]);

  const toolCallsWithoutConfirmation = useMemo(() => {
    return toolCalls.filter((toolCall) => {
      const tool = tools?.find(
        (tool) => tool.tool.function.name === toolCall.function?.name,
      );

      return tool?.requireConfirmation === false;
    });
  }, [toolCalls, tools]);

  return (
    <div className="MarkpromptToolCallConfirmation">
      {toolCallsWithoutConfirmation.length > 0 && (
        <div>
          <p>The bot is calling the following tools on your behalf:</p>
          {toolCallsWithoutConfirmation.map((toolCall) => {
            const tool = tools?.find(
              (tool) => tool.tool.function.name === toolCall.function?.name,
            );

            if (!tool) throw Error('tool not found');

            return (
              <p key={toolCall.function.name}>
                <strong>
                  {tool.tool.function.description ?? tool.tool.function.name}
                </strong>
              </p>
            );
          })}
        </div>
      )}

      {toolCallsRequiringConfirmation.length > 0 && (
        <>
          <div>
            <p>
              The bot wants to use {toolCalls.length === 1 ? 'a tool' : 'tools'}
              , please confirm that you allow to:
            </p>
            {toolCallsRequiringConfirmation.map((toolCall) => {
              const tool = tools?.find(
                (tool) => tool.tool.function.name === toolCall.function?.name,
              );

              if (!tool) throw Error('tool not found');

              if (tool?.requireConfirmation === false) {
                return null;
              }

              const status = toolCallsByToolCallId[toolCall.id]?.status;

              return (
                <p key={toolCall.function.name}>
                  <strong>
                    {tool.tool.function.description ?? tool.tool.function.name}{' '}
                    {status === 'loading'
                      ? '🔄'
                      : status === 'done'
                      ? '✅'
                      : status === 'error'
                      ? '❌'
                      : null}
                  </strong>
                </p>
              );
            })}
          </div>

          {Object.values(toolCallsByToolCallId).some(
            (x) => x.status !== 'done',
          ) && (
            <div>
              <button className="MarkpromptButton" onClick={confirmToolCalls}>
                Confirm
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
