import Head from 'next/head';
import { FC } from 'react';

type SharedHeadProps = {
  title: string;
};

export const SharedHead: FC<SharedHeadProps> = ({ title }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content="Markprompt" />
      <meta
        name="description"
        content="Open-source GPT-4 platform for Markdown, Markdoc and MDX with built-in analytics"
        key="desc"
      />
      <meta
        property="og:description"
        content="Open-source GPT-4 platform for Markdown, Markdoc and MDX with built-in analytics"
      />

      <meta property="og:url" content="https://markprompt.com/" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Markprompt" />
      <meta
        property="og:image"
        content="https://markprompt.com/static/cover.png"
      />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="markprompt.com" />
      <meta property="twitter:url" content="https://markprompt.com/" />
      <meta name="twitter:title" content="Markprompt" />
      <meta
        name="twitter:description"
        content="Open-source GPT-4 platform for Markdown, Markdoc and MDX with built-in analytics"
      />
      <meta
        name="twitter:image"
        content="https://markprompt.com/static/cover.png"
      />
      <meta name="viewport" content="width=device-width, user-scalable=no" />
    </Head>
  );
};
