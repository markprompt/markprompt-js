import '@markprompt/css';
import styles from './App.module.css';

import { Markprompt, openMarkprompt } from '@markprompt/react';
import type { JSX } from 'react';

function App(): JSX.Element {
  return (
    <div className={styles.app}>
      <div className={styles.centered}>
        <p>Open the Markprompt dialog</p>
        <Markprompt
          projectKey={import.meta.env.VITE_PROJECT_API_KEY}
          trigger={{ customElement: true }}
        />
        <button
          type="button"
          className={styles.customTrigger}
          onClick={() => openMarkprompt()}
        >
          Open Markprompt
        </button>
      </div>
    </div>
  );
}

export default App;
