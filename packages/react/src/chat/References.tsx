import type { FileSectionReference } from '@markprompt/core/types';
import { useCallback, useMemo, type ComponentType, type JSX } from 'react';

import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants.js';
import * as Markprompt from '../primitives/headless.js';
import type { ChatLoadingState } from '../types.js';

interface ReferenceProps {
  getHref?: (reference: FileSectionReference) => string | undefined;
  getLabel?: (reference: FileSectionReference) => string | undefined;
  filter?: (reference: FileSectionReference) => boolean;
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

export const Reference = (props: ReferenceProps): JSX.Element => {
  const {
    getHref = DEFAULT_MARKPROMPT_OPTIONS.references.getHref,
    getLabel = DEFAULT_MARKPROMPT_OPTIONS.references.getLabel,
    filter = DEFAULT_MARKPROMPT_OPTIONS.references.filter,
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

  if (filter && !filter(reference)) {
    return <></>;
  }

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
  filter?: (reference: FileSectionReference) => boolean;
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

const References = (props: ReferencesProps): JSX.Element | null => {
  const {
    getHref,
    getLabel,
    filter,
    heading = DEFAULT_MARKPROMPT_OPTIONS.references?.heading,
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
        filter={filter}
        // Backwards compatibility
        transformReferenceId={transformReferenceId}
        linkAs={linkAs}
        {...props}
      />
    ),
    [getHref, getLabel, filter, transformReferenceId, linkAs],
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
