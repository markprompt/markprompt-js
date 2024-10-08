import type { MarkpromptOptions } from '@markprompt/react';

import { closeMarkprompt, markprompt, openMarkprompt } from './index.js';

declare global {
  interface Window {
    markprompt?: {
      projectKey: string;
      container?: HTMLElement | string;
      options?: MarkpromptOptions;
      open?: typeof openMarkprompt;
      close?: typeof closeMarkprompt;
    };
  }
}

if (!window.markprompt) {
  throw new Error(
    'Markprompt configuration not found on window. See: https://markprompt.com/docs#script-tag',
  );
}

let { container } = window.markprompt;

if (!container) {
  container = document.createElement('div');
  container.id = 'markprompt';
  document.body.appendChild(container);
}

const { projectKey, options } = window.markprompt;

if (!projectKey) {
  throw new Error(
    'Markprompt project key not found on window. Find your project key in the project settings on https://markprompt.com/',
  );
}

window.markprompt.open = openMarkprompt;
window.markprompt.close = closeMarkprompt;

markprompt(projectKey, container, options);
