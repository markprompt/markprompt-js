import { animated, useSpring } from '@react-spring/web';
import React, { useCallback, useMemo, type ReactElement } from 'react';

import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import { useMarkpromptContext } from './index.js';
import * as Markprompt from './index.js';
import { useElementSize } from './useElementSize.js';

type ReferenceProps = {
  transformReferenceId?: (referenceId: string) => {
    href: string;
    text: string;
  };
  referenceId: string;
  index: number;
};

const Reference = (props: ReferenceProps): ReactElement => {
  const {
    transformReferenceId = DEFAULT_MARKPROMPT_OPTIONS.references!
      .transformReferenceId!,
    index,
    referenceId,
  } = props;

  const reference = useMemo(
    () => transformReferenceId(referenceId),
    [referenceId, transformReferenceId],
  );

  return (
    <li
      key={referenceId}
      className="MarkpromptReference"
      style={{
        animationDelay: `${100 * index}ms`,
      }}
    >
      <a href={reference.href}>{reference.text}</a>
    </li>
  );
};

type ReferencesProps = {
  loadingText?: string;
  heading?: string;
  transformReferenceId?: (referenceId: string) => {
    href: string;
    text: string;
  };
};

const References = (props: ReferencesProps): ReactElement | null => {
  const {
    loadingText = DEFAULT_MARKPROMPT_OPTIONS.references!.loadingText!,
    heading = DEFAULT_MARKPROMPT_OPTIONS.references!.heading,
    transformReferenceId,
  } = props;
  const { state, references } = useMarkpromptContext();
  const [ref, { height }] = useElementSize<HTMLDivElement>();

  const ReferenceComponent = useCallback(
    (props: { referenceId: string; index: number }) => (
      <Reference transformReferenceId={transformReferenceId} {...props} />
    ),
    [transformReferenceId],
  );

  let adjustedState: string = state;
  if (state === 'done' && references.length === 0) {
    adjustedState = 'indeterminate';
  }

  const [style] = useSpring(
    () => ({
      height: adjustedState === 'indeterminate' ? 0 : height,
      opacity: adjustedState === 'indeterminate' ? 0 : 1,
      y: adjustedState === 'indeterminate' ? '100%' : '0%',
    }),
    [adjustedState, height],
  );

  return (
    <animated.div style={style}>
      <div
        ref={ref}
        className="MarkpromptReferences"
        data-loading-state={adjustedState}
        role="status"
      >
        {state === 'preload' && (
          <>
            <div
              className="MarkpromptProgress"
              id="markprompt-progressbar"
              role="progressbar"
              aria-labelledby="markprompt-loading-text"
            />
            <p id="markprompt-loading-text">{loadingText}</p>
          </>
        )}

        {state !== 'preload' && <p>{heading}</p>}

        {(state === 'streaming-answer' || state === 'done') && (
          <Markprompt.References ReferenceComponent={ReferenceComponent} />
        )}
      </div>
    </animated.div>
  );
};

export { References };
