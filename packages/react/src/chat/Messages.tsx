import React, { Fragment, type ReactElement } from 'react';

import { MessageAnswer } from './MessageAnswer.js';
import { MessagePrompt } from './MessagePrompt.js';
import { useChatStore } from './store.js';
import { Feedback } from '../feedback/Feedback.js';
import { useFeedback } from '../feedback/useFeedback.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import { Reference } from '../prompt/References.js';
import type { MarkpromptOptions } from '../types.js';

interface MessagesProps {
  feedbackOptions: NonNullable<MarkpromptOptions['feedback']>;
  referencesOptions: NonNullable<MarkpromptOptions['references']>;
  projectKey: string;
}

export function Messages(props: MessagesProps): ReactElement {
  const { feedbackOptions, referencesOptions, projectKey } = props;

  const messages = useChatStore((state) => state.messages);

  const { submitFeedback, abort: abortFeedbackRequest } = useFeedback({
    projectKey,
    feedbackOptions,
  });

  return (
    <div className="MarkpromptMessages">
      <BaseMarkprompt.AutoScroller
        className="MarkpromptAutoScroller"
        scrollTrigger={messages}
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

            {message.role === 'assistant' && message.content && (
              <div className="MarkpromptMessageAnswerContainer">
                <MessageAnswer state={message.state}>
                  {message.content ?? ''}
                </MessageAnswer>

                {feedbackOptions?.enabled && message.state === 'done' && (
                  <Feedback
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
                  />
                )}
              </div>
            )}

            {message.role === 'assistant' && message.function_call && (
              <div>
                I would like to perform an action for you:{' '}
                {message.function_call.name}. Is that ok?
              </div>
            )}

            {(!referencesOptions?.display ||
              referencesOptions?.display === 'end') &&
              message.references &&
              message.references?.length > 0 && (
                <div className="MarkpromptReferences">
                  {(message.state === 'streaming-answer' ||
                    message.state === 'done') && (
                    <>
                      <p>{referencesOptions.heading}</p>
                      <BaseMarkprompt.References
                        ReferenceComponent={Reference}
                        references={message.references}
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
