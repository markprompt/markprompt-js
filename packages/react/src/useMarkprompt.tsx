import {
  submitPrompt as submitPromptToMarkprompt,
  submitSearchQuery as submitSearchQueryToMarkprompt,
  type SearchResultsResponse,
  type SubmitPromptOptions,
  type SearchResult,
} from '@markprompt/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type LoadingState =
  | 'indeterminate'
  | 'preload'
  | 'streaming-answer'
  | 'done';

const mockData: SearchResultsResponse = {
  project_id: 'abc123',
  data: [
    {
      path: '/docs/getting-started.mdoc',
      meta: {
        title: 'Getting Started',
      },
      source: {
        type: 'gitlab',
        data: {
          url: 'https://gitlab.com/my-project/my-repo',
        },
      },
      sections: [
        {
          content:
            'Welcome to our product documentation! This guide will help you get started with using our platform.',
        },
        {
          heading: 'Installation',
          content: 'To install our platform, follow these steps...',
        },
        {
          heading: 'Configuration',
          content:
            'Once you have installed the platform, you will need to configure it...',
        },
      ],
    },
    {
      path: '/docs/faq.mdoc',
      meta: {
        title: 'Frequently Asked Questions',
      },
      source: {
        type: 'github',
        data: {
          url: 'https://github.com/my-org/my-repo',
        },
      },
      sections: [
        {
          content: 'Here are some common questions we receive from our users.',
        },
        {
          heading: 'How do I reset my password?',
          content: 'To reset your password, follow these steps...',
        },
        {
          heading: 'What payment methods do you accept?',
          content: 'We accept all major credit cards...',
        },
      ],
    },
  ],
};

export function useMarkprompt({
  projectKey,
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
}: {
  /** Project key, required */
  projectKey: string;
} & SubmitPromptOptions) {
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
        setSearchResults(mockData.data);
        setState('done');
      });

      promise.catch((error) => {
        if (error.cause?.name === 'AbortError') {
          // Ignore abort errors
          return;
        }

        setSearchResults(mockData.data);
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
