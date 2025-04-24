// tests/reward/admin-reward-management.spec.ts
import { expect, test } from '@playwright/test';
import { loginAsAdmin, loginAsCustomer } from '../helpers/auth-helpers';

test.describe('Admin Reward Management', () => {
  const hotelId = '644b1f1e1a1e1f1e1a1e1f3e';

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('TC1: Admin can access redemption management page', async ({ page }) => {
    // Navigate to redemption management
    await page.goto('/admin/redemption');

    // Find and click the admin dashboard link as shown in Figma
    await page.getByText('Back to Admin Dashboard').click();

    // Verify we're now on admin dashboard
    await expect(page).toHaveURL('/admin');

    // Verify redemption management content as shown in Figma
    await expect(
      page.getByRole('heading', { name: 'Price To Point Rate' }),
    ).toBeVisible();
    await expect(page.getByText('Booking Price per Point')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Manage Redeem Points' }),
    ).toBeVisible();
  });

  test('TC2: Admin can modify point rate and it affects user point earning', async ({
    page,
  }) => {
    // First, check how many points are earned with default rate
    await loginAsCustomer(page);

    // Navigate to hotel page
    await page.goto(`/hotels/${hotelId}`);

    // Select dates and check availability
    await page.locator('.MuiInputAdornment-root').first().click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Next month' }).click();
    await page.waitForTimeout(1500);
    await page.getByRole('gridcell', { name: '15', exact: true }).click();

    await page.locator('.MuiInputAdornment-root').nth(1).click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Next month' }).click();
    await page.waitForTimeout(1500);
    await page.getByRole('gridcell', { name: '18', exact: true }).click();

    // Check availability and select room
    await page.getByRole('button', { name: 'Check Available' }).click();
    await page.waitForTimeout(1500);

    // Select a room
    await page
      .locator('div')
      .filter({ hasText: /^Standard/ })
      .filter({ hasText: /Select Room/ })
      .getByRole('button')
      .click();

    // Click Book Now
    await page.getByRole('button', { name: 'Book Now' }).click();

    // Get the points that would be earned with default rate
    await expect(page.getByText('Points to Earn:')).toBeVisible();
    const pointsTextWithDefaultRate = await page
      .locator('text=/\\d+ points/')
      .innerText();
    const pointsWithDefaultRate = parseInt(
      pointsTextWithDefaultRate.split(' ')[0],
    );

    // Cancel the confirmation without booking
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Now login as admin and change the rate
    await loginAsAdmin(page);
    await page.goto('/admin/redemption');

    // Find the point rate input field
    const rateInput = page.getByPlaceholder('Enter rate');
    await expect(rateInput).toBeVisible();

    // >>Test increasing the rate
    await rateInput.clear();
    await rateInput.fill('1.5');

    // Save changes
    await page.getByTestId('save-rate-btn').click();

    // Verify success message
    await expect(page.getByText('Rate updated successfully')).toBeVisible();

    // Now login as customer again and check points with new rate
    await loginAsCustomer(page);

    // Navigate to hotel page
    await page.goto(`/hotels/${hotelId}`);

    // Select dates and check availability
    await page.locator('.MuiInputAdornment-root').first().click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Next month' }).click();
    await page.waitForTimeout(1500);
    await page.getByRole('gridcell', { name: '15', exact: true }).click();

    await page.locator('.MuiInputAdornment-root').nth(1).click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Next month' }).click();
    await page.waitForTimeout(1500);
    await page.getByRole('gridcell', { name: '18', exact: true }).click();

    // Check availability and select room
    await page.getByRole('button', { name: 'Check Available' }).click();
    await page.waitForTimeout(1500);

    // Select a room
    await page
      .locator('div')
      .filter({ hasText: /^Standard/ })
      .filter({ hasText: /Select Room/ })
      .getByRole('button')
      .click();

    // Click Book Now
    await page.getByRole('button', { name: 'Book Now' }).click();

    // Get the points that would be earned with new rate
    await expect(page.getByText('Points to Earn:')).toBeVisible();
    const pointsTextWithNewRate = await page
      .locator('text=/\\d+ points/')
      .innerText();
    const pointsWithNewRate = parseInt(pointsTextWithNewRate.split(' ')[0]);

    // Verify the points have increased with the higher rate
    expect(pointsWithNewRate).toBeGreaterThan(pointsWithDefaultRate);

    // >>Test decreasing the rate
    // Cancel the booking
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Login as admin again
    await loginAsAdmin(page);
    await page.goto('/admin/redemption');

    // Find the point rate input field
    await expect(rateInput).toBeVisible();

    // Modify rate from 1.5 to 0.5 (decreasing the rate)
    await rateInput.clear();
    await rateInput.fill('0.5');

    // Save changes
    await page.getByTestId('save-rate-btn').click();

    // Verify success message
    await expect(page.getByText('Rate updated successfully')).toBeVisible();

    // Login as customer again and check points with lower rate
    await loginAsCustomer(page);

    // Navigate to hotel page
    await page.goto(`/hotels/${hotelId}`);

    // Select dates and check availability
    await page.locator('.MuiInputAdornment-root').first().click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Next month' }).click();
    await page.waitForTimeout(1500);
    await page.getByRole('gridcell', { name: '15', exact: true }).click();

    await page.locator('.MuiInputAdornment-root').nth(1).click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Next month' }).click();
    await page.waitForTimeout(1500);
    await page.getByRole('gridcell', { name: '18', exact: true }).click();

    // Check availability and select room
    await page.getByRole('button', { name: 'Check Available' }).click();
    await page.waitForTimeout(1500);

    // Select a room
    await page
      .locator('div')
      .filter({ hasText: /^Standard/ })
      .filter({ hasText: /Select Room/ })
      .getByRole('button')
      .click();

    // Click Book Now
    await page.getByRole('button', { name: 'Book Now' }).click();

    // Get the points that would be earned with lower rate
    await expect(page.getByText('Points to Earn:')).toBeVisible();
    const pointsTextWithLowerRate = await page
      .locator('text=/\\d+ points/')
      .innerText();
    const pointsWithLowerRate = parseInt(pointsTextWithLowerRate.split(' ')[0]);

    // Verify the points have decreased with the lower rate
    expect(pointsWithLowerRate).toBeLessThan(pointsWithDefaultRate);

    // Cancel the booking
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Finally, reset the rate back to 1 (default)
    await loginAsAdmin(page);
    await page.goto('/admin/redemption');

    // Find the point rate input field
    await expect(rateInput).toBeVisible();

    // Reset rate to 1
    await rateInput.clear();
    await rateInput.fill('1');

    // Save changes
    await page.getByTestId('save-rate-btn').click();

    // Verify success message
    await expect(page.getByText('Rate updated successfully')).toBeVisible();
  });

  test('TC3: Admin can adjust user points', async ({ page }) => {
    await page.goto('/admin/redemption');

    // Verify admin can see user list
    await expect(page.getByText('premKung')).toBeVisible();
    await expect(page.getByText('palm')).toBeVisible();

    // Verify the point adjustment input is visible
    const pointInput = page.getByPlaceholder('Edit Points').first();
    await expect(pointInput).toBeVisible();

    // Adjust points (add)
    await pointInput.clear();
    await pointInput.fill('100');

    // Click Redeem Point button
    await page.getByTestId('save-usrPoint-btn').first().click();

    // Verify success message
    await expect(page.getByText('Points adjusted successfully')).toBeVisible();
  });

  test('TC4: Admin can paginate through user list', async ({ page }) => {
    await page.goto('/admin/redemption');

    // Check for pagination controls
    await expect(page.getByText('Page')).toBeVisible();

    // Click next button to go to next page (if it's not disabled)
    const nextButton = page.getByRole('button', { name: 'Next' });
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForTimeout(500);

      // Verify page change
      await expect(page.getByText('Page 2')).toBeVisible();

      // Go back to previous page
      await page.getByRole('button', { name: 'Prev' }).click();
      await page.waitForTimeout(500);

      // Verify we're back on page 1
      await expect(page.getByText('Page 1')).toBeVisible();
    }
  });

  test('TC5: Admin can add a new coupon', async ({ page }) => {
    // Navigate to redeemables page
    await page.goto('/reward/redeemables');

    // Verify admin can see add item button as shown in Figma
    const addCouponButton = page.getByTestId('add-coupon-button');
    await expect(addCouponButton).toBeVisible();

    // Click add item button
    await addCouponButton.click();

    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Add New Coupon' }),
    ).toBeVisible();

    // Fill out the form for a coupon based on CouponCardProps interface
    await page.getByLabel('Name').fill('Special Discount');
    await page.getByLabel('Point').fill('500');
    await page.getByLabel('Discount').fill('15');
    await page.getByLabel('Expire').fill('2025-12-31');
    await page.getByLabel('Remain').fill('50');

    // Submit the form using the AlertDialogAction
    await page.getByRole('button', { name: 'Create Coupon' }).click();

    // Verify success message
    await expect(page.getByText('Coupon created successfully')).toBeVisible();

    // Verify new coupon appears in the list
    await expect(page.getByText('Special Discount')).toBeVisible();
    await expect(page.getByText('15%')).toBeVisible();
  });

  test('TC6: Admin can add a new gift', async ({ page }) => {
    // Navigate to redeemables page
    await page.goto('/reward/redeemables');

    // Navigate to Gifts section (assuming there's a tab or scroll down)
    await page.getByRole('heading', { name: 'Gifts' }).scrollIntoViewIfNeeded();

    // Verify admin can see add item button as shown in Figma
    const addGiftButton = page.getByTestId('add-gift-button'); // Second add item button (for gifts)
    await expect(addGiftButton).toBeVisible();

    // Click add item button
    await addGiftButton.click();

    // Verify the add redeemable form appears
    await expect(
      page.getByRole('heading', { name: 'Add New Redeemable' }),
    ).toBeVisible();

    // Fill out the form for a gift
    const giftName = `Test Gift ${Date.now()}`;
    await page.getByLabel('Gift Name').fill(giftName);
    await page
      .getByLabel('Description')
      .fill('Ut tempor accusam dolore sanctus diam consetetur ea accusam');
    await page.getByLabel('Point Cost').fill('1000');
    await page.getByLabel('Available Count').fill('25');
    await page.getByLabel('Type').selectOption('gift');

    // Upload image if there's an upload field
    // This would depend on your implementation

    // Submit the form
    await page.getByRole('button', { name: 'Create Gift' }).click();

    // Verify success message
    await expect(page.getByText('Gift created successfully')).toBeVisible();

    // Verify new gift appears in the list
    await expect(page.getByText(giftName)).toBeVisible();
  });
});
