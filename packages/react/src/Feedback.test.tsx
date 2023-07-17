import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, test, vitest } from 'vitest';

import { MarkpromptContext } from './context';
import { Feedback } from './Feedback';
import { View } from './useMarkprompt';

const submitFeedback = vitest.fn((helpful: boolean) => Promise.resolve());

const mockContextValue = {
  activeView: 'prompt' as View,
  activeSearchResult: undefined,
  answer: undefined,
  isSearchEnabled: false,
  searchProvider: undefined,
  isSearchActive: false,
  prompt: '',
  references: [],
  searchQuery: '',
  searchResults: [],
  state: 'indeterminate' as const,
  abort: vitest.fn(),
  submitFeedback: submitFeedback,
  setActiveView: vitest.fn(),
  setPrompt: vitest.fn(),
  setSearchQuery: vitest.fn(),
  submitPrompt: vitest.fn(),
  submitSearchQuery: vitest.fn(),
  updateActiveSearchResult: vitest.fn(),
  updatePrompt: vitest.fn(),
};

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

    await waitFor(() => expect(submitFeedback).toHaveBeenCalledWith(true));

    expect(screen.getByText(/Thank you!/)).toBeInTheDocument();
  });
});
