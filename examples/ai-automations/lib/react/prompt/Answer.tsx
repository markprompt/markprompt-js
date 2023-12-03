import { clsx } from 'clsx';
import React, { type ReactElement } from 'react';

import type { PromptLoadingState } from './usePrompt';
import type { ChatLoadingState } from '../chat/store';
import * as BaseMarkprompt from '../primitives/headless';

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
  className?: string;
  answer: string;
  state: PromptLoadingState | ChatLoadingState;
}

export function Answer(props: AnswerProps): ReactElement {
  const { answer, className, state } = props;

  return (
    <div
      className={clsx('MarkpromptAnswer prose', className)}
      aria-describedby="markprompt-progressbar"
      aria-busy={state === 'preload' || state === 'streaming-answer'}
      aria-live="polite"
    >
      <Caret answer={answer} />
      <BaseMarkprompt.Answer answer={answer} />
    </div>
  );
}
