import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  type FileSectionReference,
  type SubmitChatOptions,
  submitChat,
  isAbortError,
  type SubmitFeedbackOptions,
} from '@/lib/core';

import { useFeedback, type UseFeedbackResult } from '../feedback/useFeedback';
import { useAbortController } from '../useAbortController';

export type PromptLoadingState =
  | 'indeterminate'
  | 'preload'
  | 'streaming-answer'
  | 'done';

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
  prompt: string;
  promptId?: string;
  references: FileSectionReference[];
  state: PromptLoadingState;
  abort: () => void;
  setPrompt: (prompt: string) => void;
  submitPrompt: () => void;
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

  const [state, setState] = useState<PromptLoadingState>('indeterminate');
  const [answer, setAnswer] = useState('');
  const [references, setReferences] = useState<FileSectionReference[]>([]);
  const [prompt, setPrompt] = useState<string>('');
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

  const submitPrompt = useCallback(async () => {
    abort();

    if (!prompt || prompt === '') {
      return;
    }

    setAnswer('');
    setReferences([]);
    setPromptId(undefined);
    setState('preload');

    const controller = new AbortController();
    controllerRef.current = controller;

    const promise = submitChat(
      [{ content: prompt, role: 'user' }],
      projectKey,
      (chunk) => {
        setState('streaming-answer');
        setAnswer((prev) => prev + chunk);
        return true;
      },
      (refs) => setReferences(refs),
      // conversation id's are not being used here
      () => {},
      (promptId: string) => setPromptId(promptId),
      (error) => {
        // ignore abort errors
        if (isAbortError(error)) return;

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
  }, [abort, controllerRef, debug, projectKey, prompt, promptOptions]);

  return useMemo(
    () => ({
      answer,
      prompt,
      promptId,
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
