import type { FileSectionReference } from '@markprompt/core';
import {
  createContext,
  useContext,
  type SetStateAction,
  type Dispatch,
} from 'react';

import type { SearchResultComponentProps } from './types.js';
import { type LoadingState, type View } from './useMarkprompt.js';

type State = {
  activeView: View;
  answer: string | undefined;
  isSearchEnabled: boolean;
  searchProvider: string | undefined;
  prompt: string;
  references: FileSectionReference[];
  searchQuery: string;
  searchResults: SearchResultComponentProps[];
  state: LoadingState;
};

type Actions = {
  abort: () => void;
  setActiveView: Dispatch<SetStateAction<View>>;
  setPrompt: Dispatch<SetStateAction<string>>;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  submitFeedback: (helpful: boolean) => void;
  submitPrompt: () => void;
  submitSearchQuery: (searchQuery: string) => void;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = (): void => {};

const MarkpromptContext = createContext<State & Actions>({
  activeView: 'prompt',
  answer: undefined,
  isSearchEnabled: false,
  searchProvider: undefined,
  prompt: '',
  references: [],
  searchQuery: '',
  searchResults: [],
  state: 'indeterminate',
  abort: noop,
  setActiveView: noop,
  setPrompt: noop,
  setSearchQuery: noop,
  submitFeedback: noop,
  submitPrompt: noop,
  submitSearchQuery: noop,
});

function useMarkpromptContext(): State & Actions {
  return useContext(MarkpromptContext);
}

export { MarkpromptContext, useMarkpromptContext };
