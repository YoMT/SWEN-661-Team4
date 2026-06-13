import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingIndicator } from '../shared/components/loading-indicator';

describe('LoadingIndicator', () => {
  it('renders without crashing when no props are provided', () => {
    expect(() => render(<LoadingIndicator />)).not.toThrow();
  });

  it('does not show a message when no message prop is given', () => {
    const { queryByText } = render(<LoadingIndicator />);
    expect(queryByText(/.+/)).toBeNull();
  });

  it('renders the message text when provided', () => {
    const { getByText } = render(<LoadingIndicator message="Please wait…" />);
    expect(getByText('Please wait…')).toBeTruthy();
  });

  it('does not render message text when message is empty string', () => {
    const { queryByText } = render(<LoadingIndicator message="" />);
    expect(queryByText(/.+/)).toBeNull();
  });
});
