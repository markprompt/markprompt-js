import { DEFAULT_SUBMIT_CHAT_OPTIONS } from '@markprompt/core';
import { render, screen, waitFor } from '@testing-library/react';
import { suppressErrorOutput } from '@testing-library/react-hooks';
import { userEvent } from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import {
  afterEach,
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { ChatView } from './ChatView.js';

const encoder = new TextEncoder();
let markpromptData: unknown = '';
let markpromptDebug = '';
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
let requestBody: any = {};
let response: string | string[] = [];
let slowChunks = false;
let status = 200;
let stream: ReadableStream;

const server = setupServer(
  rest.post(DEFAULT_SUBMIT_CHAT_OPTIONS.apiUrl!, async (req, res, ctx) => {
    requestBody = await req.json();

    stream = new ReadableStream({
      async start(controller) {
        for (const chunk of response) {
          if (slowChunks) {
            await new Promise((resolve) => setTimeout(resolve, 10));
          }
          controller.enqueue(encoder.encode(chunk));
        }
        controller?.close();
      },
    });

    return res(
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
);

describe('ChatView', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

  afterEach(() => {
    status = 200;
    response = [];
    requestBody = {};
    slowChunks = false;
    markpromptData = '';
    markpromptDebug = '';

    server.resetHandlers();
    vi.resetAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
    server.close();
  });

  it('renders', () => {
    render(<ChatView projectKey="test-key" />);
    expect(screen.getByText('Ask AI')).toBeInTheDocument();
  });

  it('throws an error if no project key is provided', () => {
    const restoreConsole = suppressErrorOutput();

    try {
      // @ts-expect-error intentionally passing no project key
      expect(() => render(<ChatView />)).toThrow(
        'Markprompt: a project key is required. Make sure to pass your Markprompt project key to <ChatView />.',
      );
    } finally {
      restoreConsole();
    }
  });

  it('submits a chat request', async () => {
    response = ['answer'];

    const user = await userEvent.setup();

    render(<ChatView projectKey="test-key" />);

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText('answer')).toBeInTheDocument();
    });
  });

  it('shows references', async () => {
    response = ['answer'];
    const references = [
      {
        file: { path: '/page1', source: { type: 'file-upload' } },
        meta: { leadHeading: { value: 'Page 1' } },
      },
    ];
    markpromptData = { references };

    const user = await userEvent.setup();

    render(<ChatView projectKey="test-key" />);

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText('Page 1')).toBeInTheDocument();
    });
  });

  it('aborts a pending chat request when the view changes', async () => {
    response = ['testing', 'testing', 'test'];
    slowChunks = true;

    const user = await userEvent.setup();

    const { rerender } = render(<ChatView projectKey="test-key" />);

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    rerender(<ChatView projectKey="test-key" activeView="search" />);

    await waitFor(() => {
      expect(
        screen.getByText(
          'This chat response was cancelled. Please try regenerating the answer or ask another question.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('initially does not have stored conversations', async () => {
    const user = await userEvent.setup();

    render(<ChatView projectKey="test-key" />);

    await user.click(screen.getByRole('combobox'));

    expect(screen.getByRole('option')).toHaveTextContent('New chat');
  });

  it('starts a new chat when the "New chat" option is selected', async () => {
    response = ['answer'];

    const user = await userEvent.setup();

    render(<ChatView projectKey="test-key" />);

    await user.type(screen.getByRole('textbox'), 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText('answer')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option'));

    await waitFor(() => {
      expect(screen.queryByText('answer')).not.toBeInTheDocument();
    });
  });

  it('saves conversations', async () => {
    const conversationId = crypto.randomUUID();
    const promptId = crypto.randomUUID();
    markpromptData = { conversationId, promptId };
    response = ['answer'];

    const user = await userEvent.setup();

    render(<ChatView projectKey="test-key" />);

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
});
