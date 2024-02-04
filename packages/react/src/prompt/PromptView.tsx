import type { FileSectionReference } from '@markprompt/core';
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import {
  useCallback,
  useEffect,
  useRef,
  type ChangeEventHandler,
  type FormEventHandler,
  type ReactElement,
} from 'react';

import { Answer } from './Answer.js';
import { DefaultView } from './DefaultView.js';
import { References } from './References.js';
import { usePrompt, type PromptLoadingState } from './usePrompt.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants.js';
import { Feedback } from '../feedback/Feedback.js';
import type { UseFeedbackResult } from '../feedback/useFeedback.js';
import { SparklesIcon } from '../icons.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import { type MarkpromptOptions, type View } from '../types.js';
import { useDefaults } from '../useDefaults.js';

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

  // we are also merging defaults in the Markprompt component, but this makes
  // sure that standalone PromptView components also have defaults as expected.
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
    error,
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
      inputRef?.current?.blur();
      event.preventDefault();
      submitPrompt();
    },
    [submitPrompt],
  );

  return (
    <div className="MarkpromptPromptView">
      <BaseMarkprompt.Form className="MarkpromptForm" onSubmit={handleSubmit}>
        <div className="MarkpromptPromptWrapper">
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
        </div>
      </BaseMarkprompt.Form>

      <AnswerContainer
        abortFeedbackRequest={abortFeedbackRequest}
        answer={answer}
        error={error}
        feedbackOptions={feedbackOptions}
        onDidSelectReference={onDidSelectReference}
        promptId={promptId}
        references={references}
        referencesOptions={referencesOptions}
        promptOptions={promptOptions}
        state={state}
        submitFeedback={(feedback, promptId) => {
          submitFeedback(feedback, promptId);
          feedbackOptions.onFeedbackSubmit?.(
            feedback,
            [
              {
                content: answer,
                id: promptId! as ReturnType<typeof self.crypto.randomUUID>,
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
  error?: Error;
  feedbackOptions?: MarkpromptOptions['feedback'];
  onDidSelectDefaultViewPrompt?: (prompt: string) => void;
  onDidSelectReference?: () => void;
  promptId?: string;
  promptOptions: NonNullable<MarkpromptOptions['prompt']>;
  references: FileSectionReference[];
  referencesOptions: MarkpromptOptions['references'];
  state: PromptLoadingState;
  submitFeedback: UseFeedbackResult['submitFeedback'];
}

function AnswerContainer(props: AnswerContainerProps): ReactElement {
  const {
    abortFeedbackRequest,
    answer,
    error,
    feedbackOptions,
    onDidSelectDefaultViewPrompt,
    onDidSelectReference,
    promptId,
    promptOptions,
    references,
    referencesOptions,
    state,
    submitFeedback,
  } = props;

  const { defaultView, errorText } = promptOptions;

  if (error) {
    const ErrorText = errorText!;

    return (
      <div
        className="MarkpromptError"
        style={{
          backgroundColor: 'var(--markprompt-muted)',
          color: 'var(--markprompt-mutedForeground)',
        }}
      >
        {ErrorText && <ErrorText error={error} />}
      </div>
    );
  }

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
