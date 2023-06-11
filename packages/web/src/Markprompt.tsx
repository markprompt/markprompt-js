import * as BaseMarkprompt from '@markprompt/react';
import { useMarkpromptContext } from '@markprompt/react';
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import React, { useEffect, useState, type ReactElement } from 'react';

import { Answer } from './Answer.js';
import {
  ChatIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  CommandIcon,
  CornerDownLeftIcon,
  SearchIcon,
  SparklesIcon,
} from './icons.js';
import { References } from './References.js';
import { SearchResult } from './SearchResult.js';
import { type MarkpromptOptions } from './types.js';

type MarkpromptProps = MarkpromptOptions & {
  projectKey: string;
};

function Markprompt(props: MarkpromptProps): ReactElement {
  const {
    close,
    description,
    projectKey,
    prompt,
    references,
    title,
    trigger,
    search,
    showBranding = true,
    ...options
  } = props;

  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <BaseMarkprompt.Root
      projectKey={projectKey}
      isSearchEnabled={search?.enable}
      isSearchActive={!showAnswer}
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
              shouldSubmitSearchOnInputChange={!showAnswer}
              label={
                <AccessibleIcon.Root
                  label={prompt?.label ?? 'Ask me anything…'}
                >
                  <SearchIcon className="MarkpromptSearchIcon" />
                </AccessibleIcon.Root>
              }
            />
          </BaseMarkprompt.Form>

          {!showAnswer && search?.enable ? (
            <SearchResultsContainer
              getResultHref={search?.getResultHref}
              showAnswer={showAnswer}
              setShowAnswer={setShowAnswer}
            />
          ) : (
            <AnswerContainer
              isSearchEnabled={search?.enable}
              references={references}
              setShowAnswer={setShowAnswer}
            />
          )}

          <BaseMarkprompt.Close className="MarkpromptClose">
            <AccessibleIcon.Root label={close?.label ?? 'Close Markprompt'}>
              <kbd>Esc</kbd>
            </AccessibleIcon.Root>
          </BaseMarkprompt.Close>
        </BaseMarkprompt.Content>
      </BaseMarkprompt.Portal>
    </BaseMarkprompt.Root>
  );
}

type SearchResultsContainerProps = {
  getResultHref?: (result: BaseMarkprompt.FlattenedSearchResult) => string;
  showAnswer: boolean;
  setShowAnswer: (show: boolean) => void;
};

function SearchResultsContainer(
  props: SearchResultsContainerProps,
): ReactElement {
  const { showAnswer, setShowAnswer, getResultHref } = props;

  const { abort, submitPrompt, state, searchResults, prompt } =
    useMarkpromptContext();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (
        (event.key === 'Enter' && event.ctrlKey) ||
        (event.key === 'Enter' && event.metaKey)
      ) {
        event.preventDefault();
        if (!showAnswer) {
          submitPrompt();
        }
        setShowAnswer(!showAnswer);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowAnswer, showAnswer, submitPrompt]);

  return (
    <div className="MarkpromptSearchResultsContainer">
      <button
        className="MarkpromptSearchAnswerButton"
        onClick={() => {
          abort();
          setShowAnswer(true);
          submitPrompt();
        }}
      >
        <span aria-hidden className="MarkpromptSearchResultIconWrapper">
          <SparklesIcon focusable={false} className="MarkpromptSearchIcon" />
        </span>
        <span>Ask Docs AI… </span>
        <kbd>
          {navigator.platform.indexOf('Mac') === 0 ||
          navigator.platform === 'iPhone' ? (
            <CommandIcon className="MarkpromptKeyboardKey" />
          ) : (
            <ChevronUpIcon className="MarkpromptKeyboardKey" />
          )}
          <CornerDownLeftIcon className="MarkpromptKeyboardKey" />
        </kbd>
      </button>
      {state === 'done' && searchResults.length === 0 && (
        <div className="MarkpromptNoSearchResults">
          <p>
            No results for “<span>{prompt}</span>”
          </p>
        </div>
      )}

      {searchResults.length > 0 && (
        <BaseMarkprompt.SearchResults
          className={'MarkpromptSearchResults'}
          SearchResultComponent={(props) => (
            <SearchResult {...props} getHref={getResultHref} />
          )}
        />
      )}
    </div>
  );
}

type AnswerContainerProps = {
  isSearchEnabled?: boolean;
  references: MarkpromptOptions['references'];
  setShowAnswer: (show: boolean) => void;
};

function AnswerContainer({
  isSearchEnabled,
  references,
  setShowAnswer,
}: AnswerContainerProps): ReactElement {
  const { abort } = useMarkpromptContext();

  return (
    <div className="MarkpromptPromptContainer">
      {isSearchEnabled && (
        <button
          className="MarkpromptBackButton"
          onClick={() => {
            abort();
            setShowAnswer?.(false);
          }}
        >
          <span aria-hidden>
            <ChevronLeftIcon className="MarkpromptHighlightedIcon" />
          </span>
          <span>Back to search</span>
        </button>
      )}

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
