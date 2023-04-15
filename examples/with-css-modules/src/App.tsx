import * as Markprompt from '@markprompt/react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { MarkpromptIcon } from './Markprompt';
import styles from './markprompt.module.css';

function App() {
  return (
    <div className={styles.app}>
      <Markprompt.Root projectKey="sk_test_mKfzAaRVAZaVvu0MHJvGNJBywfJSOdp4">
        <Markprompt.Trigger
          aria-label="Open Markprompt"
          className={styles.button}
        >
          <MarkpromptIcon className={styles.icon} />
        </Markprompt.Trigger>
        <Markprompt.Portal>
          <Markprompt.Overlay className={styles.overlay} />
          <Markprompt.Content className={styles.content}>
            <Markprompt.Close className={styles.close}>
              <Cross1Icon />
            </Markprompt.Close>

            {/* Markprompt.Title is included for accessibility reasons and can be hidden. */}
            <VisuallyHidden asChild>
              <Markprompt.Title className={styles.title}>
                Ask the 🤖 a question
              </Markprompt.Title>
            </VisuallyHidden>

            {/* Markprompt.Description is included for accessibility reasons and can be hidden. */}
            <VisuallyHidden asChild>
              <Markprompt.Description className={styles.description}>
                Ask me anything about Motif.land
              </Markprompt.Description>
            </VisuallyHidden>

            <Markprompt.Form>
              <Markprompt.Prompt
                className={styles.prompt}
                placeholder="Ask me anything about motif.land"
              />
            </Markprompt.Form>
            <Markprompt.Answer />
          </Markprompt.Content>
        </Markprompt.Portal>
      </Markprompt.Root>
    </div>
  );
}

export default App;
