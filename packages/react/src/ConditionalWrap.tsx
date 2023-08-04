import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import React, { type ReactNode, type ReactElement } from 'react';

interface ConditionalWrapProps {
  condition?: boolean;
  wrap: (children: ReactNode) => ReactNode;
  children: ReactNode;
}

export const ConditionalWrap = (props: ConditionalWrapProps): ReactElement => {
  const { condition, wrap, children } = props;
  return (condition ? wrap(children) : children) as ReactElement;
};

interface ConditionalVisuallyHiddenProps {
  children: ReactNode;
  hide?: boolean;
}

export const ConditionalVisuallyHidden = (
  props: ConditionalVisuallyHiddenProps,
): ReactElement => {
  const { hide, children } = props;
  return (
    <ConditionalWrap
      condition={hide}
      wrap={(children) => <VisuallyHidden>{children}</VisuallyHidden>}
    >
      {children}
    </ConditionalWrap>
  );
};
