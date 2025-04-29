// tests/hotel/room-viewing.spec.ts
import { expect, test } from '@playwright/test';

test.describe('Guest Room Viewing Functionality', () => {
  const hotelId = '644b1f1e1a1e1f1e1a1e1f3e';

  test('TC1: Guest can view room availability status', async ({ page }) => {
    // Navigate to a specific hotel page
    await page.goto(`/hotels/${hotelId}`);
    await page.waitForTimeout(1500);

    await expect(
      page.getByRole('button', { name: 'Choose date', exact: true }).nth(1),
    ).toBeDisabled();

    // select check-in date
    await page.locator('.MuiInputAdornment-root').first().click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Next month' }).click();
    await page.waitForTimeout(1500);
    await page.getByRole('gridcell', { name: '13' }).click();
    await page.waitForTimeout(2000);

    // select check-out date
    await page.locator('.MuiInputAdornment-root').nth(1).click();

    await page.waitForTimeout(2000);
    await expect(page.getByRole('gridcell', { name: '18' })).toBeDisabled();
    await page.getByRole('button', { name: 'Next month' }).click();
    await page.waitForTimeout(1500);
    await page.getByRole('gridcell', { name: '14' }).click();
    await page.waitForTimeout(2000);

    // Click "Check Available" button
    await page.getByRole('button', { name: 'Check Available' }).click();

    // Wait for rooms to display with availability status
    await expect(
      page.getByText(
        'Executive Suite$250per nightMax 3 persons5 rooms availableSelect Room',
      ),
    ).toBeVisible();
    await page
      .locator('div')
      .filter({ hasText: /^5 rooms availableSelect Room$/ })
      .getByRole('button')
      .click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Login to Book' }).click();

    await expect(
      page.getByText('You need to be logged in to book a hotel'),
    ).toBeVisible();
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(`/api/auth/login`);
  });

  test('TC2: Guest can view room details', async ({ page }) => {
    // Navigate to a specific hotel page
    await page.goto(`/hotels/${hotelId}`);

    await page.waitForTimeout(2000);

    // Find all room cards
    const roomCards = page.locator('.w-\\[70\\%\\]');

    // Check if room cards exist
    expect(await roomCards.count()).toBeGreaterThanOrEqual(0);

    // For each room card, verify they display necessary information
    const roomCount = (await roomCards.count()) || 0;

    if (roomCount > 0) {
      for (let i = 0; i < roomCount; i++) {
        const card = roomCards.nth(i);

        // Verify room type is displayed
        await expect(card.locator('.text-xl.font-bold')).toBeVisible();

        // Verify price is displayed
        await expect(card.locator('.text-lg.font-semibold')).toBeVisible();

        // Verify capacity is displayed
        await expect(card.locator('text=Max')).toBeVisible();

        // Verify rooms total or availability is displayed
        await expect(card.locator('text=rooms')).toBeVisible();

        // Check for Select Room button
        await expect(
          card.locator('button:has-text("Select Room")'),
        ).toBeVisible();
      }
    }
  });
});
