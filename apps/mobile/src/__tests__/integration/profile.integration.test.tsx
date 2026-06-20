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
import ProfileScreen from '../../app/(tabs)/profile/index';
import EditProfileScreen from '../../app/(tabs)/profile/edit';
import EmergencyScreen from '../../app/(tabs)/profile/emergency';
import CaretakerNotesScreen from '../../app/(tabs)/profile/caretaker-notes';

// ── Profile index ─────────────────────────────────────────────────────────────

describe('Profile screen', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
    });
  });

  it('renders user name and email from the API', async () => {
    const { findByText } = await renderWithProviders(<ProfileScreen />);
    // seed profile: name 'Alex Johnson', email 'demo@careconnect.com'
    expect(await findByText('Alex Johnson')).toBeTruthy();
    expect(await findByText('demo@careconnect.com')).toBeTruthy();
  });

  it('navigates to edit profile when "Edit profile" is pressed', async () => {
    const { findByText, getByLabelText } = await renderWithProviders(<ProfileScreen />);
    await findByText('Alex Johnson'); // wait for profile to load
    await fireEvent.press(getByLabelText('Edit profile'));
    expect(mockPush).toHaveBeenCalledWith('/(tabs)/profile/edit');
  });

  it('navigates to emergency contacts via the links card', async () => {
    const { findByText, getByLabelText } = await renderWithProviders(<ProfileScreen />);
    await findByText('Alex Johnson');
    await fireEvent.press(getByLabelText('Emergency contacts'));
    expect(mockPush).toHaveBeenCalledWith('/(tabs)/profile/emergency');
  });
});

// ── Edit profile ──────────────────────────────────────────────────────────────

describe('Edit Profile screen', () => {
  const mockBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      back: mockBack,
    });
  });

  it('renders the edit form fields after profile loads', async () => {
    const { findByLabelText } = await renderWithProviders(<EditProfileScreen />);
    // findByLabelText waits until the form renders (profile must be loaded first)
    expect(await findByLabelText('Full name')).toBeTruthy();
    expect(await findByLabelText('Email')).toBeTruthy();
    expect(await findByLabelText('Phone')).toBeTruthy();
  });

  it('navigates back after saving changes', async () => {
    const { findByLabelText, getByText } = await renderWithProviders(<EditProfileScreen />);
    await findByLabelText('Full name'); // wait for form
    await fireEvent.changeText(await findByLabelText('Full name'), 'Alex Johnson Updated');
    await fireEvent.press(getByText('Save Changes'));
    expect(mockBack).toHaveBeenCalled();
  });
});

// ── Emergency screen ──────────────────────────────────────────────────────────

describe('Emergency screen', () => {
  const mockBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      back: mockBack,
    });
  });

  it('renders emergency contacts from the API', async () => {
    const { findByText } = await renderWithProviders(<EmergencyScreen />);
    // seed: { name: 'Sarah Johnson', relationship: 'Daughter', phone: '(555) 234-5678' }
    expect(await findByText('Sarah Johnson')).toBeTruthy();
    expect(await findByText('Daughter')).toBeTruthy();
  });

  it('saves an incident log and shows the saved confirmation', async () => {
    const { getByLabelText, findByText } = await renderWithProviders(<EmergencyScreen />);
    await fireEvent.changeText(getByLabelText('Quick incident log'), 'Patient had a fall');
    await fireEvent.press(getByLabelText('Save incident log'));
    expect(await findByText(/✓ Saved/i)).toBeTruthy();
  });

  it('navigates back when the back button is pressed', async () => {
    const { getByLabelText } = await renderWithProviders(<EmergencyScreen />);
    await fireEvent.press(getByLabelText('Go back'));
    expect(mockBack).toHaveBeenCalled();
  });
});

// ── Caretaker notes ───────────────────────────────────────────────────────────

describe('Caretaker Notes screen', () => {
  const mockBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      back: mockBack,
    });
  });

  it('renders notes from the care team', async () => {
    const { findByText } = await renderWithProviders(<CaretakerNotesScreen />);
    // seed: { authorName: 'Maria (Day Nurse)', content: 'Margaret had a good morning.' }
    expect(await findByText('Maria (Day Nurse)')).toBeTruthy();
    expect(await findByText('Margaret had a good morning.')).toBeTruthy();
  });

  it('submits a reply and shows the reply text', async () => {
    const { findByText, getByLabelText } = await renderWithProviders(<CaretakerNotesScreen />);
    await findByText('Maria (Day Nurse)'); // wait for notes to load
    await fireEvent.changeText(getByLabelText('Reply to note'), 'Thank you!');
    await fireEvent.press(getByLabelText('Submit reply'));
    expect(await findByText('Thank you!')).toBeTruthy();
  });

  it('navigates back when the back button is pressed', async () => {
    const { getByLabelText } = await renderWithProviders(<CaretakerNotesScreen />);
    await fireEvent.press(getByLabelText('Go back'));
    expect(mockBack).toHaveBeenCalled();
  });
});
