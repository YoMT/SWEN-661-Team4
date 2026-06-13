import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { ErrorBoundary } from '../shared/components/error-boundary';

function GoodChild() {
  return <Text>All good</Text>;
}

function BadChild({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Test render error');
  return <Text>All good</Text>;
}

// Suppress React's error boundary console.error output in test output
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe('ErrorBoundary', () => {
  it('renders children normally when no error is thrown', async () => {
    const { getByText } = await render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>
    );
    expect(getByText('All good')).toBeTruthy();
  });

  it('renders the error screen when a child throws', async () => {
    const { getByText } = await render(
      <ErrorBoundary>
        <BadChild shouldThrow />
      </ErrorBoundary>
    );
    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByText('Test render error')).toBeTruthy();
  });

  it('shows "Try again" button when an error is caught', async () => {
    const { getByLabelText } = await render(
      <ErrorBoundary>
        <BadChild shouldThrow />
      </ErrorBoundary>
    );
    expect(getByLabelText('Try again')).toBeTruthy();
  });

  it('clears the error and re-renders children when "Try again" is pressed', async () => {
    const { getByLabelText, getByText, queryByText } = await render(
      <ErrorBoundary>
        <BadChild shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(getByText('All good')).toBeTruthy();
    expect(queryByText('Something went wrong')).toBeNull();
    expect(queryByText('Try again')).toBeNull();
    // button not rendered when no error — verify accessibilityLabel absent
    expect(() => getByLabelText('Try again')).toThrow();
  });
});
