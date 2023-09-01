import type { PromptFeedback } from '@markprompt/core';
import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import React, {
  useState,
  type ReactElement,
  type ComponentPropsWithoutRef,
  useEffect,
} from 'react';

import type { UseFeedbackResult } from './useFeedback.js';
import type { ChatLoadingState } from '../chat/useChat.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants.js';
import { ThumbsDownIcon, ThumbsUpIcon } from '../icons.js';
import type { PromptLoadingState } from '../prompt/usePrompt.js';

interface FeedbackProps extends ComponentPropsWithoutRef<'aside'> {
  state: PromptLoadingState | ChatLoadingState;
  heading?: string;
  submitFeedback: UseFeedbackResult['submitFeedback'];
  abortFeedbackRequest: UseFeedbackResult['abort'];
  messageIndex: number;
  variant: 'text' | 'icons';
}

export function Feedback(props: FeedbackProps): ReactElement {
  const {
    heading = DEFAULT_MARKPROMPT_OPTIONS.feedback!.heading,
    submitFeedback,
    abortFeedbackRequest,
    state,
    messageIndex,
    variant,
    ...asideProps
  } = props;

  const [feedback, setFeedback] = useState<PromptFeedback>();

  function handleFeedback(feedback: PromptFeedback): void {
    submitFeedback(feedback, state, messageIndex);
    setFeedback(feedback);
  }

  useEffect(() => {
    // Abort feedback request on unmount
    return () => abortFeedbackRequest();
  }, [abortFeedbackRequest]);

  return (
    <aside {...asideProps} data-variant={variant}>
      <h3>{heading}</h3>
      <div>
        <button
          onClick={() => handleFeedback({ vote: '1' })}
          data-active={feedback?.vote === '1'}
        >
          {variant === 'text' && 'Yes'}
          {variant === 'icons' && (
            <AccessibleIcon label="yes">
              <ThumbsUpIcon width={15} height={15} />
            </AccessibleIcon>
          )}
        </button>
        <button
          onClick={() => handleFeedback({ vote: '-1' })}
          data-active={feedback?.vote === '-1'}
          style={{ animationDelay: '100ms' }}
        >
          {variant === 'text' && 'No'}
          {variant === 'icons' && (
            <AccessibleIcon label="no">
              <ThumbsDownIcon width={15} height={15} />
            </AccessibleIcon>
          )}
        </button>
      </div>
    </aside>
  );
}
