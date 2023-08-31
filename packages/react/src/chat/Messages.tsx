import React, { type ReactElement } from 'react';

import { MessageAnswer } from './MessageAnswer.js';
import { MessagePrompt } from './MessagePrompt.js';
import { type ChatViewMessage } from './useChat.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants.js';
import { Feedback } from '../feedback/Feedback.js';
import type { UseFeedbackResult } from '../feedback/useFeedback.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import { Reference } from '../prompt/References.js';
import type { MarkpromptOptions } from '../types.js';

interface MessagesProps {
  feedbackOptions?: MarkpromptOptions['feedback'];
  messages: ChatViewMessage[];
  submitFeedback: UseFeedbackResult['submitFeedback'];
  abortFeedbackRequest: UseFeedbackResult['abort'];
  referencesOptions?: MarkpromptOptions['references'];
}

export function Messages(props: MessagesProps): ReactElement {
  const {
    feedbackOptions,
    messages,
    submitFeedback,
    abortFeedbackRequest,
    referencesOptions,
  } = props;

  return (
    <div className="MarkpromptMessages">
      <BaseMarkprompt.AutoScroller
        className="MarkpromptAutoScroller"
        scrollTrigger={messages}
      >
        {messages.map((message, index) => (
          <section key={message.id}>
            <MessagePrompt state={message.state}>
              {message.prompt}
            </MessagePrompt>
            <div className="MarkpromptMessageAnswerContainer">
              <MessageAnswer state={message.state}>
                {message.answer ?? ''}
              </MessageAnswer>

              {feedbackOptions?.enabled && message.state === 'done' && (
                <Feedback
                  variant="icons"
                  className="MarkpromptPromptFeedback"
                  submitFeedback={submitFeedback}
                  abortFeedbackRequest={abortFeedbackRequest}
                  state={message.state}
                  // convert back to the original index in the array returned from the API
                  messageIndex={index + index + 1}
                />
              )}
            </div>

            <div className="MarkpromptReferences">
              {(message.state === 'streaming-answer' ||
                message.state === 'done') && (
                <>
                  <p>
                    {referencesOptions?.heading ??
                      DEFAULT_MARKPROMPT_OPTIONS.references?.heading}
                  </p>
                  <BaseMarkprompt.References
                    ReferenceComponent={Reference}
                    references={message.references}
                  />
                </>
              )}
            </div>
          </section>
        ))}
      </BaseMarkprompt.AutoScroller>
    </div>
  );
}
