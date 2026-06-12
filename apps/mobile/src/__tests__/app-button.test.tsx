import React from 'react';
import { render } from '@testing-library/react-native';
import { AppButton } from '../shared/components/app-button';

jest.mock('../features/accessibility/accessibility-context', () => ({
  useAccessibilityContext: () => ({
    buttonHeight: 60,
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
});