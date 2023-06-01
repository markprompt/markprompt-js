import { type Options, type SearchResult } from '@markprompt/core';
import {
  DEFAULT_FREQUENCY_PENALTY,
  DEFAULT_I_DONT_KNOW_MESSAGE,
  DEFAULT_MAX_TOKENS,
  DEFAULT_MODEL,
  DEFAULT_PRESENCE_PENALTY,
  DEFAULT_PROMPT_TEMPLATE,
  DEFAULT_SECTIONS_MATCH_COUNT,
  DEFAULT_SECTIONS_MATCH_THRESHOLD,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_P,
  MARKPROMPT_COMPLETIONS_URL,
  submitPrompt as submitPromptToMarkprompt,
  submitSearchQuery as submitSearchQueryToMarkprompt,
} from '@markprompt/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type LoadingState =
  | 'indeterminate'
  | 'preload'
  | 'streaming-answer'
  | 'done';

const mockData: SearchResult[] = [
  {
    path: '/path1',
    meta: {
      title: 'Title 1',
    },
    content: '# Content 1\n\nThis is **Markdown**',
    source_type: 'Type 1',
    source_data: {
      url: 'https://example.com/url1',
    },
    project_id: 'Project 1',
  },
  {
    path: '/path2',
    meta: {
      title: 'Title 2',
    },
    content: '# Content 2\n\nThis is **Markdown**',
    source_type: 'Type 2',
    source_data: {
      url: 'https://example.com/url2',
    },
    project_id: 'Project 2',
  },
  {
    path: '/path3',
    meta: {
      title: 'Title 3',
    },
    content: '# Content 3\n\nThis is **Markdown**',
    source_type: 'Type 3',
    source_data: {
      url: 'https://example.com/url3',
    },
    project_id: 'Project 3',
  },
  // Add more objects as needed
];

export function useMarkprompt({
  projectKey,
  completionsUrl = MARKPROMPT_COMPLETIONS_URL,
  frequencyPenalty = DEFAULT_FREQUENCY_PENALTY,
  iDontKnowMessage = DEFAULT_I_DONT_KNOW_MESSAGE,
  maxTokens = DEFAULT_MAX_TOKENS,
  model = DEFAULT_MODEL,
  presencePenalty = DEFAULT_PRESENCE_PENALTY,
  promptTemplate = DEFAULT_PROMPT_TEMPLATE,
  sectionsMatchCount = DEFAULT_SECTIONS_MATCH_COUNT,
  sectionsMatchThreshold = DEFAULT_SECTIONS_MATCH_THRESHOLD,
  temperature = DEFAULT_TEMPERATURE,
  topP = DEFAULT_TOP_P,
}: {
  /** Project key, required */
  projectKey: string;
} & Options) {
  if (!projectKey) {
    throw new Error(
      'Markprompt: a project key is required. Make sure to pass the projectKey prop to Markprompt.Root.',
    );
  }

  const [state, setState] = useState<LoadingState>('indeterminate');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
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
    async (searchQuery: string) => {
      console.log('search', searchQuery);

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
        signal: controller.signal,
      });

      promise.then((searchResults) => {
        // setSearchResults(searchResults);
        setSearchResults(mockData);
        setState('done');
      });

      promise.catch((error) => {
        if (error.cause?.name === 'AbortError') {
          // Ignore abort errors
          return;
        }

        setSearchResults(mockData);
      });

      promise.finally(() => {
        if (controllerRef.current === controller) {
          controllerRef.current = undefined;
        }
      });
    },
    [abort, projectKey],
  );

  return useMemo(
    () => ({
      answer,
      prompt,
      references,
      searchResults,
      state,
      abort,
      updatePrompt: setPrompt,
      submitPrompt,
      submitSearchQuery,
    }),
    [
      answer,
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
