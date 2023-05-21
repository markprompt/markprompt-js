// import '@markprompt/css';
import './style.css';

import { markprompt } from '@markprompt/web';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main>
    <p>Click the Markprompt button ↘️</p>
  </main>
  <div id="markprompt"></div>
`;

const el = document.querySelector('#markprompt');

if (el && el instanceof HTMLElement) {
  markprompt(import.meta.env.VITE_PROJECT_API_KEY, el);
}
