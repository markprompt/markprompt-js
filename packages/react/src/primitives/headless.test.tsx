import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, test } from 'vitest';

import * as Markprompt from './headless.js';

test('initial state', async () => {
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

test('trigger opens the dialog', async () => {
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
