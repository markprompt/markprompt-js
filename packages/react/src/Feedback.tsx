import React, {
  useState,
  type ReactElement,
  type ComponentPropsWithoutRef,
} from 'react';

import { useMarkpromptContext } from './context.js';
import { ThumbsDownIcon, ThumbsUpIcon } from './icons.js';

export function Feedback(
  props: ComponentPropsWithoutRef<'aside'>,
): ReactElement {
  const { submitFeedback } = useMarkpromptContext();
  const [feedback, setFeedback] = useState<boolean>();

  async function handleFeedback(helpful: boolean): Promise<void> {
    await submitFeedback(helpful);
    setFeedback(helpful);
  }

  return (
    <aside {...props}>
      <h3>Was this response helpful?</h3>

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

      {typeof feedback === 'boolean' && (
        <p>Thanks for helping us improve our responses.</p>
      )}
    </aside>
  );
}
