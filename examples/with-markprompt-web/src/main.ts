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
      stream: false,
      functions: [
        {
          name: 'get_random_activity',
          description:
            "Finds you something to do when you're bored, get a random activity",
          parameters: {
            type: 'object',
            properties: {
              key: {
                type: 'string',
                description: 'Find an activity by its key',
              },
              type: {
                type: 'string',
                description: 'Find a random activity with a given type',
                enum: [
                  'education',
                  'recreational',
                  'social',
                  'diy',
                  'charity',
                  'cooking',
                  'relaxation',
                  'music',
                  'busywork',
                ],
              },
              participants: {
                type: 'integer',
                description:
                  'Find a random activity with a given number of participants',
              },
            },
          },
        },
      ],
    },
    defaultView: 'chat',
  } satisfies MarkpromptOptions);
}
