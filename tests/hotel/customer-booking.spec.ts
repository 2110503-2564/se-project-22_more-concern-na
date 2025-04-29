// tests/hotel/customer-booking.spec.ts
import { expect, test } from '@playwright/test';
import { loginAsCustomer } from '../helpers/auth-helpers';

test.describe('TC1: Customer Booking Functionality', () => {
  const hotelId = '644b1f1e1a1e1f1e1a1e1f3e';

  test.beforeEach(async ({ page }) => {
    await loginAsCustomer(page);
  });

  test('TC1: Customer can select a booking date and room type', async ({
    page,
  }) => {
    // Navigate to a specific hotel page
    await page.goto(`/hotels/${hotelId}`);

    // Check "check-out date" btn & "Check Available" button are disabled
    await expect(
      page.getByRole('button', { name: 'Choose date', exact: true }).nth(1),
    ).toBeDisabled();

    await expect(
      page.getByRole('button', { name: 'Check Available' }),
    ).toBeDisabled();

    // select check-in date
    await page.locator('.MuiInputAdornment-root').first().click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Next month' }).click();
    await page.waitForTimeout(1500);
    await page.getByRole('gridcell', { name: '6', exact: true }).click();
    await page.waitForTimeout(1500);

    // select check-out date
    await page.locator('.MuiInputAdornment-root').nth(1).click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Next month' }).click();
    await page.waitForTimeout(1500);
    await page.getByRole('gridcell', { name: '9', exact: true }).click();
    await page.waitForTimeout(1500);

    // Click "Check Available" button
    await page.getByRole('button', { name: 'Check Available' }).click();

    // Wait for rooms to display with availability status
    await expect(
      page.getByText(
        'Executive Suite$250per nightMax 3 persons5 rooms availableSelect Room',
      ),
    ).toBeVisible();

    // select room for book
    await page
      .locator('div')
      .filter({ hasText: /^1 rooms availableSelect Room$/ })
      .getByRole('button')
      .click();
    await page
      .locator('div')
      .filter({ hasText: /^10 rooms availableSelect Room$/ })
      .getByRole('button')
      .click();
    await page
      .locator('div')
      .filter({ hasText: /^5 rooms availableSelect Room$/ })
      .getByRole('button')
      .dblclick();

    await page.getByRole('button', { name: 'Book Now' }).click();
    await expect(
      page.getByRole('heading', { name: 'Confirm Your Booking' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Confirm Booking' }).click();

    await expect(page.getByText('Booking Confirmed!')).toBeVisible();
  });

  test('TC2: Customer can not book unavailable date', async ({page}) => {
    // Navigate to a specific hotel page
    await page.goto(`/hotels/${hotelId}`);

    // Check "check-out date" btn & "Check Available" button are disabled
    await expect(
      page.getByRole('button', { name: 'Choose date', exact: true }).nth(1),
    ).toBeDisabled();

    await expect(
      page.getByRole('button', { name: 'Check Available' }),
    ).toBeDisabled();

    // select check-in date
    await page.locator('.MuiInputAdornment-root').first().click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Next month' }).click();
    await page.waitForTimeout(1500);
    await page.getByRole('gridcell', { name: '6', exact: true }).click();
    await page.waitForTimeout(1500);

    // select check-out date
    await page.locator('.MuiInputAdornment-root').nth(1).click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Next month' }).click();
    await page.waitForTimeout(1500);

    // Check if the check-out date is disabled (book exceed 3 nights)
    await expect(
      page.getByRole('gridcell', { name: '10', exact: true }),
    ).toBeDisabled();

    // can't select check-out date before check-in date
    await expect(
      page.getByRole('gridcell', { name: '2', exact: true }),
    ).toBeDisabled();
  });

  test('TC3: the availability count of room will be updated', async ({
    page,
  }) => {
    // Navigate to a specific hotel page
    await page.goto(`/hotels/${hotelId}`);

    await expect(
      page.getByRole('button', { name: 'Choose date', exact: true }).nth(1),
    ).toBeDisabled();

    await expect(
      page.getByRole('button', { name: 'Check Available' }),
    ).toBeDisabled();

    // Select check-in date
    await page.locator('.MuiInputAdornment-root').first().click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Next month' }).click();
    await page.waitForTimeout(1500);
    await page.getByRole('gridcell', { name: '6', exact: true }).click();
    await page.waitForTimeout(1500);
    // Select check-out date
    await page.locator('.MuiInputAdornment-root').nth(1).click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Next month' }).click();
    await page.waitForTimeout(1500);
    await page.getByRole('gridcell', { name: '9', exact: true }).click();
    await page.waitForTimeout(1500);

    await page.getByRole('button', { name: 'Check Available' }).click();
    await page.waitForTimeout(1500);

    await expect(
      page.getByText(
        'Executive Suite$250per nightMax 3 persons3 rooms availableSelect Room',
      ),
    ).toBeVisible();

    await expect(page.getByRole('button', {name: 'Not Available'})).toBeDisabled();
  });

  test('TC4: Customer can view and update their booking', async ({ page }) => {
    // Navigate to bookings page
    await page.goto('/bookings');

    // Find a booking and click to view details
    await page.locator('.grid > div').filter({ hasText: 'check-in: May 6, 2025'}).filter({ hasText: 'check-out: May 9, 2025'}).getByRole('button').click();

    // Verify booking details are displayed
    await expect(page.getByRole('heading', { name: 'Booking Details' })).toBeVisible();

    await expect(page.getByText('Tuesday, May 6, 2025')).toBeVisible();
    await expect(page.getByText('prem@user.com')).toBeVisible();

    // Click to update booking
    await page.getByRole('button', { name: 'Edit Booking' }).click();
    await page.waitForTimeout(1500);

    // Select check-in date
    await page.locator('.MuiInputAdornment-root').first().click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Next month' }).dblclick();
    await page.waitForTimeout(1500);
    await page.getByRole('gridcell', { name: '15', exact: true }).click();
    await page.waitForTimeout(1500);
    // Select check-out date
    await page.locator('.MuiInputAdornment-root').nth(1).click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Next month' }).dblclick();
    await page.waitForTimeout(1500);
    await page.getByRole('gridcell', { name: '17', exact: true }).click();
    await page.waitForTimeout(1500);

    // Add room 
    await page.locator('div:nth-child(2) > div > .flex > button:nth-child(3)').click();
    // await page.locator('div').filter({ hasText: /^Standard$/ }).getByRole('button').nth(1).click();
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await page.waitForTimeout(2500);
    await expect(page.getByText('Booking updated successfully!')).toBeVisible();

    // Verify updated booking details
    await expect(page.locator('div').filter({ hasText: /^Standardx2$/ }).first()).toBeVisible();
    await expect(page.getByText('Sunday, June 15, 2025')).toBeVisible();
    await expect(page.getByText('Tuesday, June 17, 2025')).toBeVisible();

  });

  test('TC5: Customer can cancel their booking', async ({ page }) => {
    await page.goto('/bookings');

    // Find a booking and click to view details
    await page.locator('.grid > div').filter({ hasText: 'check-in: Jun 15, 2025'}).filter({ hasText: 'check-out: Jun 17, 2025'}).getByRole('button').click();

    // Verify booking details are displayed
    await expect(page.getByRole('heading', { name: 'Booking Details' })).toBeVisible();
    await expect(page.getByText('Sunday, June 15, 2025')).toBeVisible();
    await expect(page.getByText('Tuesday, June 17, 2025')).toBeVisible();
    await expect(page.getByText('prem@user.com')).toBeVisible();

    // Click to cancel booking
    await page.getByRole('button', { name: 'Cancel Booking' }).click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', {name: 'Yes, Delete'}).click();
    await page.waitForTimeout(1000);

    // Verify cancellation
    await expect(page.getByText('Booking cancelled successfully')).toBeVisible();
    await page.waitForTimeout(1500);
    await expect(page).toHaveURL('/bookings');

    // Verify booking is removed from the list
    await page.waitForTimeout(1500);
    await expect(page.locator('.grid > div').filter({ hasText: 'check-in: June 15, 2025'}).filter({ hasText: 'check-out: June 17, 2025'})).not.toBeVisible();
  });

});
