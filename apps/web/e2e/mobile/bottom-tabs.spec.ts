import { test, expect } from '@playwright/test'
import { login, bottomTabs } from '../helpers'

// Runs under the `mobile-mock` project (Pixel 5). At this width the persistent
// sidebar is hidden and navigation happens through the bottom tab bar.
test.beforeEach(async ({ page }) => {
  await login(page)
})

test.describe('Mobile — bottom-tab navigation', () => {
  test('shows the bottom tab bar and hides the desktop sidebar', async ({ page }) => {
    await expect(bottomTabs(page)).toBeVisible()
    await expect(page.locator('.side-nav')).toBeHidden()
  })

  test('navigates between screens via the bottom tabs', async ({ page }) => {
    const tabs = bottomTabs(page)

    await tabs.getByRole('link', { name: 'Meds' }).click()
    await expect(page.getByRole('heading', { name: 'Medications' })).toBeVisible()
    await expect(page).toHaveURL(/\/medications$/)

    await tabs.getByRole('link', { name: 'Appts' }).click()
    await expect(page.getByRole('heading', { name: 'Appointments' })).toBeVisible()

    await tabs.getByRole('link', { name: 'Sympt.' }).click()
    await expect(page.getByRole('heading', { name: 'Symptoms' })).toBeVisible()

    await tabs.getByRole('link', { name: 'Profile' }).click()
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible()

    await tabs.getByRole('link', { name: 'Home' }).click()
    await expect(page.getByRole('heading', { name: 'Margaret Johnson' })).toBeVisible()
  })

  test('marks the active tab with aria-current', async ({ page }) => {
    const tabs = bottomTabs(page)

    await tabs.getByRole('link', { name: 'Meds' }).click()
    await expect(tabs.getByRole('link', { name: 'Meds' })).toHaveAttribute('aria-current', 'page')
    await expect(tabs.getByRole('link', { name: 'Home' })).not.toHaveAttribute(
      'aria-current',
      'page'
    )
  })
})
