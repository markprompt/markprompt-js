import * as Markprompt from '@markprompt/react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import type { JSX } from 'react';

import styles from './markprompt.module.css';

function Component(): JSX.Element {
  return (
    <Markprompt.Root>
      <Markprompt.DialogTrigger
        aria-label="Ask AI"
        className={styles.MarkpromptButton}
      >
        <ChatIcon className={styles.MarkpromptIcon} />
      </Markprompt.DialogTrigger>
      <Markprompt.Portal>
        <Markprompt.Overlay className={styles.MarkpromptOverlay} />
        <Markprompt.Content className={styles.MarkpromptContentDialog}>
          <Markprompt.Close
            aria-label="Close"
            className={styles.MarkpromptClose}
          >
            <CloseIcon />
          </Markprompt.Close>

          {/* Markprompt.Title is required for accessibility reasons. It can be hidden using an accessible content hiding technique. */}
          <VisuallyHidden asChild>
            <Markprompt.Title>Ask AI</Markprompt.Title>
          </VisuallyHidden>

          {/* Markprompt.Description is included for accessibility reasons. It is optional and can be hidden using an accessible content hiding technique. */}
          <VisuallyHidden asChild>
            <Markprompt.Description>
              I can answer your questions about Markprompt’s client-side
              libraries, onboarding, API’s and more.
            </Markprompt.Description>
          </VisuallyHidden>

          <Markprompt.ChatView
            projectKey={import.meta.env.VITE_PROJECT_API_KEY}
          />
        </Markprompt.Content>
      </Markprompt.Portal>
    </Markprompt.Root>
  );
}

const CloseIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" x2="6" y1="6" y2="18" />
    <line x1="6" x2="18" y1="6" y2="18" />
  </svg>
);

const ChatIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
  </svg>
);

export default Component;
