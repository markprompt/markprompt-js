import defaults from 'defaults';

import { DEFAULT_OPTIONS } from './constants.js';
import type { BaseOptions } from './types.js';

export interface PromptFeedback {
  vote: '1' | '-1';
}

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

const allowedOptionKeys = ['signal', 'apiUrl', 'headers'];

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
  }) as SubmitFeedbackOptions & BaseOptions;

  try {
    const response = await fetch(
      `${resolvedOptions.apiUrl}/messages/${body.messageId}`,
      {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'X-Markprompt-API-Version': '2024-05-21',
          ...(resolvedOptions.headers ? resolvedOptions.headers : {}),
        }),
        body: JSON.stringify({
          projectKey,
          vote: Number.parseInt(body.feedback.vote),
        }),
        signal: signal,
      },
    );

    if (!response.ok) {
      const json: unknown = await response.json();
      if (
        json &&
        typeof json === 'object' &&
        'error' in json &&
        typeof json.error === 'string'
      ) {
        throw new Error(`Failed to submit feedback: ${json.error}`, {
          cause: json,
        });
      }

      throw new Error(`Failed to submit feedback: 'Unknown error'`, {
        cause: json,
      });
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      // do nothing on AbortError's, this is expected
      return undefined;
    }
    throw error;
  }
}

export type CSAT = 0 | 1 | 2 | 3 | 4 | 5;

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
  }) as SubmitFeedbackOptions & BaseOptions;

  try {
    const response = await fetch(
      `${resolvedOptions.apiUrl}/threads/${body.threadId}`,
      {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'X-Markprompt-API-Version': '2024-05-21',
          ...(resolvedOptions.headers ? resolvedOptions.headers : {}),
        }),
        body: JSON.stringify({ projectKey, csat: body.csat }),
        signal: signal,
      },
    );

    if (!response.ok) {
      const json: unknown = await response.json();
      if (
        json &&
        typeof json === 'object' &&
        'error' in json &&
        typeof json.error === 'string'
      ) {
        throw new Error(`Failed to submit feedback: ${json.error}`, {
          cause: json,
        });
      }

      throw new Error(`Failed to submit feedback: 'Unknown error'`, {
        cause: json,
      });
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      // do nothing on AbortError's, this is expected
      return undefined;
    }
    throw error;
  }
}

export interface SubmitCSATReasonBody {
  /** Thread id */
  threadId: string;
  /** CSAT reason. */
  reason: string;
}

export async function submitCSATReason(
  body: SubmitCSATReasonBody,
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
  }) as SubmitFeedbackOptions & BaseOptions;

  try {
    const response = await fetch(
      `${resolvedOptions.apiUrl}/threads/${body.threadId}`,
      {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'X-Markprompt-API-Version': '2024-05-21',
          ...(resolvedOptions.headers ? resolvedOptions.headers : {}),
        }),
        body: JSON.stringify({ projectKey, csatReason: body.reason }),
        signal: signal,
      },
    );

    if (!response.ok) {
      const json: unknown = await response.json();
      if (
        json &&
        typeof json === 'object' &&
        'error' in json &&
        typeof json.error === 'string'
      ) {
        throw new Error(`Failed to submit feedback: ${json.error}`, {
          cause: json,
        });
      }

      throw new Error(`Failed to submit feedback: 'Unknown error'`, {
        cause: json,
      });
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      // do nothing on AbortError's, this is expected
      return undefined;
    }
    throw error;
  }
}
