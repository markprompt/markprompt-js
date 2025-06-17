'use client';

import { Markprompt, useChatStore } from '@markprompt/react';

export default function MarkpromptComponent() {
  const clearStorage = useChatStore((state) => state.clearStorage);

  return (
    <div className="grid w-screen h-dvh place-items-center">
      <Markprompt
        projectKey={
          process.env.NEXT_PUBLIC_MARKPROMPT_PROJECT_KEY ?? 'enter-a-key'
        }
      />

      <button
        type="button"
        onClick={() => {
          console.debug('> clearing storage...');
          clearStorage();
          console.debug('> storage cleared');
        }}
        className="rounded-md bg-neutral-100 text-neutral-900 w-fit px-2 py-1.5 font-normal text-sm border border-solid border-neutral-200 text-nowrap"
      >
        Clear Storage
      </button>
    </div>
  );
}
