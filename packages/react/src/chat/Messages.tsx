import React, { type ReactElement } from 'react';

import { MessageAnswer } from './MessageAnswer.js';
import { MessagePrompt } from './MessagePrompt.js';
import { useChatStore } from './store.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants.js';
import { Feedback } from '../feedback/Feedback.js';
import { useFeedback } from '../feedback/useFeedback.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import { Reference } from '../prompt/References.js';
import type { MarkpromptOptions } from '../types.js';

interface MessagesProps {
  feedbackOptions: MarkpromptOptions['feedback'];
  referencesOptions: MarkpromptOptions['references'];
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
                  promptId={message.promptId}
                  heading={feedbackOptions.heading}
                />
              )}
            </div>

            {(!referencesOptions?.display ||
              referencesOptions?.display === 'end') && (
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
            )}
          </section>
        ))}
      </BaseMarkprompt.AutoScroller>
    </div>
  );
}
