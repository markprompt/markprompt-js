// polyfill crypto.randomUUID for iOS
import "randomuuid";

import "@markprompt/css";
import "./style.css";
import {
  markprompt,
  type MarkpromptOptions,
  openMarkprompt,
} from "@markprompt/web";

const el = document.querySelector("#markprompt");

setTimeout(() => {
  openMarkprompt("ticket");
}, 200);

if (el && el instanceof HTMLElement) {
  markprompt(import.meta.env.VITE_PROJECT_API_KEY, el, {
    defaultView: "chat",
    display: "sheet",
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
          "I am an AI assistant. Consider checking important information.",
        cta: "I agree",
      },
      enabled: true,
      placeholder: "Ask a question...",
      title: "Help",
      defaultView: {
        message: "Hello, I'm an AI assistant from Acme!",
        prompts: [
          "What is Markprompt?",
          "How do I setup the React component?",
          "Do you have a REST API?",
        ],
      },
      avatars: {
        user: "/avatars/user.png",
        assistant: "/avatars/logo.png",
      },
      threadMetadata: {
        userId: "user-123",
        plan: "hobby",
      },
    },
    integrations: {
      createTicket: {
        enabled: true,
        provider: "zendesk",
        // user: {
        //   name: "Jane Doe",
        //   email: "jane@doe.com",
        // },
        form: {
          hasFileUploadInput: true,
          emailLabel: "Email",
          nameLabel: "Name",
          emailPlaceholder: "jane@doe.com",
          namePlaceholder: "Jane Doe",
          maxFileSizeError: "File size should be less than 4.5MB",
          submitLabel: "Submit case",
          summaryLabel: "Summary",
          summaryLoading: "Generating summary…",
          summaryPlaceholder: "Please describe your issue",
          ticketCreatedError: "An error occurred while creating the case",
          ticketCreatedOk: "Thank you! We will get back to you shortly.",
          uploadFileLabel: "Attach files (optional)",
        },
      },
    },
    menu: {
      title: "Need help?",
      subtitle: "Get help with setting up Acme",
      sections: [
        {
          entries: [
            {
              title: "Documentation",
              type: "link",
              href: "https://markprompt.com/docs",
              iconId: "book",
            },
            {
              title: "Ask a question",
              type: "link",
              iconId: "magnifying-glass",
              action: "chat",
            },
            {
              title: "Get help",
              type: "link",
              iconId: "chat",
              action: "ticket",
            },
          ],
        },
        {
          heading: "What's new",
          entries: [
            {
              title: "Changelog",
              type: "link",
              iconId: "newspaper",
              href: "https://markprompt.com",
              target: "_blank",
            },
          ],
        },
        {
          entries: [
            {
              title: "Join Discord",
              type: "button",
              iconId: "discord",
              theme: "purple",
              href: "https://discord.com",
              target: "_blank",
            },
          ],
        },
      ],
    },
  } satisfies MarkpromptOptions);
}
