/* eslint-disable @typescript-eslint/no-explicit-any */
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { Flame, MoreHorizontal, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Button } from '@/components/ui/Button';
import { TicketForm } from '@/components/ui/TicketForm';
import { ChatMessage, submitChatGenerator } from '@/lib/chat';
import { CATEGORIES } from '@/lib/constants';

const inter = Inter({ subsets: ['latin'] });

type State = {
  currentMessage?: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
  streamedMessage?: string | null;
  generatingResponse?: boolean;
  generatingTicketInfo?: boolean;
  references?: any[];
  ticketInfo?: {
    product: 'platform' | 'v0';
    problemArea: string;
    subject: string;
    description: string;
  };
  isSimulatingIncident?: boolean;
};

export default function Home() {
  const [state, setState] = useState<State>({ messages: [] });

  const submitMessage = useCallback(
    async (message: string) => {
      setState((s) => ({
        ...s,
        streamedMessage: '',
        ticketInfo: undefined,
        generatingResponse: true,
      }));

      const messages: ChatMessage[] = [];

      if (state.isSimulatingIncident) {
        messages.push({
          role: 'user',
          content:
            'IMPORTANT: Acme is currently ongoing a major outage of the cron service. If there are any questions related to cron jobs, respond by saying that the issue has been detected and an investigation is ongoing.',
        });
      }

      messages.push({
        role: 'user',
        content: message,
      });

      for await (const value of submitChatGenerator(
        messages,
        process.env.NEXT_PUBLIC_PROJECT_KEY!,
      )) {
        if (value.content) {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
          });
          setState((s) => ({
            ...s,
            streamedMessage: value.content,
          }));
        }

        if (value.references) {
          setState((s) => ({
            ...s,
            references: value.references,
          }));

          setTimeout(() => {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth',
            });
          }, 200);
        }
      }

      setState((s) => ({
        ...s,
        messages: [
          ...(s.messages || []),
          { role: 'assistant', content: s.streamedMessage || '' },
        ],
        generatingResponse: false,
      }));
    },
    [state.isSimulatingIncident],
  );

  const createTicket = useCallback(async () => {
    setState((s) => ({ ...s, generatingTicketInfo: true }));

    let category = '';
    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: `Below is message describing an issue I am having. Based on this message, your task is to assign the message to one of the following categories. You should reply only with the category, and should not add any extra text to the response:\n\n${CATEGORIES.map(
          (c) => `- ${c}`,
        ).join('\n')}`,
      },
      {
        role: 'user',
        content: state.currentMessage || '',
      },
    ];

    for await (const chunk of submitChatGenerator(
      messages,
      process.env.NEXT_PUBLIC_PROJECT_KEY!,
      {
        systemPrompt:
          'You are an expert technical support engineer from Acme who loves to help people.',
        doNotInjectContext: true,
        excludeFromInsights: true,
      },
    )) {
      if (chunk.content) {
        category = chunk.content || '';
      }
    }

    let subject = '';
    for await (const chunk of submitChatGenerator(
      [
        {
          role: 'user',
          content: `Below is message describing the issue I am having. Please summarize it in a single sentence to use for a subject matter.`,
        },
        {
          role: 'user',
          content: state.currentMessage || '',
        },
      ],
      process.env.NEXT_PUBLIC_PROJECT_KEY!,
      {
        systemPrompt:
          'You are an expert technical support engineer from Acme who loves to help people.',
        doNotInjectContext: true,
        excludeFromInsights: true,
      },
    )) {
      if (chunk.content) {
        subject = chunk.content || '';
      }
    }

    let improvedMessage = '';
    for await (const chunk of submitChatGenerator(
      [
        {
          role: 'user',
          content: `Below is message describing an issue I am having. Please rewrite it into a concise message with all available information and no typos. Also follow these instructions:

- Rewrite it so that a support agent can immediately see what is going wrong.
- Make sure to not omit any parts of the question.
- Rewrite it in English if my message is another language.
- Just rewrite it with no additional tags. For instance, don't include a "Subject:" line.`,
        },
        {
          role: 'user',
          content: state.currentMessage || '',
        },
      ],
      process.env.NEXT_PUBLIC_PROJECT_KEY!,
      {
        systemPrompt:
          'You are an expert technical support engineer from Acme who loves to help people.',
        doNotInjectContext: true,
        excludeFromInsights: true,
      },
    )) {
      if (chunk.content) {
        improvedMessage = chunk.content || '';
      }
    }

    setState((s) => ({
      ...s,
      generatingTicketInfo: false,
      ticketInfo: {
        product: state.currentMessage?.includes('v0') ? 'v0' : 'platform',
        problemArea: category || '',
        subject: subject || '',
        description: `${improvedMessage}\n\n-------------------\n\nOriginal message:\n\n${
          state.currentMessage || ''
        }`,
      },
    }));

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight - 1100,
        behavior: 'smooth',
      });
    }, 200);
  }, [state.currentMessage]);

  return (
    <main
      className={`relative flex justify-center items-start min-h-screen bg-neutral-50 p-8 ${inter.className}`}
    >
      <Head>
        <title>Markprompt Ticket Deflector</title>
        <meta charSet="utf-8" />
      </Head>
      <div className="prose w-full px-8 pt-0 pb-16 max-w-screen-sm rounded-md shadow-xl bg-white flex flex-col relative">
        <div className="absolute top-8 right-8 flex flex-row gap-4 items-center">
          <Flame
            className={clsx('text-orange-500 w-4 h-4 transition duration-300', {
              'opacity-0': !state.isSimulatingIncident,
            })}
          />
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="bg-transparent border-0 outline-none rounded-md hover:bg-neutral-100 transition p-1">
                <MoreHorizontal className="w-5 h-5 text-neutral-500" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="DropdownMenuContent"
                sideOffset={5}
              >
                <DropdownMenu.Item
                  className="DropdownMenuItem outline-none"
                  onSelect={() => {
                    setState((s) => ({
                      ...s,
                      isSimulatingIncident: !s.isSimulatingIncident,
                    }));
                  }}
                >
                  <div className="flex flex-row gap-2 items-center">
                    {state.isSimulatingIncident && (
                      <Flame className="w-4 h-4 text-orange-500" />
                    )}
                    Simulate incident
                  </div>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
        <h2>Submit a case</h2>
        <fieldset>
          <label htmlFor="description">
            <div className="mb-1 text-xs text-neutral-700">
              Describe your issue
            </div>
          </label>
          <textarea
            id="description"
            className="py-1.5 px-2 w-full h-[120px] appearance-none rounded-md border bg-white text-neutral-900 transition duration-200 placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:text-neutral-500 border-neutral-200 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/10 text-sm"
            onChange={(e) =>
              setState((s) => ({ ...s, currentMessage: e.target.value }))
            }
          />
        </fieldset>
        <Button
          disabled={!state.currentMessage}
          loading={state.generatingResponse}
          variant="cta"
          className="place-self-end"
          onClick={() => {
            if (state.currentMessage) {
              submitMessage(state.currentMessage);
            }
          }}
        >
          Submit
        </Button>
        {state.streamedMessage && (
          <>
            <h4>Suggested answer</h4>
            <Markdown
              className="max-w-full prose prose-sm"
              remarkPlugins={[remarkGfm]}
            >
              {state.streamedMessage || ''}
            </Markdown>
            <div
              className={clsx(
                'bg-white flex flex-row gap-3 items-center rounded-full shadow-md place-self-end mt-2 px-3 py-1.5 border border-neutral-100',
                {
                  'opacity-0': state.generatingResponse,
                },
              )}
            >
              <ThumbsDown className="w-4 h-5" />
              <ThumbsUp className="w-4 h-5" />
            </div>
          </>
        )}

        {!state.generatingResponse && state.streamedMessage && (
          <div>
            {state.references && (
              <>
                <p className="font-semibold text-sm mb-2">Relevant resources</p>
                <div className="flex flex-row flex-warp overflow-x-auto gap-4 items-center not-prose pb-4">
                  {state.references.map((r, i) => {
                    return (
                      <a
                        key={`reference-${i}`}
                        className="font-medium rounded-full bg-neutral-100 px-3 py-1 text-sm whitespace-nowrap hover:bg-neutral-200 transition"
                        target="_blank"
                        href={r.file.path}
                      >
                        {r.file.title.split('|')[0].trim()}
                      </a>
                    );
                  })}
                </div>
              </>
            )}
            {!state.ticketInfo && (
              <>
                <p className="font-semibold text-sm mb-2">
                  Did this not solve your issue?
                </p>
                <div className="place-self-start flex flex-row gap-4 items-center">
                  <Button
                    variant="cta"
                    loading={state.generatingTicketInfo}
                    onClick={createTicket}
                  >
                    Create a ticket
                  </Button>
                  {state.generatingTicketInfo && (
                    <span className="text-sm text-neutral-500 animate-pulse">
                      Generating ticket info...
                    </span>
                  )}
                </div>
              </>
            )}
            <div>
              {state.ticketInfo && (
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <TicketForm
                    problemArea={state.ticketInfo.problemArea}
                    subject={state.ticketInfo.subject}
                    description={state.ticketInfo.description}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
