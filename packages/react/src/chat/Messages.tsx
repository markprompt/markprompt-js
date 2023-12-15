import { isToolCall } from '@markprompt/core';
import React, { Fragment, useState, type ReactElement } from 'react';

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
  feedbackOptions: NonNullable<MarkpromptOptions['feedback']>;
  referencesOptions: NonNullable<MarkpromptOptions['references']>;
  defaultView: NonNullable<MarkpromptOptions['chat']>['defaultView'];
  projectKey: string;
  tools?: ChatViewTool[];
}

export function Messages(props: MessagesProps): ReactElement {
  const { feedbackOptions, referencesOptions, defaultView, projectKey, tools } =
    props;

  const messages = useChatStore((state) => state.messages);
  const submitChat = useChatStore((state) => state.submitChat);

  if (!messages || messages.length === 0) {
    return (
      <DefaultView
        message={defaultView?.message}
        prompts={defaultView?.prompts}
        promptsHeading={defaultView?.promptsHeading}
        onDidSelectPrompt={(prompt) =>
          submitChat({ role: 'user', content: prompt })
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
                tools={tools}
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
  feedbackOptions: NonNullable<MarkpromptOptions['feedback']>;
  message: ChatViewMessage;
  projectKey: string;
  tools?: ChatViewTool[];
}

function AssistantMessage(props: AssistantMessageProps): JSX.Element {
  const { feedbackOptions, message, projectKey, tools } = props;

  const messages = useChatStore((state) => state.messages);
  const submitToolCall = useChatStore((state) => state.submitToolCalls);

  const { submitFeedback, abort: abortFeedbackRequest } = useFeedback({
    projectKey,
    feedbackOptions,
  });

  const [toolCallConfirmed, setToolCallConfirmed] = useState(false);

  const confirmToolCall = (): void => {
    setToolCallConfirmed(true);
    submitToolCall(message);
  };

  return (
    <div className="MarkpromptMessageAnswerContainer">
      <MessageAnswer state={message.state}>
        {message.content ?? ''}
      </MessageAnswer>

      {/* if this message has any tool calls, and those tool calls require a confirmation, and that confirmation has not already been given, show either the default or user-provided confirmation */}
      {Array.isArray(message.tool_calls) &&
        message.tool_calls.map((tool_call) => {
          // don't render incomplete tool calls
          if (!isToolCall(tool_call)) return null;

          const tool = tools?.find(
            (tool) => tool.tool.function.name === tool_call.function?.name,
          );

          if (tool?.requireConfirmation === false || toolCallConfirmed) {
            // show a message that we received a function call and show a loading state?
            // render a loading state while we wait for the tool call to resolve?
          }

          if (tool.Confirmation) {
            const Confirmation = tool.Confirmation;
            return (
              <Confirmation
                key={tool_call.id!}
                args={
                  tool_call.function.arguments === ''
                    ? '{}'
                    : tool_call.function.arguments!
                }
                confirm={confirmToolCall}
              />
            );
          }

          return (
            <div key={tool_call.id!} style={{ paddingInline: '1.75rem' }}>
              <p>
                The bot wants to use a tool, please confirm that you want to:
              </p>
              <p>
                <strong>
                  {tool.tool.function.description ?? tool.tool.function.name}
                </strong>
              </p>
              <div>
                <button onClick={confirmToolCall}>Confirm</button>
              </div>
            </div>
          );
        })}

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
