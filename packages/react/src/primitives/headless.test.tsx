import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, test } from 'vitest';

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
