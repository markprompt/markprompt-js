import { useMarkpromptContext } from '@markprompt/react';
import React, { type ReactElement } from 'react';

export const Caret = (): ReactElement | null => {
  const { answer } = useMarkpromptContext();

  if (answer) {
    return null;
  }

  return <span className="MarkpromptCaret" />;
};
