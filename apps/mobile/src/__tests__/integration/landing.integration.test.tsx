import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from './setup/render-with-providers';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Redirect: () => null,
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

import { useRouter } from 'expo-router';
import LandingScreen from '../../app/(auth)/index';

describe('Landing screen', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
    });
  });

  it('renders the CareConnect branding and headline', async () => {
    const { getByText } = await renderWithProviders(<LandingScreen />);
    expect(getByText('CareConnect')).toBeTruthy();
    expect(getByText(/gentle helping hand/i)).toBeTruthy();
  });

  it('"Get started" navigates to signup', async () => {
    const { getByText } = await renderWithProviders(<LandingScreen />);
    await fireEvent.press(getByText(/Get started/i));
    expect(mockPush).toHaveBeenCalledWith('/(auth)/signup');
  });

  it('"I already have an account" navigates to login', async () => {
    const { getByText } = await renderWithProviders(<LandingScreen />);
    await fireEvent.press(getByText(/I already have an account/i));
    expect(mockPush).toHaveBeenCalledWith('/(auth)/login');
  });

  it('"Sign in" header link navigates to login', async () => {
    const { getByLabelText } = await renderWithProviders(<LandingScreen />);
    await fireEvent.press(getByLabelText('Sign in'));
    expect(mockPush).toHaveBeenCalledWith('/(auth)/login');
  });
});
