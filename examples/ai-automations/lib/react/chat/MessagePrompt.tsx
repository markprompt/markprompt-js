/* eslint-disable @next/next/no-img-element */
import React, { type ReactElement } from 'react';

import { type ChatViewMessage } from './store';
import type { MarkpromptOptions } from '../types';

interface MessagePromptProps {
  children: string;
  state: ChatViewMessage['state'];
  referencesOptions?: MarkpromptOptions['references'];
}

export function MessagePrompt(props: MessagePromptProps): ReactElement {
  const { children, referencesOptions, state } = props;
  return (
    <div className="MarkpromptMessagePrompt items-start">
      <img
        className="w-7 h-7 rounded-full"
        src="/avatar.png"
        alt="Alexa Kendricks"
      />
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
