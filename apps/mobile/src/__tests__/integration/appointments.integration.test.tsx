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
import AppointmentScreen from '../../app/(tabs)/appointments/index';

describe('Appointments screen', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
    });
  });

  it('loads and renders appointment doctor names from the API', async () => {
    const { findByText } = await renderWithProviders(<AppointmentScreen />);

    expect(await findByText('Dr. Sarah Chen')).toBeTruthy();
    expect(await findByText('Dr. Michael Torres')).toBeTruthy();
  });

  it('renders appointment specialties', async () => {
    const { findByText } = await renderWithProviders(<AppointmentScreen />);

    expect(await findByText('Cardiologist')).toBeTruthy();
    expect(await findByText('General Practice')).toBeTruthy();
  });

  it('navigates to book appointment screen when "+ Book" is pressed', async () => {
    const { findByLabelText } = await renderWithProviders(<AppointmentScreen />);

    await fireEvent.press(await findByLabelText('Book appointment'));

    expect(mockPush).toHaveBeenCalledWith('/(tabs)/appointments/new');
  });

  it('navigates to reschedule screen when "Reschedule" is pressed', async () => {
    const { findAllByLabelText } = await renderWithProviders(<AppointmentScreen />);

    const rescheduleButtons = await findAllByLabelText('Reschedule appointment');
    await fireEvent.press(rescheduleButtons[0]);

    expect(mockPush).toHaveBeenCalledWith('/(tabs)/appointments/reschedule');
  });
});
