import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/static/favicons/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/static/favicons/favicon.svg"
          type="image/svg+xml"
        />
        <link
          rel="apple-touch-icon"
          href="/static/favicons/apple-touch-icon.png"
        />
        <link rel="manifest" href="/static/favicons/site.webmanifest" />
        <meta name="theme-color" content="#4a4a4a" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
