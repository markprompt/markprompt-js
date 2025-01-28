import { clsx } from 'clsx';
import type { ComponentType, JSX } from 'react';

import * as BaseMarkprompt from '../primitives/headless.js';
import type { ChatViewAssistantMessage } from '../types.js';

interface AnswerProps {
  /**
   * Custom class name.
   */
  className?: string;
  /**
   * The message to display, in Markdown format.
   */
  message: ChatViewAssistantMessage;
  /**
   * Component to use in place of <a>.
   * @default "a"
   */
  linkAs?: string | ComponentType<unknown>;
}

export function Answer(props: AnswerProps): JSX.Element {
  const { message, className, linkAs } = props;

  return (
    <div
      className={clsx('MarkpromptAnswer', className)}
      aria-busy={
        message.state === 'preload' || message.state === 'streaming-answer'
      }
      aria-live="polite"
    >
      {Array.isArray(message.content) ? (
        message.content.map((part, index) => (
          <BaseMarkprompt.Answer
            key={`${message.id}-${part.type}-${index}`}
            content={part.type === 'text' ? part.text : part.refusal}
            state={message.state}
            copyButtonClassName="MarkpromptGhostThumbButton"
            linkAs={linkAs}
          />
        ))
      ) : (
        <BaseMarkprompt.Answer
          content={message.content ?? ''}
          state={message.state}
          copyButtonClassName="MarkpromptGhostThumbButton"
          linkAs={linkAs}
        />
      )}
    </div>
  );
}
