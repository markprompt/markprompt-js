import { Markprompt } from '@markprompt/react';
import Head from 'next/head';
import { ReactElement, forwardRef } from 'react';
import { SearchIcon } from '../components/icons';

export default function IndexPage(): ReactElement {
  return (
    <>
      <Head>
        <title>Markprompt + Next.js</title>
      </Head>
      <div
        style={{
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 48,
          display: 'flex',
          placeContent: 'center',
        }}
      >
        <Markprompt
          projectKey={
            process.env.NEXT_PUBLIC_MARKPROMPT_PROJECT_KEY || 'YOUR-PROJECT-KEY'
          }
          chat={{
            enabled: true,
            systemPrompt:
              'You are a very enthusiastic company representative who loves to help people!',
          }}
          search={{
            enabled: true,
            layout: 'input',
            defaultView: {
              searchesHeading: 'Recommended for you',
              searches: [
                { title: 'Welcome to Acme', href: '/welcome' },
                { title: 'Get Started', href: '/get-started' },
                { title: 'Onboarding', href: '/onboarding' },
                { title: 'Payments', href: '/payments' },
                { title: 'User Management', href: '/users' },
                { title: 'Acme CLI', href: '/acme-clie' },
                { title: 'How to build an Acme app', href: '/tutorials/build' },
                {
                  title: 'How to setup authentication',
                  href: '/tutorials/auth',
                },
                { title: 'How to invite users', href: '/tutorials/invite' },
              ],
            },
            provider: {
              name: 'algolia',
              apiKey: process.env.NEXT_PUBLIC_ALGOLIA_API_KEY!,
              appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
              indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME!,
            },
            getHref: (result: any) => result.href,
            getHeading: (result: any) => result.heading,
            getTitle: (result) => result.content || undefined,
          }}
          close={{ visible: false }}
          branding={{ show: false }}
        >
          <button id="search">
            <SearchIcon className="icon" />
            Search documentation...
          </button>
        </Markprompt>
      </div>
    </>
  );
}
