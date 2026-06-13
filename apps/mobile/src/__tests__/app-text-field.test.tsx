import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AppTextField } from '../shared/components/app-text-field';

jest.mock('../shared/components/cc-text', () => ({
  useFS: () => (size: number) => size,
}));

const mockUseAccessibility = jest.fn(() => ({
  settings: { highContrast: false },
  fontScale: 1,
  buttonHeight: 48,
}));

jest.mock('../features/accessibility/accessibility-context', () => ({
  useAccessibilityContext: () => mockUseAccessibility(),
}));

beforeEach(() => {
  mockUseAccessibility.mockReturnValue({
    settings: { highContrast: false },
    fontScale: 1,
    buttonHeight: 48,
  });
});

describe('AppTextField', () => {
  it('renders with a label', async () => {
    const { getByText } = await render(<AppTextField label="Email" />);
    expect(getByText('Email')).toBeTruthy();
  });

  it('renders the input with the correct accessibilityLabel', async () => {
    const { getByLabelText } = await render(<AppTextField label="Email" />);
    expect(getByLabelText('Email')).toBeTruthy();
  });

  it('does not show error text when no error prop is given', async () => {
    const { queryByText } = await render(<AppTextField label="Email" />);
    expect(queryByText(/required|invalid|error/i)).toBeNull();
  });

  it('shows error text when error prop is provided', async () => {
    const { getByText } = await render(<AppTextField label="Email" error="Invalid email" />);
    expect(getByText('Invalid email')).toBeTruthy();
  });

  it('renders without crashing when obscureToggle is not set', () => {
    expect(() =>
      render(<AppTextField label="Password" secureTextEntry />)
    ).not.toThrow();
  });

  it('shows the toggle button when obscureToggle is true', async () => {
    const { getByLabelText } = await render(
      <AppTextField label="Password" secureTextEntry obscureToggle />
    );
    expect(getByLabelText('Show password')).toBeTruthy();
  });

  it('toggles password visibility when the toggle button is pressed', async () => {
    const { getByLabelText } = await render(
      <AppTextField label="Password" secureTextEntry obscureToggle />
    );
    fireEvent.press(getByLabelText('Show password'));
    await waitFor(() => expect(getByLabelText('Hide password')).toBeTruthy());
  });

  it('renders without crashing in high contrast mode', () => {
    mockUseAccessibility.mockReturnValue({
      settings: { highContrast: true },
      fontScale: 1,
      buttonHeight: 48,
    });
    expect(() => render(<AppTextField label="Name" />)).not.toThrow();
  });
});
