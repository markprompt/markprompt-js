import '@markprompt/css';
import './global.css';

import type { AppProps } from 'next/app';
import type { ReactElement } from 'react';

export default function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <main>
      <Component {...pageProps} />
    </main>
  );
}
