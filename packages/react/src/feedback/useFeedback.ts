import {
  submitFeedback as submitFeedbackCore,
  submitCSAT as submitCSATCore,
  submitCSATReason as submitCSATReasonCore,
  type SubmitFeedbackOptions,
  type CSAT,
  type PromptFeedback,
} from '@markprompt/core/feedback';
import { useCallback } from 'react';

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
  /** Submit CSAT reason for a thread */
  submitThreadCSATReason: (threadId: string, reason: string) => void;
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

      try {
        await submitFeedbackCore({ feedback, messageId }, projectKey, {
          ...feedbackOptions,
          signal: controller.signal,
          apiUrl,
        });
      } catch {
        // ignore submitFeedback errors
      } finally {
        if (controllerRef.current === controller) {
          controllerRef.current = undefined;
        }
      }
    },
    [abort, controllerRef, projectKey, feedbackOptions, apiUrl],
  );

  const submitThreadCSAT = useCallback(
    async (threadId: string, csat: CSAT) => {
      abort();

      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        await submitCSATCore({ threadId, csat }, projectKey, {
          ...feedbackOptions,
          apiUrl,
          signal: controller.signal,
        });
      } catch {
        // ignore submitFeedback errors
      } finally {
        if (controllerRef.current === controller) {
          controllerRef.current = undefined;
        }
      }
    },
    [abort, controllerRef, projectKey, feedbackOptions, apiUrl],
  );

  const submitThreadCSATReason = useCallback(
    async (threadId: string, reason: string) => {
      abort();

      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        await submitCSATReasonCore({ threadId, reason }, projectKey, {
          ...feedbackOptions,
          apiUrl,
          signal: controller.signal,
        });
      } catch {
        // ignore submitFeedback errors
      } finally {
        if (controllerRef.current === controller) {
          controllerRef.current = undefined;
        }
      }
    },
    [abort, controllerRef, projectKey, feedbackOptions, apiUrl],
  );

  return { submitFeedback, submitThreadCSAT, submitThreadCSATReason, abort };
}
