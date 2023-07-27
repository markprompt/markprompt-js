import type { PromptFeedback } from '@markprompt/core';
import React, {
  useState,
  type ReactElement,
  type ComponentPropsWithoutRef,
} from 'react';

import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import { useMarkpromptContext } from './context.js';

type FeedbackProps = {
  heading?: string;
} & ComponentPropsWithoutRef<'aside'>;

export function Feedback(props: FeedbackProps): ReactElement {
  const { heading = DEFAULT_MARKPROMPT_OPTIONS.feedback!.heading } = props;

  const { submitFeedback } = useMarkpromptContext();
  const [feedback, setFeedback] = useState<PromptFeedback>();

  async function handleFeedback(feedback: PromptFeedback): Promise<void> {
    await submitFeedback(feedback);
    setFeedback(feedback);
  }

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
