import '@markprompt/css';
import { AppProps } from 'next/app';
import React from 'react';

import './global.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
