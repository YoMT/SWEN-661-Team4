import { test, expect } from '@playwright/test'
import { login, sideNav } from './helpers'

// Every flow starts from a logged-in dashboard.
test.beforeEach(async ({ page }) => {
  await login(page)
})

test.describe('Caregiver flows', () => {
  test('navigates to Medications and marks a dose as taken', async ({ page }) => {
    await sideNav(page).getByRole('link', { name: 'Medications' }).click()
    await expect(page.getByRole('heading', { name: 'Medications' })).toBeVisible()

    const markButtons = page.getByRole('button', { name: /Mark .* as taken/ })
    const before = await markButtons.count()
    expect(before).toBeGreaterThan(0)

    await markButtons.first().click()
    // Optimistic update removes the mark button for that dose.
    await expect(markButtons).toHaveCount(before - 1)
  })

  test('logs a symptom and shows the confirmation', async ({ page }) => {
    await sideNav(page).getByRole('link', { name: 'Symptoms' }).click()
    await expect(page.getByRole('heading', { name: 'Symptoms' })).toBeVisible()

    await page.getByRole('button', { name: /Pain/ }).click()
    await page.getByRole('button', { name: 'Severity 4' }).click()
    await page.getByLabel('Note (optional)').fill('sharp pain after lunch')
    await page.getByRole('button', { name: 'Save to log' }).click()

    await expect(page.getByText('✓ Symptom logged')).toBeVisible()
  })

  test('shows appointments split into Today and Upcoming', async ({ page }) => {
    await sideNav(page).getByRole('link', { name: 'Appointments' }).click()
    await expect(page.getByRole('heading', { name: 'Appointments' })).toBeVisible()
    await expect(page.getByText('Today', { exact: true })).toBeVisible()
    await expect(page.getByText('Upcoming', { exact: true })).toBeVisible()
  })

  test('opens the Edit Profile modal from the Profile screen', async ({ page }) => {
    await sideNav(page).getByRole('link', { name: 'Profile' }).click()
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible()

    await page.getByRole('button', { name: 'Edit' }).click()
    await expect(page.getByRole('dialog', { name: 'Edit Profile' })).toBeVisible()
  })

  test('opens the Peggy assistant and receives a reply', async ({ page }) => {
    await page.getByRole('button', { name: /Ask Peggy/ }).click()
    const panel = page.getByRole('complementary', { name: 'Peggy assistant' })
    await expect(panel).toBeVisible()

    await panel.getByLabel('Message Peggy').fill('tell me about her medication')
    await panel.getByRole('button', { name: 'Send' }).click()

    await expect(panel.getByText(/Metoprolol/)).toBeVisible()
  })

  test('signs out and is returned to the landing page', async ({ page }) => {
    // The route guard bounces a logged-out user off protected routes to the
    // landing page (which offers a Sign in link).
    await sideNav(page).getByRole('button', { name: 'Sign out' }).click()
    await expect(page).toHaveURL(/localhost:5173\/$/)
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible()
  })
})
