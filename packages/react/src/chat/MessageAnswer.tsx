import type { ComponentType, ReactElement } from 'react';

import { Answer } from './Answer.js';
import type { ChatViewMessage } from './store.js';

interface MessageAnswerProps {
  children: string;
  state: ChatViewMessage['state'];
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

export function MessageAnswer(props: MessageAnswerProps): ReactElement {
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
