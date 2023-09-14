import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  type FormEventHandler,
  type ReactElement,
} from 'react';

import { ConversationSelect } from './ConversationSelect.js';
import { RegenerateButton } from './RegenerateButton.js';
import { ChatContext, useChatStore } from './store.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants.js';
import { SparklesIcon } from '../icons.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import type { MarkpromptOptions } from '../types.js';
import type { View } from '../useViews.js';

interface ChatViewFormProps {
  activeView?: View;
  chatOptions?: MarkpromptOptions['chat'];
  close?: MarkpromptOptions['close'];
}

export function ChatViewForm(props: ChatViewFormProps): ReactElement {
  const { activeView, close, chatOptions } = props;

  const submitChat = useChatStore((state) => state.submitChat);
  const lastMessageState = useChatStore(
    (state) => state.messages[state.messages.length - 1]?.state,
  );
  const regenerateLastAnswer = useChatStore(
    (state) => state.regenerateLastAnswer,
  );

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

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Bring form input in focus when activeView changes.
    inputRef.current?.focus();
  }, [activeView]);

  // keep abortChat up to date, but do not trigger rerenders (and effect hooks calls) when it updates
  const store = useContext(ChatContext);
  const abortChat = useRef(() => store?.getState().abortController?.abort());

  useEffect(
    () =>
      store?.subscribe((state) => {
        abortChat.current = () => state.abortController?.abort();
      }),
    [store],
  );

  useEffect(() => {
    // cancel pending chat requests when the view changes.
    if (activeView && activeView !== 'chat') {
      abortChat.current?.();
    }

    // cancel pending chat request when the component unmounts.
    return () => abortChat.current?.();
  }, [activeView]);

  return (
    <BaseMarkprompt.Form className="MarkpromptForm" onSubmit={handleSubmit}>
      <ConversationSelect />

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
          abortSubmitChat={abortChat.current}
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
