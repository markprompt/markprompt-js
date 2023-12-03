import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from 'sonner';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Toaster position="bottom-left" closeButton richColors />
      <Component {...pageProps} />
    </>
  );
}
