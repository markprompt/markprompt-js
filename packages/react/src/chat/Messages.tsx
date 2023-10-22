import React, {
  Fragment,
  useCallback,
  type ReactElement,
  useMemo,
  useState,
} from 'react';

import { MessageAnswer } from './MessageAnswer.js';
import { MessagePrompt } from './MessagePrompt.js';
import { useChatStore, type ChatViewMessage } from './store.js';
import { Feedback } from '../feedback/Feedback.js';
import { useFeedback } from '../feedback/useFeedback.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import { DefaultView } from '../prompt/DefaultView.js';
import { References } from '../prompt/References.js';
import type {
  DefaultViewProps,
  FeedbackOptions,
  ReferencesOptions,
} from '../types.js';

interface MessagesProps {
  defaultView?: DefaultViewProps;
  feedbackOptions: FeedbackOptions;
  projectKey: string;
  referencesOptions: ReferencesOptions;
}

export function Messages(props: MessagesProps): ReactElement {
  const { feedbackOptions, referencesOptions, defaultView, projectKey } = props;

  const messages = useChatStore((state) => state.messages);
  const submitChat = useChatStore((state) => state.submitChat);

  const { submitFeedback, abort: abortFeedbackRequest } = useFeedback({
    projectKey,
    feedbackOptions,
  });

  if (!messages || messages.length === 0) {
    return (
      <DefaultView
        message={defaultView?.message}
        prompts={defaultView?.prompts}
        promptsHeading={defaultView?.promptsHeading}
        onDidSelectPrompt={submitChat}
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
              <FunctionCall functionCall={message.function_call} />
            )}

            {(!referencesOptions?.display ||
              referencesOptions?.display === 'end') &&
              message.references &&
              message.references?.length > 0 && (
                <div className="MarkpromptReferences">
                  {(message.state === 'streaming-answer' ||
                    message.state === 'done') && (
                    <References
                      references={message.references}
                      getHref={referencesOptions?.getHref}
                      getLabel={referencesOptions?.getLabel}
                      loadingText={referencesOptions?.loadingText}
                      heading={referencesOptions?.heading}
                      state={message.state}
                    />
                  )}
                </div>
              )}
          </Fragment>
        ))}
      </BaseMarkprompt.AutoScroller>
    </div>
  );
}

interface FunctionCallProps {
  functionCall: NonNullable<ChatViewMessage['function_call']>;
}

function FunctionCall(props: FunctionCallProps) {
  const { functionCall } = props;

  const functions = useChatStore((state) => state.options.functions);

  const [confirmed, setConfirmed] = useState(false);

  const hasConfirmationRequirement = useCallback(
    (name: string) => {
      return Boolean(functions?.find((f) => f.name === name)?.confirmation);
    },
    [functions],
  );

  const confirmation = useMemo(() => {
    const confirmation = functions?.find((f) => f.name === functionCall.name)
      ?.confirmation;

    if (!confirmation) return null;

    if (typeof confirmation === 'function') {
      return confirmation(JSON.parse(functionCall.arguments));
    }

    return confirmation;
  }, [functionCall, functions]);

  if (!hasConfirmationRequirement || confirmed) {
    return null;
  }

  return (
    <div style={{ paddingInline: '1.5rem', paddingBottom: '2.5rem' }}>
      <p>{confirmation}</p>
      <button onClick={() => setConfirmed(true)}>Confirm</button>
      <button onClick={() => setConfirmed(false)}>Cancel</button>
    </div>
  );
}
