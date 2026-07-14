# Desktop Accessibility Scanning

CareConnect desktop has three complementary ways to catch accessibility (WCAG) issues:
manual **axe DevTools** audits, automated **jest-axe** tests, and **@axe-core/react**
console logging during development.

## 1. Manual axe DevTools (browser extension)

[axe DevTools](https://www.deque.com/axe/devtools/) is a Chrome/Edge browser extension.
It does not load into a packaged Electron window cleanly, but the renderer is an ordinary
React web page served by the Vite dev server — so scan it in a real browser:

1. Start the app in dev mode:
   ```bash
   cd apps/desktop
   npm run dev
   ```
   `electron-vite` serves the renderer at a local URL (the `ELECTRON_RENDERER_URL` used in
   `src/main/index.ts`), typically <http://localhost:5173>.
2. Open that URL in **Chrome or Edge** with the axe DevTools extension installed.
3. Open DevTools (`F12`) → **axe DevTools** tab → **Scan All of My Page**.
4. Walk each screen — Login, Dashboard, Appointments, Medications, Symptoms, Profile,
   Landing — and triage the reported violations.

> **Note:** the frameless custom title-bar controls (minimize / maximize / close) rely on
> Electron IPC (`window:*`) and won't function in a plain browser — there's no
> `window.electron` bridge. All screen, form, and dialog content renders and scans
> normally; only those window chrome buttons are inert.

## 2. Automated jest-axe tests (CI regression coverage)

Each screen has a `*.a11y.test.tsx` suite under `src/renderer/src/__tests__/` that renders
the component and asserts zero axe violations. The `toHaveNoViolations` matcher is
registered globally in `src/renderer/src/setupTests.ts`.

Run them with the rest of the suite:

```bash
npm test              # all tests, including *.a11y.test.tsx
npm run test:coverage # same, with coverage report
```

Run only the accessibility suites:

```bash
npx jest a11y
```

To cover a new screen or a complex component (e.g. a modal), copy an existing
`*.a11y.test.tsx`, reuse the same `jest.mock(...)` blocks as that component's functional
test, render it, and assert `expect(await axe(container)).toHaveNoViolations()`.

## 3. @axe-core/react dev-console logging

`src/renderer/src/main.tsx` loads `@axe-core/react` in dev only (`import.meta.env.DEV`).
While `npm run dev` is running, open the Electron DevTools console (`F12`) — axe-core logs
any violations on every render, giving live feedback as you build. It is stripped from
production builds and does not run under Jest.

## Coverage and the pre-release manual pass

The `*.a11y.test.tsx` suites cover the seven screens **and** the interactive overlays that
mount outside them — the Edit Profile modal, the command palette, and info dialogs. Any new
screen, modal, or dialog should get a suite before it ships.

jsdom has no layout or paint engine, so the automated suites **cannot** evaluate colour
contrast (1.4.3, 1.4.11) or visible focus indicators (2.4.7). Those are only observable in a
real browser. **Before each release, run one manual axe DevTools pass over every screen**
(see §1) and check keyboard focus is visible on each interactive element. Automated scans are
a regression guard, not a substitute for that pass.

## Triaging findings

Fix genuine violations at the source. axe rules map to WCAG success criteria; each console
entry and test failure links to a Deque University page explaining the rule and remediation.
For example, a decorative-but-labeled element flagged as `aria-prohibited-attr` usually
needs an appropriate `role` (e.g. `role="img"`) so its `aria-label` is exposed to assistive
technology.

Controls that exist but are not implemented yet ("coming soon") should be marked
`aria-disabled="true"` with a label that says so — **not** the native `disabled` attribute,
which removes them from the tab order and hides them from screen readers entirely.
