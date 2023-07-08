import type { FileSectionReference } from '@markprompt/core';
import {
  createContext,
  useContext,
  type SetStateAction,
  type Dispatch,
} from 'react';

import type { SearchResultComponentProps } from './types.js';
import { type LoadingState } from './useMarkprompt.js';

type State = {
  activeSearchResult: string | undefined;
  answer: string | undefined;
  isSearchEnabled: boolean;
  isSearchActive: boolean;
  prompt: string;
  references: FileSectionReference[];
  searchResults: SearchResultComponentProps[];
  state: LoadingState;
};

type Actions = {
  abort: () => void;
  submitFeedback: (helpful: boolean) => void;
  submitPrompt: () => void;
  submitSearchQuery: (searchQuery: string) => void;
  updateActiveSearchResult: Dispatch<SetStateAction<string | undefined>>;
  updatePrompt: (nextPrompt: string) => void;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = (): void => {};

const MarkpromptContext = createContext<State & Actions>({
  activeSearchResult: undefined,
  answer: undefined,
  isSearchEnabled: false,
  isSearchActive: false,
  prompt: '',
  references: [],
  searchResults: [],
  state: 'indeterminate',
  abort: noop,
  submitFeedback: noop,
  submitPrompt: noop,
  submitSearchQuery: noop,
  updateActiveSearchResult: noop,
  updatePrompt: noop,
});

function useMarkpromptContext(): State & Actions {
  return useContext(MarkpromptContext);
}

export { MarkpromptContext, useMarkpromptContext };
