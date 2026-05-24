// spec: tests/cryptofolio-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication — Public Routes', () => {
  test('Register page renders all expected elements', async ({ page }) => {
    // 1. Navigate to /register
    await page.goto('/register');

    // expect: The page title shows 'Sign up'
    // CardTitle renders as a div (not a semantic heading element), so we match by text
    await expect(page.getByText('Sign up', { exact: true })).toBeVisible();

    // expect: A Full name input field is visible
    await expect(page.locator('#fullname')).toBeVisible();

    // expect: An Email input field is visible
    await expect(page.locator('#email')).toBeVisible();

    // expect: A Password input field is visible
    await expect(page.locator('#password')).toBeVisible();

    // expect: A 'Register' submit button is visible
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
  });
});
