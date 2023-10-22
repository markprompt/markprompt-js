import React, { type ReactElement } from 'react';

import { type ChatViewMessage } from './store.js';
import type { ReferencesOptions } from '../types.js';

interface MessagePromptProps {
  children: string;
  state: ChatViewMessage['state'];
  referencesOptions?: ReferencesOptions;
}

export function MessagePrompt(props: MessagePromptProps): ReactElement {
  const { children, referencesOptions, state } = props;

  return (
    <div className="MarkpromptMessagePrompt">
      <h3 className="MarkpromptMessagePromptText">{children}</h3>
      {(state === 'preload' || state === 'streaming-answer') && (
        <div
          className="MarkpromptProgress"
          id="markprompt-progressbar"
          role="progressbar"
          aria-labelledby="markprompt-loading-text"
          data-loading-state={state}
        >
          <p id="markprompt-loading-text">{referencesOptions?.loadingText}</p>
        </div>
      )}
    </div>
  );
}
