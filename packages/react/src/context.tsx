import { createContext, useContext } from 'react';

import { noop } from './headless.js';
import { type LoadingState } from './useMarkprompt.js';

type State = {
  answer: string | undefined;
  prompt: string;
  references: string[];
  state: LoadingState;
};

type Actions = {
  abort: () => void;
  submit: () => void;
  updatePrompt: (nextPrompt: string) => void;
};

const MarkpromptContext = createContext<State & Actions>({
  answer: undefined,
  prompt: '',
  references: [],
  state: 'indeterminate',
  abort: noop,
  submit: noop,
  updatePrompt: noop,
});

function useMarkpromptContext(): State & Actions {
  return useContext(MarkpromptContext);
}

export { MarkpromptContext, useMarkpromptContext };
