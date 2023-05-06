import type { Options } from '@markprompt/core';
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
}: {
  /** Project key, required */
  projectKey: string;
} & Options) {
  if (!projectKey) {
    throw new Error(
      'Markprompt: a project key is required. Make sure to pass the projectKey prop to Markprompt.Root.',
    );
  }

  const [state, setState] = useState<'indeterminate' | 'loading' | 'success'>(
    'indeterminate',
  );
  const [answer, setAnswer] = useState('');
  const [references, setReferences] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>('');

  const controllerRef = useRef<AbortController>();

  // abort ongoing fetch requests on unmount
  useEffect(() => {
    return () => abort();
  }, []);

  const abort = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  }, []);

  const updatePrompt = useCallback((prompt: string) => {
    setPrompt(prompt);
  }, []);

  const submit = useCallback(async () => {
    controllerRef.current?.abort();

    if (!prompt || prompt === '') {
      return;
    }

    setAnswer('');
    setReferences([]);
    setState('loading');

    const controller = new AbortController();
    controllerRef.current = controller;

    const promise = submitPrompt(
      prompt,
      projectKey,
      (chunk) => {
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
        signal: controller.signal,
      },
    );

    promise.then(() => {
      setState('success');
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
