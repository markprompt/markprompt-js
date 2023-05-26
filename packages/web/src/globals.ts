import type { MarkpromptOptions } from './types.js';

declare global {
  interface Window {
    markprompt?: {
      projectKey: string;
      container?: HTMLElement | string;
      options?: MarkpromptOptions;
    };
  }
}
