import type { FileSectionReference } from '@markprompt/core';
import { animated, useSpring } from '@react-spring/web';
import React, { useCallback, useMemo, type ReactElement } from 'react';

import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import * as Markprompt from './index.js';
import { useMarkpromptContext } from './index.js';
import { useElementSize } from './useElementSize.js';

type ReferenceProps = {
  getHref?: (reference: FileSectionReference) => string;
  getLabel?: (reference: FileSectionReference) => string;
  reference: FileSectionReference;
  index: number;
  // Backwards compatibility
  transformReferenceId?: (referenceId: string) => {
    href: string;
    text: string;
  };
};

const Reference = (props: ReferenceProps): ReactElement => {
  const {
    getHref = DEFAULT_MARKPROMPT_OPTIONS.references!.getHref!,
    getLabel = DEFAULT_MARKPROMPT_OPTIONS.references!.getLabel,
    index,
    reference,
    transformReferenceId,
  } = props;

  const referenceHrefLabel = useMemo(() => {
    // Backwards compatibility
    if (transformReferenceId) {
      const t = transformReferenceId(reference.file.path);
      return { href: t.href, label: t.text };
    }
    return {
      href: getHref?.(reference),
      label: getLabel?.(reference),
    };
  }, [transformReferenceId, getHref, reference, getLabel]);

  return (
    <li
      key={referenceHrefLabel.href}
      className="MarkpromptReference"
      style={{
        animationDelay: `${100 * index}ms`,
      }}
    >
      <a href={referenceHrefLabel.href}>{referenceHrefLabel.label}</a>
    </li>
  );
};

type ReferencesProps = {
  loadingText?: string;
  heading?: string;
  getHref?: (reference: FileSectionReference) => string;
  getLabel?: (reference: FileSectionReference) => string;
  // Backwards compatibility
  transformReferenceId?: (referenceId: string) => {
    href: string;
    text: string;
  };
};

const References = (props: ReferencesProps): ReactElement | null => {
  const {
    loadingText = DEFAULT_MARKPROMPT_OPTIONS.references!.loadingText!,
    heading = DEFAULT_MARKPROMPT_OPTIONS.references!.heading,
    getHref,
    getLabel,
    transformReferenceId,
  } = props;
  const { references, state } = useMarkpromptContext();
  const [ref, { height }] = useElementSize<HTMLDivElement>();

  const ReferenceComponent = useCallback(
    (props: { reference: FileSectionReference; index: number }) => (
      <Reference
        getHref={getHref}
        getLabel={getLabel}
        // Backwards compatibility
        transformReferenceId={transformReferenceId}
        {...props}
      />
    ),
    [transformReferenceId, getHref, getLabel],
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
