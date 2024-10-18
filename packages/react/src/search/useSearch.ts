import {
  submitAlgoliaDocsearchQuery,
  submitSearchQuery as submitSearchQueryToMarkprompt,
  type SubmitSearchQueryOptions,
  type AlgoliaDocSearchHit,
  type AlgoliaDocSearchResultsResponse,
  type SearchResult,
  type SearchResultsResponse,
} from '@markprompt/core/search';
import { isAbortError } from '@markprompt/core/utils';
import debounce from 'p-debounce';
import { useCallback, useState } from 'react';

import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants.js';
import type {
  MarkpromptOptions,
  SearchResultComponentProps,
} from '../types.js';
import { useAbortController } from '../useAbortController.js';

export type SearchLoadingState = 'indeterminate' | 'preload' | 'done';

export interface UseSearchOptions {
  apiUrl?: string;
  projectKey: string;
  searchOptions?: Omit<SubmitSearchQueryOptions, 'signal'>;
  debug?: boolean;
}

export interface UseSearchResult {
  searchQuery: string;
  searchResults: SearchResultComponentProps[];
  state: SearchLoadingState;
  abort: () => void;
  setSearchQuery: (searchQuery: string) => void;
  submitSearchQuery: (searchQuery: string) => void;
}

export function useSearch({
  apiUrl,
  projectKey,
  debug,
  searchOptions,
}: UseSearchOptions): UseSearchResult {
  const [state, setState] = useState<SearchLoadingState>('indeterminate');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<
    SearchResultComponentProps[]
  >([]);

  const { ref: controllerRef, abort } = useAbortController();

  const submitSearchQuery = useCallback(
    async (searchQuery: string) => {
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

      try {
        let promise: Promise<
          SearchResult[] | AlgoliaDocSearchHit[] | undefined
        >;

        if (searchOptions?.provider?.name === 'algolia') {
          promise = (
            submitAlgoliaDocsearchQuery(searchQuery, {
              ...searchOptions,
              signal: controller.signal,
            }) as Promise<AlgoliaDocSearchResultsResponse>
          ).then((result) => result?.hits || []) as Promise<
            AlgoliaDocSearchHit[]
          >;
        } else {
          promise = (
            submitSearchQueryToMarkprompt(searchQuery, projectKey, {
              apiUrl,
              ...searchOptions,
              signal: controller.signal,
            }) as Promise<SearchResultsResponse>
          ).then((result) => {
            if (debug) {
              // Show debug info return from Markprompt search API
              console.debug(JSON.stringify(result?.debug, null, 2));
            }
            return result?.data || [];
          });
        }

        const searchResults = await promise;

        if (controller.signal.aborted) return;
        if (!searchResults) return;

        setSearchResults(
          searchResultsToSearchComponentProps(
            searchQuery,
            searchResults,
            searchOptions,
          ) ?? [],
        );

        // initially focus the first result
        setState('done');
      } catch (error) {
        // ignore abort errors
        if (isAbortError(error)) return;

        // todo: surface errors to the user in the UI
        console.error(error);
      } finally {
        if (controllerRef.current === controller) {
          controllerRef.current = undefined;
        }
      }
    },
    [abort, controllerRef, searchOptions, projectKey, apiUrl, debug],
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
      href: (options?.getHref || DEFAULT_MARKPROMPT_OPTIONS.search?.getHref)?.(
        result,
      ),
      heading: (
        options?.getHeading || DEFAULT_MARKPROMPT_OPTIONS.search?.getHeading
      )?.(result, query),
      title:
        (options?.getTitle || DEFAULT_MARKPROMPT_OPTIONS.search?.getTitle)?.(
          result,
          query,
        ) || 'Untitled',
      subtitle: (
        options?.getSubtitle || DEFAULT_MARKPROMPT_OPTIONS.search?.getSubtitle
      )?.(result, query),
    };
  });
}
