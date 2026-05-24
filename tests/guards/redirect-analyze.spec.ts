// spec: tests/cryptofolio-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Protected Route Guards', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Unauthenticated user is redirected from /analyze to login', async ({ page }) => {
    // 1. With no session cookies set, navigate directly to /analyze
    await page.goto('/analyze');

    // expect: The browser redirects to /login
    await page.waitForURL('**/login', { timeout: 10000 });

    // expect: The login page is displayed
    await expect(page.getByText('Welcome back')).toBeVisible();
  });
});
