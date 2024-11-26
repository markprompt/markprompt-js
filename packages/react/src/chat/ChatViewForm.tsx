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

import { ChatContext, useChatStore } from './store.js';
import { ThreadSelect } from './ThreadSelect.js';
import { LoadingIcon, SendIcon } from '../icons.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import type { MarkpromptOptions, View } from '../types.js';

interface ChatViewFormProps {
  activeView?: View;
  chatOptions: NonNullable<MarkpromptOptions['chat']>;
  minInputRows?: number;
  submitOnEnter?: boolean;
}

interface ChatSendIconProps {
  isLoading: boolean;
}

function ChatSendIcon(props: ChatSendIconProps): JSX.Element {
  if (props.isLoading) {
    return (
      <div>
        <LoadingIcon role="img" aria-label="generating answer" />
        {/* <div style={{ position: 'absolute', inset: 0 }}>
          <StopInsideLoadingIcon />
        </div> */}
      </div>
    );
  }
  return <SendIcon role="img" aria-label="send" />;
}

export function ChatViewForm(props: ChatViewFormProps): ReactElement {
  const { activeView, chatOptions, minInputRows, submitOnEnter } = props;

  const [prompt, setPrompt] = useState('');

  const submitChat = useChatStore((state) => state.submitChat);
  const lastMessageState = useChatStore(
    (state) => state.messages[state.messages.length - 1]?.state,
  );

  const formRef = useRef<HTMLFormElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault();
      textAreaRef.current?.blur();
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run the effect when activeView changes
  useEffect(() => {
    // Bring form input in focus when activeView changes.
    textAreaRef.current?.focus();
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
      ref={formRef}
      className="MarkpromptForm"
      onSubmit={handleSubmit}
      data-state={!didAcceptDisclaimer ? 'disabled' : undefined}
    >
      <div className="MarkpromptPromptWrapper">
        <BaseMarkprompt.Prompt
          ref={textAreaRef}
          className="MarkpromptPrompt"
          name="markprompt-prompt"
          type="text"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          placeholder={chatOptions?.placeholder}
          labelClassName="MarkpromptPromptLabel"
          textAreaContainerClassName="MarkpromptTextAreaContainer"
          sendButtonClassName="MarkpromptButton"
          buttonLabel={isLoading ? 'Generating...' : chatOptions?.buttonLabel}
          value={prompt}
          isLoading={isLoading}
          onChange={(event) => setPrompt(event.target.value)}
          Icon={<ChatSendIcon isLoading={isLoading} />}
          disabled={!didAcceptDisclaimer}
          minRows={minInputRows}
          submitOnEnter={submitOnEnter}
          onSubmit={(e) => {
            e.preventDefault();
            formRef.current?.requestSubmit();
          }}
        />
        {chatOptions.history && (
          <ThreadSelect disabled={!didAcceptDisclaimer} />
        )}
        <div />
      </div>
    </BaseMarkprompt.Form>
  );
}
