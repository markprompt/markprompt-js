import { markprompt } from './index.js';

(async () => {
  if (!window.markprompt) {
    // todo: replace placeholder
    throw new Error(
      'Markprompt configuration not found on window. See: https://markprompt.com/docs#<placeholder>',
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

  markprompt(projectKey, container, options);
})();
