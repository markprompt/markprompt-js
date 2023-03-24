import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import {
  SessionContextProvider,
  useSession,
} from '@supabase/auth-helpers-react';
import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect, useState } from 'react';
import { NextComponentType, NextPageContext } from 'next';
import { Toaster } from '@/components/ui/Toaster';
import { ManagedAppContext } from '@/lib/context/app';
import { ManagedTrainingContext } from '@/lib/context/training';
import * as Fathom from 'fathom-client';
import { useRouter } from 'next/router';
import { PlainProvider } from '@team-plain/react-chat-ui';
import { ChatWindow, plainTheme } from '@/components/user/ChatWindow';
import { getHost } from '@/lib/utils';

interface CustomAppProps<P = {}> extends AppProps<P> {
  Component: NextComponentType<NextPageContext, any, P> & {
    getLayout?: (page: ReactNode) => JSX.Element;
    title?: string;
  };
}

const getCustomerJwt = async () => {
  return fetch('/api/user/jwt')
    .then((res) => res.json())
    .then((res) => res.customerJwt);
};

export default function App({ Component, pageProps }: CustomAppProps) {
  const router = useRouter();
  const [supabase] = useState(() => createBrowserSupabaseClient());

  useEffect(() => {
    const origin = getHost();
    if (!process.env.NEXT_PUBLIC_FATHOM_SITE_ID || !origin) {
      return;
    }

    Fathom.load(process.env.NEXT_PUBLIC_FATHOM_SITE_ID, {
      includedDomains: [origin],
    });

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }
    router.events.on('routeChangeComplete', onRouteChangeComplete);

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ThemeProvider defaultTheme="dark" attribute="class">
        <SessionContextProvider
          supabaseClient={supabase}
          initialSession={(pageProps as any).initialSession}
        >
          <ManagedPlainProvider>
            <ManagedAppContext>
              <ManagedTrainingContext>
                <Component {...pageProps}></Component>
              </ManagedTrainingContext>
            </ManagedAppContext>
          </ManagedPlainProvider>
        </SessionContextProvider>
      </ThemeProvider>
      <Toaster />
    </>
  );
}

export const ManagedPlainProvider = ({ children }: { children: ReactNode }) => {
  const session = useSession();

  return (
    <PlainProvider
      appKey={process.env.NEXT_PUBLIC_PLAIN_APP_KEY!}
      customer={
        session?.user
          ? { type: 'logged-in', getCustomerJwt }
          : { type: 'logged-out' }
      }
      theme={plainTheme}
    >
      {children}
      <ChatWindow />
    </PlainProvider>
  );
};
