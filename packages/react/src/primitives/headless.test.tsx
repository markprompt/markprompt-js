import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, test, vi } from 'vitest';

import * as Markprompt from './headless.js';

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
