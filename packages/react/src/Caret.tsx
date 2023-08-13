import React, { type ReactElement } from 'react';

interface CaretProps {
  answer: string;
}

export function Caret(props: CaretProps): ReactElement | null {
  const { answer } = props;

  if (answer) {
    return null;
  }

  return <span className="MarkpromptCaret" />;
}
