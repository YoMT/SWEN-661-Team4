import { defineConfig, devices } from '@playwright/test'

/**
 * E2E config for the CareConnect web PWA. Playwright starts the Vite dev server
 * and drives a real Chromium browser against it. The app uses its in-memory mock
 * backend under `import.meta.env` (no VITE_API_URL), so no server is required —
 * the demo account (demo@careconnect.com / demo123) is always available.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      // A clearly-desktop viewport so the persistent sidebar (>=1200px) is shown.
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } }
    }
  ],
  webServer: {
    // `npm run dev` runs the local Vite binary regardless of the package manager.
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
})
