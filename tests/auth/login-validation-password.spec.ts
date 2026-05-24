// spec: tests/cryptofolio-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication — Public Routes', () => {
  test('Login form client-side validation — short password', async ({ page }) => {
    // 1. Navigate to /login
    await page.goto('/login');

    // expect: Login page is displayed
    await expect(page.getByText('Welcome back')).toBeVisible();

    // 2. Type 'test@example.com' into the Email field and 'abc' (3 characters) into the Password field, then click 'Login'
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('abc');
    await page.getByRole('button', { name: 'Login' }).click();

    // expect: The error message 'Password must be at least 6 characters' appears under the Password field
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();

    // expect: The user remains on /login
    await expect(page).toHaveURL(/\/login/);
  });
});
