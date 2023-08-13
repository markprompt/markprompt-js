import type { FileSectionReference, PromptFeedback } from '@markprompt/core';
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import React, {
  useCallback,
  type FormEventHandler,
  type ReactElement,
  type ChangeEventHandler,
  useEffect,
} from 'react';

import { Answer } from './Answer.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import { Feedback } from './Feedback.js';
import { SparklesIcon } from './icons.js';
import * as BaseMarkprompt from './primitives/headless.js';
import { References } from './References.js';
import { type MarkpromptOptions } from './types.js';
import { usePrompt, type PromptLoadingState } from './usePrompt.js';
import type { View } from './useViews.js';

export interface PromptViewProps {
  activeView?: View;
  projectKey: string;
  promptOptions: MarkpromptOptions['prompt'];
  feedbackOptions?: MarkpromptOptions['feedback'];
  referencesOptions: MarkpromptOptions['references'];
  close?: MarkpromptOptions['close'];
  onDidSelectReference?: () => void;
  debug?: boolean;
}

export function PromptView(props: PromptViewProps): ReactElement {
  const {
    activeView,
    promptOptions,
    referencesOptions,
    feedbackOptions,
    close,
    onDidSelectReference,
    debug,
    projectKey,
  } = props;

  const {
    abort,
    answer,
    submitPrompt,
    setPrompt,
    prompt,
    state,
    references,
    submitFeedback,
    abortFeedbackRequest,
  } = usePrompt({
    projectKey,
    promptOptions,
    feedbackOptions,
    debug,
  });

  useEffect(() => {
    if (activeView && activeView !== 'prompt') abort();
    return () => abort();
  }, [activeView, abort]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setPrompt(event.target.value);
    },
    [setPrompt],
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault();
      submitPrompt();
    },
    [submitPrompt],
  );

  return (
    <div className="MarkpromptPromptView">
      <BaseMarkprompt.Form className="MarkpromptForm" onSubmit={handleSubmit}>
        <BaseMarkprompt.Prompt
          className="MarkpromptPrompt"
          name="markprompt-prompt"
          onChange={handleChange}
          value={prompt}
          type="text"
          placeholder={
            promptOptions?.placeholder ??
            DEFAULT_MARKPROMPT_OPTIONS.prompt!.placeholder!
          }
          labelClassName="MarkpromptPromptLabel"
          label={
            <AccessibleIcon.Root
              label={
                promptOptions?.label ??
                DEFAULT_MARKPROMPT_OPTIONS.prompt!.label!
              }
            >
              <SparklesIcon className="MarkpromptSearchIcon" />
            </AccessibleIcon.Root>
          }
        />
        {close && close.visible !== false && (
          <BaseMarkprompt.Close className="MarkpromptClose">
            <AccessibleIcon.Root
              label={close?.label ?? DEFAULT_MARKPROMPT_OPTIONS.close!.label!}
            >
              <kbd>Esc</kbd>
            </AccessibleIcon.Root>
          </BaseMarkprompt.Close>
        )}
      </BaseMarkprompt.Form>

      <AnswerContainer
        answer={answer}
        feedbackOptions={feedbackOptions}
        onDidSelectReference={onDidSelectReference}
        references={references}
        referencesOptions={referencesOptions}
        state={state}
        submitFeedback={submitFeedback}
        abortFeedbackRequest={abortFeedbackRequest}
      />
    </div>
  );
}

interface AnswerContainerProps {
  answer: string;
  feedbackOptions?: MarkpromptOptions['feedback'];
  onDidSelectReference?: () => void;
  references: FileSectionReference[];
  referencesOptions: MarkpromptOptions['references'];
  state: PromptLoadingState;
  submitFeedback: (feedback: PromptFeedback) => void;
  abortFeedbackRequest: () => void;
}

function AnswerContainer(props: AnswerContainerProps): ReactElement {
  const {
    answer,
    feedbackOptions,
    referencesOptions,
    references,
    onDidSelectReference,
    state,
    submitFeedback,
    abortFeedbackRequest,
  } = props;

  return (
    <div className="MarkpromptAnswerContainer" data-loading-state={state}>
      <BaseMarkprompt.AutoScroller
        className="MarkpromptAutoScroller"
        scrollTrigger={answer}
      >
        <Answer answer={answer} state={state} />
        {feedbackOptions?.enabled && state === 'done' && (
          <Feedback
            className="MarkpromptPromptFeedback"
            submitFeedback={submitFeedback}
            abortFeedbackRequest={abortFeedbackRequest}
          />
        )}
      </BaseMarkprompt.AutoScroller>

      <References
        getHref={referencesOptions?.getHref}
        getLabel={referencesOptions?.getLabel}
        loadingText={referencesOptions?.loadingText}
        onDidSelectReference={onDidSelectReference}
        references={references}
        state={state}
        transformReferenceId={referencesOptions?.transformReferenceId}
      />
    </div>
  );
}
