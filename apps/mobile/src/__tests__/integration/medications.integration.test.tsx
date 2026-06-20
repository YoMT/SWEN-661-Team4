import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
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
import MedicationListScreen from '../../app/(tabs)/medications/index';

describe('Medications screen', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
    });
  });

  it('loads and renders medication names from the API', async () => {
    const { findByText } = await renderWithProviders(<MedicationListScreen />);

    expect(await findByText('Metoprolol')).toBeTruthy();
    expect(await findByText('Lisinopril')).toBeTruthy();
    expect(await findByText('Atorvastatin')).toBeTruthy();
  });

  it('shows the adherence counter after data loads', async () => {
    const { findByText } = await renderWithProviders(<MedicationListScreen />);

    expect(await findByText(/1\/3 doses/)).toBeTruthy();
  });

  it('navigates to add medication screen when "+ Add" is pressed', async () => {
    const { findByLabelText } = await renderWithProviders(<MedicationListScreen />);

    await fireEvent.press(await findByLabelText('Add medication'));

    expect(mockPush).toHaveBeenCalledWith('/(tabs)/medications/new');
  });

  it('optimistically marks a medication as taken', async () => {
    const { findByLabelText, queryByLabelText } = await renderWithProviders(<MedicationListScreen />);

    const takeBtn = await findByLabelText('Mark Lisinopril as taken');
    await fireEvent.press(takeBtn);

    // Optimistic update: the take button disappears once status flips to 'given'
    await waitFor(() => {
      expect(queryByLabelText('Mark Lisinopril as taken')).toBeNull();
    });
  });
});
