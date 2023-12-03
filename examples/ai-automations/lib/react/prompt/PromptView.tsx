import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import React, {
  useCallback,
  useEffect,
  useRef,
  type ChangeEventHandler,
  type FormEventHandler,
  type ReactElement,
} from 'react';

import type { FileSectionReference } from '@/lib/core';

import { Answer } from './Answer';
import { References } from './References';
import { usePrompt, type PromptLoadingState } from './usePrompt';
import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants';
import { Feedback } from '../feedback/Feedback';
import type { UseFeedbackResult } from '../feedback/useFeedback';
import { SparklesIcon } from '../icons';
import * as BaseMarkprompt from '../primitives/headless';
import { type MarkpromptOptions } from '../types';
import { useDefaults } from '../useDefaults';
import type { View } from '../useViews';

export interface PromptViewProps {
  activeView?: View;
  projectKey: string;
  promptOptions: MarkpromptOptions['prompt'];
  feedbackOptions?: MarkpromptOptions['feedback'];
  referencesOptions: MarkpromptOptions['references'];
  onDidSelectReference?: () => void;
  debug?: boolean;
}

export function PromptView(props: PromptViewProps): ReactElement {
  const { activeView, onDidSelectReference, debug, projectKey } = props;

  // we are also merging defaults in the Markprompt component, but this makes sure
  // that standalone PromptView components also have defaults as expected.
  const promptOptions = useDefaults(
    { ...props.promptOptions },
    DEFAULT_MARKPROMPT_OPTIONS.prompt,
  );

  const feedbackOptions = useDefaults(
    { ...props.feedbackOptions },
    DEFAULT_MARKPROMPT_OPTIONS.feedback,
  );

  const referencesOptions = useDefaults(
    { ...props.referencesOptions },
    DEFAULT_MARKPROMPT_OPTIONS.references,
  );

  const {
    abort,
    answer,
    submitPrompt,
    setPrompt,
    prompt,
    promptId,
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

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (activeView && activeView !== 'prompt') abort();
    return () => abort();
  }, [activeView, abort]);

  useEffect(() => {
    // Bring form input in focus when activeView changes.
    inputRef.current?.focus();
  }, [activeView]);

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
          ref={inputRef}
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
      </BaseMarkprompt.Form>

      <AnswerContainer
        abortFeedbackRequest={abortFeedbackRequest}
        answer={answer}
        feedbackOptions={feedbackOptions}
        onDidSelectReference={onDidSelectReference}
        promptId={promptId}
        references={references}
        referencesOptions={referencesOptions}
        state={state}
        submitFeedback={(feedback, promptId) => {
          submitFeedback(feedback, promptId);

          // feedbackOptions.onFeedbackSubmit?.(
          //   feedback,
          //   [
          //     {
          //       answer,
          //       id: promptId!,
          //       prompt,
          //       promptId,
          //       references,
          //       state,
          //     },
          //   ],
          //   promptId,
          // );
        }}
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
  submitFeedback: UseFeedbackResult['submitFeedback'];
  abortFeedbackRequest: UseFeedbackResult['abort'];
  promptId?: string;
}

function AnswerContainer(props: AnswerContainerProps): ReactElement {
  const {
    abortFeedbackRequest,
    answer,
    feedbackOptions,
    onDidSelectReference,
    promptId,
    references,
    referencesOptions,
    state,
    submitFeedback,
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
            variant="text"
            className="MarkpromptPromptFeedback"
            submitFeedback={submitFeedback}
            abortFeedbackRequest={abortFeedbackRequest}
            promptId={promptId}
            heading={feedbackOptions.heading}
          />
        )}
      </BaseMarkprompt.AutoScroller>

      <References
        getHref={referencesOptions?.getHref}
        getLabel={referencesOptions?.getLabel}
        loadingText={referencesOptions?.loadingText}
        heading={referencesOptions?.heading}
        onDidSelectReference={onDidSelectReference}
        references={references}
        state={state}
        transformReferenceId={referencesOptions?.transformReferenceId}
      />
    </div>
  );
}
