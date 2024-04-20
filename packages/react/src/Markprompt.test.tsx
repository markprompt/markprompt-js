import { act, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Markprompt, closeMarkprompt, openMarkprompt } from './index.js';

describe('Markprompt', () => {
  it('renders', async () => {
    render(<Markprompt projectKey="test-key" />);
    expect(screen.getByText('Ask AI')).toBeInTheDocument();
  });

  // Before re-enabling this test, we should review the keyboard shortcuts.
  it.skip('opens the dialog when a hotkey is pressed while the non-floating trigger is rendered', async () => {
    const user = await userEvent.setup();
    render(<Markprompt projectKey="test-key" trigger={{ floating: false }} />);
    await user.keyboard(`{Meta>}{Enter}{/Meta}`);
    await expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders no dialog when display = plain', async () => {
    render(
      <Markprompt
        projectKey="test-key"
        display="plain"
        trigger={{ buttonLabel: 'Open prompt' }}
      />,
    );
    expect(screen.queryByText('Open prompt')).not.toBeInTheDocument();
  });

  it('throws an error if no project key is provided', async () => {
    try {
      // @ts-expect-error intentionally passing no project key
      expect(() => render(<Markprompt />)).toThrowError(
        /Markprompt: a project key is required/,
      );
    } catch {
      // nothing
    }
  });

  it('renders search view when search is enabled', async () => {
    const user = await userEvent.setup();

    render(
      <Markprompt
        projectKey="test-key"
        layout="tabs"
        defaultView="search"
        search={{
          enabled: true,
          askLabel: 'Ask Acme',
          defaultView: {
            searchesHeading: 'Recommended for you',
            searches: [{ href: '/', title: 'Entry 1' }],
          },
        }}
      />,
    );

    await user.click(screen.getByText('Ask AI'));

    // wait for lazy loaded content
    await screen.findByRole('searchbox');

    expect(screen.getByText('Recommended for you')).toBeInTheDocument();
  });

  it('renders chat view when chat is enabled', async () => {
    const user = await userEvent.setup();
    render(<Markprompt projectKey="test-key" chat={{ enabled: true }} />);
    await user.click(screen.getByText('Ask AI'));
    expect(screen.getByText('Chats')).toBeInTheDocument();
  });

  it('renders tabs when multiple views are enabled', async () => {
    const user = await userEvent.setup();

    render(
      <Markprompt
        projectKey="test-key"
        layout="tabs"
        chat={{ enabled: true, tabLabel: 'chattab' }}
        search={{ enabled: true, tabLabel: 'searchtab' }}
      />,
    );
    await user.click(screen.getByText('Ask AI'));

    // tabs are rendered
    await expect(screen.getByText('searchtab')).toBeInTheDocument();
    await expect(screen.getByText('chattab')).toBeInTheDocument();

    // wait for lazy loaded content
    await screen.findByRole('searchbox');

    // tabs switching
    await user.click(screen.getByText('chattab'));
    await expect(screen.getByRole('textbox')).toBeInTheDocument();
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

    await user.click(screen.getByText('Ask AI'));

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

  it('calls back on open', async () => {
    const user = await userEvent.setup();
    const fn = vi.fn();
    render(<Markprompt projectKey="test-key" onDidRequestOpenChange={fn} />);
    await user.click(screen.getByText('Ask AI'));
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
