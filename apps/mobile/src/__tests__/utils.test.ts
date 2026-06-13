import { getInitials } from "../features/emergency/emergency-contact";
import { adherenceRate } from "../features/profile/care-report";
import {
  textScale,
  minTouchTarget,
  primaryButtonHeight,
  navItemHeight,
  defaultAccessibility,
} from "../features/accessibility/accessibility";
import type { AccessibilitySettings } from "../features/accessibility/accessibility";
import type { CareReport } from "../features/profile/care-report";

// ── getInitials ────────────────────────────────────────────────────────────────

describe("getInitials", () => {
  test("returns two initials for a full name", () => {
    expect(getInitials("Alex Johnson")).toBe("AJ");
  });

  test("returns one initial for a single-word name", () => {
    expect(getInitials("Alex")).toBe("A");
  });

  test("returns at most two initials for a three-word name", () => {
    expect(getInitials("Mary Jane Watson")).toBe("MJ");
  });

  test("returns uppercase initials", () => {
    expect(getInitials("sarah chen")).toBe("SC");
  });

  test("returns '?' for an empty string", () => {
    expect(getInitials("")).toBe("?");
  });
});

// ── adherenceRate ─────────────────────────────────────────────────────────────

describe("adherenceRate", () => {
  const base: CareReport = {
    patientName: "Test Patient",
    totalDoses: 4,
    takenDoses: 4,
    missedDoses: 0,
    symptomSummary: "",
    nextAppointment: "",
  };

  test("returns 100 when all doses taken", () => {
    expect(adherenceRate({ ...base, totalDoses: 4, takenDoses: 4 })).toBe(100);
  });

  test("returns 75 when 3 of 4 doses taken", () => {
    expect(adherenceRate({ ...base, totalDoses: 4, takenDoses: 3 })).toBe(75);
  });

  test("returns 0 when no doses taken", () => {
    expect(adherenceRate({ ...base, totalDoses: 4, takenDoses: 0 })).toBe(0);
  });

  test("returns 0 when totalDoses is 0", () => {
    expect(adherenceRate({ ...base, totalDoses: 0, takenDoses: 0 })).toBe(0);
  });

  test("returns 50 when half doses taken", () => {
    expect(adherenceRate({ ...base, totalDoses: 10, takenDoses: 5 })).toBe(50);
  });
});

// ── accessibility utils ────────────────────────────────────────────────────────

const standard: AccessibilitySettings = { ...defaultAccessibility, textSize: "standard" };
const large: AccessibilitySettings = { ...defaultAccessibility, textSize: "large" };
const largest: AccessibilitySettings = { ...defaultAccessibility, textSize: "largest" };
const tremorOn: AccessibilitySettings = { ...defaultAccessibility, tremorMode: true };

describe("textScale", () => {
  test("returns 1.0 for standard text size", () => {
    expect(textScale(standard)).toBe(1.0);
  });

  test("returns 1.25 for large text size", () => {
    expect(textScale(large)).toBe(1.25);
  });

  test("returns 1.5 for largest text size", () => {
    expect(textScale(largest)).toBe(1.5);
  });
});

describe("minTouchTarget", () => {
  test("returns 48 without tremor mode", () => {
    expect(minTouchTarget(standard)).toBe(48);
  });

  test("returns 60 with tremor mode", () => {
    expect(minTouchTarget(tremorOn)).toBe(60);
  });
});

describe("primaryButtonHeight", () => {
  test("returns 64 without tremor mode", () => {
    expect(primaryButtonHeight(standard)).toBe(64);
  });

  test("returns 72 with tremor mode", () => {
    expect(primaryButtonHeight(tremorOn)).toBe(72);
  });
});

describe("navItemHeight", () => {
  test("returns 56 without tremor mode", () => {
    expect(navItemHeight(standard)).toBe(56);
  });

  test("returns 64 with tremor mode", () => {
    expect(navItemHeight(tremorOn)).toBe(64);
  });
});
