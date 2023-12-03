import React, { type ReactElement, useCallback } from 'react';

import type { ChatViewMessage } from './store';
import { ReloadIcon, StopIcon } from '../icons';

interface RegenerateButtonProps {
  abortSubmitChat?: () => void;
  lastMessageState: ChatViewMessage['state'];
  regenerateLastAnswer: () => void;
}

export function RegenerateButton(props: RegenerateButtonProps): ReactElement {
  const { abortSubmitChat, lastMessageState, regenerateLastAnswer } = props;

  const handleClick = useCallback(() => {
    if (lastMessageState === 'done' || lastMessageState === 'cancelled') {
      regenerateLastAnswer();
    } else {
      abortSubmitChat?.();
    }
  }, [lastMessageState, regenerateLastAnswer, abortSubmitChat]);

  return (
    <button
      className="MarkpromptRegenerateButton"
      type="button"
      onClick={handleClick}
    >
      {(lastMessageState === 'done' || lastMessageState === 'cancelled') && (
        <>
          <ReloadIcon className="MarkpromptSearchIcon" /> Regenerate
        </>
      )}

      {(lastMessageState === 'preload' ||
        lastMessageState === 'streaming-answer') && (
        <>
          <StopIcon className="MarkpromptSearchIcon" /> Stop generating
        </>
      )}
    </button>
  );
}
