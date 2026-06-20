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
import SymptomLogScreen from '../../app/(tabs)/symptoms';

describe('Symptom Log screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    });
  });

  it('renders all six symptom buttons', async () => {
    const { getByLabelText } = await renderWithProviders(<SymptomLogScreen />);
    expect(getByLabelText('Pain')).toBeTruthy();
    expect(getByLabelText('Dizzy')).toBeTruthy();
    expect(getByLabelText('Breath')).toBeTruthy();
    expect(getByLabelText('Tired')).toBeTruthy();
    expect(getByLabelText('Nausea')).toBeTruthy();
    expect(getByLabelText('Other')).toBeTruthy();
  });

  it('pressing Save Log with no symptom selected does not show the banner', async () => {
    const { getByText, queryByText } = await renderWithProviders(<SymptomLogScreen />);
    await fireEvent.press(getByText('Save Log'));
    expect(queryByText('✓ Symptom logged')).toBeNull();
  });

  it('selecting a symptom and pressing Save Log shows the success banner', async () => {
    const { getByLabelText, getByText, findByText } =
      await renderWithProviders(<SymptomLogScreen />);

    await fireEvent.press(getByLabelText('Pain'));
    await fireEvent.press(getByText('Save Log'));

    expect(await findByText('✓ Symptom logged')).toBeTruthy();
  });

  it('the saved symptom appears in the recent entries list', async () => {
    const { getByLabelText, getByText, findByText } =
      await renderWithProviders(<SymptomLogScreen />);

    await fireEvent.press(getByLabelText('Pain'));
    await fireEvent.press(getByText('Save Log'));

    // default severity is 5; seed dizzy entry has severity 3 — so "Severity 5/10" is unique
    expect(await findByText('Severity 5/10')).toBeTruthy();
  });

  it('shows existing seed entries in recent entries on load', async () => {
    const { findByText } = await renderWithProviders(<SymptomLogScreen />);
    // the seed note text is unique — no button or label contains this string
    expect(await findByText('Brief dizzy spell after standing up')).toBeTruthy();
  });
});
