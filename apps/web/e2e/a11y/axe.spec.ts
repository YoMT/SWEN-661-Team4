import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { login } from '../helpers'

/**
 * Automated WCAG 2.1 A/AA accessibility scan (axe-core) — the scriptable
 * equivalent of the axe DevTools browser extension. Runs the same rule engine
 * axe DevTools uses, across every route and every overlay of the CareConnect
 * web PWA, in both Chromium (Chrome) and Edge (see playwright.config.ts).
 *
 * Each scan asserts zero violations AND writes a JSON artifact under
 * test-results/a11y/<project>/ so the accessibility report can cite real,
 * reproducible numbers instead of a screenshot.
 */

const OUT_DIR = fileURLToPath(new URL('../../test-results/a11y', import.meta.url))

// WCAG 2.0/2.1 Level A and AA — the conformance target for the project.
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

interface ViolationRow {
  id: string
  impact: string | null | undefined
  help: string
  nodes: number
}

async function scan(page: import('@playwright/test').Page, label: string) {
  const project = test.info().project.name
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()

  const dir = `${OUT_DIR}/${project}`
  mkdirSync(dir, { recursive: true })
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  writeFileSync(`${dir}/${slug}.json`, JSON.stringify(results, null, 2))

  const rows: ViolationRow[] = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    help: v.help,
    nodes: v.nodes.length
  }))

  // Surface a compact summary in the Playwright output for the report.
  console.log(
    `[axe:${project}] ${label} — ${results.violations.length} violation(s)` +
      (rows.length ? `\n${JSON.stringify(rows, null, 2)}` : '')
  )

  return { results, rows }
}

test.describe('Automated accessibility (axe-core, WCAG 2.1 AA)', () => {
  

  test('public — landing page', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const { rows } = await scan(page, 'landing')
    expect(rows, JSON.stringify(rows, null, 2)).toEqual([])
  })

  test('public — login page', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByLabel('Email address')).toBeVisible()
    const { rows } = await scan(page, 'login')
    expect(rows, JSON.stringify(rows, null, 2)).toEqual([])
  })

  test('public — signup page', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const { rows } = await scan(page, 'signup')
    expect(rows, JSON.stringify(rows, null, 2)).toEqual([])
  })

  test('authed — all routes + overlays', async ({ page }) => {
    // WebKit-on-Windows can't complete the mock sign-in flow (an engine/runtime
    // limitation of the Windows WebKit build, unrelated to accessibility), so
    // the authed surfaces are covered by Chromium, Edge and Firefox instead.
    // WebKit still scans the public pages above. Real Safari is a documented
    // manual check in the accessibility report.
    test.skip(
      test.info().project.name === 'a11y-webkit',
      'WebKit-on-Windows cannot complete the mock login; authed scan runs on Chromium/Edge/Firefox.'
    )

    // The app discards its token on every cold boot (auth-context.tsx), so a
    // full-page navigation logs out. Log in ONCE, then move between routes with
    // the in-app sidebar links (client-side history nav) to stay authenticated.
    await login(page)

    const allRows: ViolationRow[] = []

    // login() lands on the dashboard.
    await expect(page.locator('#main')).toBeVisible()
    allRows.push(...(await scan(page, 'dashboard')).rows)

    const routes: Array<[string, string]> = [
      ['Medications', 'medications'],
      ['Appointments', 'appointments'],
      ['Symptoms', 'symptoms'],
      ['Profile', 'profile']
    ]

    for (const [linkName, label] of routes) {
      await page.locator('.side-nav').getByRole('link', { name: linkName }).click()
      await expect(page).toHaveURL(new RegExp(`/${label}$`))
      await expect(page.locator('#main')).toBeVisible()
      const { rows } = await scan(page, label)
      allRows.push(...rows)
    }

    // Overlay 1: Peggy assistant panel (Ctrl/⌘ J).
    await page.locator('#peggy-toggle').click()
    await expect(page.getByRole('complementary', { name: 'Peggy assistant' })).toBeVisible()
    allRows.push(...(await scan(page, 'peggy-panel')).rows)
    await page.keyboard.press('Escape')

    // Overlay 2: Keyboard shortcuts dialog (?).
    await page.getByRole('button', { name: 'Keyboard shortcuts' }).click()
    await expect(page.getByRole('dialog', { name: 'Keyboard Shortcuts' })).toBeVisible()
    allRows.push(...(await scan(page, 'shortcuts-dialog')).rows)
    await page.keyboard.press('Escape')

    // Overlay 3: Edit Profile modal — we are already on the Profile route
    // (last in the loop above), so open it directly without a full reload.
    await page.getByRole('button', { name: 'Edit', exact: true }).click()
    await expect(page.getByRole('dialog', { name: 'Edit Profile' })).toBeVisible()
    allRows.push(...(await scan(page, 'edit-profile-modal')).rows)

    expect(allRows, JSON.stringify(allRows, null, 2)).toEqual([])
  })
})
