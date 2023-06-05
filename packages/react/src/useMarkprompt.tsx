import {
  submitPrompt as submitPromptToMarkprompt,
  submitSearchQuery as submitSearchQueryToMarkprompt,
  type SubmitPromptOptions,
  type SearchResult,
} from '@markprompt/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type LoadingState =
  | 'indeterminate'
  | 'preload'
  | 'streaming-answer'
  | 'done';

export function useMarkprompt({
  projectKey,
  enableSearch,
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
  /** Enable search functionality */
  enableSearch?: boolean;
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

  useEffect(() => {
    setSearchResults([
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
          },
          {
            content: 'Here is the intro section without a leading heading',
          },
          {
            meta: {
              leadHeading: {
                depth: 2,
                value: 'Other sub section',
              },
            },
            content: 'Subsection content',
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
          },
          {
            meta: {
              leadHeading: {
                depth: 3,
                value: 'Train content',
              },
            },
            content: '### Train content',
          },
          {
            meta: {
              leadHeading: {
                depth: 3,
                value: 'Train content',
              },
            },
            content: '### Train content',
          },
          {
            meta: {
              leadHeading: {
                depth: 3,
                value: 'Train content',
              },
            },
            content: '### Train content',
          },
          {
            meta: {
              leadHeading: {
                depth: 3,
                value: 'Train content',
              },
            },
            content: '### Train content',
          },
          {
            meta: {
              leadHeading: {
                depth: 3,
                value: 'Train content',
              },
            },
            content: '### Train content',
          },
          {
            meta: {
              leadHeading: {
                depth: 3,
                value: 'Train content',
              },
            },
            content: '### Train content',
          },
        ],
      },
    ]);
  }, []);

  const submitSearchQuery = useCallback(
    (searchQuery: string) => {
      if (!enableSearch) return;

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
        setSearchResults(searchResults?.data ?? []);
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
    [abort, enableSearch, projectKey],
  );

  return useMemo(
    () => ({
      answer,
      enableSearch: !!enableSearch,
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
      enableSearch,
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
