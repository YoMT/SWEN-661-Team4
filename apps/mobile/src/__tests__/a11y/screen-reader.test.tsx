import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../integration/setup/render-with-providers';

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
import LoginScreen from '../../app/(auth)/login';
import SymptomLogScreen from '../../app/(tabs)/symptoms';
import { LoadingIndicator } from '../../shared/components/loading-indicator';

// Walk up the host element tree until a node with the given prop value is found.
function findAncestorWithProp(node: any, prop: string, value: string): any {
  let el = node?.parent;
  while (el) {
    if (el.props?.[prop] === value) return el;
    el = el.parent;
  }
  return null;
}

describe('Screen reader (TalkBack) accessibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    });
  });

  // ── LoadingIndicator ────────────────────────────────────────────────────────

  describe('LoadingIndicator', () => {
    it('is announced as "Loading" by default', async () => {
      const { getByLabelText } = await render(<LoadingIndicator />);
      expect(getByLabelText('Loading')).toBeTruthy();
    });

    it('uses the message prop as its label', async () => {
      const { getByLabelText } = await render(<LoadingIndicator message="Fetching appointments" />);
      expect(getByLabelText('Fetching appointments')).toBeTruthy();
    });

    it('has progressbar role so TalkBack announces it correctly', async () => {
      const { getByRole } = await render(<LoadingIndicator />);
      expect(getByRole('progressbar')).toBeTruthy();
    });
  });

  // ── Landing screen ──────────────────────────────────────────────────────────

  describe('Landing screen', () => {
    it('all interactive buttons are reachable by role and name', async () => {
      const { getByRole } = await renderWithProviders(<LandingScreen />);
      expect(getByRole('button', { name: 'Sign in' })).toBeTruthy();
      expect(getByRole('button', { name: /get started/i })).toBeTruthy();
      expect(getByRole('button', { name: /i already have an account/i })).toBeTruthy();
    });

    it('hero image has a descriptive label (not empty)', async () => {
      const { getByLabelText } = await renderWithProviders(<LandingScreen />);
      expect(getByLabelText(/caregiver/i)).toBeTruthy();
    });
  });

  // ── Login screen ────────────────────────────────────────────────────────────

  describe('Login screen', () => {
    it('text inputs are reachable by label', async () => {
      const { getByLabelText } = await renderWithProviders(<LoginScreen />);
      expect(getByLabelText('Email address')).toBeTruthy();
      expect(getByLabelText('Password')).toBeTruthy();
    });

    it('primary action button is reachable by role and name', async () => {
      const { getByRole } = await renderWithProviders(<LoginScreen />);
      expect(getByRole('button', { name: 'Sign In' })).toBeTruthy();
    });

    it('secondary actions are reachable by label', async () => {
      const { getByLabelText } = await renderWithProviders(<LoginScreen />);
      expect(getByLabelText('Sign in with biometrics')).toBeTruthy();
      expect(getByLabelText('Forgot password')).toBeTruthy();
      expect(getByLabelText('Create account')).toBeTruthy();
    });

    it('error container has assertive live region when validation fails', async () => {
      const { getByRole, findByText } = await renderWithProviders(<LoginScreen />);
      await fireEvent.press(getByRole('button', { name: 'Sign In' }));
      // wait for the validation error to appear (contains ⚠️ prefix)
      const errorEl = await findByText(/⚠️/);
      const liveRegionContainer = findAncestorWithProp(errorEl, 'accessibilityLiveRegion', 'assertive');
      expect(liveRegionContainer).toBeTruthy();
    });
  });

  // ── Symptoms screen ─────────────────────────────────────────────────────────

  describe('Symptoms screen', () => {
    it('all six symptom buttons are reachable by role and name', async () => {
      const { getByRole } = await renderWithProviders(<SymptomLogScreen />);
      expect(getByRole('button', { name: 'Pain' })).toBeTruthy();
      expect(getByRole('button', { name: 'Dizzy' })).toBeTruthy();
      expect(getByRole('button', { name: 'Breath' })).toBeTruthy();
      expect(getByRole('button', { name: 'Tired' })).toBeTruthy();
      expect(getByRole('button', { name: 'Nausea' })).toBeTruthy();
      expect(getByRole('button', { name: 'Other' })).toBeTruthy();
    });

    it('severity row renders 10 radio buttons', async () => {
      const { getAllByRole } = await renderWithProviders(<SymptomLogScreen />);
      expect(getAllByRole('radio')).toHaveLength(10);
    });

    it('default severity 5 is the only checked radio', async () => {
      const { getAllByRole } = await renderWithProviders(<SymptomLogScreen />);
      const radios = getAllByRole('radio');
      const checked = radios.filter((r) => r.props.accessibilityState?.checked === true);
      expect(checked).toHaveLength(1);
      expect(checked[0].props.accessibilityLabel).toBe('Severity 5');
    });

    it('note input is reachable by label', async () => {
      const { getByLabelText } = await renderWithProviders(<SymptomLogScreen />);
      expect(getByLabelText('Note (optional)')).toBeTruthy();
    });

    it('selecting a symptom updates its accessibilityState to selected', async () => {
      const { getByRole } = await renderWithProviders(<SymptomLogScreen />);
      expect(getByRole('button', { name: 'Pain' }).props.accessibilityState?.selected).toBe(false);
      await fireEvent.press(getByRole('button', { name: 'Pain' }));
      // re-query to get the updated element after state flush
      expect(getByRole('button', { name: 'Pain' }).props.accessibilityState?.selected).toBe(true);
    });

    it('success banner has polite live region after saving', async () => {
      const { getByRole, findByText } = await renderWithProviders(<SymptomLogScreen />);
      await fireEvent.press(getByRole('button', { name: 'Pain' }));
      await fireEvent.press(getByRole('button', { name: 'Save Log' }));
      const bannerText = await findByText('✓ Symptom logged');
      const liveRegionContainer = findAncestorWithProp(bannerText, 'accessibilityLiveRegion', 'polite');
      expect(liveRegionContainer).toBeTruthy();
    });
  });
});
