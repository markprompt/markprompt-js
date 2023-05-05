import {
  DEFAULT_MODEL,
  DEFAULT_I_DONT_KNOW_MESSAGE,
  MARKPROMPT_COMPLETIONS_URL,
  submitPrompt,
  DEFAULT_LOADING_HEADING,
  DEFAULT_REFERENCES_HEADING,
  DEFAULT_PROMPT_TEMPLATE,
  DEFAULT_TOP_P,
  DEFAULT_TEMPERATURE,
  DEFAULT_FREQUENCY_PENALTY,
  DEFAULT_PRESENCE_PENALTY,
  DEFAULT_MAX_TOKENS,
} from '@markprompt/core';
import type { Options } from '@markprompt/core';
import { useCallback, useMemo, useRef, useState } from 'react';

export function useMarkprompt({
  projectKey,
  completionsUrl = MARKPROMPT_COMPLETIONS_URL,
  iDontKnowMessage = DEFAULT_I_DONT_KNOW_MESSAGE,
  referencesHeading = DEFAULT_REFERENCES_HEADING,
  loadingHeading = DEFAULT_LOADING_HEADING,
  includeBranding = true,
  model = DEFAULT_MODEL,
  promptTemplate = DEFAULT_PROMPT_TEMPLATE,
  temperature = DEFAULT_TEMPERATURE,
  topP = DEFAULT_TOP_P,
  frequencyPenalty = DEFAULT_FREQUENCY_PENALTY,
  presencePenalty = DEFAULT_PRESENCE_PENALTY,
  maxTokens = DEFAULT_MAX_TOKENS,
}: { projectKey: string } & Options) {
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
        (chunk) => {
          setAnswer((prev) => prev + chunk);
          return true;
        },
        (refs) => setReferences(refs),
        (error) => {
          console.error(error);
        },
        {
          completionsUrl,
          iDontKnowMessage,
          referencesHeading,
          loadingHeading,
          includeBranding,
          model,
          promptTemplate,
          temperature,
          topP,
          frequencyPenalty,
          presencePenalty,
          maxTokens,
          signal: controller.current.signal,
        },
      );

      setLoading(false);
    },
    [
      prompt,
      projectKey,
      completionsUrl,
      iDontKnowMessage,
      referencesHeading,
      loadingHeading,
      includeBranding,
      model,
      promptTemplate,
      temperature,
      topP,
      frequencyPenalty,
      presencePenalty,
      maxTokens,
    ],
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
