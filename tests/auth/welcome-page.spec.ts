// spec: tests/cryptofolio-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication — Public Routes', () => {
  test('Welcome page renders correctly (unauthenticated access)', async ({ page }) => {
    // 1. Navigate to /welcome
    await page.goto('/welcome');

    // expect: The page heading 'Welcome to Your Crypto Journey' is visible
    await expect(page.getByText('Welcome to Your Crypto Journey')).toBeVisible();

    // expect: The 'Create Portfolio' button/link is visible linking to /portfolios/new
    await expect(page.getByRole('link', { name: /Create Portfolio/ })).toBeVisible();
  });
});
