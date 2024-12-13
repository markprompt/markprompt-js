import type { ComponentType, JSX } from 'react';
import Markdown from 'react-markdown';

export function RichText(props: {
  children: string | ComponentType;
  className?: string;
}): JSX.Element {
  if (typeof props.children === 'string') {
    return <Markdown className={props.className}>{props.children}</Markdown>;
  }
  const Message = props.children;
  return <Message />;
}
