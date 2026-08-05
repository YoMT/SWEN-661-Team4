# CareConnect — Web

The web build of **CareConnect**, a healthcare/caregiver app for caregivers with
Parkinsonian tremors, built around WCAG-aligned accessibility.

**Stack:** React 19 · TypeScript · Vite · PWA (installable, offline via a service worker).

## Features

- **Public pages:** Landing, Login, and Signup.
- **Authenticated app:** Dashboard, Medications, Appointments, Symptoms, and Profile.
- **Peggy** — an in-app AI assistant with a polite live-region transcript.
- **PWA** — installable, with offline support via a hand-rolled service worker.
- Talks to the CareConnect API (`apps/server`, Express + TiDB); falls back to an
  in-memory mock when `VITE_API_URL` is unset.

## Prerequisites

- Node.js 20 LTS+ and pnpm 9+

Install dependencies from the repo root (see the [root README](../../README.md)):

```bash
pnpm install
```

## Running

```bash
cd apps/web
pnpm dev        # start the Vite dev server at http://localhost:5173
pnpm build      # type-check (tsc -b) + production build to dist/
pnpm preview    # preview the production build locally
pnpm lint       # ESLint
```

Sign in with the demo account **`demo@careconnect.com` / `demo123`** to reach the
authenticated screens. By default the app uses an in-memory mock; to point it at a
running API instead, set `VITE_API_URL` (e.g. in `.env.local`):

```bash
VITE_API_URL=http://localhost:8787
```

## Testing

Unit and integration tests run with **Jest 30** + **Testing Library**; end-to-end
tests run with **Playwright**; accessibility is scanned with **axe-core** (across
four browsers) and **Lighthouse**.

```bash
cd apps/web
pnpm test               # Jest: unit + integration (jsdom + Testing Library)
pnpm test:coverage      # Jest with coverage
pnpm test:e2e           # Playwright E2E (all projects)
pnpm test:e2e:mobile    # Playwright E2E, mobile viewport (mock API)
pnpm test:e2e:real      # Playwright E2E against the real API
pnpm test:e2e:report    # open the last Playwright HTML report
```

## Accessibility

CareConnect Web targets **WCAG 2.1 Level AA** and follows the four POUR principles.

- **axe-core** (WCAG 2.1 A/AA) — **0 violations**: Chromium, Edge, and Firefox across
  all surfaces, and WebKit across the public pages (`a11y-*` Playwright projects in
  `playwright.config.ts`, driven by `e2e/a11y/axe.spec.ts`).
- **Lighthouse** accessibility — **100 / 100** on the public pages.
- Full report: [docs/WEB_ACCESSIBILITY_TEST_REPORT.md](docs/WEB_ACCESSIBILITY_TEST_REPORT.md);
  raw axe/Lighthouse evidence under [docs/accessibility/](docs/accessibility/).

> Items requiring a human operating assistive technology — hands-on NVDA/VoiceOver,
> the WAVE / axe DevTools browser extensions, and real Safari on macOS — are covered
> by runbooks in the report and remain manual tester tasks (marked ☐).
