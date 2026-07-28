import { defineConfig, devices } from '@playwright/test'
import { fileURLToPath } from 'node:url'

/**
 * E2E config for the CareConnect web PWA.
 *
 * Three projects:
 *  - desktop-mock : Desktop Chrome (1440×900, persistent sidebar) against the
 *                   in-memory mock backend. Runs the core auth/caregiver/offline
 *                   specs in ./e2e.
 *  - mobile-mock  : Pixel 5 (393px, bottom tab bar) against the mock backend.
 *                   Runs ./e2e/mobile (bottom-tab navigation).
 *  - real-api     : Desktop Chrome against the live apps/server API (Express +
 *                   TiDB Cloud). Runs ./e2e/real-api (real fetches + injected
 *                   failure states). Only enabled when explicitly requested, so
 *                   the default run needs neither apps/server nor TiDB.
 *
 * The demo account (demo@careconnect.com / demo123) exists in both the mock and
 * the seeded database.
 */

// Enable the real-API project + its servers only on request, so a plain
// `playwright test` stays mock-only and CI-safe (no DB connectivity needed).
// `--project=real-api` sets the env var in the main process; workers re-load
// this config and inherit that env, so the project resolves identically in both.
if (process.argv.some((a) => a.includes('real-api'))) process.env.E2E_REAL_API = '1'
const REAL_API = process.env.E2E_REAL_API === '1'

const MOCK_URL = 'http://localhost:5173'
// 4173 is in apps/server's CORS allowlist (CORS_ORIGIN); the browser's requests
// to the API must come from an allowed origin.
const REAL_URL = 'http://localhost:4173'
const API_URL = 'http://localhost:8787'
const serverCwd = fileURLToPath(new URL('../server', import.meta.url))

export default defineConfig({
  fullyParallel: true,
  // Cap concurrency: all mock projects share one Vite dev server, and too many
  // cold, parallel first-requests overwhelm its on-demand compile queue.
  workers: process.env.CI ? 1 : 3,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  // Compile the Vite app graph once before the workers start (see the file) so
  // cold on-demand compiles don't time out the first parallel navigations.
  globalSetup: './e2e/global-setup.ts',
  use: { trace: 'on-first-retry' },

  projects: [
    {
      name: 'desktop-mock',
      testDir: './e2e',
      testIgnore: ['**/mobile/**', '**/real-api/**'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        baseURL: MOCK_URL
      }
    },
    {
      name: 'mobile-mock',
      testDir: './e2e/mobile',
      // Pixel 5 (393px wide) → the desktop sidebar is hidden and the bottom tab
      // bar is shown.
      use: { ...devices['Pixel 5'], baseURL: MOCK_URL }
    },
    ...(REAL_API
      ? [
          {
            name: 'real-api',
            testDir: './e2e/real-api',
            use: {
              ...devices['Desktop Chrome'],
              viewport: { width: 1440, height: 900 },
              baseURL: REAL_URL
            }
          }
        ]
      : [])
  ],

  webServer: [
    {
      // Mock-backed dev server: VITE_API_URL blanked so api.ts routes to the
      // in-memory backend regardless of any local .env.local.
      command: 'npm run dev -- --port 5173 --strictPort',
      url: MOCK_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: { ...process.env, VITE_API_URL: '' }
    },
    ...(REAL_API
      ? [
          {
            // Real-API dev server: points the web app at apps/server. Served on
            // 4173 so its origin is in the API's CORS allowlist.
            command: 'npm run dev -- --port 4173 --strictPort',
            url: REAL_URL,
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
            env: { ...process.env, VITE_API_URL: API_URL }
          },
          {
            // apps/server (Express + TiDB Cloud). /health is an unauthenticated
            // 200 liveness probe Playwright can poll for readiness.
            command: 'npm start',
            cwd: serverCwd,
            url: `${API_URL}/health`,
            reuseExistingServer: !process.env.CI,
            timeout: 120_000
          }
        ]
      : [])
  ]
})
