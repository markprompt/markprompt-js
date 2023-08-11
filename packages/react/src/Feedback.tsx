import type { PromptFeedback } from '@markprompt/core';
import React, {
  useState,
  type ReactElement,
  type ComponentPropsWithoutRef,
  useEffect,
} from 'react';

import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';

interface FeedbackProps extends ComponentPropsWithoutRef<'aside'> {
  heading?: string;
  submitFeedback: (feedback: PromptFeedback) => void;
  abortFeedbackRequest: () => void;
}

export function Feedback(props: FeedbackProps): ReactElement {
  const {
    heading = DEFAULT_MARKPROMPT_OPTIONS.feedback!.heading,
    submitFeedback,
    abortFeedbackRequest,
  } = props;

  const [feedback, setFeedback] = useState<PromptFeedback>();

  function handleFeedback(feedback: PromptFeedback): void {
    submitFeedback(feedback);
    setFeedback(feedback);
  }

  useEffect(() => {
    // Abort feedback request on unmount
    return () => abortFeedbackRequest();
  }, [abortFeedbackRequest]);

  return (
    <aside {...props}>
      <h3>{heading}</h3>

      <div>
        <button
          aria-label="Yes"
          onClick={() => handleFeedback({ vote: '1' })}
          data-active={feedback?.vote === '1'}
        >
          Yes
        </button>
        <button
          aria-label="No"
          onClick={() => handleFeedback({ vote: '-1' })}
          data-active={feedback?.vote === '-1'}
          style={{ animationDelay: '100ms' }}
        >
          No
        </button>
      </div>
    </aside>
  );
}
