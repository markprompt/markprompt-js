import '@markprompt/css';
import './style.css';

import { markprompt, type MarkpromptOptions } from '@markprompt/web';

const el = document.querySelector('#markprompt');

if (el && el instanceof HTMLElement) {
  markprompt(import.meta.env.VITE_PROJECT_API_KEY, el, {
    feedback: { enabled: true },
    search: { enabled: true },
    chat: {
      enabled: true,
      apiUrl: `${import.meta.env.VITE_MARKPROMPT_API_URL}/v1/chat`,
      defaultView: {
        message: 'Welcome to Markprompt!',
        promptsHeading: 'Popular questions',
        prompts: [
          'What is Markprompt?',
          'How do I setup the React component?',
          'Do you have a REST API?',
        ],
      },
    },
    defaultView: 'chat',
    trigger: {
      buttonLabel: 'Ask AI',
    },
  } satisfies MarkpromptOptions);
}
