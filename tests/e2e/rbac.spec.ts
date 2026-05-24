import { test, expect } from '@playwright/test';

test.describe('SCRUM-41: UI RBAC Role Enforcement', () => {

  test.beforeEach(async ({ page }) => {
    
    await page.context().clearCookies();
    await page.goto('http://localhost:3000');
  });

  test('Accessing /dashboard without a session should redirect to login', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    await expect(page).toHaveURL(/.*(login|callbackUrl)/);
  })});
