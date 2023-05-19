import { type ReactNode, type ReactElement } from 'react';

type ConditionalWrapProps = {
  condition: boolean;
  wrap: (children: ReactNode) => ReactNode;
  children: ReactNode;
};

export const ConditionalWrap = (props: ConditionalWrapProps) => {
  const { condition, wrap, children } = props;
  return (condition ? wrap(children) : children) as ReactElement;
};
