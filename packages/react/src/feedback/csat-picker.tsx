/** eslint-disable @typescript-eslint/no-misused-promises */
/** eslint-disable @typescript-eslint/no-misused-promises */
import { DEFAULT_OPTIONS } from '@markprompt/core/constants';
import type { CSAT } from '@markprompt/core/feedback';
import {
  type ComponentPropsWithoutRef,
  useState,
  useCallback,
  useRef,
  type FormEventHandler,
  type JSX,
} from 'react';

import { useFeedback } from './useFeedback.js';
import { StarIcon } from '../icons.js';
import type { MarkpromptOptions } from '../index.js';
import * as BaseMarkprompt from '../primitives/headless.js';

interface CSATPickerProps extends ComponentPropsWithoutRef<'aside'> {
  apiUrl?: string;
  projectKey: string;
  threadId: string;
  csat?: CSAT;
  feedbackOptions: NonNullable<MarkpromptOptions['feedback']>;
}

function getHeading(csat: CSAT): string | undefined {
  switch (csat) {
    case 1:
      return 'Very unhelpful';
    case 2:
      return 'Unhelpful';
    case 3:
      return 'Somewhat helpful';
    case 4:
      return 'Helpful';
    case 5:
      return 'Very helpful';
  }
  return undefined;
}

export function CSATReasonTextArea({
  onSubmit,
  heading,
  thankYou,
}: {
  onSubmit: (reason: string) => Promise<void>;
  heading: string | undefined;
  thankYou: string | undefined;
}): JSX.Element {
  const formRef = useRef<HTMLFormElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault();
      setIsLoading(true);
      textAreaRef.current?.blur();
      await onSubmit(reason);
      setIsLoading(false);
      setShowThankYou(true);
      setReason('');
    },
    [reason, onSubmit],
  );

  return (
    <BaseMarkprompt.Form
      ref={formRef}
      onSubmit={handleSubmit}
      style={{ width: '100%', paddingTop: '0.5rem' }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '0.25rem',
        }}
      >
        <p
          className="MarkpromptMessageSectionHeading"
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}
        >
          {heading}
        </p>
        {showThankYou && (
          <p
            className="MarkpromptMessageSectionHeading"
            style={{
              flex: 'none',
              marginRight: '0.5rem',
            }}
          >
            {thankYou}
          </p>
        )}
      </div>
      <div className="MarkpromptCSATReasonWrapper">
        <BaseMarkprompt.Prompt
          ref={textAreaRef}
          className="MarkpromptPrompt"
          name="markprompt-csat-reason"
          autoFocus
          labelClassName="MarkpromptPromptLabel"
          textAreaContainerClassName="MarkpromptTextAreaContainer"
          sendButtonClassName="MarkpromptButton"
          buttonLabel={isLoading ? 'Sending…' : 'Send'}
          isLoading={isLoading}
          onChange={(event) => setReason(event.target.value)}
          disabled={isLoading}
          value={reason}
          minRows={2}
          submitOnEnter
          onSubmit={(e) => {
            e.preventDefault();
            formRef.current?.requestSubmit();
          }}
        />
      </div>
    </BaseMarkprompt.Form>
  );
}

export function CSATPicker(props: CSATPickerProps): JSX.Element {
  const { csat = 0, projectKey, apiUrl, threadId, feedbackOptions } = props;
  const [tempValue, setTempValue] = useState<CSAT>(csat);
  const [permanentValue, setPermanentValue] = useState<CSAT>(csat);
  const [isHovering, setIsHovering] = useState(false);

  const { submitThreadCSAT, submitThreadCSATReason } = useFeedback({
    apiUrl: apiUrl || DEFAULT_OPTIONS.apiUrl,
    projectKey,
    feedbackOptions,
  });

  const submitCSAT = useCallback(
    async (value: CSAT) => {
      setTempValue(value);
      setPermanentValue(value);
      await submitThreadCSAT(threadId, value);
    },
    [submitThreadCSAT, threadId],
  );

  const submitCSATReason = useCallback(
    async (reason: string) => {
      await submitThreadCSATReason(threadId, reason);
    },
    [submitThreadCSATReason, threadId],
  );

  return (
    <>
      <p className="MarkpromptMessageSectionHeading">
        {isHovering
          ? getHeading(tempValue) || feedbackOptions.headingCSAT
          : feedbackOptions.headingCSAT}
      </p>
      <div
        onMouseEnter={() => {
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
          setTempValue(permanentValue);
        }}
        style={{ display: 'flex', alignItems: 'center', gap: '0.125rem' }}
      >
        {Array.from(Array(5).keys()).map((_, i) => {
          const isActive = i + 1 <= tempValue;
          return (
            <StarIcon
              onMouseEnter={() => {
                setTempValue((i + 1) as CSAT);
              }}
              onClick={() => {
                void submitCSAT((i + 1) as CSAT);
              }}
              key={`star-${_}`}
              className="MarkpromptMessageCSATStar"
              data-active={isActive}
              aria-label={`Rate ${i + 1}`}
              fill={isActive ? 'var(--markprompt-star-active)' : 'none'}
            />
          );
        })}
      </div>
      {!!(
        feedbackOptions.csatReason &&
        permanentValue &&
        permanentValue > 0
      ) && (
        <CSATReasonTextArea
          onSubmit={submitCSATReason}
          heading={feedbackOptions.headingCSATReason}
          thankYou={feedbackOptions.thankYouCSATReason}
        />
      )}
    </>
  );
}
