import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  type FormEventHandler,
  type ReactElement,
  useState,
  useMemo,
} from 'react';

import { ConversationSelect } from './ConversationSelect.js';
import { ChatContext, useChatStore } from './store.js';
import { LoadingIcon, SendIcon, StopInsideLoadingIcon } from '../icons.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import type { MarkpromptOptions, View } from '../types.js';

interface ChatViewFormProps {
  activeView?: View;
  chatOptions: NonNullable<MarkpromptOptions['chat']>;
  minInputRows?: number;
}

interface ChatSendIconProps {
  isLoading: boolean;
}

function ChatSendIcon(props: ChatSendIconProps): JSX.Element {
  if (props.isLoading) {
    return (
      <div>
        <LoadingIcon />
        <div style={{ position: 'absolute', inset: 0 }}>
          <StopInsideLoadingIcon />
        </div>
      </div>
    );
  }
  return <SendIcon />;
}

export function ChatViewForm(props: ChatViewFormProps): ReactElement {
  const { activeView, chatOptions, minInputRows } = props;

  const [prompt, setPrompt] = useState('');

  const submitChat = useChatStore((state) => state.submitChat);
  const lastMessageState = useChatStore(
    (state) => state.messages[state.messages.length - 1]?.state,
  );
  // const regenerateLastAnswer = useChatStore(
  //   (state) => state.regenerateLastAnswer,
  // );
  // const conversations = useChatStore(selectProjectConversations);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault();
      inputRef.current?.blur();
      const data = new FormData(event.currentTarget);
      const value = data.get('markprompt-prompt');

      if (typeof value === 'string') {
        submitChat([{ role: 'user', content: value }]);
      }

      if (event.target instanceof HTMLFormElement) {
        setPrompt('');
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
  const abortChat = useRef(() => store?.getState().abort?.());

  useEffect(
    () =>
      store?.subscribe((state) => {
        abortChat.current = () => state.abort?.();
      }),
    [store],
  );

  useEffect(() => {
    // cancel pending chat requests when the view changes.
    if (activeView && activeView !== 'chat') {
      abortChat.current?.();
    }

    // Cancel pending chat request when the component unmounts.
    return () => abortChat.current?.();
  }, [activeView]);

  const isLoading = useMemo(() => {
    return (
      lastMessageState === 'streaming-answer' ||
      lastMessageState === 'indeterminate' ||
      lastMessageState === 'preload'
    );
  }, [lastMessageState]);

  const didAcceptDisclaimer = useChatStore(
    (state) => state.didAcceptDisclaimer,
  );

  return (
    <BaseMarkprompt.Form
      className="MarkpromptForm"
      onSubmit={handleSubmit}
      data-state={!didAcceptDisclaimer ? 'disabled' : undefined}
    >
      <div className="MarkpromptPromptWrapper">
        <BaseMarkprompt.Prompt
          ref={inputRef}
          className="MarkpromptPrompt"
          name="markprompt-prompt"
          type="text"
          autoFocus
          placeholder={chatOptions?.placeholder}
          labelClassName="MarkpromptPromptLabel"
          sendButtonClassName="MarkpromptPromptSubmitButton"
          buttonLabel={isLoading ? 'Stop generating' : chatOptions?.buttonLabel}
          value={prompt}
          isLoading={isLoading}
          onChange={(event) => setPrompt(event.target.value)}
          Icon={<ChatSendIcon isLoading={isLoading} />}
          disabled={!didAcceptDisclaimer}
          minRows={minInputRows}
        />
        {chatOptions.history && (
          <ConversationSelect disabled={!didAcceptDisclaimer} />
        )}
        <div />
      </div>
    </BaseMarkprompt.Form>
  );
}
