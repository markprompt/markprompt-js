import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, test, vitest } from 'vitest';

import { Feedback } from './Feedback';

const submitFeedback = vitest.fn(() => Promise.resolve());
const abortFeedbackRequest = vitest.fn();

describe('Feedback', () => {
  test('render the Feedback component', () => {
    render(
      <Feedback
        submitFeedback={submitFeedback}
        abortFeedbackRequest={abortFeedbackRequest}
        state="done"
        variant="text"
        messageIndex={1}
        data-testid="test-feedback"
      />,
    );

    const element = screen.getByTestId('test-feedback');

    expect(element).toBeInTheDocument();
  });

  test('thank the user when feedback was provided', async () => {
    const user = userEvent.setup();

    render(
      <Feedback
        variant="text"
        submitFeedback={submitFeedback}
        abortFeedbackRequest={abortFeedbackRequest}
        state="done"
        messageIndex={1}
      />,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);

    const yesButton = screen.getByText('Yes');

    await user.click(yesButton);

    await waitFor(() =>
      expect(submitFeedback).toHaveBeenCalledWith({ vote: '1' }, 'done', 1),
    );

    expect(yesButton).toHaveAttribute('data-active', 'true');
  });
});
