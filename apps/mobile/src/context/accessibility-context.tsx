import React, { createContext, useContext, useState } from 'react';
import { defaultAccessibility, primaryButtonHeight, navItemHeight, textScale, minTouchTarget } from '@/models/accessibility';
import type { AccessibilitySettings } from '@/models/accessibility';

interface AccessibilityState {
  settings: AccessibilitySettings;
  buttonHeight: number;
  tabHeight: number;
  fontScale: number;
  touchTarget: number;
  update: (patch: Partial<AccessibilitySettings>) => void;
}

const AccessibilityContext = createContext<AccessibilityState | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultAccessibility);

  function update(patch: Partial<AccessibilitySettings>) {
    setSettings((prev) => ({ ...prev, ...patch }));
  }

  return (
    <AccessibilityContext.Provider value={{
      settings,
      buttonHeight: primaryButtonHeight(settings),
      tabHeight: navItemHeight(settings),
      fontScale: textScale(settings),
      touchTarget: minTouchTarget(settings),
      update,
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibilityContext() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibilityContext must be used within AccessibilityProvider');
  return ctx;
}
