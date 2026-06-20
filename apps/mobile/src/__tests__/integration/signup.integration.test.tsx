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
import SignupScreen from '../../app/(auth)/signup';

describe('Auth — Signup screen', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: mockReplace,
      back: jest.fn(),
    });
  });

  it('renders all form fields', async () => {
    const { getByLabelText, getByText } = await renderWithProviders(<SignupScreen />);
    expect(getByText('Create account')).toBeTruthy();
    expect(getByLabelText('Full name')).toBeTruthy();
    expect(getByLabelText('Email address')).toBeTruthy();
    expect(getByLabelText('Password')).toBeTruthy();
    expect(getByText('Create Account')).toBeTruthy();
  });

  it('shows a validation error when the form is empty', async () => {
    const { getByText, findByText } = await renderWithProviders(<SignupScreen />);
    await fireEvent.press(getByText('Create Account'));
    expect(await findByText(/Name is required/i)).toBeTruthy();
  });

  it('creates an account with valid inputs and shows no error', async () => {
    const { getByLabelText, getByText, queryByText, findByText } =
      await renderWithProviders(<SignupScreen />);

    await fireEvent.changeText(getByLabelText('Full name'), 'Alex Johnson');
    await fireEvent.changeText(getByLabelText('Email address'), 'new@test.com');
    await fireEvent.changeText(getByLabelText('Password'), 'password123');
    await fireEvent.press(getByText('Create Account'));

    await findByText('Create Account'); // reappears after isLoading: false
    expect(queryByText(/error/i)).toBeNull();
  });

  it('navigates to login when "Sign in" is pressed', async () => {
    const { getByLabelText } = await renderWithProviders(<SignupScreen />);
    await fireEvent.press(getByLabelText('Sign in'));
    expect(mockReplace).toHaveBeenCalledWith('/(auth)/login');
  });
});
