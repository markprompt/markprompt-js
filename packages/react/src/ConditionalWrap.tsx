import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import React, { type ReactNode, type ReactElement } from 'react';

type ConditionalWrapProps = {
  condition?: boolean;
  wrap: (children: ReactNode) => ReactNode;
  children: ReactNode;
};

export const ConditionalWrap = (props: ConditionalWrapProps) => {
  const { condition, wrap, children } = props;
  return (condition ? wrap(children) : children) as ReactElement;
};

type ConditionalVisuallyHiddenProps = {
  children: ReactNode;
  hide?: boolean;
};

export const ConditionalVisuallyHidden = (
  props: ConditionalVisuallyHiddenProps,
) => {
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
