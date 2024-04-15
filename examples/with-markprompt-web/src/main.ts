// polyfill crypto.randomUUID for iOS
import 'randomuuid';

import '@markprompt/css';
import './style.css';
import { markprompt, type MarkpromptOptions } from '@markprompt/web';

const el = document.querySelector('#markprompt');

async function get_random_activity(args: string): Promise<string> {
  const parsed = JSON.parse(args);
  const url = new URL('https://www.boredapi.com/api/activity');

  Object.entries(parsed).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value.toString());
  });

  const res = await fetch(url);
  return await res.text();
}

if (el && el instanceof HTMLElement) {
  markprompt(import.meta.env.VITE_PROJECT_API_KEY, el, {
    defaultView: 'chat',
    display: 'sheet',
    search: {
      apiUrl: import.meta.env.VITE_MARKPROMPT_API_URL + '/search',
      enabled: false,
    },
    integrations: {
      createTicket: {
        enabled: true,
        provider: 'zendesk',
        user: {
          name: 'Jane Doe',
          email: 'jane@doe.com',
        },
      },
    },
    ticketForm: {
      enabled: true,
      title: 'Get help',
      subtitle: 'How can we help?',
      placeholder: ['I am having trouble with...', 'Send a message'],
      disclaimerView: {
        message:
          'Answers generated with AI. Consider checking important information.',
      },
    },
    chat: {
      disclaimerView: {
        message:
          'I am an AI assistant. Consider checking important information.',
      },
      enabled: true,
      placeholder: 'Ask a question...',
      title: 'Help',
      model: 'gpt-4-1106-preview',
      apiUrl: import.meta.env.VITE_API_URL + '/chat',
      defaultView: {
        message:
          "Hello, I'm an AI assistant from Acme. If we find something we can't solve, I'll help create a support case for you.",
        // promptsHeading: 'Popular questions',
        prompts: [
          'What is Markprompt?',
          'How do I setup the React component?',
          'Do you have a REST API?',
        ],
      },
      avatars: {
        user: '/avatars/user.png',
        assistant: '/avatars/logo.png',
      },
      tool_choice: 'auto',
      tools: [
        {
          call: get_random_activity,
          tool: {
            type: 'function',
            function: {
              name: 'get_random_activity',
              description: 'Get a random activity from the Bored API',
              parameters: {
                type: 'object',
                properties: {
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
                required: [],
              },
            },
          },
          requireConfirmation: true,
        },
      ],
    },
    menu: {
      title: 'Need help?',
      subtitle: 'Get help with setting up Acme',
      sections: [
        {
          entries: [
            {
              title: 'Documentation',
              type: 'link',
              href: 'https://markprompt.com/docs',
              iconId: 'book',
            },
            {
              title: 'Ask a question',
              type: 'link',
              iconId: 'magnifying-glass',
              action: 'chat',
            },
            {
              title: 'Get help',
              type: 'link',
              iconId: 'chat',
              action: 'ticket',
            },
          ],
        },
        {
          heading: "What's new",
          entries: [
            {
              title: 'Changelog',
              type: 'link',
              iconId: 'newspaper',
              href: 'https://markprompt.com',
              target: '_blank',
            },
          ],
        },
        {
          entries: [
            {
              title: 'Join Discord',
              type: 'button',
              iconId: 'discord',
              theme: 'purple',
              href: 'https://discord.com',
              target: '_blank',
            },
          ],
        },
      ],
    },
    // trigger: {
    //   buttonLabel: 'Ask AI',
    // },
  } satisfies MarkpromptOptions);
}
