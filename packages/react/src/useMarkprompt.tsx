import {
  submitFeedback as submitFeedbackToMarkprompt,
  submitPrompt as submitPromptToMarkprompt,
  submitSearchQuery as submitSearchQueryToMarkprompt,
  submitAlgoliaDocsearchQuery,
  type SubmitPromptOptions,
  type SearchResult,
  type FileSectionReference,
  type SearchResultsResponse,
  type AlgoliaDocSearchResultsResponse,
  type AlgoliaDocSearchHit,
} from '@markprompt/core';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import type { MarkpromptOptions, SearchResultComponentProps } from './types.js';

export type LoadingState =
  | 'indeterminate'
  | 'preload'
  | 'streaming-answer'
  | 'done';

export type View = 'prompt' | 'search';

export interface UseMarkpromptOptions {
  /** Render in a dialog or plain? */
  display?: MarkpromptOptions['display'];
  /** Display debug info */
  debug?: boolean;
  /** Project key, required */
  projectKey: string;
  /** Enable and configure prompt functionality */
  promptOptions?: Omit<SubmitPromptOptions, 'signal'>;
  /** Enable and configure search functionality */
  searchOptions?: MarkpromptOptions['search'];
}

export type UseMarkpromptResult = {
  /** The currently active view */
  activeView: View;
  /** The most recent answer */
  answer: string | undefined;
  /** Enable search functionality */
  isSearchEnabled: boolean;
  /** Custom search provider, e.g. 'algolia' */
  searchProvider: string | undefined;
  /** The current prompt */
  prompt: string;
  /** The references that belong to the latest answer */
  references: FileSectionReference[];
  /** Search results */
  searchResults: SearchResultComponentProps[];
  /** The current search query */
  searchQuery: string;
  /** The current state of request(s) */
  state: LoadingState;
  /** Abort a pending request */
  abort: () => void;
  /** Switch the active view between search and prompt */
  setActiveView: Dispatch<SetStateAction<View>>;
  /** Set a new value for the prompt */
  setPrompt: Dispatch<SetStateAction<string>>;
  /** Set a new value for the search query */
  setSearchQuery: Dispatch<SetStateAction<string>>;
  /** Submit user feedback */
  submitFeedback: (helpful: boolean) => Promise<void>;
  /** Submit the prompt */
  submitPrompt: () => Promise<void>;
  /** Submit search query */
  submitSearchQuery: (query: string) => void;
};

/**
 * A React hook with all the functionality you need to create an interactive
 * stateful Markprompt prompt with search and a prompt.
 */
export function useMarkprompt({
  projectKey,
  searchOptions,
  promptOptions,
  debug,
}: UseMarkpromptOptions): UseMarkpromptResult {
  if (!projectKey) {
    throw new Error(
      'Markprompt: a project key is required. Make sure to pass the projectKey to useMarkprompt.',
    );
  }

  const [activeView, setActiveView] = useState<View>(
    searchOptions?.enabled ? 'search' : 'prompt',
  );

  const [state, setState] = useState<LoadingState>('indeterminate');
  const [searchResults, setSearchResults] = useState<
    SearchResultComponentProps[]
  >([]);
  const [answer, setAnswer] = useState('');
  const [references, setReferences] = useState<FileSectionReference[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [promptId, setPromptId] = useState<string>();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const controllerRef = useRef<AbortController>();

  const abort = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = undefined;
    }
  }, []);

  // Abort ongoing fetch requests on unmount
  useEffect(() => {
    return () => abort();
  }, [abort]);

  const submitFeedback = useCallback(
    async (helpful: boolean) => {
      abort();

      // only submit feedback when we are done loading the answer
      if (state !== 'done') return;
      // we need to be able to associate the feedback to a prompt
      if (!promptId) return;

      const controller = new AbortController();
      controllerRef.current = controller;

      const promise = submitFeedbackToMarkprompt(
        projectKey,
        { helpful, promptId },
        { signal: controller.signal },
      );

      promise.catch(() => {
        // ignore submitFeedback errors
      });

      promise.finally(() => {
        if (controllerRef.current === controller) {
          controllerRef.current = undefined;
        }
      });
    },
    [abort, projectKey, promptId, state],
  );

  const submitPrompt = useCallback(async () => {
    abort();

    if (state === 'preload' || state === 'streaming-answer') {
      // If state is loading and fetch was aborted, wait a short delay
      // so that the original fetch request aborts and resets the state.
      // Otherwise, the new fetch starts (and state becomes 'preload'),
      // and after that, the state becomes 'done', which is the wrong
      // order.
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    if (!prompt || prompt === '') {
      return;
    }

    setAnswer('');
    setReferences([]);
    setState('preload');

    const controller = new AbortController();
    controllerRef.current = controller;

    const promise = submitPromptToMarkprompt(
      prompt,
      projectKey,
      (chunk) => {
        setState('streaming-answer');
        setAnswer((prev) => prev + chunk);
        return true;
      },
      (refs) => setReferences(refs),
      (error) => {
        if (
          error instanceof Error &&
          typeof error.cause === 'object' &&
          error.cause !== null &&
          'name' in error.cause &&
          error.cause?.name === 'AbortError'
        ) {
          // Ignore abort errors
          return;
        }

        // todo: surface errors to the user
        // eslint-disable-next-line no-console
        console.error(error);
      },
      {
        ...promptOptions,
        signal: controller.signal,
      },
      debug,
    );

    promise.then(() => {
      if (controller.signal.aborted) return;
      setState('done');
    });

    promise.finally(() => {
      if (controllerRef.current === controller) {
        controllerRef.current = undefined;
      }
    });
  }, [abort, debug, projectKey, prompt, promptOptions, state]);

  const submitSearchQuery = useCallback(
    (searchQuery: string) => {
      if (!searchOptions?.enabled) return;

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

      if (searchOptions.provider?.name === 'algolia') {
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
            ...searchOptions,
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

        console.log('searchResults', JSON.stringify(searchResults, null, 2));
        setSearchResults(
          searchResultsToSearchComponentProps(
            searchQuery,
            searchResults,
            searchOptions,
          ) ?? [],
        );

        // initially focus the first result
        setState('done');
      });

      promise?.catch((error) => {
        if ((error as any).cause?.name !== 'AbortError') {
          // todo: surface errors to the user
          // eslint-disable-next-line no-console
          console.error(error);
        }
      });

      promise?.finally(() => {
        if (controllerRef.current === controller) {
          controllerRef.current = undefined;
        }
      });
    },
    [abort, projectKey, searchOptions, debug],
  );

  return useMemo(
    () => ({
      answer,
      isSearchEnabled: !!searchOptions?.enabled,
      searchProvider: searchOptions?.provider?.name,
      activeView,
      prompt,
      references,
      searchQuery,
      searchResults,
      state,
      abort,
      setActiveView,
      setPrompt,
      setSearchQuery,
      submitFeedback,
      submitPrompt,
      submitSearchQuery,
    }),
    [
      answer,
      searchOptions?.enabled,
      searchOptions?.provider?.name,
      activeView,
      prompt,
      references,
      searchQuery,
      searchResults,
      state,
      abort,
      submitFeedback,
      submitPrompt,
      submitSearchQuery,
    ],
  );
}

function searchResultsToSearchComponentProps(
  query: string,
  searchResults: SearchResult[] | AlgoliaDocSearchHit[],
  searchOptions: MarkpromptOptions['search'],
): SearchResultComponentProps[] {
  return searchResults.map((result) => {
    return {
      href: (
        searchOptions?.getHref || DEFAULT_MARKPROMPT_OPTIONS.search!.getHref
      )?.(result),
      heading: (
        searchOptions?.getHeading ||
        DEFAULT_MARKPROMPT_OPTIONS.search!.getHeading
      )?.(result, query),
      title:
        (
          searchOptions?.getTitle || DEFAULT_MARKPROMPT_OPTIONS.search!.getTitle
        )?.(result, query) || 'Untitled',
      subtitle: (
        searchOptions?.getSubtitle ||
        DEFAULT_MARKPROMPT_OPTIONS.search!.getSubtitle
      )?.(result, query),
    };
  });
}
