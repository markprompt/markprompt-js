/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx';
import type { ComponentType, ReactElement } from 'react';

import type { ChatLoadingState } from '../chat/store.js';
import * as BaseMarkprompt from '../primitives/headless.js';

interface CaretProps {
  answer: string;
}

export function Caret(props: CaretProps): ReactElement | null {
  const { answer } = props;

  if (answer) {
    return null;
  }

  return <span className="MarkpromptCaret" />;
}

interface AnswerProps {
  /**
   * Custom class name.
   */
  className?: string;
  /**
   * The answer to display, in Markdown format.
   */
  answer: string;
  /**
   * The loading state of the message.
   */
  state: ChatLoadingState;
  /**
   * Component to use in place of <a>.
   * @default "a"
   */
  linkAs?: string | ComponentType<any>;
}

export function Answer(props: AnswerProps): ReactElement {
  const { answer, className, state, linkAs } = props;

  return (
    <div
      className={clsx('MarkpromptAnswer', className)}
      aria-describedby="markprompt-progressbar"
      aria-busy={state === 'preload' || state === 'streaming-answer'}
      aria-live="polite"
    >
      <Caret answer={answer} />
      <BaseMarkprompt.Answer
        answer={answer}
        state={state}
        copyButtonClassName="MarkpromptGhostThumbButton"
        linkAs={linkAs}
      />
    </div>
  );
}
