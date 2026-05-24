// spec: tests/cryptofolio-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication — Public Routes', () => {
  test('Login form client-side validation — invalid email format', async ({ page }) => {
    // 1. Navigate to /login
    await page.goto('/login');

    // expect: Login page is displayed
    await expect(page.getByText('Welcome back')).toBeVisible();

    // 2. Type 'notanemail' into the Email field and 'password123' into the Password field, then click 'Login'
    // Override input type to 'text' to bypass browser-native email validation so Zod can handle it
    await page.locator('#email').evaluate(el => (el as HTMLInputElement).setAttribute('type', 'text'));
    await page.locator('#email').fill('notanemail');
    await page.locator('#password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    // expect: The error message 'Invalid email address' appears under the Email field
    await expect(page.getByText('Invalid email address')).toBeVisible();

    // expect: The user remains on /login
    await expect(page).toHaveURL(/\/login/);
  });
});
