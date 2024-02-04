import '@markprompt/css';
import './global.css';

import { AppProps } from 'next/app';
import { ReactElement } from 'react';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <main>
      <Component {...pageProps} />
    </main>
  );
}
