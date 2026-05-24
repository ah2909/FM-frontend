// spec: tests/cryptofolio-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication — Public Routes', () => {
  test('Register form client-side validation — empty submission', async ({ page }) => {
    // 1. Navigate to /register
    await page.goto('/register');

    // expect: Register page is displayed
    // CardTitle renders as a div (not a semantic heading element), so we match by text
    await expect(page.getByText('Sign up', { exact: true })).toBeVisible();

    // 2. Click the 'Register' button without filling in any fields
    await page.getByRole('button', { name: 'Register' }).click();

    // expect: Inline validation error 'Full name is required' appears under Full name
    await expect(page.getByText('Full name is required')).toBeVisible();

    // expect: Inline validation error 'Invalid email address' appears under Email
    await expect(page.getByText('Invalid email address')).toBeVisible();

    // expect: Inline validation error 'Password must be at least 6 characters' appears under Password
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();

    // expect: The user remains on /register
    await expect(page).toHaveURL(/\/register/);
  });
});
