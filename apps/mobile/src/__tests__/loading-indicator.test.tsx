import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingIndicator } from '../shared/components/loading-indicator';

describe('LoadingIndicator', () => {
  it('renders without crashing when no props are provided', () => {
    expect(() => render(<LoadingIndicator />)).not.toThrow();
  });

  it('does not show a message when no message prop is given', async () => {
    const { queryByText } = await render(<LoadingIndicator />);
    expect(queryByText(/.+/)).toBeNull();
  });

  it('renders the message text when provided', async () => {
    const { getByText } = await render(<LoadingIndicator message="Please wait…" />);
    expect(getByText('Please wait…')).toBeTruthy();
  });

  it('does not render message text when message is empty string', async () => {
    const { queryByText } = await render(<LoadingIndicator message="" />);
    expect(queryByText(/.+/)).toBeNull();
  });
});
