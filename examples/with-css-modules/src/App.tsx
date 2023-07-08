import { FileSectionReference } from '@markprompt/core';
import * as Markprompt from '@markprompt/react';
import { useMarkpromptContext } from '@markprompt/react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import React, { ReactElement } from 'react';

import styles from './markprompt.module.css';

function Component(): ReactElement {
  return (
    <Markprompt.Root
      projectKey={import.meta.env.VITE_PROJECT_API_KEY}
      promptOptions={{
        iDontKnowMessage: 'Sorry, I am not sure how to answer that.',
        promptTemplate: `You are a very enthusiastic company representative who loves to help people! Given the following sections from the documentation (preceded by a section id), answer the question using only that information, output in Markdown format. If you are unsure and the answer is not explicitly written in the documentation, say "{{I_DONT_KNOW}}".

  Context sections:
  ---
  {{CONTEXT}}

  Question: "{{PROMPT}}"

  Answer (including related code snippets if available):`,
        temperature: 0.1,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
        maxTokens: 500,
        sectionsMatchCount: 10,
        sectionsMatchThreshold: 0.5,
      }}
    >
      <Markprompt.DialogTrigger
        aria-label="Open Markprompt"
        className={styles.MarkpromptButton}
      >
        <ChatIcon className={styles.MarkpromptIcon} />
      </Markprompt.DialogTrigger>
      <Markprompt.Portal>
        <Markprompt.Overlay className={styles.MarkpromptOverlay} />
        <Markprompt.Content className={styles.MarkpromptContentDialog}>
          <Markprompt.Close className={styles.MarkpromptClose}>
            <CloseIcon />
          </Markprompt.Close>

          {/* Markprompt.Title is required for accessibility reasons. It can be hidden using an accessible content hiding technique. */}
          <VisuallyHidden asChild>
            <Markprompt.Title>Ask me anything</Markprompt.Title>
          </VisuallyHidden>

          {/* Markprompt.Description is included for accessibility reasons. It is optional and can be hidden using an accessible content hiding technique. */}
          <VisuallyHidden asChild>
            <Markprompt.Description>
              I can answer your questions about Markprompt’s client-side
              libraries, onboarding, API’s and more.
            </Markprompt.Description>
          </VisuallyHidden>

          <Markprompt.Form>
            <SearchIcon className={styles.MarkpromptSearchIcon} />
            <Markprompt.Prompt className={styles.MarkpromptPrompt} />
          </Markprompt.Form>

          <Markprompt.AutoScroller className={styles.MarkpromptAnswer}>
            <Caret />
            <Markprompt.Answer />
          </Markprompt.AutoScroller>

          <References />
        </Markprompt.Content>
      </Markprompt.Portal>
    </Markprompt.Root>
  );
}

const Caret = (): ReactElement | null => {
  const { answer } = useMarkpromptContext();

  if (answer) {
    return null;
  }

  return <span className={styles.caret} />;
};

const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const removeFileExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return fileName;
  }
  return fileName.substring(0, lastDotIndex);
};

const Reference = ({
  reference,
  index,
}: {
  reference: FileSectionReference;
  index: number;
}): ReactElement => {
  return (
    <li
      key={`${reference.file?.path}-${index}`}
      className={styles.reference}
      style={{
        animationDelay: `${100 * index}ms`,
      }}
    >
      <a href={removeFileExtension(reference.file.path)}>
        {reference.file.title ||
          capitalize(removeFileExtension(reference.file.path))}
      </a>
    </li>
  );
};

const References = (): ReactElement | null => {
  const { state, references } = useMarkpromptContext();

  if (state === 'indeterminate') return null;

  let adjustedState: string = state;
  if (state === 'done' && references.length === 0) {
    adjustedState = 'indeterminate';
  }

  return (
    <div data-loading-state={adjustedState} className={styles.references}>
      <div className={styles.progress} />
      <p>Fetching relevant pages…</p>
      <p>Answer generated from the following sources:</p>
      <Markprompt.References
        RootComponent="ul"
        ReferenceComponent={Reference}
      />
    </div>
  );
};

const SearchIcon = ({ className }: { className?: string }): ReactElement => (
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
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
  </svg>
);

const CloseIcon = ({ className }: { className?: string }): ReactElement => (
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
    <line x1="18" x2="6" y1="6" y2="18"></line>
    <line x1="6" x2="18" y1="6" y2="18"></line>
  </svg>
);

const ChatIcon = ({ className }: { className?: string }): ReactElement => (
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
