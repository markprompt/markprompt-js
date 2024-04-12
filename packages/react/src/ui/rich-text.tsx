import type { ComponentType, ReactElement } from 'react';
import Markdown from 'react-markdown';

export function RichText(props: {
  children: string | ComponentType;
}): ReactElement {
  if (typeof props.children === 'string') {
    return <Markdown>{props.children}</Markdown>;
  } else {
    const Message = props.children;
    return <Message />;
  }
}
