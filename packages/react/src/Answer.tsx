import React, { type ReactElement } from 'react';

import { Caret } from './Caret.js';
import * as BaseMarkprompt from './index.js';
import { useMarkpromptContext } from './index.js';

export function Answer(): ReactElement {
  const { state } = useMarkpromptContext();
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
