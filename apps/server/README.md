# CareConnect API server

Express + TiDB Cloud (MySQL-compatible) backend for `apps/web`. The REST
contract mirrors the web app's in-memory mock (`apps/web/src/services/mock-api.ts`),
so the frontend switches backends purely via `VITE_API_URL` — no code changes.

## Setup

1. `cp .env.example .env` and fill in the TiDB credentials
   (kept locally in `Documentation/_WK11/Database_Setting.txt`; both files are gitignored).
2. `pnpm install`
3. `pnpm --filter server init-db` — creates tables and (re)seeds the demo
   account `demo@careconnect.com` / `demo123`. Idempotent; only resets the
   demo user's rows.

## Run

```
pnpm server        # from repo root — starts http://localhost:8787 (watch mode)
pnpm web           # in another terminal — Vite dev server
```

`apps/web/.env.local` sets `VITE_API_URL=http://localhost:8787`; blank it to
fall back to the in-memory mock. Vitest always forces the mock (see
`vitest.config.ts` `test.env`).

## Endpoints

Same as the mock: `POST /auth/login|signup`, `GET /auth/me`, `GET|PATCH /profile`,
`GET|POST /medications` + `PATCH /medications/:id/taken`, `GET|POST /appointments`
+ `PATCH /appointments/:id`, `GET|POST /symptoms`, `GET /emergency-contacts`,
`POST /incidents`, `GET /caretaker-notes` + `PATCH /caretaker-notes/:id/reply`,
`POST /ai/chat` (canned replies grounded in the user's rows).

Auth: scrypt password hashes; stateless HMAC bearer tokens (30-day expiry,
`AUTH_SECRET` in `.env`). All routes except login/signup require
`Authorization: Bearer <token>`.

## Deploy to Render

The repo root ships a Render Blueprint (`render.yaml`). In the Render dashboard:
**New → Blueprint → select this repo**. It provisions one web service with:

| Setting | Value |
|---------|-------|
| Root Directory | `apps/server` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Health Check Path | `/health` |

The service is self-contained (only public deps), so it installs in isolation
without a monorepo-wide `pnpm install`.

**Environment variables** — set in the Render dashboard (Environment tab), not in
a file. Render injects them into `process.env`; the `start` script uses
`--env-file-if-exists`, so it loads a local `.env` in development and silently
skips it in production.

- `TIDB_HOST`, `TIDB_USER`, `TIDB_PASSWORD` — from TiDB Cloud (mark as secret).
- `TIDB_PORT=4000`, `TIDB_DATABASE=CareConnect`.
- `AUTH_SECRET` — a long random string (the Blueprint auto-generates one).
- `CORS_ORIGIN` — the deployed web app's origin, e.g.
  `https://careconnect.example.com`. **Required**; if unset the API rejects all
  cross-origin browser requests. Comma-separate multiple origins.
- `PORT` — provided automatically by Render; do not set it.

**One-time DB init** — after the first deploy, open the Render service **Shell**
and run `npm run init-db` to create the schema and seed the demo account. It is
idempotent.

**Point the web app at it** — set `VITE_API_URL` to the Render service URL
(e.g. `https://careconnect-api.onrender.com`) in the web app's build env, and add
that web origin to `CORS_ORIGIN` here.

> On Render's free plan the service spins down when idle and cold-starts on the
> next request; upgrade to a paid plan for always-on.

## Notes

- TiDB serverless requires TLS; the pool sets `rejectUnauthorized: true`.
  If you see a Node warning about `NODE_TLS_REJECT_UNAUTHORIZED=0`, that env
  var is set globally on your machine and disables certificate verification
  process-wide — consider unsetting it.
- Timestamps are stored as ISO-8601 strings (`VARCHAR(32)`) for exact
  round-trips with the app, which only ever calls `new Date(value)`.
