import defaults from 'defaults';

import { DEFAULT_OPTIONS } from './index.js';
import type { PromptFeedback, BaseOptions } from './types.js';

export type CSAT = 0 | 1 | 2 | 3 | 4 | 5;

export interface SubmitFeedbackBody {
  /** Prompt feedback */
  feedback: PromptFeedback;
  /** ID of the prompt for which feedback is being submitted. */
  messageId: string;
}

export interface SubmitFeedbackOptions {
  /**
   * AbortController signal
   * @default undefined
   **/
  signal?: AbortSignal;
}

const allowedOptionKeys = ['signal', 'apiUrl'];

export const DEFAULT_SUBMIT_FEEDBACK_OPTIONS =
  {} satisfies SubmitFeedbackOptions;

export async function submitFeedback(
  body: SubmitFeedbackBody,
  projectKey: string,
  options: SubmitFeedbackOptions & BaseOptions = {},
): Promise<void> {
  if (!projectKey) {
    throw new Error('A projectKey is required.');
  }

  const allowedOptions: SubmitFeedbackOptions & BaseOptions =
    Object.fromEntries(
      Object.entries(options ?? {}).filter(([key]) =>
        allowedOptionKeys.includes(key),
      ),
    );

  const { signal, ...cloneableOpts } = allowedOptions ?? {};

  const resolvedOptions = defaults(cloneableOpts, {
    ...DEFAULT_OPTIONS,
    ...DEFAULT_SUBMIT_FEEDBACK_OPTIONS,
  });

  try {
    const response = await fetch(
      `${resolvedOptions.apiUrl}/messages/${body.messageId}`,
      {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'X-Markprompt-API-Version': '2024-05-21',
        }),
        body: JSON.stringify({
          projectKey,
          vote: parseInt(body.feedback.vote),
        }),
        signal: signal,
      },
    );

    if (!response.ok) {
      const error = (await response.json())?.error;
      throw new Error(`Failed to submit feedback: ${error || 'Unknown error'}`);
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      // do nothing on AbortError's, this is expected
      return undefined;
    } else {
      throw error;
    }
  }
}

export interface SubmitCSATBody {
  /** Thread id */
  threadId: string;
  /** CSAT. */
  csat: CSAT;
}

export async function submitCSAT(
  body: SubmitCSATBody,
  projectKey: string,
  options: SubmitFeedbackOptions & BaseOptions = {},
): Promise<void> {
  if (!projectKey) {
    throw new Error('A projectKey is required.');
  }

  const allowedOptions: SubmitFeedbackOptions & BaseOptions =
    Object.fromEntries(
      Object.entries(options ?? {}).filter(([key]) =>
        allowedOptionKeys.includes(key),
      ),
    );

  const { signal, ...cloneableOpts } = allowedOptions ?? {};

  const resolvedOptions = defaults(cloneableOpts, {
    ...DEFAULT_OPTIONS,
    ...DEFAULT_SUBMIT_FEEDBACK_OPTIONS,
  });

  try {
    const response = await fetch(
      `${resolvedOptions.apiUrl}/threads/${body.threadId}`,
      {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'X-Markprompt-API-Version': '2024-05-21',
        }),
        body: JSON.stringify({ projectKey, csat: body.csat }),
        signal: signal,
      },
    );

    if (!response.ok) {
      const error = (await response.json())?.error;
      throw new Error(`Failed to submit feedback: ${error || 'Unknown error'}`);
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      // do nothing on AbortError's, this is expected
      return undefined;
    } else {
      throw error;
    }
  }
}
