import {
  submitAlgoliaDocsearchQuery,
  submitSearchQuery as submitSearchQueryToMarkprompt,
  type AlgoliaDocSearchHit,
  type AlgoliaDocSearchResultsResponse,
  type SearchResult,
  type SearchResultsResponse,
  isAbortError,
} from '@markprompt/core';
import debounce from 'p-debounce';
import { useCallback, useState } from 'react';

import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import type { MarkpromptOptions, SearchResultComponentProps } from './types.js';
import { useAbortController } from './useAbortController.js';

export type SearchLoadingState = 'indeterminate' | 'preload' | 'done';

export interface UseSearchOptions {
  projectKey: string;
  options?: MarkpromptOptions['search'];
  debug?: boolean;
}

export interface UseSearchResult {
  state: SearchLoadingState;
  searchResults: SearchResultComponentProps[];
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  submitSearchQuery: (searchQuery: string) => void;
  abort: () => void;
}

export function useSearch({
  projectKey,
  options,
  debug,
}: UseSearchOptions): UseSearchResult {
  const [state, setState] = useState<SearchLoadingState>('indeterminate');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<
    SearchResultComponentProps[]
  >([]);

  const { ref: controllerRef, abort } = useAbortController();

  const submitSearchQuery = useCallback(
    (searchQuery: string) => {
      if (!options?.enabled) return;

      abort();

      // reset state if the query was set (back) to empty
      if (searchQuery === '') {
        if (controllerRef.current) controllerRef.current.abort();
        setSearchResults([]);
        setState('indeterminate');
        return;
      }

      setState('preload');

      const controller = new AbortController();
      controllerRef.current = controller;

      let promise: Promise<SearchResult[] | AlgoliaDocSearchHit[] | undefined>;

      if (options.provider?.name === 'algolia') {
        promise = (
          submitAlgoliaDocsearchQuery(searchQuery, {
            ...options,
            signal: controller.signal,
          }) as Promise<AlgoliaDocSearchResultsResponse>
        ).then((result) => result?.hits || []) as Promise<
          AlgoliaDocSearchHit[]
        >;
      } else {
        promise = (
          submitSearchQueryToMarkprompt(searchQuery, projectKey, {
            ...options,
            signal: controller.signal,
          }) as Promise<SearchResultsResponse>
        ).then((result) => {
          if (debug) {
            // Show debug info return from Markprompt search API
            // eslint-disable-next-line no-console
            console.debug(JSON.stringify(result?.debug, null, 2));
          }
          return result?.data || [];
        });
      }
      promise.then((searchResults) => {
        if (controller.signal.aborted) return;
        if (!searchResults) return;

        setSearchResults(
          searchResultsToSearchComponentProps(
            searchQuery,
            searchResults,
            options,
          ) ?? [],
        );

        // initially focus the first result
        setState('done');
      });

      promise?.catch((error: unknown) => {
        // ignore abort errors
        if (isAbortError(error)) return;

        // todo: surface errors to the user in the UI
        // eslint-disable-next-line no-console
        console.error(error);
      });

      promise?.finally(() => {
        if (controllerRef.current === controller) {
          controllerRef.current = undefined;
        }
      });
    },
    [options, abort, controllerRef, projectKey, debug],
  );

  return {
    state,
    searchResults,
    searchQuery,
    setSearchQuery,
    submitSearchQuery: debounce(submitSearchQuery, 220),
    abort,
  };
}

function searchResultsToSearchComponentProps(
  query: string,
  searchResults: SearchResult[] | AlgoliaDocSearchHit[],
  options: MarkpromptOptions['search'],
): SearchResultComponentProps[] {
  return searchResults.map((result) => {
    return {
      href: (options?.getHref || DEFAULT_MARKPROMPT_OPTIONS.search!.getHref)?.(
        result,
      ),
      heading: (
        options?.getHeading || DEFAULT_MARKPROMPT_OPTIONS.search!.getHeading
      )?.(result, query),
      title:
        (options?.getTitle || DEFAULT_MARKPROMPT_OPTIONS.search!.getTitle)?.(
          result,
          query,
        ) || 'Untitled',
      subtitle: (
        options?.getSubtitle || DEFAULT_MARKPROMPT_OPTIONS.search!.getSubtitle
      )?.(result, query),
    };
  });
}