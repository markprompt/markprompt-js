import { useMarkpromptContext } from '@markprompt/react';
import React from 'react';

export const Caret = () => {
  const { answer } = useMarkpromptContext();

  if (answer) {
    return null;
  }

  return <span className="MarkpromptCaret" />;
};
