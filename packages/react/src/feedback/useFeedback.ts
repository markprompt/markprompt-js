import {
  submitFeedback as submitFeedbackToMarkprompt,
  type PromptFeedback,
  type SubmitFeedbackOptions,
} from '@markprompt/core';
import { useCallback } from 'react';

import type { ChatLoadingState } from '../chat/useChat.js';
import type { PromptLoadingState } from '../prompt/usePrompt.js';
import { useAbortController } from '../useAbortController.js';

export interface UseFeedbackOptions {
  /** Enable and configure feedback functionality */
  feedbackOptions?: Omit<SubmitFeedbackOptions, 'signal'>;
  /** Markprompt project key */
  projectKey: string;
  /** ID for the current prompt */
  promptId?: string;
}

export interface UseFeedbackResult {
  /** Abort any pending feedback submission */
  abort: () => void;
  /** Submit feedback for the current prompt */
  submitFeedback: (
    feedback: PromptFeedback,
    state: PromptLoadingState | ChatLoadingState,
    messageIndex: number,
  ) => void;
}

export function useFeedback({
  feedbackOptions,
  projectKey,
  promptId,
}: UseFeedbackOptions): UseFeedbackResult {
  if (!projectKey) {
    throw new Error(
      `Markprompt: a project key is required. Make sure to pass your Markprompt project key to useFeedback.`,
    );
  }

  const { ref: controllerRef, abort } = useAbortController();

  const submitFeedback = useCallback(
    async (
      feedback: PromptFeedback,
      state: PromptLoadingState | ChatLoadingState,
      messageIndex: number,
    ) => {
      abort();

      // only submit feedback when we are done loading the answer
      if (state !== 'done') return;

      // we need to be able to associate the feedback to a prompt
      if (!promptId) return;

      const controller = new AbortController();
      controllerRef.current = controller;

      const promise = submitFeedbackToMarkprompt(
        projectKey,
        { feedback, promptId, messageIndex },
        { ...feedbackOptions, signal: controller.signal },
      );

      promise.catch(() => {
        // ignore submitFeedback errors
      });

      promise.finally(() => {
        if (controllerRef.current === controller) {
          controllerRef.current = undefined;
        }
      });
    },
    [abort, promptId, controllerRef, projectKey, feedbackOptions],
  );

  return { submitFeedback, abort };
}
