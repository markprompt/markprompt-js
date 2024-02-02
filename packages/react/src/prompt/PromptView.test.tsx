import {
  DEFAULT_SUBMIT_CHAT_OPTIONS,
  DEFAULT_SUBMIT_FEEDBACK_OPTIONS,
  type FileSectionReference,
} from '@markprompt/core';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { PromptView } from './PromptView.js';
import { formatEvent, getChunk } from './usePrompt.test.js';

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
        ctx.status(status),
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

describe('PromptView', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

  afterEach(() => {
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

  it('should throw when rendered without projectKey', async () => {
    expect(() => render(<PromptView />)).toThrow(
      'Markprompt: a project key is required. Make sure to pass the projectKey to usePrompt.',
    );
  });

  it('should render with defaults', async () => {
    expect(() => render(<PromptView projectKey="test" />)).not.toThrow();
  });

  it('should answer a prompt', async () => {
    render(<PromptView projectKey="test" />);

    const user = userEvent.setup();

    const input = screen.getByRole('textbox');

    response = [{ content: 'test answer' }];

    await user.click(input);
    await user.type(input, 'test prompt');
    await user.keyboard('{Enter}');

    await vi.waitFor(() => screen.getByText('test answer'));

    expect(screen.getByText('test answer')).toBeInTheDocument();
  });

  it('should render a default view', async () => {
    render(
      <PromptView
        projectKey="test"
        promptOptions={{
          defaultView: {
            message:
              "Welcome to Markprompt! We're here to assist you. Just type your question to get started.",
            promptsHeading: 'Popular questions',
            prompts: [
              'What is Markprompt?',
              'How do I setup the React component?',
              'Do you have a REST API?',
            ],
          },
        }}
      />,
    );

    response = [{ content: 'test answer' }];

    const user = userEvent.setup();

    screen.debug();

    const prompt = screen.getByText('What is Markprompt?');

    user.click(prompt);

    await vi.waitFor(() => screen.getByText('test answer'));

    expect(screen.getByText('test answer')).toBeInTheDocument();
  });

  it('should render an error view', async () => {
    render(<PromptView projectKey="test" />);

    const user = userEvent.setup();

    const input = screen.getByRole('textbox');

    status = 500;

    await user.click(input);
    await user.type(input, 'test prompt');
    await user.keyboard('{Enter}');

    await vi.waitFor(() =>
      screen.getByText(
        'Sorry, it looks like the bot is having a hard time! Please try again in a few minutes.',
      ),
    );

    expect(
      screen.getByText(
        'Sorry, it looks like the bot is having a hard time! Please try again in a few minutes.',
      ),
    ).toBeInTheDocument();
  });
});
