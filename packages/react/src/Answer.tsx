import * as BaseMarkprompt from '@markprompt/react';
import { useMarkpromptContext } from '@markprompt/react';
import React, { type ReactElement } from 'react';

import { Caret } from './Caret.js';

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
