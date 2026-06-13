import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GlobalErrorToast } from '../shared/components/global-error-toast';

const mockDismissError = jest.fn();
let mockCurrentErrors: string[] = [];

jest.mock('../shared/context/error-context', () => ({
  useErrorContext: () => ({
    errors: mockCurrentErrors,
    pushError: jest.fn(),
    dismissError: mockDismissError,
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

beforeEach(() => {
  mockCurrentErrors = [];
  mockDismissError.mockClear();
});

describe('GlobalErrorToast', () => {
  it('renders nothing when there are no errors', async () => {
    const { toJSON } = await render(<GlobalErrorToast />);
    expect(toJSON()).toBeNull();
  });

  it('renders the first error message', async () => {
    mockCurrentErrors = ['Something went wrong'];
    const { getByText } = await render(<GlobalErrorToast />);
    expect(getByText('Something went wrong')).toBeTruthy();
  });

  it('shows only the first error when multiple are queued', async () => {
    mockCurrentErrors = ['First error', 'Second error'];
    const { getByText, queryByText } = await render(<GlobalErrorToast />);
    expect(getByText('First error')).toBeTruthy();
    expect(queryByText('Second error')).toBeNull();
  });

  it('calls dismissError when the close button is pressed', async () => {
    mockCurrentErrors = ['Error to dismiss'];
    const { getByLabelText } = await render(<GlobalErrorToast />);
    fireEvent.press(getByLabelText('Dismiss error'));
    expect(mockDismissError).toHaveBeenCalledTimes(1);
  });
});
