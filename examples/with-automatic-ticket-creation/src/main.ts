import '@markprompt/css';
import './style.css';
import { markprompt, type MarkpromptOptions } from '@markprompt/web';

const el = document.querySelector('#markprompt');

async function createTicket(args: string): Promise<string> {
  console.log(args);
  return ''
};

if (el && el instanceof HTMLElement) {
  markprompt(import.meta.env.VITE_PROJECT_API_KEY, el, {
    defaultView: 'chat',
    display: 'dialog',
    apiUrl: import.meta.env.VITE_MARKPROMPT_API_URL,
    search: {
      enabled: false,
    },
    references: {
      getLabel: (f) => {
        if (f.meta?.leadHeading?.value?.length === 1) {
          return `${f.file.title} - ${f.meta?.leadHeading?.value}`;
        }
        return f.meta?.leadHeading?.value ?? f.file.title;
      },
    },
    chat: {
      assistantId: import.meta.env.VITE_ASSISTANT_ID,
      disclaimerView: {
        message:
          'I am an AI assistant. Consider checking important information.',
        cta: 'I agree',
      },
      enabled: true,
      placeholder: 'Ask a question...',
      title: 'Help',
      defaultView: {
        message: "Hello, I'm an AI assistant from Acme!",
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
      threadMetadata: {
        userId: 'user-123',
        plan: 'hobby',
      },
      toolChoice: 'auto',
      tools: [
        {
          call: createTicket,
          tool: {
            type: 'function',
            function: {
              name: 'create_ticket',
              description: 'Create a support case for this user, allowing them to speak to a human support agent about their issue.',
              parameters: {
                type: 'object',
                properties: {
                  provider: {
                    type: 'string',
                    description: 'The ticket or case support provider',
                    enum: [
                      'salesforce',
                      'zendesk',
                    ],
                  },
                  name: {
                    type: 'string',
                    description: 'The name of the user submitting the ticket',
                  },
                  userName: {
                    type: 'string',
                    description: 'The user name of the user submitting the ticket',
                  },
                  email: {
                    type: 'string',
                    description: 'The email address of the user submitting the ticket',
                  },
                  content: {
                    type: 'string',
                    description: 'The content of the ticket or case',
                  },
                  summary: {
                    type: 'string',
                    description: 'The summary of the ticket or case',
                  },
                  projectKey: {
                    type: 'string',
                    description: 'The project key of the Markprompt project to create the ticket or case in',
                  },
                  customFields: {
                    type: 'array',
                    description: 'Custom fields to add to the ticket or case',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          description: 'The ID of the custom field',
                        },
                        value: {
                          type: 'string',
                          description: 'The value of the custom field',
                        },
                      },
                      required: ['id', 'value'],
                    },
                  }
                },
                required: ['email', 'provider', 'projectKey'],
              },
            },
          },
          requireConfirmation: false,
        },
      ],
    },
    integrations: {
      createTicket: {
        enabled: true,
        provider: 'zendesk',
        user: {
          name: 'Jane Doe',
          email: 'jane@doe.com',
        },
        form: {
          hasFileUploadInput: true,
          emailLabel: 'Email',
          nameLabel: 'Name',
          emailPlaceholder: 'jane@doe.com',
          namePlaceholder: 'Jane Doe',
          maxFileSizeError: 'File size should be less than 4.5MB',
          submitLabel: 'Submit case',
          summaryLabel: 'Summary',
          summaryLoading: 'Generating summary…',
          summaryPlaceholder: 'Please describe your issue',
          ticketCreatedError: 'An error occurred while creating the case',
          ticketCreatedOk: 'Thank you! We will get back to you shortly.',
          uploadFileLabel: 'Attach files (optional)',
          customFields: [
            {
              id: 'Reason',
              label: 'Reason for creating the case',
              items: [
                { value: 'Bug', label: 'Bug' },
                { value: 'Feature request', label: 'Feature request' },
                { value: 'Feedback', label: 'Feedback' },
                { value: 'Other', label: 'Other' },
              ],
            },
          ],
        },
      },
    },
  } satisfies MarkpromptOptions);
}
