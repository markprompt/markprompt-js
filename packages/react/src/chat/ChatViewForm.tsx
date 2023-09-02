import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import React, {
  type FormEventHandler,
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { RegenerateButton } from './RegenerateButton.js';
import type { ChatViewMessage, UseChatResult } from './useChat.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants.js';
import { SparklesIcon } from '../icons.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import type { MarkpromptOptions } from '../types.js';
import type { View } from '../useViews.js';

interface ChatViewFormProps {
  activeView?: View;
  chatOptions?: MarkpromptOptions['chat'];
  close?: MarkpromptOptions['close'];
  submitChat: UseChatResult['submitChat'];
  lastMessageState?: ChatViewMessage['state'];
  regenerateLastAnswer: () => void;
  abortSubmitChat: () => void;
}

export function ChatViewForm(props: ChatViewFormProps): ReactElement {
  const {
    activeView,
    close,
    chatOptions,
    submitChat,
    lastMessageState,
    regenerateLastAnswer,
    abortSubmitChat,
  } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const value = data.get('markprompt-prompt');

      if (typeof value === 'string') {
        submitChat(value);
      }

      if (event.target instanceof HTMLFormElement) {
        event.target.reset();
      }
    },
    [submitChat],
  );

  useEffect(() => {
    // Bring form input in focus when activeView changes.
    inputRef.current?.focus();
  }, [activeView]);

  return (
    <BaseMarkprompt.Form className="MarkpromptForm" onSubmit={handleSubmit}>
      <BaseMarkprompt.Prompt
        ref={inputRef}
        className="MarkpromptPrompt"
        name="markprompt-prompt"
        type="text"
        autoFocus
        placeholder={
          chatOptions?.placeholder ??
          DEFAULT_MARKPROMPT_OPTIONS.chat!.placeholder!
        }
        labelClassName="MarkpromptPromptLabel"
        label={
          <AccessibleIcon.Root
            label={
              chatOptions?.label ?? DEFAULT_MARKPROMPT_OPTIONS.prompt!.label!
            }
          >
            <SparklesIcon className="MarkpromptSearchIcon" />
          </AccessibleIcon.Root>
        }
      />
      {lastMessageState && lastMessageState !== 'indeterminate' && (
        <RegenerateButton
          lastMessageState={lastMessageState}
          regenerateLastAnswer={regenerateLastAnswer}
          abortSubmitChat={abortSubmitChat}
        />
      )}
      {close && close.visible !== false && (
        <BaseMarkprompt.Close className="MarkpromptClose">
          <AccessibleIcon.Root
            label={close?.label ?? DEFAULT_MARKPROMPT_OPTIONS.close!.label!}
          >
            <kbd>Esc</kbd>
          </AccessibleIcon.Root>
        </BaseMarkprompt.Close>
      )}
    </BaseMarkprompt.Form>
  );
}
