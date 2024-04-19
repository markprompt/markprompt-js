import defaults from 'defaults';

import { DEFAULT_OPTIONS } from './index.js';
import type { PromptFeedback, CSAT, BaseOptions } from './types.js';

export interface SubmitFeedbackBody {
  /** Prompt feedback */
  feedback: PromptFeedback;
  /** ID of the prompt for which feedback is being submitted. */
  promptId: string;
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
  feedback: SubmitFeedbackBody,
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
      `${resolvedOptions.apiUrl}/messages/${feedback.promptId}`,
      {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'X-Markprompt-API-Version': '2023-12-01',
        }),
        body: JSON.stringify({
          projectKey,
          vote: parseInt(feedback.feedback.vote),
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

// export async function submitCSAT(
//   csat: CSAT,
//   projectKey: string,
//   options?: SubmitFeedbackOptions,
// ): Promise<void> {
//   if (!projectKey) {
//     throw new Error('A projectKey is required.');
//   }

//   const allowedOptions = Object.fromEntries(
//     Object.entries(options ?? {}).filter(([key]) =>
//       allowedOptionKeys.includes(key),
//     ),
//   );

//   const { signal, ...cloneableOpts } = allowedOptions ?? {};

//   const params = new URLSearchParams({
//     projectKey,
//   });

//   try {
//     const response = await fetch(`${apiUrl}/threads` + `?${params}`, {
//       method: 'POST',
//       headers: new Headers({
//         'Content-Type': 'application/json',
//         'X-Markprompt-API-Version': '2023-12-01',
//       }),
//       body: JSON.stringify({
//         ...feedback,
//         // /v1/feedback was using promptId. The new /feedback endpoint
//         // now uses messageId. We should eventually migrate everything
//         // to messageId, but now we just copy the promptId parameter
//         // to messageId, so that it works with both endpoints.
//         messageId: feedback.promptId,
//       }),
//       signal: signal,
//     });

//     if (!response.ok) {
//       const error = (await response.json())?.error;
//       throw new Error(`Failed to submit feedback: ${error || 'Unknown error'}`);
//     }

//     return response.json();
//   } catch (error) {
//     if (error instanceof DOMException && error.name === 'AbortError') {
//       // do nothing on AbortError's, this is expected
//       return undefined;
//     } else {
//       throw error;
//     }
//   }
// }
