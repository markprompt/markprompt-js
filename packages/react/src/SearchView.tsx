import React, {
  useEffect,
  type ReactElement,
  useCallback,
  type KeyboardEventHandler,
  type SetStateAction,
  type Dispatch,
  useMemo,
} from 'react';

import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import { useMarkpromptContext } from './context.js';
import { MarkpromptForm } from './MarkpromptForm.js';
import * as BaseMarkprompt from './primitives/headless.js';
import { SearchResult } from './SearchResult.js';
import { type MarkpromptOptions } from './types.js';

interface SearchViewProps {
  search?: MarkpromptOptions['search'];
  close?: MarkpromptOptions['close'];
  handleViewChange?: () => void;
  onDidSelectResult?: () => void;
}

export function SearchView(props: SearchViewProps): ReactElement {
  const { search, close, handleViewChange, onDidSelectResult } = props;

  const [activeSearchResult, setActiveSearchResult] = React.useState<
    string | undefined
  >();

  const { searchResults, searchQuery } = useMarkpromptContext();

  useEffect(() => {
    // if the search query changes, unset the active search result
    setActiveSearchResult(undefined);
  }, [searchQuery]);

  useEffect(() => {
    // if the search results change, set the active search result to the first result
    if (searchResults.length === 0) return;
    setActiveSearchResult('markprompt-result-0');
  }, [searchResults]);

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => {
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
          if (activeSearchResult.endsWith('-0')) return;
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
    [activeSearchResult, searchResults.length],
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
        icon="search"
        close={close}
      />

      <SearchResultsContainer
        activeSearchResult={activeSearchResult}
        getHref={search?.getHref}
        handleViewChange={handleViewChange}
        onDidSelectResult={onDidSelectResult}
        setActiveSearchResult={setActiveSearchResult}
      />
    </div>
  );
}

interface SearchResultsContainerProps {
  activeSearchResult?: string;
  setActiveSearchResult: Dispatch<SetStateAction<string | undefined>>;
  handleViewChange?: () => void;
  onDidSelectResult?: () => void;
  getHref?: NonNullable<MarkpromptOptions['search']>['getHref'];
}

function SearchResultsContainer(
  props: SearchResultsContainerProps,
): ReactElement {
  const {
    activeSearchResult,
    getHref,
    handleViewChange,
    setActiveSearchResult,
    onDidSelectResult,
  } = props;

  const { searchQuery, searchResults, state, submitPrompt } =
    useMarkpromptContext();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
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
      {state === 'done' &&
        searchResults.length === 0 &&
        searchQuery.trim().length > 0 && (
          <div className="MarkpromptNoSearchResults">
            <p>
              No results for “<span>{searchQuery}</span>”
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
                onClick={onDidSelectResult}
                aria-selected={id === activeSearchResult}
              />
            );
          }}
        />
      )}
    </div>
  );
}
