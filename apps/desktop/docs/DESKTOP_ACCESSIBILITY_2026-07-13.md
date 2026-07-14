# CareConnect Desktop — Accessibility Guide

Course: SWEN 661 — CareConnect Desktop Application | Team 4 — Nuboke Bakoh, Yoseph Tesfay, Prashanth Saseenthar

Version 1.1 | Updated July 13, 2026 | Electron desktop client | Keyboard-first interaction model | WCAG 2.1 AA

> **What changed in 1.1.** This revision incorporates the findings and recommendations from
> `DESKTOP_ACCESSIBILITY_REPORT_2026-07-13.md`: the §9 conformance table now carries test
> verification, the Symptoms severity indicator fix (F-06) is reflected in §5, and a new
> §12 records the findings-and-recommendations summary.

## 1. Purpose and Scope

This document describes the accessibility design and conformance of the CareConnect
**desktop** (Electron) client. It is the accessibility companion to
`DESKTOP_DESIGN_SYSTEM.md` (the source of truth for tokens and components) and
`CareConnect_Week7_Keyboard_Shortcuts_Updated_v2.docx` (the printable keyboard
reference), and reflects the behavior implemented in `apps/desktop`. Its conformance
claims are verified by the desktop Jest suites and recorded in
`DESKTOP_ACCESSIBILITY_REPORT_2026-07-13.md`.

**Primary users.** CareConnect's caregivers include people living with Parkinson's
tremor, for whom a pointing device can be unreliable. The governing requirement is
therefore: **every task must be completable with the keyboard alone; the mouse is an
accelerator, never a requirement** (WCAG 2.1.1). Any flow that can only be completed
with a mouse is treated as a defect.

**Scope.** Window chrome (title bar, menu bar, toolbar, sidebar, status bar), the
five primary screens (Dashboard, Medications, Appointments, Symptoms, Profile), the
Edit Profile dialog, the Peggy assistant panel, the command palette, and the pre-auth
landing/login flow.

## 2. Accessibility Principles

- **Keyboard-first.** All navigation and actions have a documented key path; focus is
  always visible and never trapped outside of modal dialogs.
- **Tremor-tolerant targets.** Care-write controls (Save, Mark as Taken, primary
  toolbar actions) never shrink below a 44px hit target, even in the dense desktop
  layout. An **Accessible (Tremor) density mode** restores larger, mobile-sized
  targets throughout.
- **Calm, static UI.** Motion is minimal (short fades, no bounce/spring/parallax/
  flashing) and can be disabled via **Reduce motion**.
- **Perceivable status.** State is conveyed with icon + text, never color alone, and
  changes are announced through ARIA live regions.

## 3. Keyboard Model

### 3.1 Global shortcuts

Application accelerators are registered through Electron's native application menu
using `CmdOrCtrl`, so a single definition is conflict-safe on Windows, Linux and
macOS. Because the window is frameless, the menu bar is also drawn in-window; the
native accelerators still fire.

| Action | Windows / Linux | macOS |
|---|---|---|
| New Medication | Ctrl + N | Cmd + N |
| New Appointment | Ctrl + Shift + N | Cmd + Shift + N |
| Export / Provider Report | Ctrl + E | Cmd + E |
| Command palette | Ctrl + K | Cmd + K |
| Settings | Ctrl + , | Cmd + , |
| Keyboard Shortcuts | Ctrl + / | Cmd + / |
| Help / User Guide | F1 | F1 |
| Go to Dashboard … Profile | Ctrl + 1 … 5 | Cmd + 1 … 5 |
| Toggle Sidebar | Ctrl + B | Cmd + B |
| Toggle Assistant (Peggy) | Ctrl + J | Cmd + J |
| Quit / Close window | Ctrl + Q / Ctrl + W | Cmd + Q / Cmd + W |

### 3.2 Region and focus navigation

- **F6 / Shift + F6** cycle focus forward/backward between shell regions: title bar →
  menu bar → toolbar → sidebar → content → assistant panel → status bar.
- **Tab / Shift + Tab** move between interactive elements in DOM/visual order.
- The menu bar, toolbar and sidebar use a **roving tabindex** (one tab stop per group;
  arrow keys move within the group).
- **Esc** closes the innermost overlay first (tooltip → popover → menu → dialog →
  panel) and returns focus to the invoking control.

### 3.3 Command palette

`Ctrl/Cmd + K` opens a searchable palette of every menu command. Focus lands in the
search field; Up/Down move the active option, Enter runs it, Esc closes and restores
focus. This gives a keyboard-only path to every action without memorizing shortcuts.

### 3.4 Lists and focused-item actions

Medication, appointment and symptom lists are reachable as a single tab stop with
arrow-key movement between rows. Activate with Enter, toggle with Space, and close any
overlay with Esc. Single-character shortcuts (e.g. type-ahead) are scoped to a focused
row and disabled while typing in a text field (WCAG 2.1.4); all accelerators are
remappable.

## 4. Focus Management

- **Visible focus ring.** Every interactive element shows a 3px focus outline with a
  2px offset on `:focus-visible`. Mouse users do not see rings; keyboard users always
  do (WCAG 2.4.7).
- **Focus order** follows visual/DOM order and is managed on navigation, mutation and
  overlay open/close (WCAG 2.4.3).
- **No keyboard trap.** Focus can always leave a widget via Tab/Esc. Only modal
  dialogs trap focus, and they always offer Esc (WCAG 2.1.2).
- **Dialogs** (Edit Profile, command palette, info dialogs) open with focus on their
  first field or close control and restore focus to the invoker on close.

## 5. Window Chrome Accessibility

- **Title bar.** Custom frameless title bar with a draggable region; window controls
  (minimize, maximize/restore, close) are real buttons with `aria-label`s and are
  excluded from the drag region. On macOS the native traffic-light controls are used.
- **Menu bar** uses `role="menubar"` with `aria-haspopup`/`aria-expanded` on each
  top-level item; Left/Right move between menus, Down/Enter open a menu, Esc closes.
- **Toolbar** uses `role="toolbar"`, one tab stop, Left/Right/Home/End arrow movement;
  primary care-write buttons are sized ≥44px.
- **Sidebar** is a `navigation` landmark; the active item is marked with
  `aria-current="page"`.
- **Status bar** is a `contentinfo` landmark. Display text (sync state, due counts) is
  non-interactive and kept out of the tab order; sync state uses an icon + text label,
  never color alone.
- **Non-text indicators.** Decorative indicators that carry meaning expose it to
  assistive technology via `role="img"` + `aria-label` — e.g. the Symptoms **severity
  dots** announce "Severity N of 5" (see §12, F-06), rather than placing `aria-label`
  on a bare `<div>`.

## 6. Assistant (Peggy) Accessibility

- Opened/closed with `Ctrl/Cmd + J`; focus moves into the message input on open and
  returns to the invoker on close.
- The transcript is a `role="log"` region with `aria-live="polite"`, so new replies
  are announced to screen-reader users.
- The composer submits on Enter and inserts a newline on Shift + Enter; a visible
  "Peggy is typing…" status communicates pending responses.

## 7. Forms, Dialogs and Live Regions

- **Labels.** Every input has an explicit, programmatically associated `<label>`.
- **Inline validation.** Required fields (e.g. Full name, Email in Edit Profile) show
  inline error text; errors are surfaced in an alert region rather than by color only.
- **Dirty-state guard.** Cancel/Esc on a changed form prompts a "Discard changes?"
  confirmation so edits are not lost by accident.
- **Two-step confirmation** is used for destructive/care-critical actions; the safe
  option (Cancel) is the default and dialogs never auto-dismiss.
- **Live regions.** `aria-live="polite"` announces saves, refreshes and counts;
  transient confirmations use a `role="status"` toast; blocking errors use an assertive
  alert.

## 8. Accessibility Preferences

Available from the Profile screen and the View menu:

| Preference | Effect |
|---|---|
| Tremor (Accessible) mode | Switches the app to the larger "accessible" density (bigger controls, rows and hit targets), applied via a `data-density` flag on the document root. |
| Reduce motion | Disables transitions/animations app-wide (also respected for users who set the OS "reduce motion" preference). |
| High contrast | Strengthens borders and text contrast for low-vision users. |

The app also honors OS text-scaling / display-scaling settings and is laid out for
large screens (≥1440px) so content has room to grow at larger text sizes.

## 9. WCAG 2.1 AA Alignment

Each criterion is now backed by the test evidence recorded in
`DESKTOP_ACCESSIBILITY_REPORT_2026-07-13.md` (38 automated tests: 31 keyboard-navigation
+ 7 axe scans).

| Criterion | How CareConnect Desktop complies | Verification | Status |
|---|---|---|---|
| 1.4.1 Use of Color | Status (sync, dose state, severity) always pairs color with an icon and/or text label. | Design tokens; screen axe scans | Supports |
| 1.4.3 Contrast (Minimum) | Text and UI colors use the design-system tokens, verified to meet AA contrast on light and dark surfaces. | Design tokens; axe `color-contrast` | Supports |
| 1.4.11 Non-text Contrast | Borders, focus rings and control boundaries meet the 3:1 non-text contrast minimum. | Design review §4 | Supports |
| 1.4.13 Content on Hover/Focus | Tooltips and helper text appear on keyboard focus as well as hover, are dismissable with Esc, and persist while focused. | Design review §7 | Supports |
| 2.1.1 Keyboard | Every action — navigation, add/edit, mark taken, log symptom, export, assistant, sign out — has a documented key path. No mouse-only paths. | Command Palette, Menu Bar, Toolbar, Sidebar, App Integration suites | Supports |
| 2.1.2 No Keyboard Trap | Focus leaves every widget via Tab/Esc; only modals trap, and they always offer Esc. | CommandPalette / InfoDialog "escape" tests | Supports |
| 2.1.4 Character Key Shortcuts | Single-key shortcuts are scoped to a focused row, disabled during text entry, and remappable. | Design review §3.4 | Supports |
| 2.4.3 Focus Order | Tab order follows visual/DOM order; focus is managed on navigation, mutation and overlay open/close. | Toolbar / Menu Bar keyboard-nav tests | Supports |
| 2.4.7 Focus Visible | A 3px focus ring (+2px offset) shows on every interactive element on `:focus-visible`. | Design review §4 | Supports |
| 2.5.5 / 2.5.8 Target Size | Care-write controls are never smaller than 44px; Accessible density enlarges all targets. | Design review §2 | Supports |
| 4.1.2 Name, Role, Value | Custom controls (menus, toolbar, switches, dialogs, assistant log) expose appropriate ARIA roles, states and labels. | Sidebar `aria-current`; 7-screen axe scans (clean after F-06 fix) | Supports |
| 4.1.3 Status Messages | Saves, refreshes, errors and assistant replies are announced through ARIA live regions. | App Integration toast / Peggy reply tests | Supports |

## 10. Platform Considerations

- **Screen readers:** NVDA (Windows, primary target), VoiceOver (macOS), Orca (Linux).
  Assistive-technology keys are never intercepted.
- **High contrast:** On Windows, the app respects `forced-colors: active` and falls
  back to system colors for borders and focus indicators.
- **Accelerators:** Defined once with `CmdOrCtrl`; platform-reserved keys
  (`Ctrl/Cmd + R`, `Cmd + M`, `Cmd + H`, Alt mnemonics, screen-reader keys) are not
  rebound to app actions.

## 11. Known Limitations

See §12 (R-06) for accessible remediation guidance on each item below:

- Secondary destinations behind some Profile/Settings link rows (Emergency Contacts,
  Caretaker Notes, Generate Report) are present as navigation affordances but not yet
  wired to dedicated screens; they surface a "coming soon" notice.
- The assistant uses a local mock response service (`/ai/chat`) rather than a live
  language model.
- "Change photo" in Edit Profile is a placeholder pending native file-picker
  integration.

## 12. Findings and Recommendations

Summarized from `DESKTOP_ACCESSIBILITY_REPORT_2026-07-13.md`.

**Violation found and fixed.**

| ID | Screen | Violation | WCAG | Resolution |
|---|---|---|---|---|
| F-06 | Symptoms | Severity dots carried `aria-label` on a bare `<div>` (`aria-prohibited-attr`), so "Severity N of 5" was not exposed to assistive technology. | 4.1.2 | Added `role="img"` so the label is valid and announced (`SymptomsScreen.tsx`). |

No other violations were found; all 38 automated tests pass and no open failures remain.

**Recommendations.**

| ID | Recommendation | Addresses | Priority | Status |
|---|---|---|---|---|
| R-01 | Corrective action for F-06 — expose the severity indicator via `role="img"` + `aria-label`. | F-06 · 4.1.2 | High | Completed |
| R-02 | Audit remaining decorative-but-labeled elements (any `div`/`span` with `aria-label`) for the same `aria-prohibited-attr` pattern; use a semantic element or `role="img"`. | 4.1.2 | Medium | Recommended |
| R-03 | Keep `jest-axe` in CI as a standing regression guard. | 4.1.2 · process | High | In place |
| R-04 | Extend automated axe scans to the interactive overlays not yet covered — Edit Profile modal, command palette, info dialogs. | 2.1.2 · 2.4.3 · 4.1.2 | Medium | Recommended |
| R-05 | Run a manual axe DevTools pass per screen before each release for contrast / visible-focus issues jsdom cannot compute. | 1.4.3 · 1.4.11 · 2.4.7 | Medium | Recommended |
| R-06 | Remediate Known Limitations accessibly — announce "coming soon" link-row state (`aria-disabled` + label), give "Change photo" an accessible label + keyboard trigger, and preserve `role="log"` / `aria-live` when the mock assistant is replaced. | §11 · 4.1.2 · 4.1.3 | Low | Recommended |

---

Companion documents: `DESKTOP_ACCESSIBILITY_REPORT_2026-07-13.md` (WCAG findings and
recommendations report), `DESKTOP_KEYBOARD_NAV_TEST_REPORT.md` (keyboard-navigation Jest
coverage), `DESKTOP_DESIGN_SYSTEM.md` (§2 tokens, §3 components, §4 keyboard model), and
`CareConnect_Week7_Keyboard_Shortcuts_Updated_v2.docx` (printable shortcut reference).
