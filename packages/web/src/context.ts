import { createContext } from '@lit-labs/context';

export type LoadingState =
  | 'indeterminate'
  | 'preload'
  | 'streaming-answer'
  | 'done';

export const open = createContext<boolean>(
  Symbol.for('markprompt-context/open'),
);

export const answer = createContext<string | undefined>(
  Symbol.for('markprompt-context/answer'),
);

export const prompt = createContext<string | undefined>(
  Symbol.for('markprompt-context/prompt'),
);

export const references = createContext<string[]>(
  Symbol.for('markprompt-context/references'),
);

export const loadingState = createContext<LoadingState>(
  Symbol.for('markprompt-context/loading-state'),
);

export const controller = createContext<AbortController | undefined>(
  Symbol.for('markprompt-context/controller'),
);
