import '@markprompt/css';
import './style.css';

import { markprompt } from '@markprompt/web';

const el = document.querySelector('#markprompt');

if (el && el instanceof HTMLElement) {
  markprompt(import.meta.env.VITE_PROJECT_API_KEY, el, {
    feedback: { enabled: true },
    trigger: { floating: true },
    search: { enabled: true, apiUrl: 'http://api.localhost:3000/v1/search' },
  });
}
