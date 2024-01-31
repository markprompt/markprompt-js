import Layout from '@theme/Layout';
import type React from 'react';

import styles from './index.module.css';

export default function Home(): React.JSX.Element {
  return (
    <Layout description="A demo showing Markprompt in Docusaurus">
      <main className={styles.main}>
        <h1>Markprompt demo</h1>
        <p>
          This is the demo of the{' '}
          <code>@markprompt/docusaurus-theme-search</code> plugin.
        </p>
        <p>Click the button at the bottom right to open Markprompt.</p>
      </main>
    </Layout>
  );
}
