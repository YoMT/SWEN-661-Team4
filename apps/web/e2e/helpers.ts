import { type Page, expect } from '@playwright/test'

export const DEMO = { email: 'demo@careconnect.com', password: 'demo123' }

/** Logs in with the demo account and waits for the authed dashboard to render. */
export async function login(page: Page): Promise<void> {
  await page.goto('/login')
  await page.getByLabel('Email address').fill(DEMO.email)
  await page.getByLabel('Password').fill(DEMO.password)
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expect(page.getByRole('heading', { name: 'Margaret Johnson' })).toBeVisible()
}

/** The persistent desktop sidebar (visible at the configured 1440px viewport). */
export const sideNav = (page: Page) => page.locator('.side-nav')

/** The mobile bottom tab bar (visible below the 768px breakpoint). */
export const bottomTabs = (page: Page) => page.locator('.bottom-tabs')
