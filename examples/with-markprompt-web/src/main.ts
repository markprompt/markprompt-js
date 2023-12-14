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
      defaultView: {
        message:
          "Welcome to Markprompt! We're here to assist you. Just type your question to get started.",
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
