import '@markprompt/css';
import './style.css';

import { markprompt } from '@markprompt/web';

const el = document.querySelector('#markprompt');

if (el && el instanceof HTMLElement) {
  markprompt(import.meta.env.VITE_PROJECT_API_KEY, el, {
    feedback: { enabled: false },
    search: {
      enabled: true,
      provider: {
        name: 'algolia',
        apiKey: '5fc87cef58bb80203d2207578309fab6',
        appId: 'KNPXZI5B0M',
        indexName: 'tailwindcss',
      },
    },
    trigger: { floating: true },
    display: 'dialog',
  });
}
