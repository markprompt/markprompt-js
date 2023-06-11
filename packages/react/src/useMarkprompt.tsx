import {
  submitPrompt as submitPromptToMarkprompt,
  submitSearchQuery as submitSearchQueryToMarkprompt,
  type SubmitPromptOptions,
  type SearchResult,
  type SubmitSearchQueryOptions,
} from '@markprompt/core';
import Slugger from 'github-slugger';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

import type { FlattenedSearchResult } from './types.js';

export type LoadingState =
  | 'indeterminate'
  | 'preload'
  | 'streaming-answer'
  | 'done';

export type UseMarkpromptOptions = SubmitPromptOptions &
  SubmitSearchQueryOptions & {
    /** Project key, required */
    projectKey: string;
    /** Enable search functionality */
    isSearchEnabled?: boolean;
    /** Is search currently active */
    isSearchActive?: boolean;
  };

export type UseMarkpromptResult = {
  /** The currently active search result */
  activeSearchResult: string | undefined;
  /** The latest answer */
  answer: string;
  /** Enable search functionality */
  isSearchEnabled: boolean;
  /** Is search currently active */
  isSearchActive: boolean;
  /** The current prompt */
  prompt: string;
  /** The references that belong to the latest answer */
  references: string[];
  /** Search results */
  searchResults: FlattenedSearchResult[];
  /** The current loading state */
  state: LoadingState;
  /** Abort a pending request */
  abort: () => void;
  /** Update the currently active search result */
  updateActiveSearchResult: Dispatch<SetStateAction<string | undefined>>;
  /** Set a new value for the prompt */
  updatePrompt: Dispatch<SetStateAction<string>>;
  /** Submit the prompt */
  submitPrompt: () => Promise<void>;
  /** Submit search query */
  submitSearchQuery: (query: string) => void;
};

const mockData: SearchResult[] = [
  {
    path: 'quick-start.mdoc',
    meta: {
      title: 'Quick start',
    },
    source: {
      type: 'github',
      data: {
        url: 'https://github.com/motifland/markprompt-sample-docs',
      },
    },
    sections: [
      {
        meta: {
          leadHeading: {
            depth: 2,
            value: 'Quick start',
          },
        },
        content:
          '## Quick start\n\nThe quickest way to get started is to navigate to the [Markprompt dashboard](https://markprompt.com) and follow the onboarding, which consists of two steps:\n\n*   Step 1: Uploading and processing a set of files\n*   Step 2: Querying the content in a playground\n\nOnce you have completed the onboarding, you can expose a prompt, for instance on a website, using our [API endpoints](#api) or our [React](#react) or [Web Component](#web-component).\n\nA good starting point for integrating a prompt on your website is the [Markprompt Starter Template](https://github.com/motifland/markprompt-starter-template), which is a sample Next.js application containing the full code for the prompt component, ready to query your content.',
        score: 5,
      },
      {
        content: 'Here is the intro section without a leading heading',
        score: 1,
      },
      {
        meta: {
          leadHeading: {
            depth: 2,
            value: 'Other sub section',
          },
        },
        content: '## Other sub section\n\nSubsection content',
        score: 1,
      },
    ],
  },
  {
    path: 'api.mdoc',
    meta: {
      title: 'API',
    },
    source: {
      type: 'github',
      data: {
        url: 'https://github.com/motifland/markprompt-sample-docs',
      },
    },
    sections: [
      {
        meta: {
          leadHeading: {
            depth: 2,
            value: 'API',
          },
        },
        content:
          '## API\n\nMarkprompt exposes two endpoints at `https://api.markprompt.com`:\n\n*   `/v1/train`: turn your content into embeddings\n*   `/v1/completions`: get completions for user prompts\n\nThe `/v1/train` endpoint requires authorization using a bearer token. This token can be found in your project settings in the dashboard, and should never be shared publicly. If you suspect that your token has been compromised, you can generate a new one in the dashboard. The `/v1/completions` endpoint can be accessed either from the server using the bearer token, or from the client side using a development key (for non-public testing) or a production key from a whitelisted domain (for public sharing). See below for more details.',
        score: 4,
      },
      {
        meta: {
          leadHeading: {
            depth: 3,
            value: 'Train content',
          },
        },
        content:
          "### Train content\n\nUsing this endpoint is relevant if you want to programmatically index your content, for instance in a [GitHub action](https://docs.github.com/en/actions). If you don't need this level of automation, we recommend that you use the Markprompt dashboard, which offers simple tools such as GitHub sync and drag-and-drop to make the process easy and setup-free.\n\n```http\nPOST https://api.markprompt.com/v1/train\n```\n\nCreates and indexes embeddings for your content.\n\nThe endpoint accepts two types of payloads:\n\n*   A JSON payload.\n*   A file payload, for uploading a zip file or a plain text file.",
        score: 1,
      },
      {
        meta: {
          leadHeading: {
            depth: 3,
            value: 'Train content',
          },
        },
        content: '### Train content\n\nSome content',
        score: 2,
      },
      {
        meta: {
          leadHeading: {
            depth: 3,
            value: 'Train content',
          },
        },
        content: '### Train content',
        score: 5,
      },
    ],
  },
];

export function useMarkprompt({
  projectKey,
  isSearchEnabled,
  isSearchActive,
  completionsUrl,
  frequencyPenalty,
  iDontKnowMessage,
  maxTokens,
  model,
  presencePenalty,
  promptTemplate,
  sectionsMatchCount,
  sectionsMatchThreshold,
  temperature,
  topP,
}: UseMarkpromptOptions): UseMarkpromptResult {
  if (!projectKey) {
    throw new Error(
      'Markprompt: a project key is required. Make sure to pass the projectKey prop to Markprompt.Root.',
    );
  }

  const [state, setState] = useState<LoadingState>('indeterminate');
  const [searchResults, setSearchResults] = useState<FlattenedSearchResult[]>(
    [],
  );
  const [activeSearchResult, setActiveSearchResult] = useState<
    string | undefined
  >();
  const [answer, setAnswer] = useState('');
  const [references, setReferences] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>('');

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
        console.error(error);
      },
      {
        completionsUrl,
        frequencyPenalty,
        iDontKnowMessage,
        maxTokens,
        model,
        presencePenalty,
        promptTemplate,
        sectionsMatchCount,
        sectionsMatchThreshold,
        signal: controller.signal,
        temperature,
        topP,
      },
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
  }, [
    abort,
    completionsUrl,
    frequencyPenalty,
    iDontKnowMessage,
    maxTokens,
    model,
    presencePenalty,
    projectKey,
    prompt,
    promptTemplate,
    sectionsMatchCount,
    sectionsMatchThreshold,
    state,
    temperature,
    topP,
  ]);

  const submitSearchQuery = useCallback(
    (searchQuery: string) => {
      if (!isSearchEnabled) return;

      abort();

      // reset state if the query was set (back) to empty
      if (searchQuery === '') {
        if (controllerRef.current) controllerRef.current.abort();
        setSearchResults([]);
        setActiveSearchResult(undefined);
        setState('indeterminate');
        return;
      }

      setState('preload');

      const controller = new AbortController();
      controllerRef.current = controller;

      const promise = submitSearchQueryToMarkprompt(searchQuery, projectKey, {
        signal: controller.signal,
      });

      promise.then((searchResults) => {
        // const searchResults = { data: mockData };

        if (controller.signal.aborted) return;
        if (!searchResults?.data) return;

        setSearchResults(
          flattenSearchResults(searchQuery, searchResults.data) ?? [],
        );
        // initially focus the first result
        setActiveSearchResult(`markprompt-result-0`);
        setState('done');
      });

      promise.catch((error) => {
        if (error.cause?.name === 'AbortError') {
          // Ignore abort errors
          return;
        }

        console.error(error);
      });

      promise.finally(() => {
        if (controllerRef.current === controller) {
          controllerRef.current = undefined;
        }
      });
    },
    [abort, isSearchEnabled, projectKey],
  );

  return useMemo(
    () => ({
      answer,
      activeSearchResult,
      isSearchEnabled: !!isSearchEnabled,
      isSearchActive: !!isSearchActive,
      prompt,
      references,
      searchResults,
      state,
      abort,
      updateActiveSearchResult: setActiveSearchResult,
      updatePrompt: setPrompt,
      submitPrompt,
      submitSearchQuery,
    }),
    [
      answer,
      activeSearchResult,
      isSearchEnabled,
      isSearchActive,
      prompt,
      references,
      searchResults,
      state,
      abort,
      submitPrompt,
      submitSearchQuery,
    ],
  );
}

function isPresent<T>(t: T | undefined | null | void): t is T {
  return t !== undefined && t !== null;
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

const isMatching = (
  text: string | undefined,
  normalizedSearchQuery: string,
): boolean => {
  if (!text || text.length === 0) {
    return false;
  }
  return text.toLowerCase().indexOf(normalizedSearchQuery) >= 0;
};

const slugger = new Slugger();

function flattenSearchResults(
  searchQuery: string,
  searchResults: SearchResult[],
): FlattenedSearchResult[] {
  const sortedSearchResults = [...searchResults].sort((a, b) => {
    const aTopSectionScore = Math.max(...a.sections.map((s) => s.score));
    const bTopSectionScore = Math.max(...b.sections.map((s) => s.score));
    return aTopSectionScore - bTopSectionScore;
  });

  // The final list is built as follows:
  // - If the title matches the search term, include a search result
  //   with the title itself, and no sections
  // - If the title matches the search term, we may also get a bunch of
  //   sections without the search term, because of the title match.
  //   So we remove all the sections that don't include the search term
  //   in the content and meta.leadHeading
  // - All other sections (with matches on search term) are added
  const normalizedSearchQuery = searchQuery.toLowerCase();

  return sortedSearchResults.flatMap((f) => {
    const isMatchingTitle = isMatching(f.meta?.title, normalizedSearchQuery);

    const sectionResults = [
      ...f.sections
        .map((s) => {
          // Fast and hacky way to remove the lead heading from
          // the content, which we don't want to be part of the snippet
          const trimmedContent = removeLeadHeading(
            s.content,
            s.meta?.leadHeading?.value,
          );

          if (!trimmedContent) {
            return undefined;
          }

          const isMatchingLeadHeading = isMatching(
            s.meta?.leadHeading?.value,
            normalizedSearchQuery,
          );

          const isMatchingContent = isMatching(
            trimmedContent,
            normalizedSearchQuery,
          );

          if (!isMatchingLeadHeading && !isMatchingContent) {
            // If this is a result because of the title only, omit
            // it from here.
            return undefined;
          }

          if (isMatchingLeadHeading) {
            // If matching lead heading, show that as title
            return {
              isParent: false,
              hasParent: isMatchingTitle,
              title: createKWICSnippet(
                trimContent(s.meta?.leadHeading?.value || ''),
                normalizedSearchQuery,
              ),
              score: s.score,
              path: `${f.path}#${slugger.slug(
                s.meta?.leadHeading?.value || '',
              )}`,
            };
          }

          return {
            isParent: false,
            hasParent: isMatchingTitle,
            tag: f.meta.title,
            title: createKWICSnippet(trimmedContent, normalizedSearchQuery),
            score: s.score,
            path: f.path,
          };
        })
        .filter(isPresent),
    ].sort((s1, s2) => s2.score - s1.score);

    if (isMatchingTitle) {
      // Set the score of the title result to the same score as the
      // highest scored section. Since the section in sectionResults are
      // already ranked by score, just take the first one.
      const topSectionScore = sectionResults[0]?.score;
      return [
        {
          isParent: true,
          hasParent: false,
          title: createKWICSnippet(f.meta.title, searchQuery),
          score: topSectionScore,
          path: f.path,
        },
      ].concat(sectionResults);
    } else {
      return sectionResults;
    }
  });
}
