import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from './setup/render-with-providers';
import { DEMO_EMAIL, DEMO_PASSWORD } from './setup/server';

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
import LoginScreen from '../../app/(auth)/login';

describe('Auth — Login screen', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: mockReplace,
      back: jest.fn(),
    });
  });

  it('renders the sign-in form', async () => {
    const { getByText, getByLabelText } = await renderWithProviders(<LoginScreen />);
    expect(getByText('Sign in')).toBeTruthy();
    expect(getByLabelText('Email address')).toBeTruthy();
    expect(getByLabelText('Password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('logs in with valid credentials and shows no error', async () => {
    const { getByLabelText, getByText, queryByText, findByText } = await renderWithProviders(<LoginScreen />);

    await fireEvent.changeText(getByLabelText('Email address'), DEMO_EMAIL);
    await fireEvent.changeText(getByLabelText('Password'), DEMO_PASSWORD);
    await fireEvent.press(getByText('Sign In'));

    // Button text reappears only after isLoading: false (entire login chain settled)
    await findByText('Sign In');
    expect(queryByText(/invalid email or password/i)).toBeNull();
  });

  it('shows an error message when credentials are wrong', async () => {
    const { getByLabelText, getByText, findByText } = await renderWithProviders(<LoginScreen />);

    await fireEvent.changeText(getByLabelText('Email address'), 'wrong@email.com');
    await fireEvent.changeText(getByLabelText('Password'), 'badpassword');
    await fireEvent.press(getByText('Sign In'));

    expect(await findByText(/invalid email or password/i)).toBeTruthy();
  });

  it('shows a local validation error when fields are empty (no API call)', async () => {
    const { getByText, findByText } = await renderWithProviders(<LoginScreen />);

    await fireEvent.press(getByText('Sign In'));

    expect(await findByText(/please enter a valid email/i)).toBeTruthy();
  });

  it('navigates to signup screen when "Create account" is pressed', async () => {
    const { getByLabelText } = await renderWithProviders(<LoginScreen />);

    await fireEvent.press(getByLabelText('Create account'));

    expect(mockReplace).toHaveBeenCalledWith('/(auth)/signup');
  });
});
