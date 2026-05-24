// spec: tests/cryptofolio-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication — Public Routes', () => {
  test('Navigation link from login to register', async ({ page }) => {
    // 1. Navigate to /login
    await page.goto('/login');

    // expect: Login page is displayed
    await expect(page.getByText('Welcome back')).toBeVisible();

    // 2. Click the 'Sign up' link
    await page.getByRole('link', { name: 'Sign up' }).click();

    // expect: The browser navigates to /register
    await page.waitForURL('**/register');

    // expect: The register page is displayed with the 'Sign up' title
    // CardTitle renders as a div (not a semantic heading element), so we match by text
    await expect(page.getByText('Sign up', { exact: true })).toBeVisible();
  });
});
