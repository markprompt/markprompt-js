import '@markprompt/css';
import './style.css';

import { markprompt, type MarkpromptOptions } from '@markprompt/web';

const el = document.querySelector('#markprompt');

function get_random_activity(args: {
  key?: string;
  type?: string;
  participants?: number;
}): Promise<string> {
  const url = new URL('https://www.boredapi.com/api/activity');

  Object.entries(args).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value.toString());
  });

  return fetch(url).then(async (res) => JSON.stringify(await res.json()));
}

if (el && el instanceof HTMLElement) {
  markprompt(import.meta.env.VITE_PROJECT_API_KEY, el, {
    open: true,
    feedback: { enabled: true },
    search: { enabled: true },
    chat: {
      enabled: true,
      history: true,
      apiUrl: `${import.meta.env.VITE_MARKPROMPT_API_URL}/v1/chat`,
      functions: [
        {
          name: 'get_random_activity',
          actual: get_random_activity,
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
                  'Find a random activity for a given number of participants',
              },
            },
          },
        },
      ],
    },
    defaultView: 'chat',
  } satisfies MarkpromptOptions);
}
