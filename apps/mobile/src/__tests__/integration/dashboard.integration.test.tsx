import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from './setup/render-with-providers';
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Redirect: () => null,
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Return the demo token so AuthProvider cold-starts GET /auth/me and populates user.
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue('cc-demo-token'),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

import { useRouter } from 'expo-router';
import DashboardScreen from '../../app/(tabs)/index';

describe('Dashboard screen', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
    });
  });

  it('renders the caree name from profile data', async () => {
    const { findByText } = await renderWithProviders(<DashboardScreen />);
    expect(await findByText('Margaret Johnson')).toBeTruthy();
  });

  it('shows the doses-today stat tile', async () => {
    const { findByText } = await renderWithProviders(<DashboardScreen />);
    // seed: 1 medication with status 'given' out of 3 total
    expect(await findByText('1/3')).toBeTruthy();
    expect(await findByText('Doses today')).toBeTruthy();
  });

  it('navigates to medications when "View all medications" is pressed', async () => {
    const { findByLabelText } = await renderWithProviders(<DashboardScreen />);
    await fireEvent.press(await findByLabelText('View all medications'));
    expect(mockPush).toHaveBeenCalledWith('/(tabs)/medications');
  });

  it('navigates to appointments when "View schedule" is pressed', async () => {
    const { findByLabelText } = await renderWithProviders(<DashboardScreen />);
    await fireEvent.press(await findByLabelText('View schedule'));
    expect(mockPush).toHaveBeenCalledWith('/(tabs)/appointments');
  });

  it('navigates to emergency page via quick link', async () => {
    const { getByLabelText, findByText } = await renderWithProviders(<DashboardScreen />);
    await findByText('Margaret Johnson'); // wait for full render
    await fireEvent.press(getByLabelText('Emergency'));
    expect(mockPush).toHaveBeenCalledWith('/(tabs)/profile/emergency');
  });
});
