import '@markprompt/css';
import './global.css';

import { AppProps } from 'next/app';
import { ReactElement } from 'react';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}
