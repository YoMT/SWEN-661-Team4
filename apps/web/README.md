# CareConnect — Web

The web build of **CareConnect**, a healthcare/caregiver app for caregivers with
Parkinsonian tremors, built around four WCAG-aligned accessibility constraints.

**Stack:** React 19 · TypeScript · Vite.

> **Status: early scaffold.** Feature work is currently led by the mobile
> (`apps/mobile`) and Flutter (`apps/flutter-app`) apps. This app does not yet
> have a test suite.

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

## Testing

No automated tests yet. When a suite is added, document the commands here and add
a matching entry to the **Testing** section of the [root README](../../README.md).
