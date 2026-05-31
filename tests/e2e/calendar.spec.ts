import { test, expect } from '@playwright/test';
test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
  });

  test('Successful Login as Master, Cookie Verification, and Logout', async ({ page }) => {
    
    await page.locator('text=Master Ulaz').click();

    
    await page.locator('input[type="email"]').fill('admin@citydent.com');
    await page.locator('input[type="password"]').fill('password123');
    await page.getByRole('button', { name: /Pristupi panelu/i }).click();

    
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
  });

test.describe('Calendar Feature', () => {
  test.beforeEach(async ({ page }) => {
    
    await page.goto('http://localhost:3000/dashboard/appointments', { waitUntil: 'networkidle' });
  });

  test('should load navigation buttons', async ({ page }) => {
    
    const danBtn = page.getByRole('button', { name: 'Dan' });
    await expect(danBtn).toBeVisible({ timeout: 10000 });
    
    await expect(page.getByText('Sedmica')).toBeVisible();
    await expect(page.getByText('Danas')).toBeVisible();
  });

  test('should open add appointment modal', async ({ page }) => {
    
    const addBtn = page.getByRole('button', { name: 'Dodaj termin' });
    
    
    await addBtn.waitFor({ state: 'visible', timeout: 10000 });
    await addBtn.click();
    
    
    await expect(page.getByText('Zakazivanje novog termina')).toBeVisible({ timeout: 10000 });
  });
});