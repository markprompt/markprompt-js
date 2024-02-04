import { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Markprompt, openMarkprompt } from '@markprompt/react';
import { SearchIcon } from '../components/icons';

export default function IndexPage(): ReactElement {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (
        (event.key === 'k' && event.ctrlKey) ||
        (event.key === 'k' && event.metaKey)
      ) {
        event.preventDefault();
        openMarkprompt();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
            defaultView: {
              searchesHeading: 'Recommended for you',
              searches: [
                { title: 'Welcome to Acme', href: '/welcome' },
                { title: 'Get Started', href: '/' },
                { title: 'Onboarding', href: '/' },
                { title: 'Payments', href: '/' },
                { title: 'User Management', href: '/' },
                { title: 'Acme CLI', href: '/' },
                { title: 'How to build an Acme app', href: '/' },
                { title: 'How to setup authentication', href: '/' },
                { title: 'How to invite users', href: '/' },
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
          linkAs={Link}
          branding={{ show: false }}
        >
          <button id="search">
            <SearchIcon />
            <span>Search documentation...</span>
            <kbd>
              <span>⌘ K</span>
            </kbd>
          </button>
        </Markprompt>
      </div>
    </>
  );
}
