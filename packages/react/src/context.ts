import type { SearchResult } from '@markprompt/core';
import { createContext, useContext } from 'react';

import { type LoadingState } from './useMarkprompt.js';

type State = {
  answer: string | undefined;
  isSearchEnabled: boolean;
  isSearchActive: boolean;
  prompt: string;
  references: string[];
  searchResults: SearchResult[];
  state: LoadingState;
};

type Actions = {
  abort: () => void;
  submitPrompt: () => void;
  submitSearchQuery: (searchQuery: string) => void;
  updatePrompt: (nextPrompt: string) => void;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = (): void => {};

const MarkpromptContext = createContext<State & Actions>({
  answer: undefined,
  isSearchEnabled: false,
  isSearchActive: false,
  prompt: '',
  references: [],
  searchResults: [],
  state: 'indeterminate',
  abort: noop,
  submitPrompt: noop,
  submitSearchQuery: noop,
  updatePrompt: noop,
});

function useMarkpromptContext(): State & Actions {
  return useContext(MarkpromptContext);
}

export { MarkpromptContext, useMarkpromptContext };
