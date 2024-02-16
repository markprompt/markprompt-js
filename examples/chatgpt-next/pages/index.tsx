import { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Markprompt, openMarkprompt } from '@markprompt/react';

export default function IndexPage(): ReactElement {
  return (
    <>
      <Head>
        <title>Markprompt + Next.js</title>
      </Head>
      <div style={{ width: '100%', height: '100vh' }}>
        <Markprompt
          projectKey={process.env.NEXT_PUBLIC_MARKPROMPT_PROJECT_KEY!}
          defaultView="search"
          display="plain"
          chat={{
            enabled: true,
            placeholder: 'Send a message',
            systemPrompt:
              'You are a friendly AI who loves to help people find the information they need!',
            avatars: {
              user: '/avatars/user.png',
              assistant: '/avatars/logo.png',
            },
          }}
          feedback={{ enabled: true }}
          references={{ display: 'end' }}
          // search={{
          //   enabled: true,
          //   askLabel: 'Ask Acme',
          //   defaultView: {
          //     searchesHeading: 'Recommended for you',
          //     searches: [
          //       { title: 'Welcome to Acme', href: '/' },
          //       { title: 'Get Started', href: '/' },
          //       { title: 'Onboarding', href: '/' },
          //       { title: 'Payments', href: '/' },
          //       { title: 'User Management', href: '/' },
          //       { title: 'Acme CLI', href: '/' },
          //       { title: 'How to build an Acme app', href: '/' },
          //       { title: 'How to setup authentication', href: '/' },
          //       { title: 'How to invite users', href: '/' },
          //     ],
          //   },
          //   provider: {
          //     name: 'algolia',
          //     apiKey: process.env.NEXT_PUBLIC_ALGOLIA_API_KEY!,
          //     appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
          //     indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME!,
          //   },
          //   getHref: (result: any) => result.href,
          //   getHeading: (result: any) => result.heading,
          //   getTitle: (result) => result.content || undefined,
          // }}
          close={{ visible: false }}
          linkAs={Link}
        ></Markprompt>
      </div>
    </>
  );
}
