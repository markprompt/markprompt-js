import type { PromptFeedback } from '@markprompt/core';
import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import {
  useState,
  type ReactElement,
  type ComponentPropsWithoutRef,
  useEffect,
} from 'react';

import type { UseFeedbackResult } from './useFeedback';
import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants';
import { ThumbsDownIcon, ThumbsUpIcon } from '../icons';
import { CopyContentButton } from '../primitives/headless';

interface FeedbackProps extends ComponentPropsWithoutRef<'aside'> {
  message?: string;
  heading?: string;
  submitFeedback: UseFeedbackResult['submitFeedback'];
  abortFeedbackRequest: UseFeedbackResult['abort'];
  variant: 'text' | 'icons';
  promptId?: string;
  showFeedback?: boolean;
  showCopy?: boolean;
}

// Historically, this component held the thumbs up/down buttons only.
// This is evolving into a more general "Actions" component, which now
// also includes a copy button.
export function Feedback(props: FeedbackProps): ReactElement {
  const {
    message,
    heading = DEFAULT_MARKPROMPT_OPTIONS.feedback!.heading,
    submitFeedback,
    abortFeedbackRequest,
    variant,
    promptId,
    showFeedback = true,
    showCopy,
    ...divProps
  } = props;

  const [feedback, setFeedback] = useState<PromptFeedback>();

  function handleFeedback(feedback: PromptFeedback): void {
    submitFeedback(feedback, promptId);
    setFeedback(feedback);
  }

  useEffect(() => {
    // Abort feedback request on unmount
    return () => abortFeedbackRequest();
  }, [abortFeedbackRequest]);

  return (
    <div {...divProps} data-variant={variant}>
      {heading && <h3>{heading}</h3>}
      <div>
        {showCopy && message && (
          <CopyContentButton
            content={message}
            className="MarkpromptGhostThumbButton"
          />
        )}
        {showFeedback && (
          <>
            <button
              className="MarkpromptGhostThumbButton"
              onClick={() => handleFeedback({ vote: '1' })}
              data-active={feedback?.vote === '1'}
            >
              {variant === 'text' && 'Yes'}
              {variant === 'icons' && (
                <AccessibleIcon label="yes">
                  <ThumbsUpIcon width={16} height={16} strokeWidth={2} />
                </AccessibleIcon>
              )}
            </button>
            <button
              className="MarkpromptGhostThumbButton"
              onClick={() => handleFeedback({ vote: '-1' })}
              data-active={feedback?.vote === '-1'}
              style={{ animationDelay: '100ms' }}
            >
              {variant === 'text' && 'No'}
              {variant === 'icons' && (
                <AccessibleIcon label="no">
                  <ThumbsDownIcon width={16} height={16} />
                </AccessibleIcon>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
