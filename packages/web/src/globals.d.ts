import type { MarkpromptOptions } from './types.ts';

declare global {
  interface Window {
    markprompt?: {
      projectKey: string;
      container?: HTMLElement | string;
      options?: MarkpromptOptions;
    };
  }
}
