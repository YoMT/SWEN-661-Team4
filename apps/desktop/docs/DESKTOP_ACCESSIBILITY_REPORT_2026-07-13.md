# CareConnect Desktop — Accessibility Findings Report (WCAG 2.1 AA)

Course: SWEN 661 — CareConnect Desktop Application | Team 4 — Nuboke Bakoh, Yoseph Tesfay, Prashanth Saseenthar

Report date: July 13, 2026 | Electron desktop client | Keyboard-first interaction model | WCAG 2.1 Level AA

**11 success criteria assessed  ·  1 defect found and resolved  ·  6 recommendations  ·  0 open failures  ·  verified by 38 automated tests (31 keyboard-navigation + 7 axe scans)**

## 1. Purpose and Scope

This report records the **accessibility findings** for the CareConnect **desktop**
(Electron) client and **maps each finding to the appropriate WCAG 2.1 Level AA success
criterion**. It is the evidence-backed companion to `DESKTOP_ACCESSIBILITY.md` (the
accessibility design/conformance guide) and draws its verification evidence from
`DESKTOP_KEYBOARD_NAV_TEST_REPORT.md` (the keyboard-navigation Jest suite) and the
per-screen `jest-axe` accessibility scans.

**Primary users.** CareConnect's caregivers include people living with Parkinson's
tremor, for whom a pointing device can be unreliable. The governing requirement is
therefore: **every task must be completable with the keyboard alone; the mouse is an
accelerator, never a requirement** (WCAG 2.1.1). Any flow that can only be completed
with a mouse is treated as a defect.

**Scope.** Window chrome (title bar, menu bar, toolbar, sidebar, status bar), the five
primary screens (Dashboard, Medications, Appointments, Symptoms, Profile), the Edit
Profile dialog, the Peggy assistant panel, the command palette, and the pre-auth
landing/login flow.

## 2. Method and Evidence Sources

Findings were gathered from three complementary sources and cross-checked against the
design intent documented in `DESKTOP_ACCESSIBILITY.md`:

| # | Source | What it verifies | Coverage |
|---|---|---|---|
| A | **Keyboard-navigation Jest suite** (`DESKTOP_KEYBOARD_NAV_TEST_REPORT.md`) | Focus movement, key handling (`Enter`, `Escape`, `Arrow`, `Home`, `End`, `F6`), command dispatch | 7 suites / 31 tests — all PASS |
| B | **Automated `jest-axe` scans** (`*.a11y.test.tsx`) | Machine-detectable WCAG issues (names/roles, labels, ARIA integrity, landmarks) per screen | 7 suites / 7 tests — all PASS |
| C | **Design / heuristic review** | Items axe cannot assert under jsdom (visible focus ring, contrast on real surfaces, screen-reader behavior) | Reviewed against guide §4–§8 |

**jsdom limitation.** Sources A and B run under jsdom, which does not render pixels; the
**visible focus ring** (2.4.7) and **contrast on live surfaces** (1.4.3/1.4.11) are
therefore confirmed by design tokens and heuristic review (source C) rather than by an
automated pixel check. This is noted per-finding below.

## 3. Accessibility Model (condensed)

- **Keyboard-first.** Every navigation and action has a documented key path; focus is
  always visible and never trapped outside modal dialogs. Global accelerators are
  registered once through Electron's native menu with `CmdOrCtrl` (conflict-safe across
  Windows/Linux/macOS).
- **Region & focus navigation.** `F6` / `Shift + F6` cycle focus between shell regions
  (title bar → menu bar → toolbar → sidebar → content → assistant → status bar); the menu
  bar, toolbar and sidebar use a **roving tabindex** (one tab stop per group, arrows move
  within); `Esc` closes the innermost overlay and restores focus to the invoker.
- **Command palette.** `Ctrl/Cmd + K` opens a searchable palette of every command; focus
  lands in the search field, Up/Down move the active option, Enter runs it, Esc closes.
- **Tremor-tolerant targets.** Care-write controls never shrink below a 44px hit target;
  an **Accessible (Tremor) density** mode enlarges all targets.
- **Perceivable status.** State is conveyed by icon + text (never color alone) and changes
  are announced through ARIA live regions.

## 4. Findings

Each finding maps to a WCAG 2.1 Level AA success criterion (SC), with a severity, a
resolution status, and the test evidence that verifies it.

| ID | Area | Finding / observation | WCAG 2.1 AA SC | Severity | Status | Evidence (verifying suite / test) |
|---|---|---|---|---|---|---|
| F-01 | Keyboard operability | Every action — palette, menus, toolbar, navigation, add/edit, mark taken, log symptom, assistant, sign out — is reachable and operable by keyboard alone. | 2.1.1 Keyboard | — | Supports | Command Palette (5), Menu Bar (4), Toolbar (3), Sidebar (3), App Integration (9) — all PASS |
| F-02 | Overlay dismissal | Overlays (palette, dialogs, assistant) close on `Escape` and restore focus to the invoker; focus is never trapped outside modals. | 2.1.2 No Keyboard Trap | — | Supports | CommandPalette "closes with **escape** key"; InfoDialog "calls onClose when **Escape** is pressed"; PeggyPanel close — PASS |
| F-03 | Focus order | Roving-tabindex toolbar/menu/sidebar and `F6` region cycling keep Tab order in visual/DOM order and manage focus on overlay open/close. | 2.4.3 Focus Order | — | Supports | Toolbar "moves focus with **arrow** keys, **home**, and **end**"; MenuBar "supports **keyboard navigation** between top menus" — PASS |
| F-04 | Focus visibility | Every interactive element shows a 3px focus ring (+2px offset) on `:focus-visible`. | 2.4.7 Focus Visible | — | Supports (design-verified) | Design review §4; not pixel-testable under jsdom |
| F-05 | Name, role, value | Custom controls (menu bar, toolbar, sidebar nav with `aria-current`, dialogs, assistant log) expose correct ARIA roles/states; automated scan finds zero violations on all seven screens. | 4.1.2 Name, Role, Value | — | Supports | Sidebar renders `aria-current`; jest-axe scans of Landing/Login/Dashboard/Medications/Appointments/Symptoms/Profile — all PASS |
| **F-06** | **Symptoms — severity dots** | **Defect:** severity indicator dots carried an `aria-label` on a bare `<div>`, where `aria-label` is prohibited (`aria-prohibited-attr`), so "Severity N of 5" was not exposed to assistive technology. | 4.1.2 Name, Role, Value | Moderate | **Resolved** — added `role="img"` so the label is valid and announced | Surfaced by SymptomsScreen jest-axe scan; now PASS |
| F-07 | Status messages | Saves, refreshes, counts, confirmation toasts and assistant replies are announced through ARIA live regions (`polite` / `role="status"` / assertive alert). | 4.1.3 Status Messages | — | Supports | App Integration "logs a symptom and shows a confirmation toast"; "opens Peggy and receives a contextual reply" — PASS |
| F-08 | Character-key shortcuts | Single-key (type-ahead) shortcuts are scoped to a focused row, disabled during text entry, and remappable. | 2.1.4 Character Key Shortcuts | — | Supports (design-verified) | Design review §3.4 |
| F-09 | Use of color / contrast | Status (sync, dose state, severity) pairs color with icon/text; text and UI colors use AA-verified design tokens; borders/focus rings meet 3:1 non-text contrast. | 1.4.1 · 1.4.3 · 1.4.11 | — | Supports | Design tokens + axe `color-contrast` where computable; design review §8 |
| F-10 | Content on hover/focus | Tooltips/helper text appear on keyboard focus as well as hover, are dismissable with `Esc`, and persist while focused. | 1.4.13 Content on Hover or Focus | — | Supports (design-verified) | Design review §9 |
| F-11 | Target size | Care-write controls are never smaller than 44px; Accessible density enlarges all targets. | 2.5.5 / 2.5.8 Target Size | — | Supports (design-verified) | Design review §2 |

**Summary:** 10 conformance findings (Supports) and 1 defect (F-06), which has been
resolved. No open failures remain.

## 5. Recommendations to Correct Violations

Recommendations for correcting the violation discovered during testing and for preventing
regressions. Each recommendation references the finding or limitation it addresses.

| ID | Recommendation | Addresses | Priority | Status |
|---|---|---|---|---|
| R-01 | **Corrective action for F-06.** Expose the Symptoms severity indicator to assistive technology by wrapping the dots in an element with `role="img"` and an `aria-label` ("Severity N of 5"), so the label is valid (not `aria-prohibited-attr`) and announced. | F-06 · 4.1.2 | High | **Completed** (`SymptomsScreen.tsx`) |
| R-02 | **Audit similar patterns.** Sweep the renderer for other decorative-but-labeled elements — any `div`/`span` carrying an `aria-label` — and give each an appropriate `role` (e.g. `role="img"`) or move the label onto a semantic element, to prevent further `aria-prohibited-attr` violations. | 4.1.2 | Medium | Recommended |
| R-03 | **Keep the axe regression guard.** Retain the `jest-axe` suites in CI so an F-06-class regression fails the build rather than shipping. | 4.1.2 · process | High | In place |
| R-04 | **Extend axe coverage to overlays.** Add `*.a11y.test.tsx` scans for the interactive overlays not yet covered — `EditProfileModal`, `CommandPalette`, `InfoDialog` — since dialogs are the highest-risk surfaces for focus, label, and name/role/value defects. | 2.1.2 · 2.4.3 · 4.1.2 | Medium | Recommended |
| R-05 | **Manual axe DevTools pass per release.** Run the browser-extension audit on each screen before release to catch contrast and visible-focus issues that jsdom cannot compute. | 1.4.3 · 1.4.11 · 2.4.7 | Medium | Recommended |
| R-06 | **Remediate Known Limitations accessibly.** Annotate "coming soon" link rows with an accessible state (e.g. `aria-disabled` plus a visible/announced "coming soon") so they do not mislead screen-reader users; give "Change photo" an accessible label and keyboard trigger when wired; and preserve `role="log"` / `aria-live` on the assistant transcript when the mock service is replaced with a live model. | §7 limitations · 4.1.2 · 4.1.3 | Low | Recommended |

**Outcome:** the one violation discovered during testing (F-06) is corrected (R-01); the
remaining recommendations (R-02, R-04, R-05, R-06) are preventive hardening, and R-03 is
already in place.

## 6. WCAG 2.1 AA Conformance Mapping

The alignment table from `DESKTOP_ACCESSIBILITY.md` §9, extended with the evidence that
verifies each criterion in this release.

| Criterion | How CareConnect Desktop complies | Evidence / verifying test | Status |
|---|---|---|---|
| 1.4.1 Use of Color | Status (sync, dose state, severity) always pairs color with an icon and/or text label. | Design tokens; Symptoms/Medications screen scans | Supports |
| 1.4.3 Contrast (Minimum) | Text and UI colors use AA-verified design-system tokens on light and dark surfaces. | Design tokens; axe `color-contrast` | Supports |
| 1.4.11 Non-text Contrast | Borders, focus rings and control boundaries meet the 3:1 non-text minimum. | Design review §4; tokens | Supports |
| 1.4.13 Content on Hover/Focus | Tooltips/helper text appear on focus and hover, dismiss with `Esc`, persist while focused. | Design review §9 (F-10) | Supports |
| 2.1.1 Keyboard | Every action has a documented key path; no mouse-only paths. | Command Palette, Menu Bar, Toolbar, Sidebar, App Integration suites (F-01) | Supports |
| 2.1.2 No Keyboard Trap | Focus leaves every widget via Tab/Esc; only modals trap, and they always offer Esc. | CommandPalette / InfoDialog "escape" tests (F-02) | Supports |
| 2.1.4 Character Key Shortcuts | Single-key shortcuts are focus-scoped, disabled during text entry, remappable. | Design review §3.4 (F-08) | Supports |
| 2.4.3 Focus Order | Tab order follows visual/DOM order; focus managed on nav, mutation, overlay open/close. | Toolbar / Menu Bar keyboard-nav tests (F-03) | Supports |
| 2.4.7 Focus Visible | 3px focus ring (+2px offset) on every interactive element on `:focus-visible`. | Design review §4 (F-04) | Supports |
| 2.5.5 / 2.5.8 Target Size | Care-write controls never below 44px; Accessible density enlarges all targets. | Design review §2 (F-11) | Supports |
| 4.1.2 Name, Role, Value | Custom controls expose correct ARIA roles/states/labels; scan is clean after fixing F-06. | Sidebar `aria-current`; 7-screen jest-axe scans (F-05, F-06) | Supports |
| 4.1.3 Status Messages | Saves, refreshes, errors and assistant replies announced via ARIA live regions. | App Integration toast / Peggy reply tests (F-07) | Supports |

## 7. Known Limitations

These are recorded as open, **non-blocking** items (navigation affordances present, not
WCAG failures); see **R-06** for accessible remediation guidance:

- Secondary destinations behind some Profile/Settings link rows (Emergency Contacts,
  Caretaker Notes, Generate Report) are present as navigation affordances but surface a
  "coming soon" notice rather than a dedicated screen.
- The assistant uses a local mock response service (`/ai/chat`) rather than a live
  language model.
- "Change photo" in Edit Profile is a placeholder pending native file-picker integration.

## 8. How to Reproduce the Evidence

All commands run from the `apps/desktop/` directory.

- **Keyboard-navigation suite (31 tests):**
  `pnpm jest CommandPalette MenuBar Toolbar Sidebar InfoDialog PeggyPanel app.integration`
- **Automated accessibility scans (7 tests):** `pnpm jest a11y`
- **Full desktop suite:** `pnpm jest` (27 suites / 96 tests, includes both of the above)

Latest run (July 13, 2026): keyboard-navigation 7 suites / 31 tests — all pass;
accessibility scans 7 suites / 7 tests — all pass.

---

Companion documents: `DESKTOP_ACCESSIBILITY.md` (accessibility design/conformance guide),
`DESKTOP_KEYBOARD_NAV_TEST_REPORT.md` (keyboard-navigation Jest coverage), and
`apps/desktop/docs/accessibility.md` (the axe DevTools / jest-axe / dev-console scanning
workflow).
