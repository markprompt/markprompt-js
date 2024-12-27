import { Markprompt, openMarkprompt } from '@markprompt/react';
import Head from 'next/head';
import Link from 'next/link';
import { type ElementType, useEffect, type JSX } from 'react';

import { SearchIcon } from '../components/icons';

export default function IndexPage(): JSX.Element {
  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent): Promise<void> => {
      if (
        (event.key === 'k' && event.ctrlKey) ||
        (event.key === 'k' && event.metaKey)
      ) {
        event.preventDefault();
        await openMarkprompt();
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
            process.env.NEXT_PUBLIC_MARKPROMPT_PROJECT_KEY ?? 'enter-a-key'
          }
          defaultView="search"
          display="dialog"
          chat={{
            enabled: true,
            placeholder: 'Send a message',
            model: 'gpt-4',
            systemPrompt:
              'You are a friendly AI who loves to help people find the information they need!',
            avatars: {
              user: '/avatars/user.png',
              assistant: '/avatars/logo.png',
            },
          }}
          feedback={{ enabled: true }}
          references={{ display: 'end' }}
          search={{
            enabled: true,
            askLabel: 'Ask Acme',
            defaultView: {
              searchesHeading: 'Recommended for you',
              searches: [
                { title: 'Welcome to Acme', href: '/' },
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
            getTitle: (result) => result.content || undefined,
          }}
          close={{ visible: false }}
          linkAs={Link as ElementType<{ href?: string }>}
        >
          <div id="search">
            <SearchIcon
              style={{ strokeWidth: '2.5px', width: 16, height: 16 }}
              aria-hidden
            />
            <span>Search or ask documentation</span>
            <kbd>
              <span>⌘ K</span>
            </kbd>
          </div>
        </Markprompt>
      </div>
    </>
  );
}
