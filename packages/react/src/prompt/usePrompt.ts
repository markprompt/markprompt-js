import {
  isAbortError,
  submitChat,
  type FileSectionReference,
  type SubmitFeedbackOptions,
} from '@markprompt/core';
import { useCallback, useEffect, useMemo, useReducer } from 'react';

import type { UserConfigurableOptions } from '../chat/store.js';
import {
  useFeedback,
  type UseFeedbackResult,
} from '../feedback/useFeedback.js';
import { useAbortController } from '../useAbortController.js';

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
  promptOptions?: UserConfigurableOptions;
}

export interface UsePromptResult {
  answer: string;
  error: Error | undefined;
  prompt: string;
  promptId?: string;
  references: FileSectionReference[];
  state: PromptLoadingState;
  abort: () => void;
  setPrompt: (prompt: string) => void;
  submitPrompt: (forcePrompt?: string) => void;
  submitFeedback: UseFeedbackResult['submitFeedback'];
  abortFeedbackRequest: UseFeedbackResult['abort'];
}

interface UsePromptState {
  prompt: string;
  state: PromptLoadingState;
  answer: string;
  references: FileSectionReference[];
  promptId: string | undefined;
  error: Error | undefined;
}

const initialState = {
  answer: '',
  error: undefined,
  prompt: '',
  promptId: undefined,
  references: [],
  state: 'indeterminate',
} satisfies UsePromptState;

function reducer(
  state: UsePromptState,
  action: Partial<UsePromptState>,
): UsePromptState {
  return { ...state, ...action };
}

export function usePrompt({
  debug,
  feedbackOptions,
  projectKey,
  promptOptions,
}: UsePromptOptions): UsePromptResult {
  if (!projectKey) {
    throw new Error(
      'Markprompt: a project key is required. Make sure to pass the projectKey to usePrompt.',
    );
  }

  const [state, dispatch] = useReducer(reducer, initialState);

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
    async (forcePrompt?: string) => {
      abort();

      const _prompt = forcePrompt || state.prompt;
      if (!_prompt || _prompt === '') {
        return;
      }

      dispatch({
        answer: '',
        state: 'preload',
        references: [],
        promptId: undefined,
        error: undefined,
      });

      const controller = new AbortController();
      controllerRef.current = controller;

      const options = {
        ...promptOptions,
        signal: controller.signal,
        debug,
        tools: promptOptions?.tools?.map((x) => x.tool),
      };

      try {
        for await (const chunk of submitChat(
          [{ content: state.prompt, role: 'user' }],
          projectKey,
          options,
        )) {
          dispatch({
            ...chunk,
            answer: chunk.content ?? '',
            state: 'streaming-answer',
          });
        }
      } catch (error) {
        if (isAbortError(error)) return;
        // eslint-disable-next-line no-console
        console.error(error);
        dispatch({
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }

      if (controllerRef.current === controller) {
        controllerRef.current = undefined;
      }

      dispatch({ state: 'done' });
    },
    [abort, controllerRef, debug, projectKey, promptOptions, state.prompt],
  );

  return useMemo(
    () => ({
      ...state,
      abort,
      abortFeedbackRequest,
      setPrompt: (prompt) => dispatch({ prompt }),
      submitFeedback,
      submitPrompt,
    }),
    [state, abort, abortFeedbackRequest, submitFeedback, submitPrompt],
  );
}
