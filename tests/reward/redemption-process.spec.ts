// tests/reward/redemption-process.spec.ts
import { expect, test } from '@playwright/test';
import { loginAsCustomer } from '../helpers/auth-helpers';

test.describe('Redemption Process Functionality', () => {
  test('TC1: User can redeem a gift', async ({ page }) => {
    await loginAsCustomer(page);
    
    // Navigate to redeemables page
    await page.goto('/reward/redeemables');
    
    // Find a gift item with a Redeem button
    const giftItem = page.getByText('Room Upgrade').first()
    
    // Click on the gift to go to details
    await giftItem.click();
    
    // Verify we're on the gift detail page
    await expect(page.getByRole('heading', { name: 'Gift Detail' })).toBeVisible();
    
    // Click the redeem button
    await page.getByRole('button', { name: 'Redeem' }).click();
    
    // Confirm redemption (assuming there's a confirmation dialog)
    await page.getByRole('button', { name: 'Confirm' }).click();
    
    // Verify success message
    await expect(page.getByText('Redemption Successful')).toBeVisible();
    
    // Verify we're redirected to inventory or a success page
    await expect(page).toHaveURL(/\/profile\/inventory/);
  });

  test('TC2: User can see redeemed items in inventory', async ({ page }) => {
    await loginAsCustomer(page);
    
    // Navigate to inventory page
    await page.goto('/profile/inventory');
    
    // Verify inventory content as shown in Figma
    await expect(page.getByRole('heading', { name: 'Your Inventory' })).toBeVisible();
    
    // Check for the coupon count displayed
    await expect(page.getByText('2')).toBeVisible();
    await expect(page.getByText('Your available coupons')).toBeVisible();
    
    // Check for the gift count displayed
    await expect(page.getByText('3')).toBeVisible();
    await expect(page.getByText('Your gifts you redeemed')).toBeVisible();
    
    // Verify coupon items are displayed
    await expect(page.getByRole('heading', { name: 'Coupons' })).toBeVisible();
    await expect(page.locator('.grid > div').filter({ hasText: '0%' }).first()).toBeVisible();
    
    // Verify gift items are displayed
    await expect(page.getByRole('heading', { name: 'Gift' })).toBeVisible();
    await expect(page.locator('.grid > div').filter({ hasText: 'Gift' }).first()).toBeVisible();
  });
});