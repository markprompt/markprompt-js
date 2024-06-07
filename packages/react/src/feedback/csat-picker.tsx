import { DEFAULT_OPTIONS } from '@markprompt/core';
import {
  type ReactElement,
  type ComponentPropsWithoutRef,
  useState,
  useCallback,
} from 'react';

import { useFeedback } from './useFeedback.js';
import type { CSAT } from '../../../core/src/types.js';
import { StarIcon } from '../icons.js';
import type { MarkpromptOptions } from '../index.js';
import { useGlobalStore } from '../store.js';

interface CSATPickerProps extends ComponentPropsWithoutRef<'aside'> {
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

export function CSATPicker(props: CSATPickerProps): ReactElement {
  const { csat = 0, projectKey, threadId, feedbackOptions } = props;
  const [tempValue, setTempValue] = useState<CSAT>(csat);
  const [permanentValue, setPermanentValue] = useState<CSAT>(csat);
  const [isHovering, setIsHovering] = useState(false);

  const apiUrl = useGlobalStore((state) => state.options.apiUrl);

  const { submitThreadCSAT } = useFeedback({
    apiUrl: apiUrl || DEFAULT_OPTIONS.apiUrl,
    projectKey,
    feedbackOptions,
  });

  const submitCSAT = useCallback(
    (value: CSAT) => {
      setTempValue(value);
      setPermanentValue(value);
      submitThreadCSAT(threadId, value);
    },
    [submitThreadCSAT, threadId],
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
                submitCSAT((i + 1) as CSAT);
              }}
              key={`star-${i}`}
              className="MarkpromptMessageCSATStar"
              data-active={isActive}
              fill={isActive ? 'var(--markprompt-star-active)' : 'none'}
            />
          );
        })}
      </div>
    </>
  );
}
