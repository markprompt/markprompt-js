import {
  DEFAULT_SECTIONS_MATCH_COUNT,
  DEFAULT_SECTIONS_MATCH_THRESHOLD,
  type Options,
} from '@markprompt/core';
import {
  DEFAULT_FREQUENCY_PENALTY,
  DEFAULT_I_DONT_KNOW_MESSAGE,
  DEFAULT_LOADING_HEADING,
  DEFAULT_MAX_TOKENS,
  DEFAULT_MODEL,
  DEFAULT_PRESENCE_PENALTY,
  DEFAULT_PROMPT_TEMPLATE,
  DEFAULT_REFERENCES_HEADING,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_P,
  MARKPROMPT_COMPLETIONS_URL,
  submitPrompt,
} from '@markprompt/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type LoadingState =
  | 'indeterminate'
  | 'preload'
  | 'streaming-answer'
  | 'done';

export function useMarkprompt({
  projectKey,
  completionsUrl = MARKPROMPT_COMPLETIONS_URL,
  frequencyPenalty = DEFAULT_FREQUENCY_PENALTY,
  iDontKnowMessage = DEFAULT_I_DONT_KNOW_MESSAGE,
  includeBranding = true,
  loadingHeading = DEFAULT_LOADING_HEADING,
  maxTokens = DEFAULT_MAX_TOKENS,
  model = DEFAULT_MODEL,
  presencePenalty = DEFAULT_PRESENCE_PENALTY,
  promptTemplate = DEFAULT_PROMPT_TEMPLATE,
  referencesHeading = DEFAULT_REFERENCES_HEADING,
  temperature = DEFAULT_TEMPERATURE,
  topP = DEFAULT_TOP_P,
  sectionsMatchCount = DEFAULT_SECTIONS_MATCH_COUNT,
  sectionsMatchThreshold = DEFAULT_SECTIONS_MATCH_THRESHOLD,
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

  const updatePrompt = useCallback((prompt: string) => {
    setPrompt(prompt);
  }, []);

  const submit = useCallback(async () => {
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

    const promise = submitPrompt(
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
        iDontKnowMessage,
        referencesHeading,
        loadingHeading,
        includeBranding,
        model,
        promptTemplate,
        temperature,
        topP,
        frequencyPenalty,
        presencePenalty,
        maxTokens,
        sectionsMatchCount,
        sectionsMatchThreshold,
        signal: controller.signal,
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
    prompt,
    projectKey,
    completionsUrl,
    iDontKnowMessage,
    referencesHeading,
    loadingHeading,
    includeBranding,
    model,
    promptTemplate,
    temperature,
    topP,
    frequencyPenalty,
    presencePenalty,
    maxTokens,
    sectionsMatchCount,
    sectionsMatchThreshold,
    state,
    abort,
  ]);

  return useMemo(
    () => ({
      answer,
      references,
      state,
      prompt,
      abort,
      updatePrompt,
      submit,
    }),
    [answer, references, state, prompt, abort, updatePrompt, submit],
  );
}
