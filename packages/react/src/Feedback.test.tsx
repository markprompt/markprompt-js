import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, test, vitest } from 'vitest';

import { MarkpromptContext } from './context';
import { Feedback } from './Feedback';

const submitFeedback = vitest.fn((helpful: boolean) => Promise.resolve());

const mockContextValue = {
  activeSearchResult: undefined,
  answer: undefined,
  isSearchEnabled: false,
  isSearchActive: false,
  prompt: '',
  references: [],
  searchResults: [],
  state: 'indeterminate' as const,
  abort: vitest.fn(),
  submitFeedback: submitFeedback,
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

    expect(
      screen.getByText(/Thanks for helping us improve our responses./),
    ).toBeInTheDocument();
  });
});
