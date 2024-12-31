import type { ComponentType, JSX } from 'react';

import { Answer } from './Answer.js';
import type { ChatLoadingState } from '../types.js';

interface MessageAnswerProps {
  children: string;
  state: ChatLoadingState;
  linkAs?: string | ComponentType<any>;
}

function LoadingDots(): JSX.Element {
  return (
    <div className="MarkpromptLoadingDots">
      <span />
      <span />
      <span />
    </div>
  );
}

export function MessageAnswer(props: MessageAnswerProps): JSX.Element {
  const { children, state } = props;

  return (
    <div className="MarkpromptMessageAnswer">
      {(state === 'indeterminate' || state === 'preload') && (
        <div className="MarkpromptLoadingContainer">
          <LoadingDots />
        </div>
      )}
      <Answer answer={children} state={state} linkAs={props.linkAs} />
      {state === 'cancelled' && (
        <div className="MarkpromptCancelled">
          <div className="MarkpromptCancelledText">
            This chat response was cancelled. Please try regenerating the answer
            or ask another question.
          </div>
        </div>
      )}
    </div>
  );
}
