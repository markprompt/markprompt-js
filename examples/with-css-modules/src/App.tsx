import * as Markprompt from '@markprompt/react';

import styles from './markprompt.module.css';

function Component() {
  return (
    <Markprompt.Root projectKey="sk_test_y3EzJ2IAHBeUA7jUqyGk8V7RvhaoZGMK">
      <Markprompt.Trigger
        aria-label="Open Markprompt"
        className={styles.MarkpromptButton}
      >
        <ChatIcon className={styles.MarkpromptIcon} />
      </Markprompt.Trigger>
      <Markprompt.Portal>
        <Markprompt.Overlay className={styles.MarkpromptOverlay} />
        <Markprompt.Content className={styles.MarkpromptContent}>
          <Markprompt.Close className={styles.MarkpromptClose}>
            <CloseIcon />
          </Markprompt.Close>
          <Markprompt.Form>
            <SearchIcon className={styles.MarkpromptSearchIcon} />
            <Markprompt.Prompt className={styles.MarkpromptPrompt} />
          </Markprompt.Form>
          <Markprompt.Answer />
        </Markprompt.Content>
      </Markprompt.Portal>
    </Markprompt.Root>
  );
}

const SearchIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" x2="6" y1="6" y2="18"></line>
    <line x1="6" x2="18" y1="6" y2="18"></line>
  </svg>
);

const ChatIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
  </svg>
);

export default Component;
