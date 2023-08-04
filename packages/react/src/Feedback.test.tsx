import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, test, vitest } from 'vitest';

import { MarkpromptContext, type MarkpromptContextValue } from './context';
import { Feedback } from './Feedback';

const submitFeedback = vitest.fn(() => Promise.resolve());

const mockContextValue = {
  activeView: 'prompt',
  answer: undefined,
  isSearchEnabled: false,
  prompt: '',
  references: [],
  searchProvider: undefined,
  searchQuery: '',
  searchResults: [],
  state: 'indeterminate',
  abort: vitest.fn(),
  setActiveView: vitest.fn(),
  setPrompt: vitest.fn(),
  setSearchQuery: vitest.fn(),
  submitFeedback,
  submitPrompt: vitest.fn(),
  submitSearchQuery: vitest.fn(),
} satisfies MarkpromptContextValue;

describe('Feedback', () => {
  test('render the Feedback component', () => {
    render(<Feedback />);

    const element = screen.getByText(
      /Was this response helpful?/,
    ).parentElement;

    expect(element).toBeInTheDocument();
  });

  test('thank the user when feedback was provided', async () => {
    const user = userEvent.setup();

    render(
      <MarkpromptContext.Provider value={mockContextValue}>
        <Feedback />
      </MarkpromptContext.Provider>,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);

    const yesButton = screen.getByLabelText('Yes');

    await act(async () => {
      await user.click(yesButton);
    });

    await waitFor(() =>
      expect(submitFeedback).toHaveBeenCalledWith({ vote: '1' }),
    );

    expect(yesButton).toHaveAttribute('data-active', 'true');
  });
});
