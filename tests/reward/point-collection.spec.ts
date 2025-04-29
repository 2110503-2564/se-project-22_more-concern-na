import { expect, test } from '@playwright/test';
import { loginAsCustomer, loginAsHotelManager } from '../helpers/auth-helpers';

test.describe('Point Collection Functionality', () => {
  const hotelId = '644b1f1e1a1e1f1e1a1e1f3e';

  test('TC1: Point display on booking confirmation', async ({ page }) => {
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

    // Verify point information is shown in the booking confirmation
    await expect(page.getByText('Points to Earn:')).toBeVisible();
    await expect(page.getByText(/\d+ points/)).toBeVisible();
    await expect(
      page.getByText('The points will be added after check-in'),
    ).toBeVisible();

    // Complete booking
    await page.getByRole('button', { name: 'Confirm Booking' }).click();
    await expect(page.getByText('Booking Confirmed!')).toBeVisible();

    // clear the booking
    await page.goto('/bookings');

    const bookingCard = page
      .locator('.grid > div')
      .filter({ hasText: 'check-in: May 15, 2025' })
      .filter({ hasText: 'check-out: May 18, 2025' });

    await bookingCard.getByRole('button').click();

    await expect(page.getByRole('button', { name: 'Cancel Booking' })).toBeVisible();

    await page.getByRole('button', { name: 'Cancel Booking' }).click();
    await page.getByTestId('alert-confirm-button').click();

    await expect(page.getByText('Booking cancelled successfully')).toBeVisible();
    await page.waitForTimeout(1500);
    await expect(page).toHaveURL('/bookings');

  });

  test('TC2: User can see their points in the profile (not checked-in)', async ({
    page,
  }) => {
    await loginAsCustomer(page);

    // Navigate to profile page
    await page.goto('/profile');

    // Verify points are displayed in the profile
    await expect(page.getByTestId('user-point')).toBeVisible();
  });

  test('TC3: HotelManager can check-in user and points are awarded', async ({
    page,
  }) => {
    // First create a booking as a customer
    await loginAsCustomer(page);

    // Navigate to hotel page and create a booking
    await page.goto(`/hotels/${hotelId}`);

    // Set dates and book a room
    await page.locator('.MuiInputAdornment-root').first().click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Next month' }).click();
    await page.waitForTimeout(1500);
    await page.getByRole('gridcell', { name: '20', exact: true }).click();

    await page.locator('.MuiInputAdornment-root').nth(1).click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Next month' }).click();
    await page.waitForTimeout(1500);
    await page.getByRole('gridcell', { name: '22', exact: true }).click();

    await page.getByRole('button', { name: 'Check Available' }).click();
    await page.waitForTimeout(1500);

    await page
      .locator('div')
      .filter({ hasText: /^Executive Suite/ })
      .filter({ hasText: /Select Room/ })
      .getByRole('button')
      .click();

    await page.getByRole('button', { name: 'Book Now' }).click();
    await page.getByRole('button', { name: 'Confirm Booking' }).click();

    // Note the expected points from the confirmation
    const pointsText = await page.locator('text=/\\d+ points/').innerText();
    const expectedPoints = parseInt(pointsText.split(' ')[0]);

    // Check initial points
    await page.goto('/profile');
    const initialPointsText = await page.locator('text=/P \\d+/').innerText();
    const initialPoints = parseInt(initialPointsText.replace('P ', ''));

    // Now login as hotel manager
    await loginAsHotelManager(page);

    // Navigate to manage bookings
    await page.goto('/manage/bookings');

    // Find the booking we just created (using the dates)
    const bookingCard = page
      .locator('.grid > div')
      .filter({ hasText: 'check-in: May 20, 2025' })
      .filter({ hasText: 'check-out: May 22, 2025' });

    // Check in the guest
    await expect(bookingCard.locator('input[type="checkbox"]')).toBeVisible();
    await bookingCard.locator('input[type="checkbox"]').check();

    // Verify success message
    await expect(page.getByText('Guest checked in successfully')).toBeVisible();

    // Login back as customer to verify points
    await loginAsCustomer(page);
    await page.goto('/profile');

    // Check that points were added
    const finalPointsText = await page.locator('text=/P \\d+/').innerText();
    const finalPoints = parseInt(finalPointsText.replace('P ', ''));

    // Verify the points were awarded
    expect(finalPoints).toBeGreaterThanOrEqual(initialPoints);

    // The difference should be the expected points
    const pointDifference = finalPoints - initialPoints;
    expect(pointDifference).toBeGreaterThanOrEqual(expectedPoints);

    // Clear the booking
    await loginAsHotelManager(page);

    await page.goto('/manage/bookings');
    const bookingCardToCancel = page
      .locator('.grid > div')
      .filter({ hasText: 'check-in: May 20, 2025' })
      .filter({ hasText: 'check-out: May 22, 2025' });
    await bookingCardToCancel.getByRole('button').click();
    await page.getByRole('button', { name: 'Cancel Booking' }).click();
    await page.getByTestId('alert-confirm-button').click();
    await expect(page.getByText('Booking cancelled successfully')).toBeVisible();
    await page.waitForTimeout(1500);
    await expect(page).toHaveURL('/manage/bookings');
    await expect(bookingCardToCancel).not.toBeVisible();

  });
});
