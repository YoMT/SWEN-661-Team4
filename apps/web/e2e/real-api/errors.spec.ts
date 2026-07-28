import { test, expect } from '@playwright/test'
import { login } from '../helpers'

// Real-fetch mode issues actual network requests, so failures can be injected
// with route interception — impossible against the in-memory mock, which never
// touches the network. These cover the app's error paths (fetch failures).
test.describe('Real API — error states', () => {
  test('shows an error banner when the medications fetch fails', async ({ page }) => {
    // Fail the medications GET (auth + profile still hit the real server and
    // succeed, so login works and the shell renders).
    await page.route('**/medications', (route) =>
      route.request().method() === 'GET'
        ? route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'boom' })
          })
        : route.continue()
    )

    await login(page)
    await page.locator('.side-nav').getByRole('link', { name: 'Medications' }).click()

    await expect(page.getByRole('heading', { name: 'Medications' })).toBeVisible()
    await expect(page.getByRole('alert')).toContainText('Could not load medications')
  })

  test('logs the user out and returns to sign-in when the API rejects the token (401)', async ({
    page
  }) => {
    await login(page)

    // Make the next protected read return 401, then force a refetch via the
    // dashboard Refresh button. The client's unauthorized handler logs out and
    // the route guard bounces to the sign-in screen.
    await page.route('**/profile', (route) =>
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Unauthorized' })
      })
    )
    await page.getByRole('button', { name: 'Refresh dashboard' }).click()

    // 401 → auto-logout → the route guard bounces to the landing page (which
    // offers a Sign in link); the authed dashboard is gone.
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Margaret Johnson' })).toHaveCount(0)
  })
})
