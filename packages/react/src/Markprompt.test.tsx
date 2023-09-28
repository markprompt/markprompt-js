import { act, render, screen, waitFor } from '@testing-library/react';
import { suppressErrorOutput } from '@testing-library/react-hooks';
import { userEvent } from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Markprompt, closeMarkprompt, openMarkprompt } from './index.js';

describe('Markprompt', () => {
  it('renders', () => {
    render(<Markprompt projectKey="test-key" />);
    expect(screen.getByText('Open Markprompt')).toBeInTheDocument();
  });

  it('renders a non-floating trigger', () => {
    render(<Markprompt projectKey="test-key" trigger={{ floating: false }} />);
    expect(screen.getByText('Open Markprompt')).toBeInTheDocument();
  });

  it('renders no dialog when display = plain', () => {
    render(<Markprompt projectKey="test-key" display="plain" />);
    expect(screen.queryByText('Open Markprompt')).not.toBeInTheDocument();
  });

  it('throws an error if no project key is provided', () => {
    const restoreConsole = suppressErrorOutput();

    try {
      // @ts-expect-error intentionally passing no project key
      expect(() => render(<Markprompt />)).toThrowError(
        /Markprompt: a project key is required/,
      );
    } finally {
      restoreConsole();
    }
  });

  it('renders search view when search is enabled', async () => {
    const user = await userEvent.setup();
    render(<Markprompt projectKey="test-key" search={{ enabled: true }} />);
    await user.click(screen.getByText('Open Markprompt'));
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('renders chat view when chat is enabled', async () => {
    const user = await userEvent.setup();
    render(<Markprompt projectKey="test-key" chat={{ enabled: true }} />);
    await user.click(screen.getByText('Open Markprompt'));
    expect(screen.getByText('Chats')).toBeInTheDocument();
  });

  it('renders algolia attribution when algolia is the search provider', async () => {
    render(
      <Markprompt
        display="plain"
        projectKey="test-key"
        search={{
          enabled: true,
          provider: {
            name: 'algolia',
            apiKey: 'test',
            appId: 'test',
            indexName: 'test',
          },
        }}
      />,
    );
    expect(screen.getByLabelText('Algolia')).toBeInTheDocument();
  });

  it('renders the title and description visually hidden', async () => {
    const user = await userEvent.setup();

    const { rerender } = render(
      <Markprompt
        projectKey="test-key"
        title={{ text: 'test title' }}
        description={{ text: 'test description' }}
      />,
    );

    await user.click(screen.getByText('Open Markprompt'));

    expect(screen.getByRole('heading', { name: 'test title' })).toHaveStyle(
      'position: absolute; border: 0px; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; word-wrap: normal;',
    );

    expect(screen.getByText('test description')).toHaveStyle(
      'position: absolute; border: 0px; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; word-wrap: normal;',
    );

    rerender(
      <Markprompt
        projectKey="test-key"
        description={{ text: 'test description', hide: false }}
        title={{ text: 'test title', hide: false }}
      />,
    );

    expect(screen.getByRole('heading', { name: 'test title' })).not.toHaveStyle(
      'position: absolute; border: 0px; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; word-wrap: normal;',
    );

    expect(screen.getByText('test description')).not.toHaveStyle(
      'position: absolute; border: 0px; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; word-wrap: normal;',
    );
  });

  it('switches views when the hotkey is pressed', async () => {
    const user = await userEvent.setup();
    render(<Markprompt projectKey="test-key" search={{ enabled: true }} />);
    await user.click(screen.getByText('Open Markprompt'));
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    await user.keyboard('{Meta>}{Enter}{/Meta}');
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });

  it('calls back on open', async () => {
    const user = await userEvent.setup();
    const fn = vi.fn();
    render(<Markprompt projectKey="test-key" onDidRequestOpenChange={fn} />);
    await user.click(screen.getByText('Open Markprompt'));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('opens programmatically', async () => {
    const fn = vi.fn();
    render(<Markprompt projectKey="test-key" onDidRequestOpenChange={fn} />);
    act(() => openMarkprompt());
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('closes programmatically', async () => {
    const fn = vi.fn();

    render(<Markprompt projectKey="test-key" onDidRequestOpenChange={fn} />);

    act(() => openMarkprompt());
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    act(() => closeMarkprompt());
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    expect(fn).toHaveBeenCalledTimes(2);
  });
});
