import Layout from '@theme/Layout';
import React, { ReactElement } from 'react';

import styles from './index.module.css';

export default function Home(): ReactElement {
  return (
    <Layout description="A demo showing Markprompt in Docusaurus with swizzling">
      <main className={styles.main}>
        <h1>Markprompt + Algolia demo with swizzling</h1>
        <p>
          This demo features Markprompt with a swizzled{' '}
          <code>@docusaurus/theme-search-algolia</code> plugin.
        </p>
        <p>Click the button at the bottom right to open Markprompt.</p>
      </main>
    </Layout>
  );
}
