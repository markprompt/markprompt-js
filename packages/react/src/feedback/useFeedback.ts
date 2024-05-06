import {
  submitFeedback as submitFeedbackCore,
  submitCSAT as submitCSATCore,
  type PromptFeedback,
  type SubmitFeedbackOptions,
} from '@markprompt/core';
import { useCallback } from 'react';

import type { CSAT } from '../../../core/src/types.js';
import { useAbortController } from '../useAbortController.js';

export interface UseFeedbackOptions {
  /** Enable and configure feedback functionality */
  feedbackOptions?: Omit<SubmitFeedbackOptions, 'signal'>;
  /** Markprompt project key */
  projectKey: string;
  /** The base API URL */
  apiUrl?: string;
}

export interface UseFeedbackResult {
  /** Abort any pending feedback submission */
  abort: () => void;
  /** Submit feedback for the current message */
  submitFeedback: (feedback: PromptFeedback, messageId?: string) => void;
  /** Submit CSAT for a thread */
  submitThreadCSAT: (threadId: string, csat: CSAT) => void;
}

export function useFeedback({
  feedbackOptions,
  projectKey,
  apiUrl,
}: UseFeedbackOptions): UseFeedbackResult {
  if (!projectKey) {
    throw new Error(
      `Markprompt: a project key is required. Make sure to pass your Markprompt project key to useFeedback.`,
    );
  }

  const { ref: controllerRef, abort } = useAbortController();

  const submitFeedback = useCallback(
    async (feedback: PromptFeedback, messageId?: string) => {
      abort();

      // we need to be able to associate the feedback to a prompt
      if (!messageId) return;

      const controller = new AbortController();
      controllerRef.current = controller;

      const promise = submitFeedbackCore({ feedback, messageId }, projectKey, {
        ...feedbackOptions,
        signal: controller.signal,
        apiUrl,
      });

      promise.catch(() => {
        // ignore submitFeedback errors
      });

      promise.finally(() => {
        if (controllerRef.current === controller) {
          controllerRef.current = undefined;
        }
      });
    },
    [abort, controllerRef, projectKey, feedbackOptions, apiUrl],
  );

  const submitThreadCSAT = useCallback(
    async (threadId: string, csat: CSAT) => {
      abort();

      const controller = new AbortController();
      controllerRef.current = controller;

      const promise = submitCSATCore({ threadId, csat }, projectKey, {
        ...feedbackOptions,
        apiUrl,
        signal: controller.signal,
      });

      promise.catch(() => {
        // ignore submitFeedback errors
      });

      promise.finally(() => {
        if (controllerRef.current === controller) {
          controllerRef.current = undefined;
        }
      });
    },
    [abort, controllerRef, projectKey, feedbackOptions],
  );

  return { submitFeedback, submitThreadCSAT, abort };
}
