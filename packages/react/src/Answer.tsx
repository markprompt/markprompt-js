import React, { type ReactElement } from 'react';

import { Caret } from './Caret.js';
import * as BaseMarkprompt from './index.js';
import type { PromptLoadingState } from './usePrompt.js';

interface AnswerProps {
  answer: string;
  state: PromptLoadingState;
}

export function Answer(props: AnswerProps): ReactElement {
  const { answer, state } = props;

  return (
    <div
      className="MarkpromptAnswer"
      aria-describedby="markprompt-progressbar"
      aria-busy={state === 'preload' || state === 'streaming-answer'}
      aria-live="polite"
    >
      <Caret answer={answer} />
      <BaseMarkprompt.Answer answer={answer} />
    </div>
  );
}
