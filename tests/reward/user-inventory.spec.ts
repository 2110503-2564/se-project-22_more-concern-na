// tests/reward/user-inventory.spec.ts
import { expect, test } from '@playwright/test';
import { loginAsCustomer } from '../helpers/auth-helpers';

test.describe('User Inventory Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsCustomer(page);
  });

  test('TC1: User can navigate to inventory from profile page', async ({ page }) => {
    // Start at profile page
    await page.goto('/profile');
    
    // Check initial profile page elements
    await expect(page.getByText(/P \d+/)).toBeVisible();
    
    // Find and click inventory button
    const inventoryButton = page.getByRole('button', { name: 'Your Inventory' });
    await expect(inventoryButton).toBeVisible();
    await inventoryButton.click();
    
    // Verify redirection to inventory page
    await expect(page).toHaveURL('/profile/inventory');
    await expect(page.getByRole('heading', { name: 'Your Inventory' })).toBeVisible();
    
    // Verify breadcrumb or back navigation
    await expect(page.getByRole('link', { name: 'Back to Profile' })).toBeVisible();
  });

  test('TC2: User inventory shows correct counts and categories', async ({ page }) => {
    // Navigate to inventory page
    await page.goto('/profile/inventory');
    
    // Verify inventory header and summary
    await expect(page.getByRole('heading', { name: 'Your Inventory' })).toBeVisible();
    
    // Check inventory summary counts - using exact texts as shown in Figma
    await expect(page.getByText('2')).toBeVisible();
    await expect(page.getByText('Your available coupons')).toBeVisible();
    
    await expect(page.getByText('3')).toBeVisible();
    await expect(page.getByText('Your gifts you redeemed')).toBeVisible();
    
    // Verify both inventory sections exist
    await expect(page.getByRole('heading', { name: 'Coupons' })).toBeVisible();
    
    // Check for coupon items using test ID format
    await expect(page.getByTestId('coupon-10%-07-31-2025')).toBeVisible();
    
    // Switch to gift section if using tabs
    const giftTab = page.getByRole('tab', { name: 'Gift' });
    if (await giftTab.isVisible()) {
      await giftTab.click();
    }
    
    await expect(page.getByRole('heading', { name: 'Gift' })).toBeVisible();
    
    // Check for gift items using test ID format
    await expect(page.getByTestId('gift-Super luggage')).toBeVisible();
  });

  test('TC3: User can view gift details from inventory', async ({ page }) => {
    // Navigate to inventory page
    await page.goto('/profile/inventory');
    
    // Navigate to gift section if needed
    const giftTab = page.getByRole('tab', { name: 'Gift' });
    if (await giftTab.isVisible()) {
      await giftTab.click();
    }
    
    // Find gift item using test ID format
    const giftItem = page.getByTestId('gift-Super luggage');
    await expect(giftItem).toBeVisible();
    
    // Store gift name before clicking for verification
    const giftName = await giftItem.locator('h3').innerText();
    
    // Click the gift
    await giftItem.click();
    await page.waitForTimeout(500);
    
    // Verify we're on the gift detail page
    await expect(page).toHaveURL(/\/profile\/inventory\/.+/);
    
    // Verify gift detail content
    await expect(page.getByRole('heading', { name: 'Gift Detail' })).toBeVisible();
    
    // Verify gift name matches
    await expect(page.getByText(giftName)).toBeVisible();
    
    // Verify gift details are displayed
    await expect(page.getByText(/Ut tempor accusam dolore sanctus diam consetetur/)).toBeVisible();
    await expect(page.getByText('Redeemed On:')).toBeVisible();
    await expect(page.getByText('Status:')).toBeVisible();
    
    // Test navigation back to inventory
    const backButton = page.getByRole('button', { name: 'Back to Inventory' });
    await expect(backButton).toBeVisible();
    await backButton.click();
    
    // Verify returned to inventory page
    await expect(page).toHaveURL('/profile/inventory');
  });

  test('TC4: User can copy coupon code from inventory', async ({ page }) => {
    // Navigate to inventory page
    await page.goto('/profile/inventory');
    
    // Make sure we're on the coupon section
    const couponTab = page.getByRole('tab', { name: 'Coupons' });
    if (await couponTab.isVisible()) {
      await couponTab.click();
    }
    
    // Find coupon item using test ID format
    const couponItem = page.getByTestId('coupon-10%-07-31-2025');
    await expect(couponItem).toBeVisible();
    
    // Check discount is displayed
    await expect(couponItem.getByText('10%')).toBeVisible();
    
    // Check expiry date is displayed
    await expect(couponItem.getByText(/Expires:/)).toBeVisible();
    
    // Check coupon code exists
    const copyButton = couponItem.getByRole('button', { name: 'Copy Code' });
    await expect(copyButton).toBeVisible();
    
    // Click copy button
    await copyButton.click();
    
    // Verify copy success message
    await expect(page.getByText('Code copied to clipboard!')).toBeVisible();
  });

  test('TC5: User can navigate between pages of inventory items', async ({ page }) => {
    // Navigate to inventory page
    await page.goto('/profile/inventory');
    
    // Verify pagination elements using your test IDs
    await expect(page.getByTestId('next-page-btn')).toBeVisible();
    await expect(page.getByTestId('prev-page-btn')).toBeVisible();
    
    // Verify page indicator shows initial page
    await expect(page.getByText('Page 1')).toBeVisible();
    
    // Get coupon items on first page using your test ID pattern
    const firstPageCouponId = await page.getByTestId(/^coupon-/).first().getAttribute('data-testid');
    
    // Click next page button using your test ID
    const nextPageButton = page.getByTestId('next-page-btn');
    await nextPageButton.click();
    await page.waitForTimeout(500);
    
    // Verify page indicator updates
    await expect(page.getByText('Page 2')).toBeVisible();
    
    // Verify items are different using your test ID pattern
    const secondPageCouponId = await page.getByTestId(/^coupon-/).first().getAttribute('data-testid');
    expect(secondPageCouponId).not.toBe(firstPageCouponId);
    
    // Go back to previous page using your test ID
    const prevPageButton = page.getByTestId('prev-page-btn');
    await prevPageButton.click();
    await page.waitForTimeout(500);
    
    // Verify we're back on page 1
    await expect(page.getByText('Page 1')).toBeVisible();
    
    // Verify same items as initially
    const backToFirstId = await page.getByTestId(/^coupon-/).first().getAttribute('data-testid');
    expect(backToFirstId).toBe(firstPageCouponId);
  });
});