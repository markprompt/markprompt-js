import {
  DEFAULT_MODEL,
  I_DONT_KNOW_MESSAGE,
  MARKPROMPT_COMPLETIONS_URL,
  OpenAIModelId,
  submitPrompt,
} from '@markprompt/core';
import { useState, useEffect } from 'react';

export type MarkpromptOptions = {
  /**
   * The completions endpoint URL to call.
   *
   * @default 'https://api.markprompt.com/v1/completions'
   */
  completionsUrl?: string;

  /**
   * The message to return if Markprompt doesn’t have an answer.
   *
   * @default 'Sorry, I am not sure how to answer that.'
   */
  iDontKnowMessage?: string;

  /**
   * The OpenAPI model to use.
   *
   * @default 'gpt-3.5-turbo'
   */
  model?: OpenAIModelId;

  /**
   * The Markprompt project key.
   */
  projectKey: string;

  /**
   * The user provided prompt.
   */
  prompt: string;
};

export type MarkpromptResponse = {
  /**
   * The answer given by Markprompt.
   */
  answer: string;

  /**
   * The reference links provided by Markprompt.
   */
  references: string[];

  /**
   * Whether or not Markprompt is loading more content.
   */
  loading: boolean;
};

/**
 * A React hook to get the answer to a prompt using Markprompt.
 *
 * The result is streamed from the Markprompt API. When the prompt changes, a
 * new request is dispatched, and the old request is cancelled.
 */
export function useMarkprompt({
  prompt,
  projectKey,
  completionsUrl = MARKPROMPT_COMPLETIONS_URL,
  iDontKnowMessage = I_DONT_KNOW_MESSAGE,
  model = DEFAULT_MODEL,
}: MarkpromptOptions): MarkpromptResponse {
  if (!projectKey) {
    throw new Error(
      'Markprompt: a project key is required. Make sure to pass the projectKey prop to Markprompt.Root.',
    );
  }

  const [answer, setAnswer] = useState('');
  const [references, setReferences] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const { signal } = controller;
    setAnswer('');
    setReferences([]);
    setLoading(true);

    submitPrompt(
      prompt,
      projectKey,
      (chunk) => {
        if (signal.aborted) {
          return;
        }
        setAnswer((prev) => prev + chunk);
        return true;
      },
      setReferences,
      (error) => {
        console.error(error);
      },
      {
        completionsUrl,
        iDontKnowMessage,
        model,
        signal,
      },
    ).then(() => {
      setLoading(false);
    });

    return () => {
      controller.abort();
    };
  }, [completionsUrl, iDontKnowMessage, model, projectKey, prompt]);

  return { answer, references, loading };
}
