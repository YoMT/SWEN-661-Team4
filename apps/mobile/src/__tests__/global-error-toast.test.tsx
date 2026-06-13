import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GlobalErrorToast } from '../shared/components/global-error-toast';

const mockDismissError = jest.fn();

jest.mock('../shared/context/error-context', () => ({
  useErrorContext: () => ({
    errors: [],
    pushError: jest.fn(),
    dismissError: mockDismissError,
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

beforeEach(() => {
  mockDismissError.mockClear();
});

describe('GlobalErrorToast', () => {
  it('renders nothing when there are no errors', () => {
    const { toJSON } = render(<GlobalErrorToast />);
    expect(toJSON()).toBeNull();
  });

  it('renders the first error message', () => {
    jest.resetModules();
    jest.doMock('../shared/context/error-context', () => ({
      useErrorContext: () => ({
        errors: ['Something went wrong'],
        pushError: jest.fn(),
        dismissError: mockDismissError,
      }),
    }));

    const { GlobalErrorToast: Toast } = require('../shared/components/global-error-toast');
    const { getByText } = render(<Toast />);
    expect(getByText('Something went wrong')).toBeTruthy();
  });

  it('shows only the first error when multiple are queued', () => {
    jest.doMock('../shared/context/error-context', () => ({
      useErrorContext: () => ({
        errors: ['First error', 'Second error'],
        pushError: jest.fn(),
        dismissError: mockDismissError,
      }),
    }));

    const { GlobalErrorToast: Toast } = require('../shared/components/global-error-toast');
    const { getByText, queryByText } = render(<Toast />);
    expect(getByText('First error')).toBeTruthy();
    expect(queryByText('Second error')).toBeNull();
  });

  it('calls dismissError when the close button is pressed', () => {
    jest.doMock('../shared/context/error-context', () => ({
      useErrorContext: () => ({
        errors: ['Error to dismiss'],
        pushError: jest.fn(),
        dismissError: mockDismissError,
      }),
    }));

    const { GlobalErrorToast: Toast } = require('../shared/components/global-error-toast');
    const { getByLabelText } = render(<Toast />);
    fireEvent.press(getByLabelText('Dismiss error'));
    expect(mockDismissError).toHaveBeenCalledTimes(1);
  });
});
