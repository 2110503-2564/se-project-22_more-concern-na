// tests/reward/redemption-process.spec.ts
import { expect, test } from '@playwright/test';
import { loginAsCustomer } from '../helpers/auth-helpers';

test.describe('Redemption Process Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsCustomer(page);
  });

  test('TC1: User can redeem a gift with sufficient points', async ({ page }) => {
    // Navigate to redeemables page
    await page.goto('/reward/redeemables');
    
    // Find a gift item - using the gift test ID format you specified
    // Let's assume there's a gift called "Super luggage"
    const giftItem = page.getByTestId('gift-Super luggage').first();
    await expect(giftItem).toBeVisible();
    
    // Click the gift to view details
    await giftItem.click();
    await page.waitForTimeout(1000);
    
    // Verify we're on the gift detail page
    await expect(page.getByRole('heading', { name: 'Gift Detail' })).toBeVisible();
    
    // Get initial points from displayed count
    // Note: We don't have a test ID for this, so using role/text
    const initialPointsElement = page.getByText(/Your Points:/);
    await expect(initialPointsElement).toBeVisible();
    const initialPointsText = await initialPointsElement.innerText();
    const initialPoints = parseInt(initialPointsText.replace(/\D/g, ''));
    
    // Get gift point cost
    const pointCostElement = page.getByText(/Point Cost:/);
    await expect(pointCostElement).toBeVisible();
    const pointCostText = await pointCostElement.innerText();
    const pointCost = parseInt(pointCostText.replace(/\D/g, ''));
    
    // Only attempt redemption if user has enough points
    if (initialPoints >= pointCost) {
      // Click the redeem button
      const redeemButton = page.getByRole('button', { name: 'Redeem' });
      await expect(redeemButton).toBeEnabled();
      await redeemButton.click();
      
      // Confirm the redemption in the dialog
      const confirmButton = page.getByRole('button', { name: 'Confirm' });
      await expect(confirmButton).toBeVisible();
      await confirmButton.click();
      
      // Verify success message
      await expect(page.getByText('Redemption Successful')).toBeVisible();
      
      // Verify redirection to inventory
      await expect(page).toHaveURL('/profile/inventory');
      
      // Verify points were deducted
      await page.goto('/profile');
      const newPointsElement = page.getByText(/P \d+/);
      await expect(newPointsElement).toBeVisible();
      const newPointsText = await newPointsElement.innerText();
      const newPoints = parseInt(newPointsText.replace(/\D/g, ''));
      
      expect(newPoints).toBe(initialPoints - pointCost);
    } else {
      // If not enough points, verify the redeem button is disabled
      const redeemButton = page.getByRole('button', { name: 'Redeem' });
      await expect(redeemButton).toBeDisabled();
      await expect(page.getByText('Insufficient Points')).toBeVisible();
      
      // Go back to redeemables page
      await page.goBack();
      await expect(page).toHaveURL('/reward/redeemables');
    }
  });

  test('TC2: User can redeem a coupon with sufficient points', async ({ page }) => {
    // Navigate to redeemables page
    await page.goto('/reward/redeemables');
    
    // Find a coupon item - using the coupon test ID format you specified
    // Let's use a 10% coupon expiring on 07-31-2025
    const couponItem = page.getByTestId('coupon-10%-07-31-2025').first();
    await expect(couponItem).toBeVisible();
    
    // Get initial points before redeeming
    await page.goto('/profile');
    const initialPointsElement = page.getByText(/P \d+/);
    await expect(initialPointsElement).toBeVisible();
    const initialPointsText = await initialPointsElement.innerText();
    const initialPoints = parseInt(initialPointsText.replace(/\D/g, ''));
    
    // Go back to redeemables
    await page.goto('/reward/redeemables');
    await expect(couponItem).toBeVisible();
    
    // Get coupon point cost
    const pointCostElement = couponItem.getByText(/\d+ Points/);
    await expect(pointCostElement).toBeVisible();
    const pointCostText = await pointCostElement.innerText();
    const pointCost = parseInt(pointCostText.replace(/\D/g, ''));
    
    // Only attempt redemption if user has enough points
    if (initialPoints >= pointCost) {
      // Click the redeem button
      const redeemButton = couponItem.getByRole('button', { name: 'Redeem' });
      await expect(redeemButton).toBeEnabled();
      await redeemButton.click();
      
      // Confirm the redemption in the dialog
      const confirmButton = page.getByTestId('alert-confirm-button');
      await expect(confirmButton).toBeVisible();
      await confirmButton.click();
      
      // Verify success message
      await expect(page.getByText('Coupon Redeemed Successfully')).toBeVisible();
      
      // Verify coupon code is displayed
      await expect(page.getByText('Your Coupon Code:')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Copy Code' })).toBeVisible();
      
      // Click Copy Code button
      await page.getByRole('button', { name: 'Copy Code' }).click();
      
      // Verify copy confirmation
      await expect(page.getByText('Code copied to clipboard!')).toBeVisible();
      
      // Close the dialog
      await page.getByRole('button', { name: 'Close' }).click();
      
      // Verify points were deducted
      await page.goto('/profile');
      const newPointsElement = page.getByText(/P \d+/);
      await expect(newPointsElement).toBeVisible();
      const newPointsText = await newPointsElement.innerText();
      const newPoints = parseInt(newPointsText.replace(/\D/g, ''));
      
      expect(newPoints).toBe(initialPoints - pointCost);
    } else {
      // If not enough points, verify the redeem button is disabled
      const redeemButton = couponItem.getByRole('button', { name: 'Redeem' });
      await expect(redeemButton).toBeDisabled();
    }
  });

  test('TC3: User can view redeemed items in inventory', async ({ page }) => {
    // Navigate to inventory page
    await page.goto('/profile/inventory');
    
    // Verify inventory page structure
    await expect(page.getByRole('heading', { name: 'Your Inventory' })).toBeVisible();
    
    // Verify coupon section
    const couponSection = page.locator('section').filter({ hasText: 'Coupon' });
    await expect(couponSection).toBeVisible();
    
    // Verify gift section
    const giftSection = page.locator('section').filter({ hasText: 'Gift' });
    await expect(giftSection).toBeVisible();
    
    // Verify coupon items are displayed (using your test ID format)
    await expect(page.getByTestId('coupon-10%-07-31-2025')).toBeVisible();
    
    // Verify gift items are displayed (using your test ID format)
    await expect(page.getByTestId('gift-Super-luggage')).toBeVisible();
  });

  test('TC4: Inventory pagination works correctly', async ({ page }) => {
    // Navigate to inventory page
    await page.goto('/profile/inventory');
    
    // Verify pagination elements exist using your test IDs
    await expect(page.getByTestId('next-page-btn')).toBeVisible();
    await expect(page.getByTestId('prev-page-btn')).toBeVisible();
    
    // Get initial displayed items
    const initialCouponId = await page.getByTestId(/^coupon-/).first().getAttribute('data-testid');
    
    // Click next page button
    await page.getByTestId('next-page-btn').click();
    await page.waitForTimeout(500);
    
    // Verify page indicator updates
    await expect(page.getByText('Page 2')).toBeVisible();
    
    // Get items on second page
    const secondPageCouponId = await page.getByTestId(/^coupon-/).first().getAttribute('data-testid');
    
    // Verify different items are shown (different test IDs)
    expect(secondPageCouponId).not.toBe(initialCouponId);
    
    // Go back to previous page
    await page.getByTestId('prev-page-btn').click();
    await page.waitForTimeout(500);
    
    // Verify we're back on page 1
    await expect(page.getByText('Page 1')).toBeVisible();
    
    // Verify original items are shown again
    const backToFirstId = await page.getByTestId(/^coupon-/).first().getAttribute('data-testid');
    expect(backToFirstId).toBe(initialCouponId);
  });
});