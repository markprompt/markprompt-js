import * as Markprompt from '@markprompt/react';
import React, { useCallback, useContext, useMemo } from 'react';

const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const removeFileExtension = (fileName: string) => {
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

const defaultTransformReferenceId = (referenceId: string) => ({
  href: removeFileExtension(referenceId),
  text: capitalize(removeFileExtension(referenceId.split('/').slice(-1)[0])),
});

const Reference = (props: ReferenceProps) => {
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

const References = (props: ReferencesProps) => {
  const {
    loadingText = 'Fetching relevant pages…',
    referencesText = 'Answer generated from the following sources:',
    transformReferenceId,
  } = props;
  const { state, references } = useContext(Markprompt.Context);

  const ReferenceComponent = useCallback(
    (props: { referenceId: string; index: number }) => (
      <Reference transformReferenceId={transformReferenceId} {...props} />
    ),
    [transformReferenceId],
  );

  if (state === 'indeterminate') return null;

  let adjustedState: string = state;
  if (state === 'done' && references.length === 0) {
    adjustedState = 'indeterminate';
  }

  return (
    <div data-loading-state={adjustedState} className="MarkpromptReferences">
      <div className="MarkpromptProgress" />
      <p>{loadingText}</p>
      <p>{referencesText}</p>
      <Markprompt.References ReferenceComponent={ReferenceComponent} />
    </div>
  );
};

export { References };
