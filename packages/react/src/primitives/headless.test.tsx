import {
  DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS,
  SearchResult,
} from '@markprompt/core';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import {
  afterAll,
  afterEach,
  beforeAll,
  expect,
  test,
  vi,
  vitest,
} from 'vitest';

import * as Markprompt from './headless.js';
import { MarkpromptContext } from '../context';
import { View } from '../useMarkprompt.js';

let searchResults: SearchResult[] = [];
let status = 200;
const server = setupServer(
  rest.get(
    DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS.apiUrl!,
    async (_req, res, ctx) => {
      return res(
        ctx.status(status),
        ctx.body(JSON.stringify({ data: searchResults })),
      );
    },
  ),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterAll(() => {
  server.close();
});

afterEach(() => {
  searchResults = [];
  status = 200;
  server.resetHandlers();
});

test('Initial state', async () => {
  render(
    <Markprompt.Root projectKey="TEST_PROJECT_KEY">
      <Markprompt.DialogTrigger>Trigger</Markprompt.DialogTrigger>
      <Markprompt.Portal>
        <Markprompt.Overlay />
        <Markprompt.Content>
          <Markprompt.Close>Close</Markprompt.Close>
          <Markprompt.Form>
            Search
            <Markprompt.Prompt />
          </Markprompt.Form>
          <Markprompt.AutoScroller>
            Caret
            <Markprompt.Answer />
          </Markprompt.AutoScroller>
          <Markprompt.References />
        </Markprompt.Content>
      </Markprompt.Portal>
    </Markprompt.Root>,
  );

  const trigger = await screen.findByText('Trigger');
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(trigger).toHaveAttribute('data-state', 'closed');
});

test('Trigger opens the dialog', async () => {
  render(
    <Markprompt.Root projectKey="TEST_PROJECT_KEY">
      <Markprompt.DialogTrigger>Trigger</Markprompt.DialogTrigger>
      <Markprompt.Portal>
        <Markprompt.Overlay />
        <Markprompt.Content>
          <Markprompt.Close>Close</Markprompt.Close>
          <Markprompt.Form>
            Search
            <Markprompt.Prompt />
          </Markprompt.Form>
          <Markprompt.AutoScroller>
            Caret
            <Markprompt.Answer />
          </Markprompt.AutoScroller>
          <Markprompt.References />
        </Markprompt.Content>
      </Markprompt.Portal>
    </Markprompt.Root>,
  );

  const trigger = await screen.findByText('Trigger');
  act(() => {
    trigger.click();
  });
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  expect(trigger).toHaveAttribute('data-state', 'open');

  const close = await screen.findByText('Close');
  expect(close).toBeInTheDocument();
});

test('Branding is displayed in Content when set to true', async () => {
  render(
    <Markprompt.Root projectKey="TEST_PROJECT_KEY">
      <Markprompt.DialogTrigger>Trigger</Markprompt.DialogTrigger>
      <Markprompt.Portal>
        <Markprompt.Content showBranding></Markprompt.Content>
      </Markprompt.Portal>
    </Markprompt.Root>,
  );

  const trigger = await screen.findByText('Trigger');
  act(() => {
    trigger.click();
  });

  const branding = await screen.findByText('Powered by');
  expect(branding).toBeInTheDocument();
});

test('Branding is not displayed in Content when set to false', async () => {
  render(
    <Markprompt.Root projectKey="TEST_PROJECT_KEY">
      <Markprompt.DialogTrigger>Trigger</Markprompt.DialogTrigger>
      <Markprompt.Portal>
        <Markprompt.Content showBranding={false}></Markprompt.Content>
      </Markprompt.Portal>
    </Markprompt.Root>,
  );

  const trigger = await screen.findByText('Trigger');
  act(() => {
    trigger.click();
  });

  const branding = await screen.queryByText('Powered by');
  expect(branding).toBeNull();
});

test('Branding is displayed in PlainContent when set to true', async () => {
  render(
    <Markprompt.Root projectKey="TEST_PROJECT_KEY">
      <Markprompt.DialogTrigger>Trigger</Markprompt.DialogTrigger>
      <Markprompt.Portal>
        <Markprompt.PlainContent showBranding></Markprompt.PlainContent>
      </Markprompt.Portal>
    </Markprompt.Root>,
  );

  const trigger = await screen.findByText('Trigger');
  act(() => {
    trigger.click();
  });

  const branding = await screen.findByText('Powered by');
  expect(branding).toBeInTheDocument();
});

test('Branding is not displayed in PlainContent when set to false', async () => {
  render(
    <Markprompt.Root projectKey="TEST_PROJECT_KEY">
      <Markprompt.DialogTrigger>Trigger</Markprompt.DialogTrigger>
      <Markprompt.Portal>
        <Markprompt.PlainContent showBranding={false}></Markprompt.PlainContent>
      </Markprompt.Portal>
    </Markprompt.Root>,
  );

  const trigger = await screen.findByText('Trigger');
  act(() => {
    trigger.click();
  });

  const branding = await screen.queryByText('Powered by');
  expect(branding).toBeNull();
});

test('Throws if projectKey is not provided', async () => {
  // Disable outputting the error that throws.
  // eslint-disable-next-line no-console
  const originalError = console.error;
  // eslint-disable-next-line no-console
  console.error = vi.fn();
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- testing invalid input
    render(<Markprompt.Root projectKey={undefined as any}></Markprompt.Root>);
  } catch (error) {
    expect((error as Error).message).toContain('a project key is required');
  }
  // eslint-disable-next-line no-console
  console.error = originalError;
});

test('Branding is not displayed in PlainContent when set to false', async () => {
  render(
    <Markprompt.Root
      projectKey="TEST_PROJECT_KEY"
      searchOptions={{ enabled: true }}
    >
      <Markprompt.DialogTrigger>Trigger</Markprompt.DialogTrigger>
      <Markprompt.Portal>
        <Markprompt.Overlay />
        <Markprompt.Content>
          <Markprompt.Close>Close</Markprompt.Close>
          {/* <Markprompt.Form>
            Search
            <Markprompt.Prompt />
          </Markprompt.Form>
          <Markprompt.SearchResults>
          </Markprompt.SearchResults>
          <Markprompt.References /> */}
        </Markprompt.Content>
      </Markprompt.Portal>
    </Markprompt.Root>,
  );

  const trigger = await screen.findByText('Trigger');
  act(() => {
    trigger.click();
  });

  const close = await screen.findByText('Close');
  act(() => {
    close.click();
  });

  const branding = await screen.queryByText('Powered by');
  expect(branding).toBeNull();
});

test('SearchResult properly includes href', async () => {
  render(
    <Markprompt.SearchResult
      href="https://example.com"
      title="Example result"
    />,
  );

  const result = await screen.findByText('Example result');
  expect(result).toHaveAttribute('href', 'https://example.com');
});

test('Title and description should be visible', async () => {
  render(
    <Markprompt.Root projectKey="TEST_PROJECT_KEY">
      <Markprompt.DialogTrigger>Trigger</Markprompt.DialogTrigger>
      <Markprompt.Portal>
        <Markprompt.Overlay />
        <Markprompt.Content>
          <Markprompt.Title hide={false}>Example title</Markprompt.Title>
          <Markprompt.Description hide={false}>
            Example description
          </Markprompt.Description>
        </Markprompt.Content>
      </Markprompt.Portal>
    </Markprompt.Root>,
  );

  const trigger = await screen.findByText('Trigger');
  act(() => {
    trigger.click();
  });

  const title = await screen.findByText('Example title');
  expect(title).toBeVisible();

  const description = await screen.findByText('Example description');
  expect(description).toBeVisible();
});

test('Title and description should be visible', async () => {
  const mockContextValue = {
    activeView: 'prompt' as View,
    activeSearchResult: undefined,
    answer: undefined,
    isSearchEnabled: true,
    searchProvider: undefined,
    isSearchActive: true,
    prompt: '',
    references: [],
    searchQuery: '',
    state: 'indeterminate' as const,
    abort: vitest.fn(),
    submitFeedback: vitest.fn(),
    setActiveView: vitest.fn(),
    setPrompt: vitest.fn(),
    setSearchQuery: vitest.fn(),
    submitPrompt: vitest.fn(),
    submitSearchQuery: vitest.fn(),
    updateActiveSearchResult: vitest.fn(),
    updatePrompt: vitest.fn(),
    searchResults: [
      {
        href: 'https://example.com',
        heading: 'Test heading',
        title: 'Test title',
        subtitle: 'Test subtitle',
      },
    ],
  };

  render(
    <MarkpromptContext.Provider value={mockContextValue}>
      <Markprompt.SearchResults></Markprompt.SearchResults>
    </MarkpromptContext.Provider>,
  );

  const heading = await screen.findByText('Test title');
  expect(heading).toBeVisible();
});

test('Form submission triggers user-defined callbacks', async () => {
  const cb = vitest.fn();

  render(
    <Markprompt.Root projectKey="TEST_PROJECT_KEY">
      <Markprompt.Form onSubmit={cb}>
        <button type="submit">submit</button>
      </Markprompt.Form>
    </Markprompt.Root>,
  );

  const button = await screen.findByRole('button');

  await act(async () => {
    button.click();
  });

  expect(cb).toHaveBeenCalled();
});

test('Prompt changes trigger user-defined callbacks', async () => {
  const cb = vitest.fn();
  const user = userEvent.setup();

  render(
    <Markprompt.Root projectKey="TEST_PROJECT_KEY">
      <Markprompt.Prompt type="text" onChange={cb} />
    </Markprompt.Root>,
  );

  const input = await screen.findByRole('textbox');

  await act(async () => {
    await user.type(input, 'test');
  });

  expect(input).toHaveValue('test');
  expect(cb).toHaveBeenCalled();
});

test('Prompt changes updates prompt state', async () => {
  const user = userEvent.setup();

  render(
    <Markprompt.Root projectKey="TEST_PROJECT_KEY">
      <Markprompt.Prompt type="text" />
    </Markprompt.Root>,
  );

  const input = await screen.findByRole('textbox');

  await act(async () => {
    await user.type(input, 'test');
  });

  expect(input).toHaveValue('test');
});
