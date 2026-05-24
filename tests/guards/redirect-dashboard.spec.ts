// spec: tests/cryptofolio-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Protected Route Guards', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Unauthenticated user is redirected from dashboard to login', async ({ page }) => {
    // 1. Ensure no authentication cookies are set (fresh browser context), then navigate to /
    await page.goto('/');

    // expect: The browser is redirected to /login before the page content renders
    await page.waitForURL('**/login', { timeout: 10000 });

    // expect: The login page is displayed
    await expect(page.getByText('Welcome back')).toBeVisible();
  });
});
