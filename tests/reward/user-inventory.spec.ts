// tests/reward/user-inventory.spec.ts
import { expect, test } from '@playwright/test';
import { loginAsCustomer } from '../helpers/auth-helpers';

test.describe('User Inventory Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsCustomer(page);
  });

  test('TC1: User can navigate to inventory from profile', async ({ page }) => {
    // Start at profile page
    await page.goto('/profile');
    
    // Find and click inventory button
    await page.getByRole('button', { name: 'Your Inventory' }).click();
    
    // Verify redirection to inventory page
    await expect(page).toHaveURL('/profile/inventory');
    await expect(page.getByRole('heading', { name: 'Your Inventory' })).toBeVisible();
  });

  test('TC2: User inventory shows correct counts of coupons and gifts', async ({ page }) => {
    await page.goto('/profile/inventory');
    
    // Based on Figma design, check for coupon count display
    await expect(page.getByText('7').first()).toBeVisible();
    await expect(page.getByText('Total available coupons')).toBeVisible();
    
    // Check for gift count display
    await expect(page.getByText('3').first()).toBeVisible();
    await expect(page.getByText('Total gift that you redeemed')).toBeVisible();
  });

  test('TC3: User can view gift details from inventory', async ({ page }) => {
    await page.goto('/profile/inventory');
    
    // Find gift items
    const giftItems = page.locator('section')
      .filter({ hasText: 'Gift' })
      .locator('.grid > div');
    
    // If any gift items exist
    if (await giftItems.count() > 0) {
      // Click the first gift
      await giftItems.first().click();
      
      // Verify we're on the gift detail page
      await expect(page).toHaveURL(/\/profile\/inventory\/.+/);
      
      // Verify gift detail content as shown in Figma
      await expect(page.getByRole('heading', { name: 'Gift Detail' })).toBeVisible();
      await expect(page.getByText('Gift Name:')).toBeVisible();
      
      // Check for detailed description based on Figma design
      await expect(page.getByText(/Daily breakfast for two people/)).toBeVisible();
    }
  });

  test('TC4: User can navigate between pages of inventory items', async ({ page }) => {
    await page.goto('/profile/inventory');
    
    // Check for pagination controls as shown in Figma
    await expect(page.getByText('Page 1').first()).toBeVisible();
    
    // Click next button to go to next page
    await page.getByRole('button', { name: 'Next' }).first().click();
    await page.waitForTimeout(500);
    
    // Verify we're on page 2
    await expect(page.getByText('Page 2').first()).toBeVisible();
    
    // Go back to previous page
    await page.getByRole('button', { name: 'Prev' }).first().click();
    await page.waitForTimeout(500);
    
    // Verify we're back on page 1
    await expect(page.getByText('Page 1').first()).toBeVisible();
  });
});