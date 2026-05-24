// spec: tests/cryptofolio-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication — Public Routes', () => {
  test('Login page renders all expected elements', async ({ page }) => {
    // 1. Navigate to /login
    await page.goto('/login');

    // expect: The page title area shows 'Welcome back'
    await expect(page.getByText('Welcome back')).toBeVisible();

    // expect: A 'Sign in with Google' button is visible
    await expect(page.getByRole('button', { name: 'Sign in with Google' })).toBeVisible();

    // expect: An Email input field is visible
    await expect(page.locator('#email')).toBeVisible();

    // expect: A Password input field is visible
    await expect(page.locator('#password')).toBeVisible();

    // expect: A 'Login' submit button is visible
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

    // expect: A 'Sign up' link pointing to /register is visible
    await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
  });
});
