import './markprompt-content.js';

/**
 * This init script automatically initializes the Markprompt web component.
 * It is meant to be used in combination with a script tag:
 *
 * ```html
 * <script
 *   async
 *   src="https://esm.sh/@markprompt/web/init"
 *   data-markprompt-init
 *   data-markprompt-project-key="<your-key>"
 *   data-markprompt-model="..."
 *   data-markprompt-...
 * >
 * ```
 *
 * This script will then append the Markprompt component to the DOM and initialize it
 * with the given options.
 */

(async () => {
  if (typeof document === 'undefined') return;

  const source = document.querySelector('[data-markprompt-init]');
  if (!source || !(source instanceof HTMLScriptElement)) return;

  const options = source.dataset;

  const el = document.createElement('markprompt-content');

  for (const [key, value] of Object.entries(options)) {
    if (!key.startsWith('markprompt')) continue;
    if (!value) continue;
    const prop = key.replace('markprompt', '').toLowerCase();
    el.setAttribute(prop, value);
  }

  document.body.insertAdjacentElement('beforeend', el);
})();
