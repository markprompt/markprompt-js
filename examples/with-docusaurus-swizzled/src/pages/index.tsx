import styles from './index.module.css';
import type { JSX } from 'react';
import Layout from '@theme/Layout';

export default function Home(): JSX.Element {
  return (
    <Layout description="A demo showing Markprompt in Docusaurus with swizzling">
      <main className={styles.main}>
        <h1>Markprompt + Algolia demo with swizzling</h1>
        <p>This demo features Markprompt with Algolia as a swizzled plugin.</p>
        <p>Click the search bar at the top right to open Markprompt.</p>
      </main>
    </Layout>
  );
}
