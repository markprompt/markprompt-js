import * as Markprompt from '@markprompt/react';
import React, { useContext } from 'react';

export const Caret = () => {
  const { answer } = useContext(Markprompt.Context);

  if (answer) {
    return null;
  }

  return <span className="MarkpromptCaret" />;
};
