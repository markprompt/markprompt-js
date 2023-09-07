import '@markprompt/css';
import './style.css';

import { markprompt, type MarkpromptOptions } from '@markprompt/web';

const el = document.querySelector('#markprompt');

if (el && el instanceof HTMLElement) {
  markprompt(import.meta.env.VITE_PROJECT_API_KEY, el, {
    feedback: { enabled: true },
    search: { enabled: true },
    chat: { enabled: true, apiUrl: 'http://api.localhost:3000/v1/chat' },
    prompt: { apiUrl: 'http://api.localhost:3000/v1/chat' },
    defaultView: 'chat',
  } satisfies MarkpromptOptions);
}
