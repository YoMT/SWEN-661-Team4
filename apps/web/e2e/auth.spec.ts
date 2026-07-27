import { test, expect } from '@playwright/test'
import { DEMO } from './helpers'

test.describe('Authentication', () => {
  test('landing page shows the hero and a sign-in link', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /gentle helping hand/i })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible()
  })

  test('logs in with demo credentials and reaches the dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email address').fill(DEMO.email)
    await page.getByLabel('Password').fill(DEMO.password)
    await page.getByRole('button', { name: 'Sign In' }).click()

    await expect(page.getByRole('heading', { name: 'Margaret Johnson' })).toBeVisible()
    await expect(page).toHaveURL(/\/dashboard$/)
  })

  test('shows a validation error for an invalid email', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email address').fill('not-an-email')
    await page.getByLabel('Password').fill('whatever')
    await page.getByRole('button', { name: 'Sign In' }).click()

    await expect(page.getByRole('alert')).toContainText('valid email')
  })

  test('surfaces an auth error for wrong credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email address').fill('nope@test.com')
    await page.getByLabel('Password').fill('wrongpass')
    await page.getByRole('button', { name: 'Sign In' }).click()

    await expect(page.getByRole('alert')).toContainText('Invalid email or password')
  })

  test('signs up a new account and reaches the dashboard', async ({ page }) => {
    await page.goto('/signup')
    await page.getByLabel('Full name').fill('Casey Rivera')
    await page.getByLabel('Email address').fill('casey@example.com')
    await page.getByLabel('Password').fill('secret1')
    await page.getByRole('button', { name: 'Create Account' }).click()

    await expect(page.getByRole('heading', { name: 'Margaret Johnson' })).toBeVisible()
  })
})
