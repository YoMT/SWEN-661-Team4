import { test, expect } from '@playwright/test'
import { login } from './helpers'

// The status strip in the app shell reflects connectivity: "Synced just now"
// when online, and an offline notice (the app keeps working from cached / mock
// data, which the service worker serves in production) when the network drops.
test.describe('Offline / connectivity banner', () => {
  test('status strip flips to the offline notice when the network drops', async ({
    page,
    context
  }) => {
    await login(page)

    const offline = page.locator('.status-offline')
    await expect(page.locator('.status-strip')).toContainText('Synced just now')
    await expect(offline).toHaveCount(0)

    // Emulate the browser going offline (fires the offline event / navigator.onLine).
    await context.setOffline(true)
    await expect(offline).toBeVisible()
    await expect(offline).toContainText('Offline')
    // The app still shows its cached data while offline.
    await expect(page.getByRole('heading', { name: 'Margaret Johnson' })).toBeVisible()

    // Coming back online clears the notice.
    await context.setOffline(false)
    await expect(offline).toHaveCount(0)
    await expect(page.locator('.status-strip')).toContainText('Synced just now')
  })
})
