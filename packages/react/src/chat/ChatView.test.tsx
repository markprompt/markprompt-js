import {
  DEFAULT_SUBMIT_CHAT_OPTIONS,
  DEFAULT_SUBMIT_FEEDBACK_OPTIONS,
  type FileSectionReference,
} from '@markprompt/core';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { ChatView } from './ChatView.js';
import {
  createChatStore,
  useChatStore,
  type ChatViewMessage,
} from './store.js';
import { formatEvent, getChunk } from '../prompt/usePrompt.test.js';

const encoder = new TextEncoder();
let markpromptData: {
  conversationId?: string;
  promptId?: string;
  references?: FileSectionReference[];
  debug?: unknown;
} = {};
let markpromptDebug: object = {};
let response:
  | string
  | {
      content: string | null;
      tool_call?: { name: string; parameters: string } | null;
    }[] = [];
let wait = false;
let status = 200;
let stream: ReadableStream;

const server = setupServer(
  rest.post(DEFAULT_SUBMIT_CHAT_OPTIONS.apiUrl!, async (req, res, ctx) => {
    if (status >= 400) {
      return res(
        ctx.delay('real'),
        ctx.status(status),
        ctx.set(
          'x-markprompt-data',
          encoder.encode(JSON.stringify(markpromptData)).toString(),
        ),
        ctx.set(
          'x-markprompt-debug-info',
          encoder.encode(JSON.stringify(markpromptDebug)).toString(),
        ),
        ctx.json({ error: 'Internal server error' }),
      );
    }

    stream = new ReadableStream({
      async start(controller) {
        if (Array.isArray(response)) {
          let i = 0;
          for (const chunk of response) {
            if (wait) await new Promise((resolve) => setTimeout(resolve, 1000));
            controller.enqueue(
              encoder.encode(
                formatEvent({
                  data: getChunk(chunk.content, chunk.tool_call ?? null, i),
                }),
              ),
            );
            i++;
          }
          controller.enqueue(encoder.encode(formatEvent({ data: '[DONE]' })));
        }

        controller?.close();
      },
    });

    return res(
      ctx.delay('real'),
      ctx.status(status),
      ctx.set(
        'x-markprompt-data',
        encoder.encode(JSON.stringify(markpromptData)).toString(),
      ),
      ctx.set(
        'x-markprompt-debug-info',
        encoder.encode(JSON.stringify(markpromptDebug)).toString(),
      ),
      ctx.body(stream),
    );
  }),
  rest.post(DEFAULT_SUBMIT_FEEDBACK_OPTIONS.apiUrl!, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ status: 'ok' }));
  }),
);

describe('ChatView', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

  beforeEach(() => {
    status = 200;
    response = [];
    wait = false;
    markpromptData = {};
    markpromptDebug = {};

    server.resetHandlers();
    vi.resetAllMocks();
    localStorage.clear();
  });

  afterAll(() => {
    vi.restoreAllMocks();
    server.close();
  });

  it('renders', () => {
    render(<ChatView projectKey={crypto.randomUUID()} />);
    expect(screen.getByText('Ask AI')).toBeInTheDocument();
  });

  it('throws an error if no project key is provided', () => {
    try {
      // @ts-expect-error intentionally passing no project key
      expect(() => render(<ChatView />)).toThrow(
        'Markprompt: a project key is required. Make sure to pass your Markprompt project key to <ChatView />.',
      );
    } catch {
      // nothing
    }
  });

  it('submits a chat request', async () => {
    response = [{ content: 'answer' }];

    const user = await userEvent.setup();

    render(<ChatView projectKey={crypto.randomUUID()} />);

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText('answer')).toBeInTheDocument();
    });
  });

  it('allows selecting an example prompt', async () => {
    const user = await userEvent.setup();

    response = [{ content: 'answer' }];

    render(
      <ChatView
        projectKey={crypto.randomUUID()}
        chatOptions={{
          defaultView: {
            message: 'test message',
            promptsHeading: 'test heading',
            prompts: ['example prompt'],
          },
        }}
      />,
    );

    await user.click(screen.getByText('example prompt'));

    await waitFor(() => {
      expect(screen.getByText('answer')).toBeInTheDocument();
    });
  });

  it('allows users to ask multiple questions', async () => {
    const conversationId = crypto.randomUUID();
    const promptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId };
    response = [{ content: 'answer' }];

    const user = await userEvent.setup();

    render(<ChatView projectKey={crypto.randomUUID()} />);

    await user.type(screen.getByRole('textbox'), 'test 1');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getAllByText('answer')).toHaveLength(2);
    });

    const nextPromptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId: nextPromptId };
    response = [{ content: 'a different answer' }];

    await user.type(screen.getByRole('textbox'), 'test 2');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getAllByText('a different answer')).toHaveLength(1);
    });

    expect(screen.queryAllByText('answer')).toHaveLength(2);
  });

  it('allows users to switch between conversations', async () => {
    const conversationId = crypto.randomUUID();
    const promptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId };
    response = [{ content: 'answer' }];

    const user = await userEvent.setup();

    render(<ChatView projectKey={crypto.randomUUID()} />);

    await user.type(screen.getByRole('textbox'), 'test 1');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getAllByText('answer')).toHaveLength(2);
    });

    await user.click(screen.getByText('New chat'));

    const nextConversationId = crypto.randomUUID();
    const nextPromptId = crypto.randomUUID();
    markpromptData = {
      conversationId: nextConversationId,
      promptId: nextPromptId,
    };
    response = [{ content: 'a different answer' }];

    await user.type(screen.getByRole('textbox'), 'test 2');
    await user.keyboard('{Enter}');

    await user.click(screen.getByRole('button', { name: 'test 1 answer' }));
  });

  it('allows users to confirm tool calls', async () => {
    async function do_a_thing(): Promise<string> {
      return 'test function result';
    }

    const user = await userEvent.setup();

    response = [
      { tool_call: { name: 'do_a_thing', parameters: '{}' }, content: null },
    ];

    render(
      <ChatView
        projectKey={crypto.randomUUID()}
        chatOptions={{
          tool_choice: 'auto',
          tools: [
            {
              call: do_a_thing,
              tool: {
                type: 'function',
                function: {
                  name: 'do_a_thing',
                  description: 'Do a thing',
                  parameters: {
                    type: 'object',
                    properties: {},
                  },
                },
              },
              requireConfirmation: true,
            },
          ],
        }}
      />,
    );

    await user.type(screen.getByRole('textbox'), 'I want to do a thing');
    await user.keyboard('{Enter}');

    expect(
      await screen.findByText('The bot wants to perform the following action', {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(await screen.findByText('Do a thing')).toBeInTheDocument();

    response = [{ content: 'you did a thing and it got a result' }];

    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(
        screen.getByText('you did a thing and it got a result'),
      ).toBeInTheDocument();
    });
  });

  it('allows users to confirm tool calls with a custom confirmation', async () => {
    async function do_a_thing(): Promise<string> {
      return 'test function result';
    }

    const user = await userEvent.setup();

    response = [
      { tool_call: { name: 'do_a_thing', parameters: '{}' }, content: null },
    ];

    render(
      <ChatView
        projectKey={crypto.randomUUID()}
        chatOptions={{
          tool_choice: 'auto',
          tools: [
            {
              call: do_a_thing,
              tool: {
                type: 'function',
                function: {
                  name: 'do_a_thing',
                  description: 'Do a thing',
                  parameters: {
                    type: 'object',
                    properties: {},
                  },
                },
              },
              requireConfirmation: true,
            },
          ],
          ToolCallsConfirmation(props) {
            return (
              <div>
                <p>custom confirmation</p>
                {/* eslint-disable react/prop-types */}
                <button onClick={props.confirmToolCalls}>Confirm</button>
              </div>
            );
          },
        }}
      />,
    );

    await user.type(screen.getByRole('textbox'), 'I want to do a thing');
    await user.keyboard('{Enter}');

    expect(
      await screen.findByText('custom confirmation', { exact: false }),
    ).toBeInTheDocument();

    response = [{ content: 'you did a thing and it got a result' }];

    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(
        screen.getByText('you did a thing and it got a result'),
      ).toBeInTheDocument();
    });
  });

  it('automatically calls tools that do not require confirmation', async () => {
    async function do_a_thing(): Promise<string> {
      return 'test function result';
    }

    const user = await userEvent.setup();

    response = [
      { tool_call: { name: 'do_a_thing', parameters: '{}' }, content: null },
    ];

    render(
      <ChatView
        projectKey={crypto.randomUUID()}
        chatOptions={{
          tool_choice: 'auto',
          tools: [
            {
              call: do_a_thing,
              tool: {
                type: 'function',
                function: {
                  name: 'do_a_thing',
                  description: 'Do a thing',
                  parameters: {
                    type: 'object',
                    properties: {},
                  },
                },
              },
              requireConfirmation: false,
            },
          ],
        }}
      />,
    );

    await user.type(screen.getByRole('textbox'), 'I want to do a thing');
    await user.keyboard('{Enter}');

    expect(
      await screen.findByText(
        'The bot is calling the following tools on your behalf',
        { exact: false },
      ),
    ).toBeInTheDocument();

    response = [{ content: 'you did a thing and it got a result' }];

    await waitFor(() => {
      expect(
        screen.getByText('you did a thing and it got a result'),
      ).toBeInTheDocument();
    });
  });

  it('shows an error state for failed tool calls', async () => {
    async function do_a_thing(): Promise<string> {
      throw new Error('tool call failed');
    }

    const user = await userEvent.setup();

    response = [
      { tool_call: { name: 'do_a_thing', parameters: '{}' }, content: null },
    ];

    render(
      <ChatView
        projectKey={crypto.randomUUID()}
        chatOptions={{
          tool_choice: 'auto',
          tools: [
            {
              call: do_a_thing,
              tool: {
                type: 'function',
                function: {
                  name: 'do_a_thing',
                  description: 'Do a thing',
                  parameters: {
                    type: 'object',
                    properties: {},
                  },
                },
              },
              requireConfirmation: false,
            },
          ],
        }}
      />,
    );

    await user.type(screen.getByRole('textbox'), 'I want to do a thing');
    await user.keyboard('{Enter}');

    expect(
      await screen.findByText(
        'The bot is calling the following tools on your behalf',
        { exact: false },
      ),
    ).toBeInTheDocument();

    response = [{ content: 'you did a thing and it got a result' }];

    await waitFor(() => {
      expect(screen.getByText('Tool status: error')).toBeInTheDocument();
    });
  });

  it('renders a custom component for the DefaultView message', () => {
    const DefaultViewMessage = vi.fn(() => <p>test</p>);
    render(
      <ChatView
        projectKey={crypto.randomUUID()}
        chatOptions={{ defaultView: { message: DefaultViewMessage } }}
      />,
    );
    expect(DefaultViewMessage).toHaveBeenCalledOnce();
  });

  it('renders empty prompts for the DefaultView message', () => {
    const DefaultViewMessage = vi.fn(() => <p>test</p>);
    render(
      <ChatView
        projectKey={crypto.randomUUID()}
        chatOptions={{
          defaultView: { message: DefaultViewMessage, prompts: [] },
        }}
      />,
    );
    expect(DefaultViewMessage).toHaveBeenCalledOnce();
  });

  it('shows references', async () => {
    response = [{ content: 'answer' }];
    const references = [
      {
        file: { path: '/page1', source: { type: 'file-upload' as const } },
        meta: { leadHeading: { value: 'Page 1' } },
      },
    ];
    markpromptData = { references };

    const user = await userEvent.setup();

    render(<ChatView projectKey={crypto.randomUUID()} />);

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText('Page 1')).toBeInTheDocument();
    });
  });

  it('shows references at the end', async () => {
    response = [{ content: 'answer' }];
    const references = [
      {
        file: { path: '/page1', source: { type: 'file-upload' as const } },
        meta: { leadHeading: { value: 'Page 1' } },
      },
    ];
    markpromptData = { references };

    const user = await userEvent.setup();

    render(
      <ChatView
        projectKey={crypto.randomUUID()}
        referencesOptions={{ display: 'end' }}
      />,
    );

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText('Page 1')).toBeInTheDocument();
    });
  });

  it('does not show references when disabled', async () => {
    response = [{ content: 'answer' }];
    const references = [
      {
        file: { path: '/page1', source: { type: 'file-upload' as const } },
        meta: { leadHeading: { value: 'Page 1' } },
      },
    ];
    markpromptData = { references };

    const user = await userEvent.setup();

    render(
      <ChatView
        projectKey={crypto.randomUUID()}
        referencesOptions={{ display: 'none' }}
      />,
    );

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.queryByText('Page 1')).not.toBeInTheDocument();
    });
  });

  it('aborts a pending chat request when the view changes', async () => {
    const conversationId = crypto.randomUUID();
    const promptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId };
    response = [
      { content: 'testing' },
      { content: 'testing' },
      { content: 'test' },
    ];
    wait = true;

    const user = await userEvent.setup();

    const { rerender } = render(
      <ChatView projectKey={crypto.randomUUID()} activeView="chat" />,
    );

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    rerender(<ChatView projectKey={crypto.randomUUID()} activeView="search" />);

    await waitFor(() => {
      expect(
        screen.getByText(
          'This chat response was cancelled. Please try regenerating the answer or ask another question.',
        ),
      ).toBeInTheDocument();
    });
  });

  it(
    'aborts a pending chat request when a new prompt is submitted',
    async () => {
      response = [
        { content: 'testing ' },
        { content: 'testing ' },
        { content: 'test' },
      ];
      wait = true;

      const user = await userEvent.setup();

      render(<ChatView projectKey={crypto.randomUUID()} />);

      await user.type(screen.getByRole('textbox'), 'test');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(
          screen.getByText('Fetching relevant pages…'),
        ).toBeInTheDocument();
      });

      response = [
        { content: 'testing ' },
        { content: 'testing ' },
        { content: 'test again' },
      ];
      wait = false;

      await user.type(screen.getByRole('textbox'), 'test again');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(
          screen.getByText(
            'This chat response was cancelled. Please try regenerating the answer or ask another question.',
          ),
        ).toBeInTheDocument();
      });
    },
    {
      // flaky test: sometimes the first request finishes before it can be cancelled by the seceond prompt
      retry: 3,
    },
  );

  it('aborts a pending chat request when an error is returned from the API', async () => {
    status = 500;

    const user = await userEvent.setup();

    render(<ChatView projectKey={crypto.randomUUID()} />);

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(
        screen.getByText(
          'Sorry, it looks like the bot is having a hard time! Please try again in a few minutes.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('initially does not have stored conversations', async () => {
    render(<ChatView projectKey={crypto.randomUUID()} />);
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('starts a new chat when the "New chat" option is selected', async () => {
    const conversationId = crypto.randomUUID();
    const promptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId };
    response = [{ content: 'answer' }];

    const user = await userEvent.setup();

    render(<ChatView projectKey={crypto.randomUUID()} />);

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'New chat' }));

    await waitFor(() => {
      // only the sidebar is shown, not the conversation itself
      expect(screen.getAllByText('answer')).toHaveLength(1);
    });
  });

  it('saves conversations', async () => {
    const conversationId = crypto.randomUUID();
    const promptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId };
    response = [{ content: 'answer' }];

    const user = await userEvent.setup();

    render(<ChatView projectKey={crypto.randomUUID()} />);

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getAllByText('answer')).toHaveLength(2);
    });

    await user.click(screen.getByRole('combobox'));

    await waitFor(() => {
      expect(screen.getAllByRole('option')).toHaveLength(2);
    });
  });

  it('saves conversations with serialized errors', async () => {
    const projectKey = crypto.randomUUID();
    const conversationId = crypto.randomUUID();
    const promptId = crypto.randomUUID();

    markpromptData = { conversationId, promptId };
    status = 500;

    render(<ChatView projectKey={projectKey} />);

    const user = await userEvent.setup();

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await screen.findByText(
      'Sorry, it looks like the bot is having a hard time! Please try again in a few minutes.',
    );

    expect(localStorage.getItem('markprompt')).not.toBeNull();

    expect(
      JSON.parse(localStorage.getItem('markprompt')!).state
        .messagesByConversationId[conversationId].messages[1].error,
    ).toEqual({
      type: 'error',
      name: 'Error',
      message: 'Malformed response from Markprompt API',
      cause: { error: 'Internal server error' },
    });
  });

  it('does not save conversations to LocalStorage when history is disabled', async () => {
    const conversationId = crypto.randomUUID();
    const promptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId };
    response = [{ content: 'answer' }];

    const user = await userEvent.setup();

    render(
      <ChatView
        projectKey={crypto.randomUUID()}
        chatOptions={{ history: false }}
      />,
    );

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getAllByText('answer')).toHaveLength(2);
    });

    expect(localStorage.getItem('markprompt')).toBeNull();
  });

  it("does not restore a conversation if it's older than 4 hours", () => {
    const projectKey = crypto.randomUUID();
    const conversationId = crypto.randomUUID();
    const lastUpdated = new Date(
      new Date().getTime() - 1000 * 60 * 60 * 5,
    ).toISOString();

    localStorage.setItem(
      'markprompt',
      JSON.stringify({
        state: {
          conversationIdsByProjectKey: {
            [projectKey]: [conversationId],
          },
          messagesByConversationId: {
            [conversationId]: {
              lastUpdated,
              messages: [
                {
                  id: crypto.randomUUID(),
                  promptId: crypto.randomUUID(),
                  role: 'user',
                  content: 'test',
                  state: 'done',
                },
                {
                  id: crypto.randomUUID(),
                  promptId: crypto.randomUUID(),
                  role: 'assistant',
                  content: 'answer',
                  state: 'done',
                  references: [],
                },
              ] satisfies ChatViewMessage[],
            },
          },
        },
        version: 1,
      }),
    );

    render(<ChatView projectKey={projectKey} />);

    expect(screen.getAllByText('test')).toHaveLength(1);
  });

  it('restores the latest conversation that is < 4 hours old', () => {
    const projectKey = crypto.randomUUID();
    const conversationId1 = crypto.randomUUID();
    const conversationId2 = crypto.randomUUID();
    const lastUpdated1 = new Date(
      new Date().getTime() - 1000 * 60 * 60 * 3,
    ).toISOString();
    const lastUpdated2 = new Date(
      new Date().getTime() - 1000 * 60 * 60 * 2,
    ).toISOString();

    localStorage.setItem(
      'markprompt',
      JSON.stringify({
        state: {
          conversationIdsByProjectKey: {
            [projectKey]: [conversationId1, conversationId2],
          },
          messagesByConversationId: {
            [conversationId1]: {
              lastUpdated: lastUpdated1,
              messages: [
                {
                  id: crypto.randomUUID(),
                  promptId: crypto.randomUUID(),
                  content: 'test 1',
                  role: 'user',
                  state: 'done',
                },
                {
                  id: crypto.randomUUID(),
                  promptId: crypto.randomUUID(),
                  content: 'answer 1',
                  role: 'assistant',
                  state: 'done',
                  references: [],
                },
              ] satisfies ChatViewMessage[],
            },
            [conversationId2]: {
              lastUpdated: lastUpdated2,
              messages: [
                {
                  id: crypto.randomUUID(),
                  promptId: crypto.randomUUID(),
                  content: 'test 2',
                  role: 'user',
                  state: 'done',
                },
                {
                  id: crypto.randomUUID(),
                  promptId: crypto.randomUUID(),
                  content: 'answer 2',
                  role: 'assistant',
                  state: 'done',
                  references: [],
                },
              ] satisfies ChatViewMessage[],
            },
          },
        },
        version: 1,
      }),
    );

    render(<ChatView projectKey={projectKey} />);

    expect(screen.getAllByText('test 1')).toHaveLength(1);
    expect(screen.getAllByText('test 2')).toHaveLength(2);
  });

  it('allows users to give feedback', async () => {
    const conversationId = crypto.randomUUID();
    const promptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId };
    response = [{ content: 'answer' }];

    const user = await userEvent.setup();

    render(
      <ChatView
        projectKey={crypto.randomUUID()}
        feedbackOptions={{ enabled: true }}
      />,
    );

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(
        screen.getByText('Was this response helpful?'),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByText('yes'));
  });

  it('calls back after giving feedback', async () => {
    const onSubmit = vi.fn();
    const conversationId = crypto.randomUUID();
    const promptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId };
    response = [{ content: 'answer' }];

    const user = await userEvent.setup();

    render(
      <ChatView
        projectKey={crypto.randomUUID()}
        feedbackOptions={{ enabled: true, onFeedbackSubmit: onSubmit }}
      />,
    );

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(
        screen.getByText('Was this response helpful?'),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByText('yes'));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('allows users to regenerate an answer', async () => {
    const conversationId = crypto.randomUUID();
    const promptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId };
    response = [{ content: 'answer' }];

    const user = await userEvent.setup();

    render(<ChatView projectKey={crypto.randomUUID()} />);

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getAllByText('answer')).toHaveLength(2);
    });

    const nextPromptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId: nextPromptId };
    response = [{ content: 'a different answer' }];

    await user.click(screen.getByText('Regenerate'));

    await waitFor(() => {
      expect(screen.getAllByText('a different answer')).toHaveLength(2);
    });

    expect(screen.queryAllByText('answer')).toHaveLength(0);
  });

  it('allows users to stop generating an answer', async () => {
    const conversationId = crypto.randomUUID();
    const promptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId };
    response = [
      { content: 'testing ' },
      { content: 'testing ' },
      { content: 'test' },
    ];
    wait = true;

    const user = await userEvent.setup();

    render(<ChatView projectKey={crypto.randomUUID()} />);

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await user.click(await screen.findByText('Stop generating'));

    await waitFor(() => {
      expect(
        screen.getByText('This chat response was cancelled.', { exact: false }),
      ).toBeInTheDocument();
    });
  });

  it('errors when creating a standalone chat store', async () => {
    try {
      // @ts-expect-error - intentionally throwing error
      expect(() => createChatStore({})).toThrowError(
        'Markprompt: a project key is required. Make sure to pass your Markprompt project key to createChatStore.',
      );
    } catch {
      // nothing
    }
  });

  it('errors when calling useChatStore outside a provider', async () => {
    expect(() => renderHook(() => useChatStore((x) => x))).toThrow(
      'Missing ChatContext.Provider in the tree',
    );
  });
});
