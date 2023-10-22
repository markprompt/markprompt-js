import {
  isAbortError,
  submitChatGenerator,
  type FileSectionReference,
  type SubmitChatOptions,
  type SubmitFeedbackOptions,
} from '@markprompt/core';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  useFeedback,
  type UseFeedbackResult,
} from '../feedback/useFeedback.js';
import type { LoadingState } from '../types.js';
import { useAbortController } from '../useAbortController.js';

export interface UsePromptOptions {
  /** Display debug info */
  debug?: boolean;
  /** Enable and configure feedback functionality */
  feedbackOptions?: Omit<SubmitFeedbackOptions, 'signal'>;
  /** Markprompt project key */
  projectKey: string;
  /** Enable and configure prompt functionality */
  promptOptions?: Omit<SubmitChatOptions, 'signal'>;
}

export interface UsePromptResult {
  answer: string;
  promptId?: string;
  references: FileSectionReference[];
  state: LoadingState;
  abort: () => void;
  submitPrompt: (forcePrompt?: string) => void;
  submitFeedback: UseFeedbackResult['submitFeedback'];
  abortFeedbackRequest: UseFeedbackResult['abort'];
}

export function usePrompt({
  debug,
  feedbackOptions,
  projectKey,
  promptOptions,
}: UsePromptOptions): UsePromptResult {
  if (!projectKey) {
    throw new Error(
      'Markprompt: a project key is required. Make sure to pass the projectKey to useMarkprompt.',
    );
  }

  const [state, setState] = useState<LoadingState>('indeterminate');
  const [answer, setAnswer] = useState('');
  const [references, setReferences] = useState<FileSectionReference[]>([]);
  const [promptId, setPromptId] = useState<string>();

  const { ref: controllerRef, abort } = useAbortController();

  const { abort: abortFeedbackRequest, submitFeedback } = useFeedback({
    projectKey,
    feedbackOptions,
  });

  // Abort ongoing fetch requests on unmount
  useEffect(() => {
    return () => abort();
  }, [abort]);

  const submitPrompt = useCallback(
    async (prompt?: string) => {
      abort();

      if (!prompt || prompt === '') return;

      setAnswer('');
      setReferences([]);
      setPromptId(undefined);
      setState('preload');

      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        for await (const value of submitChatGenerator(
          [{ content: prompt, role: 'user' }],
          projectKey,
          { ...promptOptions, signal: controller.signal },
          debug,
        )) {
          setState('streaming-answer');

          if (controller.signal.aborted) return;

          if (value.content) {
            setAnswer(value.content);
          }

          if (value.promptId) {
            setPromptId(value.promptId);
          }

          if (value.references) {
            setReferences(value.references);
          }
        }
      } catch (error) {
        setState('cancelled');

        // ignore abort errors
        if (isAbortError(error)) return;

        // todo: surface errors to the user
        // eslint-disable-next-line no-console
        console.error(error);
      }

      setState('done');
      controllerRef.current = undefined;
    },
    [abort, controllerRef, debug, projectKey, promptOptions],
  );

  return useMemo(
    () => ({
      answer,
      promptId,
      references,
      state,
      abort,
      abortFeedbackRequest,
      submitFeedback,
      submitPrompt,
    }),
    [
      answer,
      promptId,
      references,
      state,
      abort,
      abortFeedbackRequest,
      submitFeedback,
      submitPrompt,
    ],
  );
}
