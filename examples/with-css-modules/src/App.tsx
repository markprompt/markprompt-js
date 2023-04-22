import * as Markprompt from '@markprompt/react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross1Icon } from '@radix-ui/react-icons';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { MarkpromptIcon } from './Markprompt';
import styles from './markprompt.module.css';

function App() {
  return (
    <div className={styles.app}>
      <Dialog.Root>
        <Dialog.Trigger aria-label="Open Markprompt" className={styles.button}>
          <MarkpromptIcon className={styles.icon} />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.overlay} />
          <Dialog.Content className={styles.content}>
            <Dialog.Close className={styles.close}>
              <Cross1Icon />
            </Dialog.Close>

            {/* Markprompt.Title is included for accessibility reasons and can be hidden. */}
            <VisuallyHidden asChild>
              <Dialog.Title className={styles.title}>
                Ask the 🤖 a question
              </Dialog.Title>
            </VisuallyHidden>

            {/* Markprompt.Description is included for accessibility reasons and can be hidden. */}
            <VisuallyHidden asChild>
              <Dialog.Description className={styles.description}>
                Ask me anything about Motif.land
              </Dialog.Description>
            </VisuallyHidden>

            <Markprompt.Root projectKey="sk_test_mKfzAaRVAZaVvu0MHJvGNJBywfJSOdp4">
              <Markprompt.Form>
                <Markprompt.Prompt
                  className={styles.prompt}
                  placeholder="Ask me anything about motif.land"
                />
              </Markprompt.Form>
              <Markprompt.Answer />
            </Markprompt.Root>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export default App;
