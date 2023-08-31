import clsx from 'clsx';
import React, { type ReactElement } from 'react';

import { Caret } from './Caret.js';
import * as BaseMarkprompt from './index.js';
import type { ChatLoadingState } from './useChat.js';
import type { PromptLoadingState } from './usePrompt.js';

interface AnswerProps {
  className?: string;
  answer: string;
  state: PromptLoadingState | ChatLoadingState;
}

export function Answer(props: AnswerProps): ReactElement {
  const { answer, className, state } = props;

  return (
    <div
      className={clsx('MarkpromptAnswer', className)}
      aria-describedby="markprompt-progressbar"
      aria-busy={state === 'preload' || state === 'streaming-answer'}
      aria-live="polite"
    >
      <Caret answer={answer} />
      <BaseMarkprompt.Answer answer={answer} />
    </div>
  );
}
