// spec: tests/cryptofolio-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication — Public Routes', () => {
  test('Login form client-side validation — empty submission', async ({ page }) => {
    // 1. Navigate to /login
    await page.goto('/login');

    // expect: Login page is displayed
    await expect(page.getByText('Welcome back')).toBeVisible();

    // 2. Click the 'Login' button without entering any values
    await page.getByRole('button', { name: 'Login' }).click();

    // expect: Inline validation error 'Invalid email address' appears under the Email field
    await expect(page.getByText('Invalid email address')).toBeVisible();

    // expect: Inline validation error 'Password must be at least 6 characters' appears under the Password field
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();

    // expect: The user remains on /login
    await expect(page).toHaveURL(/\/login/);
  });
});
