import { test, expect } from '@playwright/test';
test.beforeEach(async ({ page }) => {
    // 1. Authenticate session smoothly via Staff Portal
    await page.goto('http://localhost:3000/');
    const staffButton = page.locator('button:has-text("Master Ulaz"), a:has-text("Master Ulaz")').first();
    if (await staffButton.isVisible()) {
      await staffButton.click();
    }
    await page.locator('input[type="email"]').fill('admin@citydent.com');
    await page.locator('input[type="password"]').fill('password123');
    await page.getByRole('button', { name: 'Pristupi panelu' }).click();
    await page.waitForURL('**/dashboard');
    });

test.describe('Calendar Feature', () => {
  test('should load calendar page and show navigation buttons', async ({ page }) => {
    await page.goto('/dashboard/appointments');
    await expect(page.getByRole('button', { name: 'Dan' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sedmica' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Danas' })).toBeVisible();
  });
});
test('should open add appointment modal when button is clicked', async ({ page }) => {
  await page.goto('/dashboard/appointments');
  await page.getByRole('button', { name: 'Dodaj termin' }).click();
  // Verify that the modal title is visible
  await expect(page.getByText('Zakazivanje novog termina')).toBeVisible();
});
test('should open date picker and allow selection', async ({ page }) => {
  await page.goto('/dashboard/appointments');
  // Open the modal
  await page.getByRole('button', { name: 'Dodaj termin' }).click();
  
  // Click the date input to trigger the calendar
  await page.locator('input[placeholder="mm/dd/yyyy"]').click();
  
  // Verify the calendar view (date picker) is visible
  await expect(page.getByText('May 2026')).toBeVisible();
});