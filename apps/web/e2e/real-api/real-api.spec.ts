import { test, expect } from '@playwright/test'
import { login } from '../helpers'

// Runs under the `real-api` project: the web app is pointed at apps/server
// (Express) backed by TiDB Cloud, so these exercise real HTTP + real database
// reads. Kept read-only so they don't mutate shared cloud data.
test.describe('Real API (apps/server + TiDB Cloud)', () => {
  test('signs in against the live API and loads the dashboard', async ({ page }) => {
    await login(page)
    await expect(page).toHaveURL(/\/dashboard$/)
    await expect(page.getByRole('heading', { name: 'Margaret Johnson' })).toBeVisible()
  })

  test('loads real medication data from the database', async ({ page }) => {
    await login(page)

    await page.locator('.side-nav').getByRole('link', { name: 'Medications' }).click()
    await expect(page.getByRole('heading', { name: 'Medications' })).toBeVisible()
    await expect(page.getByText(/Metoprolol/)).toBeVisible()
  })

  test('loads appointments split into Today and Upcoming', async ({ page }) => {
    await login(page)

    await page.locator('.side-nav').getByRole('link', { name: 'Appointments' }).click()
    await expect(page.getByRole('heading', { name: 'Appointments' })).toBeVisible()
    await expect(page.getByText('Today', { exact: true })).toBeVisible()
    await expect(page.getByText('Upcoming', { exact: true })).toBeVisible()
  })
})
