export interface SubmitFeedbackBody {
  /**
   * Whether the prompt was helpful or not.
   */
  helpful: boolean;
  /** ID of the prompt for which feedback is being submitted. */
  promptId: string;
}

export interface SubmitFeedbackOptions {
  /**
   * URL to submit feedback to.
   * @default 'https://api.markprompt.com/v1/feedback'
   */
  feedbackUrl?: string;
  signal?: AbortSignal;
}

export const DEFAULT_SUBMIT_FEEDBACK_OPTIONS = {
  feedbackUrl: 'https://api.markprompt.com/v1/feedback',
} satisfies SubmitFeedbackOptions;

export async function submitFeedback(
  projectKey: string,
  body: SubmitFeedbackBody,
  options?: SubmitFeedbackOptions,
): Promise<void> {
  const { feedbackUrl = DEFAULT_SUBMIT_FEEDBACK_OPTIONS.feedbackUrl, signal } =
    options ?? {};

  const params = new URLSearchParams({
    projectKey,
  });

  try {
    const response = await fetch(feedbackUrl + `?${params}`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
      signal,
    });

    if (!response.ok) {
      const error = (await response.json())?.error;
      throw new Error(`Failed to submit feedback: ${error || 'Unknown error'}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      // do nothing on AbortError's, this is expected
      return undefined;
    } else {
      throw error;
    }
  }
}
