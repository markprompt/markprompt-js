import '@markprompt/css';
import './style.css';
import { markprompt, openMarkprompt } from '@markprompt/web';

import styles from './main.module.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class=${styles.centered}>
    <p>Open the Markprompt dialog ⬇️</p>
    <button id="markprompt-trigger" class=${styles.customTrigger}>
      Open Markprompt
    </button>
    <div id="markprompt"></div>
  </div>
`;

const el = document.querySelector('#markprompt');

if (el instanceof HTMLElement) {
  markprompt(import.meta.env.VITE_PROJECT_API_KEY, el, {
    trigger: { customElement: true },
    search: { enabled: false },
  });
}

const trigger = document.querySelector<HTMLButtonElement>(
  '#markprompt-trigger',
);

if (trigger) {
  trigger.addEventListener('click', () => {
    openMarkprompt();
  });
}
