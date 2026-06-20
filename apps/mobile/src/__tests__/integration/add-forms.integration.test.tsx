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
import NewAppointmentScreen from '../../app/(tabs)/appointments/new';
import NewMedicationScreen from '../../app/(tabs)/medications/new';

describe('New Appointment form', () => {
  const mockBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      back: mockBack,
    });
  });

  it('renders all appointment form fields', async () => {
    const { getByLabelText } = await renderWithProviders(<NewAppointmentScreen />);
    // header title and button both say "Book Appointment" — query fields by label instead
    expect(getByLabelText('Doctor name')).toBeTruthy();
    expect(getByLabelText('Specialty')).toBeTruthy();
    expect(getByLabelText('Location')).toBeTruthy();
    expect(getByLabelText('Date & time')).toBeTruthy();
    expect(getByLabelText('Book Appointment')).toBeTruthy(); // AppButton sets accessibilityLabel
  });

  it('shows a validation error when doctor name is empty', async () => {
    const { getByLabelText, findByText } = await renderWithProviders(<NewAppointmentScreen />);
    await fireEvent.press(getByLabelText('Book Appointment'));
    expect(await findByText(/Doctor name is required/i)).toBeTruthy();
  });

  it('navigates back when the back button is pressed', async () => {
    const { getByLabelText } = await renderWithProviders(<NewAppointmentScreen />);
    await fireEvent.press(getByLabelText('Go back'));
    expect(mockBack).toHaveBeenCalled();
  });
});

describe('New Medication form', () => {
  const mockBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      back: mockBack,
    });
  });

  it('renders all medication form fields', async () => {
    const { getByLabelText, getByText } = await renderWithProviders(<NewMedicationScreen />);
    expect(getByText('Add Medication')).toBeTruthy();
    expect(getByLabelText('Medication name')).toBeTruthy();
    expect(getByLabelText('Dosage')).toBeTruthy();
    expect(getByLabelText('Instructions')).toBeTruthy();
    expect(getByLabelText('Scheduled time')).toBeTruthy();
  });

  it('shows a validation error when medication name is empty', async () => {
    const { getByText, findByText } = await renderWithProviders(<NewMedicationScreen />);
    await fireEvent.press(getByText('Save Medication'));
    expect(await findByText(/Medication name is required/i)).toBeTruthy();
  });

  it('navigates back when the back button is pressed', async () => {
    const { getByLabelText } = await renderWithProviders(<NewMedicationScreen />);
    await fireEvent.press(getByLabelText('Go back'));
    expect(mockBack).toHaveBeenCalled();
  });
});
