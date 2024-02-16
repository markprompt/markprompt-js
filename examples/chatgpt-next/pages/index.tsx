import { ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Markprompt } from '@markprompt/react';

export default function IndexPage(): ReactElement {
  return (
    <>
      <Head>
        <title>Markprompt + Next.js</title>
      </Head>
      <div style={{ width: '100%', height: '100vh' }}>
        <Markprompt
          projectKey={process.env.NEXT_PUBLIC_MARKPROMPT_PROJECT_KEY!}
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
          linkAs={Link}
        ></Markprompt>
      </div>
    </>
  );
}
