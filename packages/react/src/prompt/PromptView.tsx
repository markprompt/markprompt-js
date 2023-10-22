import type { FileSectionReference } from '@markprompt/core';
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import React, {
  useCallback,
  useEffect,
  useRef,
  type ReactElement,
  useState,
  type FormEvent,
} from 'react';

import { Answer } from './Answer.js';
import { DefaultView } from './DefaultView.js';
import { References } from './References.js';
import { usePrompt } from './usePrompt.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants.js';
import { Feedback } from '../feedback/Feedback.js';
import type { UseFeedbackResult } from '../feedback/useFeedback.js';
import { SparklesIcon } from '../icons.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import { type LoadingState, type MarkpromptOptions } from '../types.js';
import { useDefaults } from '../useDefaults.js';
import type { View } from '../useViews.js';

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

  const [prompt, setPrompt] = useState('');

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

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const prompt = data.get('markprompt-prompt');
      if (typeof prompt !== 'string') return;
      submitPrompt(prompt);
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
          type="text"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
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
        defaultView={promptOptions.defaultView}
        state={state}
        submitFeedback={(feedback, promptId) => {
          submitFeedback(feedback, promptId);
          feedbackOptions.onFeedbackSubmit?.(
            feedback,
            [
              {
                content: answer,
                id: promptId!,
                promptId,
                references,
                state,
              },
            ],
            promptId,
          );
        }}
        onDidSelectDefaultViewPrompt={(prompt: string) => {
          setPrompt(prompt);
          submitPrompt(prompt);
        }}
      />
    </div>
  );
}

interface AnswerContainerProps {
  abortFeedbackRequest: UseFeedbackResult['abort'];
  answer: string;
  defaultView: NonNullable<MarkpromptOptions['prompt']>['defaultView'];
  feedbackOptions?: MarkpromptOptions['feedback'];
  onDidSelectDefaultViewPrompt?: (prompt: string) => void;
  onDidSelectReference?: () => void;
  promptId?: string;
  references: FileSectionReference[];
  referencesOptions: MarkpromptOptions['references'];
  state: LoadingState;
  submitFeedback: UseFeedbackResult['submitFeedback'];
}

function AnswerContainer(props: AnswerContainerProps): ReactElement {
  const {
    abortFeedbackRequest,
    answer,
    defaultView,
    feedbackOptions,
    onDidSelectDefaultViewPrompt,
    onDidSelectReference,
    promptId,
    references,
    referencesOptions,
    state,
    submitFeedback,
  } = props;

  if ((!answer || answer.length === 0) && state === 'indeterminate') {
    return (
      <DefaultView
        message={defaultView?.message}
        prompts={defaultView?.prompts}
        promptsHeading={defaultView?.promptsHeading}
        onDidSelectPrompt={(prompt: string) =>
          onDidSelectDefaultViewPrompt?.(prompt)
        }
      />
    );
  }

  return (
    <div className="MarkpromptAnswerContainer" data-loading-state={state}>
      <BaseMarkprompt.AutoScroller
        className="MarkpromptAutoScroller"
        scrollTrigger={answer}
      >
        <Answer answer={answer} state={state} />
        {feedbackOptions?.enabled && state === 'done' && (
          <Feedback
            abortFeedbackRequest={abortFeedbackRequest}
            className="MarkpromptPromptFeedback"
            heading={feedbackOptions.heading}
            promptId={promptId}
            submitFeedback={submitFeedback}
            variant="text"
          />
        )}
      </BaseMarkprompt.AutoScroller>

      <References
        getHref={referencesOptions?.getHref}
        getLabel={referencesOptions?.getLabel}
        heading={referencesOptions?.heading}
        loadingText={referencesOptions?.loadingText}
        onDidSelectReference={onDidSelectReference}
        references={references}
        state={state}
        transformReferenceId={referencesOptions?.transformReferenceId}
      />
    </div>
  );
}
