import * as Markprompt from '@markprompt/react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import styles from './markprompt.module.css';
import { useCaret } from './useCaret';

function Component() {
  const ref = useCaret<HTMLDivElement>();

  return (
    <Markprompt.Root
      projectKey="sk_test_mKfzAaRVAZaVvu0MHJvGNJBywfJSOdp4"
      model="gpt-4"
    >
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

          {/* Markprompt.Title is required for accessibility reasons. It can be hidden using an accessible content hiding technique. */}
          <VisuallyHidden asChild>
            <Markprompt.Title className={styles.title}>
              Ask me anything about Motif.land
            </Markprompt.Title>
          </VisuallyHidden>

          {/* Markprompt.Description is included for accessibility reasons. It is optional and can be hidden using an accessible content hiding technique. */}
          <VisuallyHidden asChild>
            <Markprompt.Description className={styles.description}>
              I can answer all your questions about Motif.land.
            </Markprompt.Description>
          </VisuallyHidden>

          <Markprompt.Form>
            <SearchIcon className={styles.MarkpromptSearchIcon} />
            <Markprompt.Prompt className={styles.MarkpromptPrompt} />
          </Markprompt.Form>

          <div className={styles.wrapper}>
            <div className={styles.answer} ref={ref}>
              <Markprompt.Answer />
            </div>

            <div className={styles.references}>
              <p>Answer generated from the following sources:</p>
              <Markprompt.References
                ReferenceElement={({ reference }) => (
                  <li>
                    <a
                      href={`https://github.com/motifland/markprompt-sample-docs/blob/main${reference}`}
                    >
                      {reference}
                    </a>
                  </li>
                )}
              />
            </div>
          </div>
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
