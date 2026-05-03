import { test, expect } from '@playwright/test';

test.describe('SCRUM-41: UI RBAC Role Enforcement', () => {

  test('Master user should see management screens', async ({ page }) => {
    // 1. Navigate to the base URL and wait for the page load
    await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 60000 });

    // 2. Click on the Master role button
    const masterButton = page.locator('text=Master Ulaz');
    await masterButton.waitFor({ state: 'visible', timeout: 30000 });
    await masterButton.click();

    // 3. Fill the credentials and submit
    await page.locator('input[type="email"], input[type="text"]').fill('admin@citydent.com');
    await page.locator('input[type="password"]').fill('password123');
    await page.click('button[type="submit"]');

    // 4. Wait for redirection to the dashboard
    await page.waitForURL('**/dashboard?role=MASTER', { timeout: 15000 });
    
    // 5. Verify the UI component is visible
    const masterOptions = page.locator('text=MASTER OPCIJE');
    await expect(masterOptions).toBeVisible();
  });

  test('Staff user should be restricted from accessing management screens', async ({ page }) => {
    // 1. Navigate to the base URL and wait for the page load
    await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 60000 });

    // 2. Click on the Staff role button
    const staffButton = page.locator('text=Staff Ulaz');
    await staffButton.waitFor({ state: 'visible', timeout: 30000 });
    await staffButton.click();

    // 3. Fill the credentials and submit
    await page.locator('input[type="email"], input[type="text"]').fill('staff@citydent.com');
    await page.locator('input[type="password"]').fill('staff123');
    await page.click('button[type="submit"]');

    // 4. Wait for redirection to the dashboard
    await page.waitForURL('**/dashboard?role=STAFF', { timeout: 15000 });
    await expect(page).toHaveURL(/.*dashboard\?role=STAFF/);
  });
});