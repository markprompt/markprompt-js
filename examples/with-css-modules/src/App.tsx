import '@markprompt/react/markprompt.css';
import { MarkpromptDialog } from '@markprompt/react';

import styles from './App.module.css';

export function App() {
  return (
    <div className={styles.app}>
      <MarkpromptDialog projectKey="sk_test_mKfzAaRVAZaVvu0MHJvGNJBywfJSOdp4" />
    </div>
  );
}
