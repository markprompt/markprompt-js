import React, {
  useState,
  type ReactElement,
  type ComponentPropsWithoutRef,
} from 'react';

import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import { useMarkpromptContext } from './context.js';
import { ThumbsDownIcon, ThumbsUpIcon } from './icons.js';

type FeedbackProps = {
  heading?: string;
  confirmationMessage?: string;
} & ComponentPropsWithoutRef<'aside'>;

export function Feedback(props: FeedbackProps): ReactElement {
  const {
    heading = DEFAULT_MARKPROMPT_OPTIONS.feedback!.heading,
    confirmationMessage = DEFAULT_MARKPROMPT_OPTIONS.feedback!
      .confirmationMessage,
  } = props;

  const { submitFeedback } = useMarkpromptContext();
  const [feedback, setFeedback] = useState<boolean>();

  async function handleFeedback(helpful: boolean): Promise<void> {
    await submitFeedback(helpful);
    setFeedback(helpful);
  }

  return (
    <aside {...props}>
      <h3>{heading}</h3>

      {typeof feedback !== 'boolean' && (
        <div>
          <button aria-label="Yes" onClick={() => handleFeedback(true)}>
            <ThumbsUpIcon width={16} height={16} />
          </button>
          <button aria-label="No" onClick={() => handleFeedback(false)}>
            <ThumbsDownIcon width={16} height={16} />
          </button>
        </div>
      )}

      {typeof feedback === 'boolean' && <p>{confirmationMessage}</p>}
    </aside>
  );
}
