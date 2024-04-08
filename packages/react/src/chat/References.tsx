/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FileSectionReference } from '@markprompt/core';
import {
  useCallback,
  useMemo,
  type ReactElement,
  type ComponentType,
} from 'react';

import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants.js';
import type { ChatLoadingState } from '../index.js';
import * as Markprompt from '../primitives/headless.js';

interface ReferenceProps {
  getHref?: (reference: FileSectionReference) => string | undefined;
  getLabel?: (reference: FileSectionReference) => string | undefined;
  reference: FileSectionReference;
  index: number;
  // Backwards compatibility
  transformReferenceId?: (referenceId: string) => {
    href: string;
    text: string;
  };
  onDidSelectReference?: () => void;
  linkAs?: string | ComponentType<any>;
}

export const Reference = (props: ReferenceProps): ReactElement => {
  const {
    getHref = DEFAULT_MARKPROMPT_OPTIONS.references!.getHref!,
    getLabel = DEFAULT_MARKPROMPT_OPTIONS.references!.getLabel,
    index,
    reference,
    transformReferenceId,
    onDidSelectReference,
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

  const LinkComponent = props.linkAs ?? 'a';
  return (
    <li
      key={referenceHrefLabel.href}
      className="MarkpromptReference"
      style={{
        animationDelay: `${100 * index}ms`,
      }}
    >
      <LinkComponent
        href={referenceHrefLabel.href}
        onClick={onDidSelectReference}
      >
        {referenceHrefLabel.label}
      </LinkComponent>
    </li>
  );
};

interface ReferencesProps {
  loadingText?: string;
  heading?: string;
  getHref?: (reference: FileSectionReference) => string | undefined;
  getLabel?: (reference: FileSectionReference) => string | undefined;
  // Backwards compatibility
  transformReferenceId?: (referenceId: string) => {
    href: string;
    text: string;
  };
  onDidSelectReference?: () => void;
  references: FileSectionReference[];
  state: ChatLoadingState;
  linkAs?: string | ComponentType<any>;
}

const References = (props: ReferencesProps): ReactElement | null => {
  const {
    getHref,
    getLabel,
    heading = DEFAULT_MARKPROMPT_OPTIONS.references!.heading,
    transformReferenceId,
    references,
    state,
    linkAs,
  } = props;

  const ReferenceComponent = useCallback(
    (props: { reference: FileSectionReference; index: number }) => (
      <Reference
        getHref={getHref}
        getLabel={getLabel}
        // Backwards compatibility
        transformReferenceId={transformReferenceId}
        linkAs={linkAs}
        {...props}
      />
    ),
    [getHref, getLabel, transformReferenceId, linkAs],
  );

  let adjustedState: ChatLoadingState = state;
  if (state === 'done' && references.length === 0) {
    adjustedState = 'indeterminate';
  }

  return (
    <div
      style={{
        opacity: adjustedState === 'indeterminate' ? 0 : 1,
        transform: `translateY(${
          adjustedState === 'indeterminate' ? '100%' : '0%'
        })`,
      }}
      className="MarkpromptReferences"
      data-loading-state={adjustedState}
      role="status"
    >
      {state !== 'preload' && <p>{heading}</p>}

      {(state === 'streaming-answer' || state === 'done') && (
        <Markprompt.References
          ReferenceComponent={ReferenceComponent}
          references={references}
        />
      )}
    </div>
  );
};

export { References };
