import type { ComponentType, JSX } from 'react';

import { Answer } from './Answer.js';
import type { ChatViewAssistantMessage } from '../types.js';

function LoadingDots(): JSX.Element {
  return (
    <div className="MarkpromptLoadingDots">
      <span />
      <span />
      <span />
    </div>
  );
}

interface MessageAnswerProps {
  message: ChatViewAssistantMessage;
  linkAs?: string | ComponentType<unknown>;
}

export function MessageAnswer(props: MessageAnswerProps): JSX.Element {
  const { message } = props;

  return (
    <div className="MarkpromptMessageAnswer">
      {(message.state === 'indeterminate' || message.state === 'preload') && (
        <div className="MarkpromptLoadingContainer">
          <LoadingDots />
        </div>
      )}

      <Answer message={message} linkAs={props.linkAs} />

      {message.state === 'cancelled' && (
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
