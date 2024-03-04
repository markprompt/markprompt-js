/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SubmitSearchQueryOptions } from '@markprompt/core';
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import {
  useCallback,
  useEffect,
  useRef,
  type ChangeEventHandler,
  type Dispatch,
  type FormEventHandler,
  type KeyboardEventHandler,
  type ReactElement,
  type SetStateAction,
  useState,
  useMemo,
  type ComponentType,
} from 'react';

import { SearchResult } from './SearchResult.js';
import { useSearch, type SearchLoadingState } from './useSearch.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants.js';
import { ChevronRightIcon, SearchIcon, SparklesIcon } from '../icons.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import {
  type MarkpromptOptions,
  type SearchOptions,
  type SearchResultComponentProps,
  type View,
} from '../types.js';
import { useDefaults } from '../useDefaults.js';

export interface SearchViewProps {
  /**
   * The project key associated to the project.
   */
  projectKey: string;
  /**
   * The active view.
   */
  activeView?: View;
  /**
   * Callback when a search result is selected.
   */
  onDidSelectResult?: () => void;
  /**
   * Callback when chat is selected.
   */
  onDidSelectAsk?: (query?: string) => void;
  /**
   * Multi-pane layout when both search and chat are enabled.
   * @default "panels"
   **/
  layout?: MarkpromptOptions['layout'];
  /**
   * Options for the search component.
   */
  searchOptions?: SubmitSearchQueryOptions & SearchOptions;
  /**
   * Component to use in place of <a>.
   * @default "a"
   */
  linkAs?: string | ComponentType<any>;
  /**
   * Display debug info.
   * @default false
   **/
  debug?: boolean;
}

interface ActiveSearchResult {
  id: string | undefined;
  trigger?: 'mouse' | 'keyboard';
}

const searchInputName = 'markprompt-search';

export function SearchView(props: SearchViewProps): ReactElement {
  const { activeView, debug, onDidSelectResult, onDidSelectAsk, projectKey } =
    props;

  if (!projectKey) {
    throw new Error(
      `Markprompt: a project key is required. Make sure to pass your Markprompt project key to <SearchView />.`,
    );
  }

  // We are also merging defaults in the Markprompt component, but this makes
  // sure that standalone SearchView components also have defaults as expected.
  const searchOptions = useDefaults(
    { ...props.searchOptions },
    DEFAULT_MARKPROMPT_OPTIONS.search,
  );

  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    abort,
    searchResults,
    searchQuery,
    state,
    setSearchQuery,
    submitSearchQuery,
  } = useSearch({
    debug,
    projectKey,
    searchOptions,
  });

  const [activeSearchResult, setActiveSearchResult] =
    useState<ActiveSearchResult>();

  // Show "Ask AI" if the query contains a space between two words
  const isAskVisible =
    props.layout === 'panels' && searchQuery.trim().includes(' ');

  const isActiveSearchResultAsk = useMemo(() => {
    return activeSearchResult?.id === 'ask';
  }, [activeSearchResult?.id]);

  useEffect(() => {
    if (isAskVisible) {
      return;
    }
    // If the search query changes, unset the active search result.
    // This should only be done when "Ask AI" is not enabled.
    if (!isActiveSearchResultAsk) {
      setActiveSearchResult(undefined);
    }
  }, [searchQuery, isAskVisible, isActiveSearchResultAsk]);

  useEffect(() => {
    // If the search results change, set the active search result to the
    // first result
    if (isAskVisible) {
      setActiveSearchResult({ id: 'ask' });
    } else if (searchResults.length > 0) {
      setActiveSearchResult({ id: 'markprompt-result-0' });
    }
  }, [searchResults, isAskVisible]);

  useEffect(() => {
    // Bring form input in focus when activeView changes.
    inputRef.current?.focus();
  }, [activeView]);

  useEffect(() => {
    // Abort search requests when the view changes to something
    // that's not search and on unmounting the component
    if (activeView && activeView !== 'search') abort();
    return () => abort();
  }, [abort, activeView]);

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      switch (event.key) {
        case 'ArrowDown': {
          if (!activeSearchResult) return;

          const defaultSearches = searchOptions?.defaultView?.searches || [];
          const numAllDisplayedResults =
            searchResults.length + defaultSearches.length;

          if (
            activeSearchResult.id !== 'ask' &&
            activeSearchResult.id?.endsWith(`${numAllDisplayedResults - 1}`)
          ) {
            // We're at the end of the list
            return;
          }

          event.preventDefault();
          let nextActiveSearchResultId: string | undefined;
          if (activeSearchResult.id === 'ask') {
            nextActiveSearchResultId = 'markprompt-result-0';
          } else {
            nextActiveSearchResultId = activeSearchResult.id?.replace(
              /\d+$/,
              (match) => String(Number(match) + 1),
            );
          }

          setActiveSearchResult({
            id: nextActiveSearchResultId,
            trigger: 'keyboard',
          });

          const el: HTMLAnchorElement | null = document.querySelector(
            `#${nextActiveSearchResultId} > a`,
          );
          if (!el) return;
          break;
        }
        case 'ArrowUp': {
          if (!activeSearchResult) return;
          if (activeSearchResult.id?.endsWith('-0')) {
            if (isAskVisible) {
              event.preventDefault();
              setActiveSearchResult({
                id: 'ask',
                trigger: 'keyboard',
              });
            }
            return;
          }

          event.preventDefault();
          const previousActiveSearchResult = activeSearchResult.id?.replace(
            /\d+$/,
            (match) => String(Number(match) - 1),
          );
          setActiveSearchResult({
            id: previousActiveSearchResult,
            trigger: 'keyboard',
          });
          const el: HTMLAnchorElement | null = document.querySelector(
            `#${previousActiveSearchResult} > a`,
          );
          if (!el) return;
          break;
        }
        case 'Enter': {
          if (event.ctrlKey || event.metaKey) return;
          if (!activeSearchResult && !isAskVisible) return;
          event.preventDefault();
          if (!activeSearchResult || activeSearchResult.id === 'ask') {
            const el: HTMLAnchorElement | null = document.querySelector('#ask');
            el?.click();
            return;
          }
          if (!activeSearchResult) {
            return;
          }
          // Assumption here is that the search result will always contain
          // an a element
          const el: HTMLAnchorElement | null = document.querySelector(
            `#${activeSearchResult.id} a`,
          );
          // TODO: reset search query and result
          if (!el) return;
          el.click();
          break;
        }
      }
    },
    [
      activeSearchResult,
      searchResults.length,
      searchOptions?.defaultView?.searches,
      isAskVisible,
    ],
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setSearchQuery(event.target.value);
      submitSearchQuery(event.target.value);
    },
    [setSearchQuery, submitSearchQuery],
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault();
      await submitSearchQuery(searchQuery);
    },
    [searchQuery, submitSearchQuery],
  );

  return (
    <div className="MarkpromptSearchView">
      <BaseMarkprompt.Form className="MarkpromptForm" onSubmit={handleSubmit}>
        <div className="MarkpromptPromptWrapper">
          <BaseMarkprompt.Prompt
            ref={inputRef}
            className="MarkpromptPrompt"
            name={searchInputName}
            placeholder={searchOptions?.placeholder}
            labelClassName="MarkpromptPromptLabel"
            value={searchQuery}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            showSubmitButton={false}
            aria-controls="markprompt-search-results"
            aria-activedescendant={activeSearchResult?.id}
            label={
              <AccessibleIcon.Root label={searchOptions?.label}>
                <SearchIcon className="MarkpromptSearchIconAccented" />
              </AccessibleIcon.Root>
            }
          />

          <button
            className={
              searchOptions.askLabel
                ? 'MarkpromptBorderedButton'
                : 'MarkpromptGhostButton'
            }
            type="button"
            style={{ flexGrow: 'none', marginRight: '0.25rem' }}
            onClick={() => onDidSelectAsk?.()}
          >
            <SparklesIcon
              style={
                searchOptions.askLabel
                  ? { width: 16, height: 16, opacity: 0.4 }
                  : { width: 18, height: 18 }
              }
            />
            {searchOptions.askLabel && <span>{searchOptions.askLabel}</span>}
          </button>
        </div>
      </BaseMarkprompt.Form>
      <SearchResultsContainer
        activeSearchResult={activeSearchResult}
        onDidSelectResult={onDidSelectResult}
        onDidSelectAsk={() => onDidSelectAsk?.(searchQuery)}
        searchQuery={searchQuery}
        searchResults={searchResults}
        searchOptions={searchOptions}
        linkAs={props.linkAs}
        setActiveSearchResult={setActiveSearchResult}
        state={state}
        isAskVisible={isAskVisible}
      />
    </div>
  );
}

interface SearchResultsContainerProps {
  searchQuery: string;
  searchResults: SearchResultComponentProps[];
  state: SearchLoadingState;
  activeSearchResult?: ActiveSearchResult;
  setActiveSearchResult: Dispatch<
    SetStateAction<ActiveSearchResult | undefined>
  >;
  onDidSelectResult?: () => void;
  onDidSelectAsk?: () => void;
  searchOptions: MarkpromptOptions['search'];
  linkAs: MarkpromptOptions['linkAs'];
  isAskVisible: boolean;
}

function SearchResultsContainer(
  props: SearchResultsContainerProps,
): ReactElement {
  const {
    searchQuery,
    searchResults,
    state,
    activeSearchResult,
    setActiveSearchResult,
    onDidSelectResult,
    onDidSelectAsk,
    searchOptions,
    linkAs,
    isAskVisible,
  } = props;
  const onMouseMovedOverSearchResult = useRef<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'ArrowDown' && activeSearchResult === undefined) {
        if (
          searchResults.length > 0 ||
          (searchOptions?.defaultView?.searches || []).length > 0
        ) {
          setActiveSearchResult({
            id: 'markprompt-result-0',
            trigger: 'keyboard',
          });
          const el = document.querySelector(`#${searchInputName}`);
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
    setActiveSearchResult,
    searchOptions?.defaultView?.searches,
  ]);

  useEffect(() => {
    // Do not scroll into view unless using keyboard navigation.
    // While using the mouse, we don't want movable hit targets.
    if (!activeSearchResult?.id || activeSearchResult.trigger !== 'keyboard') {
      return;
    }

    const element = document.getElementById(activeSearchResult.id);

    element?.focus();
    element?.scrollIntoView({ block: 'nearest' });
  }, [activeSearchResult, searchResults]);

  return (
    <div className="MarkpromptSearchResultsContainer">
      {isAskVisible && (
        <div
          className="MarkpromptSearchResult"
          aria-selected={
            !activeSearchResult?.id || activeSearchResult.id === 'ask'
          }
          id="ask"
          style={{ cursor: 'pointer' }}
          onMouseMove={() => {
            // We use a mouse move event, instead of mouse over or
            // mouse enter. Indeed, onMouseOver and onMouseEnter will
            // trigger at each rerender. This is a problem when scrolling
            // the list using the keyboard: it will automatically reselect
            // the result that the mouse is over.
            if (onMouseMovedOverSearchResult?.current === 'ask') {
              return;
            }
            onMouseMovedOverSearchResult.current = 'ask';
            setActiveSearchResult({ id: 'ask', trigger: 'mouse' });
            return true;
          }}
          onClick={onDidSelectAsk}
        >
          <div className="MarkpromptSearchResultLink">
            <div className="MarkpromptSearchResultContainer">
              <div className="MarkpromptSearchResultIconWrapper MarkpromptSearchResultIconWrapperBordered">
                <SparklesIcon className="MarkpromptSearchResultIcon" />
              </div>
              <div className="MarkpromptSearchResultContentWrapper">
                <div className="MarkpromptSearchResultTitle">
                  <span className="MarkpromptSearchResultTitleAccent">
                    {searchOptions?.askLabel ?? 'Ask AI'}:
                  </span>{' '}
                  {searchQuery}
                </div>
              </div>
              <ChevronRightIcon className="MarkpromptSearchResultIcon" />
            </div>
          </div>
        </div>
      )}

      {state === 'done' &&
        searchResults.length === 0 &&
        searchQuery.trim().length > 0 && (
          <div className="MarkpromptNoSearchResults">
            <p>
              No matches found for <span>“{searchQuery}”</span>
            </p>
          </div>
        )}

      <BaseMarkprompt.SearchResults
        searchResults={searchResults}
        searchOptions={searchOptions}
        className="MarkpromptSearchResults"
        headingClassName="MarkpromptSearchResultSectionHeading"
        SearchResultComponent={({ index, ...rest }) => {
          const id = `markprompt-result-${index}`;
          return (
            <SearchResult
              {...rest}
              id={id}
              searchQuery={searchQuery}
              onMouseMove={() => {
                // We use a mouse move event, instead of mouse over or
                // mouse enter. Indeed, onMouseOver and onMouseEnter will
                // trigger at each rerender. This is a problem when scrolling
                // the list using the keyboard: it will automatically reselect
                // the result that the mouse is over.
                if (onMouseMovedOverSearchResult?.current === id) {
                  return true;
                }
                onMouseMovedOverSearchResult.current = id;
                setActiveSearchResult({ id, trigger: 'mouse' });
                return true;
              }}
              onClick={() => {
                onDidSelectResult?.();
              }}
              aria-selected={id === activeSearchResult?.id}
              linkAs={linkAs}
            />
          );
        }}
      />
    </div>
  );
}
