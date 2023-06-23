import React, { type ReactElement } from 'react';

import { useMarkpromptContext } from './index.js';

export const Caret = (): ReactElement | null => {
  const { answer } = useMarkpromptContext();

  if (answer) {
    return null;
  }

  return <span className="MarkpromptCaret" />;
};
