import { animated, useSpring } from '@react-spring/web';
import React, { useCallback, useMemo, type ReactElement } from 'react';

import { useMarkpromptContext } from './index.js';
import * as Markprompt from './index.js';
import { useElementSize } from './useElementSize.js';

const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const removeFileExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return fileName;
  }
  return fileName.substring(0, lastDotIndex);
};

type ReferenceProps = {
  transformReferenceId?: (referenceId: string) => {
    href: string;
    text: string;
  };
  referenceId: string;
  index: number;
};

const defaultTransformReferenceId: ReferenceProps['transformReferenceId'] = (
  referenceId,
) => ({
  href: removeFileExtension(referenceId),
  text: capitalize(removeFileExtension(referenceId.split('/').slice(-1)[0])),
});

const Reference = (props: ReferenceProps): ReactElement => {
  const {
    transformReferenceId = defaultTransformReferenceId,
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
  referencesText?: string;
  transformReferenceId?: (referenceId: string) => {
    href: string;
    text: string;
  };
};

const References = (props: ReferencesProps): ReactElement | null => {
  const {
    loadingText = 'Fetching relevant pages…',
    referencesText = 'Answer generated from the following sources:',
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

        {state !== 'preload' && <p>{referencesText}</p>}

        {(state === 'streaming-answer' || state === 'done') && (
          <Markprompt.References ReferenceComponent={ReferenceComponent} />
        )}
      </div>
    </animated.div>
  );
};

export { References };