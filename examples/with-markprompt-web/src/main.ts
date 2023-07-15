import '@markprompt/css';
import './style.css';

import { markprompt } from '@markprompt/web';

const el = document.querySelector('#markprompt');

if (el && el instanceof HTMLElement) {
  markprompt(import.meta.env.VITE_PROJECT_API_KEY, el, {
    feedback: { enabled: false },
    search: { enabled: false },
    trigger: { floating: true },
    display: 'dialog',
    close: { visible: false },
  });
}
