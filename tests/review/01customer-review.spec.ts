import { expect, test } from '@playwright/test';
import { loginAsCustomer } from '../helpers/auth-helpers';

test.describe('customer review functionality', () => {
  const hotelId = '644b1f1e1a1e1f1e1a1e1f3e';
  const bookingId = '6807ae727f0c3ffa95790820';

  test.beforeEach(async ({ page }) => {
    await loginAsCustomer(page);
  });

  // user write review
  test('TC1: Customer can write a review', async ({ page }) => {
    await page.goto(`/bookings`);
    await page.waitForTimeout(1000);
    await page
      .locator('.grid > div')
      .filter({ hasText: 'check-in: Dec 1, 2024' })
      .filter({ hasText: 'check-out: Dec 3, 2024' })
      .getByRole('button')
      .click();

    await expect(
      page.getByRole('button', { name: 'Write Review' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Write Review' }).click();

    await expect(page.getByText('Write a Review')).toBeVisible();
    await expect(
      page.getByPlaceholder('Give your review a title'),
    ).toBeVisible();
    await expect(page.getByPlaceholder('Share your experience')).toBeVisible();
    await expect(page.locator('.MuiRating-root')).toBeVisible();

    await page.getByRole('textbox', { name: 'Title' }).click();
    await page.getByRole('textbox', { name: 'Title' }).fill('Good naja');
    await page.getByRole('textbox', { name: 'Your Review' }).click();
    await page.getByRole('textbox', { name: 'Your Review' }).fill('hohohohoho');
    await page.locator('.MuiRating-root > label').nth(3).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Submit Review' }).click();
    await page.getByTestId('alert-confirm-button').click();

    await expect(
      page.getByTestId('alert-confirm-button')
    ).not.toBeVisible();
  });

  test('TC2: Customer can see their review', async ({ page }) => {
    await page.goto(`hotels/${hotelId}`);
    await page.waitForTimeout(2000);
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('...premKungStayed December')).toBeVisible();
    await expect(page.getByText('Good naja', { exact: true })).toBeVisible();
    await expect(page.getByText('hohohohoho')).toBeVisible();
  });

  test('TC3: Customer can use pagination to see reviews', async ({ page }) => {
    await page.goto(`hotels/${hotelId}`);
    await page.waitForTimeout(1000);
    await page.waitForLoadState('networkidle');

    // reivew before pagination
    await expect(page.getByText('อาหาร aroi mak mak')).toBeVisible();
    await expect(
      page.getByText('tung tung tung tara tarav corcadir o +'),
    ).toBeVisible();
    await expect(page.getByText('wow')).not.toBeVisible();
    await expect(page.getByText('love na ja')).not.toBeVisible();
    // Click on the "Next" button to go to the next page
    await page.getByRole('button', { name: 'Next' }).nth(1).click();
    await page.waitForTimeout(1000);
    // Verify that the reviews on the next page are displayed
    await expect(page.getByText('อาหาร aroi mak mak')).not.toBeVisible();
    await expect(
      page.getByText('tung tung tung tara tarav corcadir o +'),
    ).not.toBeVisible();
    await expect(page.getByText('wow')).toBeVisible();
    await expect(page.getByText('love na ja')).toBeVisible();

    // Click on the "Previous" button to go back to the previous page
    await page.getByRole('button', { name: 'Previous' }).nth(1).click();
    await page.waitForTimeout(1000);
    // Verify that the reviews on the previous page are displayed
    await expect(page.getByText('อาหาร aroi mak mak')).toBeVisible();
    await expect(
      page.getByText('tung tung tung tara tarav corcadir o +'),
    ).toBeVisible();
    await expect(page.getByText('wow')).not.toBeVisible();
    await expect(page.getByText('love na ja')).not.toBeVisible();
  });

  test('TC4: Customer can edit their review', async ({ page }) => {
    await page.goto(`/hotels/${hotelId}`);
    await page.waitForTimeout(1000);
    await page.waitForLoadState('networkidle');

    // review before edit
    await expect(page.getByText('Good naja')).toBeVisible();
    await expect(page.getByText('hohohohoho')).toBeVisible();

    await page.getByRole('button', { name: '...' }).nth(1).click();
    await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeVisible();

    await page.getByRole('menuitem', { name: 'Edit' }).click();
    await page
      .locator('div')
      .filter({ hasText: /^Review Title$/ })
      .getByRole('textbox')
      .click();
    await page
      .locator('div')
      .filter({ hasText: /^Review Title$/ })
      .getByRole('textbox')
      .fill('Good naja jub');
    await page.locator('label').filter({ hasText: '5 Stars' }).click();
    await page.getByText('hohohohoho').click();
    await page.getByText('hohohohoho').fill('hohohohohoOH');
    await page.getByRole('button', { name: 'Save Changes' }).click();

    const confirmDialog = page.getByText(
      'Are you sure you want to save these changes?',
    );
    await expect(confirmDialog).toBeVisible();

    const alertConfirmButton = page.getByTestId('alert-confirm-button');

    await alertConfirmButton.click();

    await expect(
      alertConfirmButton
    ).not.toBeVisible();

    // review after edit
    await expect(page.getByText('Good naja jub')).toBeVisible();
    await expect(page.getByText('hohohohohoOH')).toBeVisible();
    await expect(
      page.getByText('Good naja', { exact: true }),
    ).not.toBeVisible();
    await expect(
      page.getByText('hohohohoho', { exact: true }),
    ).not.toBeVisible();
  });

  test('TC5: Customer can delete their review', async ({ page }) => {
    await page.goto(`/hotels/${hotelId}`);
    await page.waitForTimeout(1000);
    await page.waitForLoadState('networkidle');

    // review before delete
    await expect(page.getByText('Good naja jub')).toBeVisible();
    await expect(page.getByText('hohohohohoOH')).toBeVisible();

    await page.getByRole('button', { name: '...' }).nth(1).click();
    await expect(page.getByRole('menuitem', { name: 'Delete' })).toBeVisible();

    await page.getByRole('menuitem', { name: 'Delete' }).click();

    const confirmDialog = page.getByText(
      'Are you sure you want to delete this? This action cannot be undone.',
    );
    await expect(confirmDialog).toBeVisible();

    // Case 1: Cancel delete
    const alertCancelButton = page.getByTestId('alert-cancel-button');
    await alertCancelButton.click();
    // Confirm that the review is still visible
    await expect(page.getByText('Good naja jub')).toBeVisible();
    await expect(page.getByText('hohohohohoOH')).toBeVisible();
    // Click the delete button again
    await page.getByRole('button', { name: '...' }).nth(1).click();
    await expect(page.getByRole('menuitem', { name: 'Delete' })).toBeVisible();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    // Check that the confirmation dialog is visible again
    await expect(confirmDialog).toBeVisible();

    // Case 2: Confirm delete
    await page.getByTestId('alert-confirm-button').click();

    // review after delete
    await expect(page.getByText('Good naja jub')).not.toBeVisible();
    await expect(page.getByText('hohohohohoOH')).not.toBeVisible();
  });
});
