import {
  DEFAULT_MODEL,
  I_DONT_KNOW_MESSAGE,
  MARKPROMPT_COMPLETIONS_URL,
  OpenAIModelId,
  submitPrompt,
} from '@markprompt/core';
import { useState, useEffect } from 'react';

export type MarkpromptOptions = {
  prompt: string;
  projectKey: string;
  completionsUrl?: string;
  iDontKnowMessage?: string;
  model?: OpenAIModelId;
};

export type MarkpromptResponse = {
  answer: string;
  references: string[];
  loading: boolean;
};

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
