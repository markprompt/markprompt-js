'use client';

import MarkpromptComponent from '@/components/markprompt';
import { ChatProvider } from '@markprompt/react';

export default function Home() {
  return (
    <ChatProvider projectKey={process.env.NEXT_PUBLIC_MARKPROMPT_PROJECT_KEY!}>
      <MarkpromptComponent />
    </ChatProvider>
  );
}
