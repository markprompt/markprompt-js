import {
  DEFAULT_MODEL,
  I_DONT_KNOW_MESSAGE,
  MARKPROMPT_COMPLETIONS_URL,
  OpenAIModelId,
  submitPrompt,
} from '@markprompt/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Options = {
  projectKey: string;
  completionsUrl?: string;
  iDontKnowMessage?: string;
  model?: OpenAIModelId;
};

export function useMarkprompt({
  projectKey,
  completionsUrl = MARKPROMPT_COMPLETIONS_URL,
  iDontKnowMessage = I_DONT_KNOW_MESSAGE,
  model = DEFAULT_MODEL,
}: Options) {
  if (!projectKey) {
    throw new Error(
      'Markprompt: a project key is required. Make sure to pass the projectKey prop to Markprompt.Root.',
    );
  }

  const [answer, setAnswer] = useState('');
  const [references, setReferences] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState<string>('');

  const controller = useRef(new AbortController());

  //   useEffect(() => {
  //     console.log('aborting');
  //     const c = controller.current;
  //     return () => c.abort();
  //   }, []);

  const handlePromptChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPrompt(event.target.value);
    },
    [],
  );

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault();

      if (!prompt || prompt === '') {
        return;
      }

      setAnswer('');
      setReferences([]);
      setLoading(true);

      await submitPrompt(
        prompt,
        projectKey,
        (chunk) => setAnswer((prev) => prev + chunk),
        (refs) => setReferences(refs),
        (error) => {
          console.error(error);
        },
        {
          completionsUrl: completionsUrl,
          iDontKnowMessage: iDontKnowMessage,
          model: model,
          signal: controller.current.signal,
        },
      );

      setLoading(false);
    },
    [prompt, projectKey, completionsUrl, iDontKnowMessage, model],
  );

  return useMemo(
    () => ({
      answer,
      references,
      loading,
      prompt,
      handlePromptChange,
      handleSubmit,
    }),
    [answer, references, loading, prompt, handlePromptChange, handleSubmit],
  );
}
