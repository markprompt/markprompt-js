import '@markprompt/css';
import './style.css';
import { markprompt, type MarkpromptOptions } from '@markprompt/web';
import { z } from 'zod';

const el = document.querySelector('#markprompt');

const argsSchema = z.object({
  summary: z.string(),
  customFields: z.array(
    z.object({
      id: z.enum(['Reason']),
      value: z.enum(['Bug', 'Feature request', 'Feedback', 'Other']),
    }),
  ),
});

function getCreateTicket(
  projectKey: string,
  provider: string,
  name: string,
  email: string,
  userName: string,
) {
  return async function createTicket(args: string) {
    const { summary, customFields } = await argsSchema.parseAsync(
      JSON.parse(args),
    );

    const data = new FormData();

    data.append('projectKey', projectKey);
    data.append('provider', provider);
    data.append('name', name);
    data.append('email', email);
    data.append('userName', userName);
    data.append('summary', summary);

    for (const field of customFields) {
      data.append('customFields', JSON.stringify(field));
    }

    const res = await fetch(
      `${import.meta.env.VITE_MARKPROMPT_API_URL}/integrations/create-ticket`,
      {
        cache: 'no-cache',
        credentials: 'omit',
        mode: 'cors',
        method: 'POST',
        body: data,
        headers: { 'X-Markprompt-API-Version': '2024-05-21' },
      },
    );

    if (res.ok) return 'Case created successfully';

    return 'An error occurred while creating the case';
  };
}

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
      assistantVersionId: import.meta.env.VITE_ASSISTANT_VERSION_ID,
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
          call: getCreateTicket(
            import.meta.env.VITE_PROJECT_API_KEY,
            'salesforce',
            'Jane Doe',
            'jane@doe.com',
            'Jane Doe',
          ),
          tool: {
            type: 'function',
            function: {
              name: 'create_ticket',
              description:
                'Create a support case for this user, allowing them to speak to a human support agent about their issue. Prefill the summary parameter with a summary of the conversation so far. Prefill the reason custom field with the most relevant reason for creating the case.',
              parameters: {
                type: 'object',
                properties: {
                  content: {
                    type: 'string',
                    description: 'The content of the ticket or case',
                  },
                  summary: {
                    type: 'string',
                    description: 'The summary of the ticket or case',
                  },
                  customFields: {
                    type: 'array',
                    description: 'Custom fields to add to the ticket or case',
                    items: {
                      type: 'object',
                      description: 'The reason for creating the case',
                      properties: {
                        id: {
                          enum: ['Reason'],
                          description: 'The ID of the custom field',
                        },
                        value: {
                          enum: ['Bug', 'Feature request', 'Feedback', 'Other'],
                          description: 'The value of the custom field',
                        },
                      },
                      required: ['id', 'value'],
                    },
                    maxContains: 1,
                  },
                },
                required: [],
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
          subjectLabel: 'Subject',
          subjectPlaceholder: '',
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
