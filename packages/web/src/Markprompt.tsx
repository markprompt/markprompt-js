import * as BaseMarkprompt from '@markprompt/react';
import { useMarkpromptContext } from '@markprompt/react';
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import React, { useEffect, useState } from 'react';

import { Answer } from './Answer.js';
import { ChatIcon, CloseIcon, SearchIcon } from './icons.js';
import { References } from './References.js';
import { type MarkpromptOptions } from './types.js';

type MarkpromptProps = MarkpromptOptions & {
  projectKey: string;
};

function Markprompt(props: MarkpromptProps) {
  const {
    close,
    description,
    projectKey,
    prompt,
    references,
    title,
    trigger,
    showBranding = true,
    ...options
  } = props;

  const { enableSearch } = options;

  return (
    <BaseMarkprompt.Root
      open
      projectKey={projectKey}
      enableSearch={enableSearch}
      {...options}
    >
      <BaseMarkprompt.DialogTrigger className="MarkpromptTrigger">
        <AccessibleIcon.Root label={trigger?.label ?? 'Open Markprompt'}>
          <ChatIcon className="MarkpromptChatIcon" width="24" height="24" />
        </AccessibleIcon.Root>
      </BaseMarkprompt.DialogTrigger>

      <BaseMarkprompt.Portal>
        <BaseMarkprompt.Overlay className="MarkpromptOverlay" />
        <BaseMarkprompt.Content
          className="MarkpromptContent"
          showBranding={showBranding}
        >
          <BaseMarkprompt.Title hide={title?.hide ?? true}>
            {title?.text ?? 'Ask me anything'}
          </BaseMarkprompt.Title>

          {description?.text && (
            <BaseMarkprompt.Description hide={description?.hide ?? true}>
              {description?.text}
            </BaseMarkprompt.Description>
          )}

          <BaseMarkprompt.Form className="MarkpromptForm">
            <BaseMarkprompt.Prompt
              className="MarkpromptPrompt"
              placeholder={prompt?.placeholder ?? 'Search or ask a question…'}
              labelClassName="MarkpromptPromptLabel"
              label={
                <AccessibleIcon.Root label={prompt?.label ?? 'Your prompt'}>
                  <SearchIcon className="MarkpromptSearchIcon" />
                </AccessibleIcon.Root>
              }
            />
          </BaseMarkprompt.Form>

          <SearchResultsOrAnswer
            enableSearch={enableSearch}
            references={references}
          />

          <BaseMarkprompt.Close className="MarkpromptClose">
            <AccessibleIcon.Root label={close?.label ?? 'Close Markprompt'}>
              <CloseIcon />
            </AccessibleIcon.Root>
          </BaseMarkprompt.Close>
        </BaseMarkprompt.Content>
      </BaseMarkprompt.Portal>
    </BaseMarkprompt.Root>
  );
}

type SearchResultsOrAnswerProps = {
  enableSearch?: boolean;
  references?: MarkpromptOptions['references'];
};

function SearchResultsOrAnswer(props: SearchResultsOrAnswerProps) {
  const { enableSearch, references } = props;

  const [showAnswer, setShowAnswer] = useState(false);

  const { submitPrompt } = useMarkpromptContext();

  let metaKey = '^'; // control key
  if (
    navigator.platform.indexOf('Mac') === 0 ||
    navigator.platform === 'iPhone'
  ) {
    metaKey = '⌘'; // command key
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.key === 'j' && event.ctrlKey) ||
        (event.key === 'j' && event.metaKey)
      ) {
        event.preventDefault();
        if (!showAnswer) submitPrompt();
        setShowAnswer(!showAnswer);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showAnswer, submitPrompt]);

  if (!showAnswer && enableSearch) {
    return (
      <div>
        <button
          className="MarkpromptSearchAnswerButton"
          onClick={() => {
            setShowAnswer(true);
            submitPrompt();
          }}
        >
          <span aria-hidden>✨</span> Ask Docs AI…{' '}
          <kbd>
            <span className={'MarkpromptMetaKey'}>{metaKey}</span>
            <span>J</span>
          </kbd>
        </button>
        <BaseMarkprompt.SearchResults className={'MarkpromptSearchResults'} />
      </div>
    );
  }

  return (
    <div>
      <button
        className="MarkpromptSearchAnswerButton"
        onClick={() => setShowAnswer(false)}
      >
        <span aria-hidden>⬅️</span> Back to search…{' '}
        <kbd>
          <span className={'MarkpromptMetaKey'}>{metaKey}</span>
          <span>J</span>
        </kbd>
      </button>

      <BaseMarkprompt.AutoScroller className="MarkpromptAutoScroller">
        <Answer />
      </BaseMarkprompt.AutoScroller>

      <References
        loadingText={references?.loadingText}
        referencesText={references?.referencesText}
        transformReferenceId={references?.transformReferenceId}
      />
    </div>
  );
}

export { Markprompt };
