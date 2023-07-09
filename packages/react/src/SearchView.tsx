import React, {
  useEffect,
  useRef,
  type ReactElement,
  useCallback,
  type KeyboardEventHandler,
  type SetStateAction,
  type Dispatch,
  useMemo,
} from 'react';

import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import { useMarkpromptContext } from './context.js';
import {
  ChevronUpIcon,
  CommandIcon,
  CornerDownLeftIcon,
  SparklesIcon,
} from './icons.js';
import { MarkpromptForm } from './MarkpromptForm.js';
import * as BaseMarkprompt from './primitives/headless.js';
import { SearchResult } from './SearchResult.js';
import { type MarkpromptOptions } from './types.js';

interface SearchViewProps {
  prompt?: MarkpromptOptions['prompt'];
  search?: MarkpromptOptions['search'];
  handleViewChange: () => void;
}

export function SearchView(props: SearchViewProps): ReactElement {
  const { prompt, search, handleViewChange } = props;

  const [activeSearchResult, setActiveSearchResult] = React.useState<
    string | undefined
  >();

  const { activeView, searchResults } = useMarkpromptContext();

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (activeView !== 'search') return;

      switch (event.key) {
        case 'ArrowDown': {
          if (!activeSearchResult) return;
          if (activeSearchResult.endsWith(`${searchResults.length - 1}`)) {
            return;
          }
          event.preventDefault();
          const nextActiveSearchResult = activeSearchResult.replace(
            /\d+$/,
            (match) => String(Number(match) + 1),
          );
          setActiveSearchResult(nextActiveSearchResult);
          const el: HTMLAnchorElement | null = document.querySelector(
            `#${nextActiveSearchResult} > a`,
          );
          if (!el) return;
          break;
        }
        case 'ArrowUp': {
          if (!activeSearchResult) return;
          if (activeSearchResult.endsWith('0')) return;
          event.preventDefault();
          const nextActiveSearchResult = activeSearchResult.replace(
            /\d+$/,
            (match) => String(Number(match) - 1),
          );
          setActiveSearchResult(nextActiveSearchResult);
          const el: HTMLAnchorElement | null = document.querySelector(
            `#${nextActiveSearchResult} > a`,
          );
          if (!el) return;
          break;
        }
        case 'Enter': {
          if (event.ctrlKey || event.metaKey) return;
          if (!activeSearchResult) return;
          event.preventDefault();
          // assumption here is that the search result will always contain an a element
          const el: HTMLAnchorElement | null = document.querySelector(
            `#${activeSearchResult} a`,
          );
          // todo: reset search query and result
          if (!el) return;
          el?.click();
          break;
        }
      }
    },
    [activeSearchResult, activeView, searchResults.length],
  );

  return (
    <div className="MarkpromptSearchView">
      <MarkpromptForm
        label={search?.label ?? DEFAULT_MARKPROMPT_OPTIONS.search!.label!}
        placeholder={
          search?.placeholder ?? DEFAULT_MARKPROMPT_OPTIONS.search!.placeholder!
        }
        inputProps={useMemo(
          () => ({
            onKeyDown: handleKeyDown,
            'aria-controls': 'markprompt-search-results',
            'aria-activedescendant': activeSearchResult,
          }),
          [activeSearchResult, handleKeyDown],
        )}
      />

      <SearchResultsContainer
        activeSearchResult={activeSearchResult}
        getHref={search?.getHref}
        handleViewChange={handleViewChange}
        promptCTA={prompt?.cta}
        setActiveSearchResult={setActiveSearchResult}
      />
    </div>
  );
}

interface SearchResultsContainerProps {
  activeSearchResult?: string;
  setActiveSearchResult: Dispatch<SetStateAction<string | undefined>>;
  handleViewChange: () => void;
  promptCTA?: string;
  getHref?: NonNullable<MarkpromptOptions['search']>['getHref'];
}

function SearchResultsContainer(
  props: SearchResultsContainerProps,
): ReactElement {
  const {
    activeSearchResult,
    getHref,
    handleViewChange,
    promptCTA,
    setActiveSearchResult,
  } = props;

  const btn = useRef<HTMLButtonElement>(null);

  const { abort, submitPrompt, state, searchResults, prompt } =
    useMarkpromptContext();

  useEffect(() => {
    if (!activeSearchResult) return;
    btn.current?.blur();
  }, [activeSearchResult]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (
        (event.key === 'Enter' && event.ctrlKey) ||
        (event.key === 'Enter' && event.metaKey)
      ) {
        event.preventDefault();
        submitPrompt();
        handleViewChange();
      }

      if (event.key === 'ArrowUp') {
        if (activeSearchResult === 'markprompt-result-0') {
          btn.current?.focus();
          setActiveSearchResult(undefined);
        }
      }

      if (event.key === 'ArrowDown') {
        if (searchResults.length > 0 && activeSearchResult === undefined) {
          setActiveSearchResult('markprompt-result-0');
          const el = document.querySelector('#markprompt-prompt');
          if (el instanceof HTMLInputElement) el.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    activeSearchResult,
    searchResults,
    submitPrompt,
    handleViewChange,
    setActiveSearchResult,
  ]);

  useEffect(() => {
    if (!activeSearchResult) {
      return;
    }

    const element = document.getElementById(activeSearchResult);
    if (!element) {
      return;
    }

    element.focus();
    element.scrollIntoView({
      block: 'nearest',
    });
  }, [activeSearchResult, searchResults]);

  return (
    <div className="MarkpromptSearchResultsContainer">
      <button
        ref={btn}
        className="MarkpromptSearchAnswerButton"
        onClick={() => {
          abort();
          handleViewChange();
          submitPrompt();
        }}
        onMouseOver={() => {
          btn.current?.focus();
          setActiveSearchResult(undefined);
        }}
      >
        <span aria-hidden className="MarkpromptSearchResultIconWrapper">
          <SparklesIcon focusable={false} className="MarkpromptSearchIcon" />
        </span>

        <span>{promptCTA || DEFAULT_MARKPROMPT_OPTIONS.prompt!.cta!}</span>

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
          className="MarkpromptSearchResults"
          SearchResultComponent={({ index, ...rest }) => {
            const id = `markprompt-result-${index}`;
            return (
              <SearchResult
                {...rest}
                id={id}
                getHref={getHref}
                onMouseOver={() => setActiveSearchResult(id)}
                aria-selected={id === activeSearchResult}
              />
            );
          }}
        />
      )}
    </div>
  );
}
