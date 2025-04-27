// tests/reward/redeemables-browsing.spec.ts
import { expect, test } from '@playwright/test';
import { loginAsAdmin, loginAsCustomer } from '../helpers/auth-helpers';

test.describe('Redeemables Browsing Functionality', () => {
  test('TC1: Customer can access the redeemables page', async ({ page }) => {
    await loginAsCustomer(page);

    // Navigate to redeemables page
    await page.goto('/reward/redeemables');

    // Verify coupons section is displayed as in Figma design
    await expect(page.getByRole('heading', { name: 'Coupons' })).toBeVisible();

    // Check for the add button that should only be visible to admin
    await expect(
      page.getByRole('button', { name: 'Add Coupon' }),
    ).not.toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Add Gift' }),
    ).not.toBeVisible();

    // Check for coupon items with "10%" discount and expireDate 07-31-2025 as shown in Figma
    const couponItems = page.getByTestId('coupon-10%-07-31-2025');
    await expect(couponItems.first()).toBeVisible();

    // Check for gifts section
    await expect(page.getByRole('heading', { name: 'Gifts' })).toBeVisible();

    // Check for gift items name "Super luggage"
    const giftItems = page.getByTestId('Super luggage');
    await expect(giftItems.first()).toBeVisible();

    // Check for pagination
    await expect(page.getByTestId('pagination-number').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next' }).first()).toBeVisible();
  });

  //pagination test
  test('TC2: Customer can navigate between pages of redeemables', async ({
    page,
  }) => {
    await loginAsCustomer(page);

    // Navigate to redeemables page
    await page.goto('/reward/redeemables');

    const nextPagebtn = page.getByTestId('next-page-btn');
    const prevPagebtn = page.getByTestId('prev-page-btn');

    const couponItemsP1 = page.getByTestId('coupon-10%-07-31-2025');
    const couponItemsP2 = page.getByTestId('coupon-50%-12-31-2025')

    //before coupon next page
    await expect(couponItemsP1).toBeVisible();
    await expect(couponItemsP2).not.toBeVisible();
    //after coupon next page
    nextPagebtn.first().click(); //coupon next page
    await expect(couponItemsP1).not.toBeVisible();
    await expect(couponItemsP2).toBeVisible();
    //after coupon prev page
    prevPagebtn.first().click(); //coupon prev page
    await expect(couponItemsP1).toBeVisible();
    await expect(couponItemsP2).not.toBeVisible();

    const giftItemsP1 = page.getByTestId('Super luggage');
    const giftItemsP2 = page.getByTestId('Super Cooler');

    //before gift next page
    await expect(giftItemsP1).toBeVisible();
    await expect(giftItemsP2).not.toBeVisible();
    //after gift next page
    nextPagebtn.nth(1).click(); //gift next page
    await expect(giftItemsP1).not.toBeVisible();
    await expect(giftItemsP2).toBeVisible();
    //after gift prev page
    prevPagebtn.nth(1).click(); //gift prev page
    await expect(giftItemsP1).toBeVisible();
    await expect(giftItemsP2).not.toBeVisible();

    
  }); 

  test('TC3: Customer can view gift details', async ({ page }) => {
    await loginAsCustomer(page);

    // Navigate to redeemables page
    await page.goto('/reward/redeemables');

    // Find a gift item
    const giftItems = page.locator('button').filter({ hasText: 'Redeem' });

    // If there are gift items, click the first one
    if ((await giftItems.count()) > 0) {
      const giftItemsP1 = page.getByTestId('Super luggage');
      await giftItemsP1.click();

      // Verify we're on the gift detail page
      await expect(
        page.getByRole('heading', { name: 'Gift Detail' }),
      ).toBeVisible();

      // Verify gift details are displayed
      await expect(page.getByText('Super luggage')).toBeVisible();
      await expect(
        page.getByText(/This luggage have very light weight and can transform to be aircraft/),
      ).toBeVisible();

      // Verify redeem button exists
      await expect(page.getByRole('button', { name: 'Redeem' })).toBeVisible();
    }
  });

  test('TC3: Admin can see add item option', async ({ page }) => {
    await loginAsAdmin(page);

    // Navigate to redeemables page
    await page.goto('/reward/redeemables');

    // Verify admin can see add redeemable button
    await expect(page.getByRole('button', { name: 'Add Coupon' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Gift' })).toBeVisible();
  });
});
