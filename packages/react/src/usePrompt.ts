import {
  type FileSectionReference,
  type SubmitPromptOptions,
  submitPrompt as submitPromptToMarkprompt,
  type PromptFeedback,
} from '@markprompt/core';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { MarkpromptOptions } from './types.js';
import { useAbortController } from './useAbortController.js';
import { useFeedback } from './useFeedback.js';

interface UsePromptOptions {
  /** Markprompt project key */
  projectKey: string;
  /** Enable and configure prompt functionality */
  promptOptions?: Omit<SubmitPromptOptions, 'signal'>;
  /** Enable and configure feedback functionality */
  feedbackOptions?: MarkpromptOptions['feedback'];
  /** Display debug info */
  debug?: boolean;
}

interface usePromptResult {
  answer: string;
  prompt: string;
  references: FileSectionReference[];
  state: LoadingState;
  abort: () => void;
  setPrompt: (prompt: string) => void;
  submitFeedback: (feedback: PromptFeedback) => void;
  abortFeedbackRequest: () => void;
  submitPrompt: () => void;
}

export type LoadingState =
  | 'indeterminate'
  | 'preload'
  | 'streaming-answer'
  | 'done';

export function usePrompt({
  projectKey,
  promptOptions,
  feedbackOptions,
  debug,
}: UsePromptOptions): usePromptResult {
  if (!projectKey) {
    throw new Error(
      'Markprompt: a project key is required. Make sure to pass the projectKey to useMarkprompt.',
    );
  }

  const [state, setState] = useState<LoadingState>('indeterminate');
  const [answer, setAnswer] = useState('');
  const [references, setReferences] = useState<FileSectionReference[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [promptId, setPromptId] = useState<string>();

  const { ref: controllerRef, abort } = useAbortController();

  const { abort: abortFeedbackRequest, submitFeedback } = useFeedback({
    projectKey,
    promptId,
    feedbackOptions,
    state,
  });

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
    setPromptId(undefined);
    setState('preload');

    const controller = new AbortController();
    controllerRef.current = controller;

    const promise = submitPromptToMarkprompt(
      [{ message: prompt, role: 'user' }],
      projectKey,
      (chunk) => {
        setState('streaming-answer');
        setAnswer((prev) => prev + chunk);
        return true;
      },
      (refs) => setReferences(refs),
      (pid) => setPromptId(pid),
      (error) => {
        // ignore abort errors
        if (error instanceof Error && error.name === 'AbortError') return;

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
  }, [abort, controllerRef, debug, projectKey, prompt, promptOptions, state]);

  return useMemo(
    () => ({
      answer,
      prompt,
      references,
      state,
      abort,
      abortFeedbackRequest,
      setPrompt,
      submitFeedback,
      submitPrompt,
    }),
    [
      answer,
      prompt,
      references,
      state,
      abort,
      abortFeedbackRequest,
      submitFeedback,
      submitPrompt,
    ],
  );
}
