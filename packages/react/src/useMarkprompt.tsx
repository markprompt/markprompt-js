import {
  submitFeedback as submitFeedbackToMarkprompt,
  submitPrompt as submitPromptToMarkprompt,
  submitSearchQuery as submitSearchQueryToMarkprompt,
  type SubmitPromptOptions,
  type SubmitSearchQueryOptions,
  type SearchResult,
  type FileSectionReference,
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

import type { MarkpromptOptions, SearchResultComponentProps } from './types.js';

export type LoadingState =
  | 'indeterminate'
  | 'preload'
  | 'streaming-answer'
  | 'done';

export type Views = 'prompt' | 'search';

export interface UseMarkpromptOptions {
  /** The currently active view */
  activeView: Views;
  /** Project key, required */
  projectKey: string;
  /** Project key, required */
  display?: MarkpromptOptions['display'];
  /** Enable and configure prompt functionality */
  promptOptions?: Omit<SubmitPromptOptions, 'signal'>;
  /** Enable and configure search functionality */
  searchOptions?: Omit<SubmitSearchQueryOptions, 'signal'> & {
    enabled?: boolean;
  };
  /** Display debug info */
  debug?: boolean;
}

export interface UseMarkpromptResult {
  /** The currently active view */
  activeView: Views;
  /** The most recent answer */
  answer: string;
  /** Enable search functionality */
  isSearchEnabled: boolean;
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
}

const mockData: SearchResultComponentProps[] = [
  {
    isSection: true,
    path: '/getting-started',
    reference: {
      file: {
        title: 'Getting Started',
        path: '/path/to/getting-started.md',
        source: {
          type: 'github',
        },
      },
      meta: {
        leadHeading: {
          id: 'introduction',
          depth: 1,
          value: 'Introduction',
          slug: 'introduction',
        },
      },
    },
    tag: 'getting-started',
    title: 'Getting Started',
  },
  {
    isSection: false,
    path: '/api-reference',
    reference: {
      file: {
        title: 'API Reference',
        path: '/path/to/api-reference.md',
        source: {
          type: 'github',
        },
      },
    },
    title: 'API Reference',
  },
  {
    isSection: true,
    path: '/guides',
    reference: {
      file: {
        title: 'Guides',
        path: '/path/to/guides.md',
        source: {
          type: 'github',
        },
      },
      meta: {
        leadHeading: {
          id: 'getting-started',
          depth: 1,
          value: 'Getting Started',
          slug: 'getting-started',
        },
      },
    },
    tag: 'guides',
    title: 'Guides',
  },
  {
    isSection: false,
    path: '/examples',
    reference: {
      file: {
        title: 'Examples',
        path: '/path/to/examples.md',
        source: {
          type: 'github',
        },
      },
    },
    title: 'Examples',
  },
  {
    isSection: true,
    path: '/tutorials',
    reference: {
      file: {
        title: 'Tutorials',
        path: '/path/to/tutorials.md',
        source: {
          type: 'github',
        },
      },
      meta: {
        leadHeading: {
          id: 'getting-started',
          depth: 1,
          value: 'Getting Started',
          slug: 'getting-started',
        },
      },
    },
    tag: 'tutorials',
    title: 'Tutorials',
  },
  {
    isSection: false,
    path: '/faq',
    reference: {
      file: {
        title: 'FAQ',
        path: '/path/to/faq.md',
        source: {
          type: 'github',
        },
      },
    },
    title: 'FAQ',
  },
  {
    isSection: true,
    path: '/blog',
    reference: {
      file: {
        title: 'Blog',
        path: '/path/to/blog.md',
        source: {
          type: 'github',
        },
      },
      meta: {
        leadHeading: {
          id: 'latest-posts',
          depth: 1,
          value: 'Latest Posts',
          slug: 'latest-posts',
        },
      },
    },
    tag: 'blog',
    title: 'Blog',
  },
  {
    isSection: false,
    path: '/contact',
    reference: {
      file: {
        title: 'Contact Us',
        path: '/path/to/contact.md',
        source: {
          type: 'github',
        },
      },
    },
    title: 'Contact Us',
  },
];

/**
 * A React hook with all the functionality you need to create an interactive
 * stateful Markprompt prompt with search and a prompt.
 */
export function useMarkprompt({
  activeView,
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

  const [state, setState] = useState<LoadingState>('indeterminate');
  const [searchResults, setSearchResults] =
    useState<SearchResultComponentProps[]>(mockData);
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
  }, [abort, projectKey, prompt, promptOptions, state]);

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

      const promise = submitSearchQueryToMarkprompt(searchQuery, projectKey, {
        ...searchOptions,
        signal: controller.signal,
      });

      promise.then((searchResults) => {
        if (debug) {
          // eslint-disable-next-line no-console
          console.debug(JSON.stringify(searchResults?.debug, null, 2));
        }

        if (controller.signal.aborted) return;
        if (!searchResults?.data) return;

        setSearchResults(
          flattenSearchResults(searchQuery, searchResults.data) ?? [],
        );

        // initially focus the first result
        setState('done');
      });

      promise.catch((error) => {
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
      });

      promise.finally(() => {
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
      activeView,
      prompt,
      references,
      searchQuery,
      searchResults,
      state,
      abort,
      setPrompt,
      setSearchQuery,
      submitFeedback,
      submitPrompt,
      submitSearchQuery,
    }),
    [
      activeView,
      answer,
      prompt,
      references,
      searchOptions?.enabled,
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

function removeLeadHeading(text: string, heading?: string): string {
  // This needs to be revised. When returning the search result, the endpoint
  // provides a snippet of the content around the search term (to avoid sending
  // entire sections). This snippet may contain the start of the section
  // content, and this content may start with a heading (the leadHeading).
  // We don't want this leadHeading to be part of the content snippet.
  // Since it's a snippet, we can't assume that the leadHeading will always be
  // the first line. Instead, we have to check it in the string itself.
  const trimmedContent = trimContent(text);
  if (!heading) {
    return trimmedContent;
  }
  const pattern = new RegExp(`^#{1,}\\s${heading}\\s?`);
  return trimContent(trimmedContent.replace(pattern, ''));
}

function trimContent(text: string): string {
  // we don't use String.prototype.trim() because we
  // don't want to remove line terminators from Markdown
  return text.trimStart().trimEnd();
}

function createKWICSnippet(
  content: string,
  normalizedSearchQuery: string,
): string {
  const trimmedContent = content.trim().replace(/\n/g, ' ');
  const index = trimmedContent
    .toLocaleLowerCase()
    .indexOf(normalizedSearchQuery);

  if (index === -1) {
    return trimmedContent.slice(0, 200);
  }

  const rawSnippet = trimmedContent.slice(Math.max(0, index - 50), index + 150);

  const words = rawSnippet.split(/\s+/);
  if (words.length > 3) {
    return words.slice(1, words.length - 1).join(' ');
  }
  return words.join(' ');
}

function flattenSearchResults(
  searchQuery: string,
  searchResults: SearchResult[],
): SearchResultComponentProps[] {
  return searchResults.map((result) => {
    if (result.matchType === 'title') {
      return {
        path: result.file.path,
        tag: undefined,
        title: result.file.title || 'Untitled',
        isSection: false,
        reference: {
          file: result.file,
          meta: undefined,
        },
      };
    } else {
      const leadHeading = result.meta?.leadHeading;
      if (result.matchType === 'leadHeading' && leadHeading?.value) {
        return {
          path: result.file.path,
          tag: result.file.title,
          title: leadHeading.value,
          isSection: true,
          reference: result,
        };
      } else {
        const normalizedSearchQuery = searchQuery.toLowerCase();
        // Fast and hacky way to remove the lead heading from
        // the content, which we don't want to be part of the snippet.
        const trimmedContent = removeLeadHeading(
          result.snippet,
          result.meta?.leadHeading?.value,
        );
        return {
          path: result.file.path,
          tag: leadHeading?.value || result.file.title,
          title: createKWICSnippet(trimmedContent, normalizedSearchQuery),
          isSection: true,
          reference: result,
        };
      }
    }
  });
}
