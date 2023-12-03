import '@markprompt/css';
import './style.css';

import { markprompt, type MarkpromptOptions } from '@markprompt/web';

const el = document.querySelector('#markprompt');

if (el && el instanceof HTMLElement) {
  markprompt('sk_test_NzuHFUpoYIQpX6FjLl5hfMqUzA6BR1r7', el, {
    feedback: { enabled: true },
    search: { apiUrl: `http://api.localhost:3000/v1/search`, enabled: true },
    chat: {
      enabled: true,
      apiUrl: `http://api.localhost:3000/v1/chat`,
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
