import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
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
import AccessibilityScreen from '../../app/(tabs)/profile/accessibility';
import ProviderReportScreen from '../../app/(tabs)/profile/report';

// ── Accessibility screen ──────────────────────────────────────────────────────

describe('Accessibility settings screen', () => {
  const mockBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      back: mockBack,
    });
  });

  it('renders all accessibility setting rows', async () => {
    const { getByText } = await renderWithProviders(<AccessibilityScreen />);
    expect(getByText('Tremor mode')).toBeTruthy();
    expect(getByText('Reduce motion')).toBeTruthy();
    expect(getByText('High contrast')).toBeTruthy();
    expect(getByText('Read aloud')).toBeTruthy();
    expect(getByText('Confirm actions')).toBeTruthy();
  });

  it('renders text size options', async () => {
    const { getByText } = await renderWithProviders(<AccessibilityScreen />);
    expect(getByText('standard')).toBeTruthy();
    expect(getByText('large')).toBeTruthy();
    expect(getByText('largest')).toBeTruthy();
  });

  it('navigates back when the back button is pressed', async () => {
    const { getByLabelText } = await renderWithProviders(<AccessibilityScreen />);
    await fireEvent.press(getByLabelText('Go back'));
    expect(mockBack).toHaveBeenCalled();
  });
});

// ── Provider report screen ────────────────────────────────────────────────────

describe('Provider Report screen', () => {
  const mockBack = jest.fn();
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      back: mockBack,
    });
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('renders the patient care report with adherence data', async () => {
    const { findByText } = await renderWithProviders(<ProviderReportScreen />);
    expect(await findByText(/Care Report for/i)).toBeTruthy();
    expect(await findByText('Medication adherence')).toBeTruthy();
    expect(await findByText('Doses taken')).toBeTruthy();
    expect(await findByText('Symptom summary')).toBeTruthy();
  });

  it('shows the share button', async () => {
    const { getByLabelText } = await renderWithProviders(<ProviderReportScreen />);
    expect(getByLabelText('Share with care team')).toBeTruthy();
  });

  it('pressing share triggers the share alert', async () => {
    const { getByLabelText } = await renderWithProviders(<ProviderReportScreen />);
    await fireEvent.press(getByLabelText('Share with care team'));
    expect(alertSpy).toHaveBeenCalledWith('Share Report', expect.any(String), expect.any(Array));
  });

  it('shows the Peggy AI assistant FAB', async () => {
    const { getByLabelText } = await renderWithProviders(<ProviderReportScreen />);
    expect(getByLabelText('Open Peggy assistant')).toBeTruthy();
  });

  it('opens the Peggy chat modal and shows the welcome message', async () => {
    const { getByLabelText, findByText } = await renderWithProviders(<ProviderReportScreen />);
    await fireEvent.press(getByLabelText('Open Peggy assistant'));
    expect(await findByText(/Hi, I'm Peggy/i)).toBeTruthy();
  });

  it('sends a message to Peggy and shows the user message', async () => {
    const { getByLabelText, findByText } = await renderWithProviders(<ProviderReportScreen />);
    await fireEvent.press(getByLabelText('Open Peggy assistant'));
    await findByText(/Hi, I'm Peggy/i);
    await fireEvent.changeText(getByLabelText('Message input'), 'How is Margaret doing?');
    await fireEvent.press(getByLabelText('Send message'));
    expect(await findByText('How is Margaret doing?')).toBeTruthy();
  });

  it('navigates back when the back button is pressed', async () => {
    const { getByLabelText } = await renderWithProviders(<ProviderReportScreen />);
    await fireEvent.press(getByLabelText('Go back'));
    expect(mockBack).toHaveBeenCalled();
  });
});
