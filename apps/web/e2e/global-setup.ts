import { chromium } from '@playwright/test'
import { DEMO } from './helpers'

/**
 * Warms the Vite dev server(s) before the workers start.
 *
 * Vite compiles modules on demand, so the first browser navigation pays the
 * cost of transforming the whole app graph. Under parallel workers those cold,
 * simultaneous first-requests back up past the navigation timeout. Loading each
 * server once here (single-threaded, generous timeout) means every test then
 * hits a warm server. Runs after the web servers are up, before any test.
 */
async function globalSetup(): Promise<void> {
  const realApi =
    process.env.E2E_REAL_API === '1' || process.argv.some((a) => a.includes('real-api'))

  const urls = ['http://localhost:5173/login']
  if (realApi) urls.push('http://localhost:4173/login')

  const browser = await chromium.launch()
  try {
    for (const url of urls) {
      const page = await browser.newPage()
      // Wait for the app to actually render (all modules compiled), not just the
      // HTML shell.
      await page.goto(url, { waitUntil: 'networkidle', timeout: 120_000 })
      await page.getByRole('button', { name: 'Sign In' }).waitFor({ timeout: 120_000 })

      // For the real-API server, complete a login so the database (TiDB Cloud
      // serverless, which cold-starts on first query) is awake and the whole
      // data path is warm before the parallel workers hit it.
      if (url.includes('4173')) {
        await page.getByLabel('Email address').fill(DEMO.email)
        await page.getByLabel('Password').fill(DEMO.password)
        await page.getByRole('button', { name: 'Sign In' }).click()
        await page.getByRole('heading', { name: 'Margaret Johnson' }).waitFor({ timeout: 120_000 })
      }
      await page.close()
    }
  } finally {
    await browser.close()
  }
}

export default globalSetup
