import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AppButton } from '../shared/components/app-button';

jest.mock('../features/accessibility/accessibility-context', () => ({
  useAccessibilityContext: () => ({
    buttonHeight: 60,
    fontScale: 1,
    settings: { highContrast: false },
  }),
}));

jest.mock('../shared/components/cc-text', () => ({
  useFS: () => (size: number) => size,
}));

describe('AppButton', () => {
  it('renders without crashing', () => {
    expect(() => {
      render(<AppButton label="Save Appointment" />);
    }).not.toThrow();
  });

  it('renders loading state without crashing', () => {
    expect(() => {
      render(<AppButton label="Loading" isLoading />);
    }).not.toThrow();
  });

  it('renders outline variant without crashing', () => {
    expect(() => {
      render(<AppButton label="Cancel" variant="outline" />);
    }).not.toThrow();
  });

  it('renders danger variant without crashing', () => {
    expect(() => {
      render(<AppButton label="Delete" variant="danger" />);
    }).not.toThrow();
  });

  it('renders text variant without crashing', () => {
    expect(() => {
      render(<AppButton label="Skip" variant="text" />);
    }).not.toThrow();
  });

  it('renders label text', () => {
    const { getByText } = render(<AppButton label="Confirm" />);
    expect(getByText('Confirm')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<AppButton label="Submit" onPress={onPress} />);
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<AppButton label="Submit" onPress={onPress} disabled />);
    fireEvent.press(getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not call onPress when loading', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<AppButton label="Submit" onPress={onPress} isLoading />);
    fireEvent.press(getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('uses custom accessibilityLabel when provided', () => {
    const { getByLabelText } = render(
      <AppButton label="Submit" accessibilityLabel="Custom label" />
    );
    expect(getByLabelText('Custom label')).toBeTruthy();
  });

  it('falls back to label as accessibilityLabel when not provided', () => {
    const { getByLabelText } = render(<AppButton label="Save" />);
    expect(getByLabelText('Save')).toBeTruthy();
  });
});
