import * as BaseMarkprompt from '@markprompt/react';
import React, { useContext } from 'react';

import { Caret } from './Caret.js';

export function Answer() {
  const { state } = useContext(BaseMarkprompt.Context);
  return (
    <div
      className="MarkpromptAnswer"
      aria-describedby="markprompt-progressbar"
      aria-busy={state === 'preload' || state === 'streaming-answer'}
      aria-live="polite"
    >
      <Caret />
      <BaseMarkprompt.Answer />
    </div>
  );
}
