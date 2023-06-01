import type { SearchResult } from '@markprompt/core';
import { createContext, useContext } from 'react';

import { type LoadingState } from './useMarkprompt.js';

type State = {
  answer: string | undefined;
  prompt: string;
  references: string[];
  searchResults: SearchResult[];
  state: LoadingState;
};

type Actions = {
  abort: () => void;
  submitPrompt: () => Promise<void>;
  submitSearchQuery: (searchQuery: string) => Promise<void>;
  updatePrompt: (nextPrompt: string) => void;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const asyncNoop = async () => {};

const MarkpromptContext = createContext<State & Actions>({
  answer: undefined,
  prompt: '',
  references: [],
  searchResults: [],
  state: 'indeterminate',
  abort: noop,
  submitPrompt: asyncNoop,
  submitSearchQuery: asyncNoop,
  updatePrompt: noop,
});

function useMarkpromptContext(): State & Actions {
  return useContext(MarkpromptContext);
}

export { MarkpromptContext, useMarkpromptContext };
