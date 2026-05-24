import { test } from '@playwright/test';

test.describe('Seed', () => {
  test('seed', async ({ page }) => {
    await page.goto('/login');
  });
});
