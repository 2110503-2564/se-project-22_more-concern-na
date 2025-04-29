import { expect, test } from '@playwright/test';
import { loginAsCustomer, loginAsHotelManager } from '../helpers/auth-helpers';

test.describe('HotelManager Review Functionality', () => {
  const hotelId = '644b1f1e1a1e1f1e1a1e1f3e';
  const bookingId = '6807ae727f0c3ffa95790820';

  const reportReasons = [
    'Child Exploitation',
    'Bullying/Harassment',
    'Self-Harm/Suicide Content',
    'Violence/Graphic Content',
    'NSFW/Adult Content',
    'Spam/Unwanted Content',
    'Scam/Fraudulent Activity',
  ];

  test("setup review", async ({ page }) => {
    await loginAsCustomer(page);
    await page.goto(`/bookings`);
    await page.waitForTimeout(1000);
    await page
      .locator('.grid > div')
      .filter({ hasText: 'check-in: Dec 15, 2024' })
      .filter({ hasText: 'check-out: Dec 16, 2024' })
      .getByRole('button')
      .click();
    await page.waitForTimeout(1500);

    await expect(
      page.getByRole('button', { name: 'Write Review' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Write Review' }).click();
    await page.waitForTimeout(2000);

    await expect(page.getByText('Write a Review')).toBeVisible();
    await expect(
      page.getByPlaceholder('Give your review a title'),
    ).toBeVisible();
    await expect(page.getByPlaceholder('Share your experience')).toBeVisible();
    await expect(page.locator('.MuiRating-root')).toBeVisible();

    await page.getByRole('textbox', { name: 'Title' }).click();
    await page.getByRole('textbox', { name: 'Title' }).fill('Sawadee krub');
    await page.getByRole('textbox', { name: 'Your Review' }).click();
    await page
      .getByRole('textbox', { name: 'Your Review' })
      .fill('one two three 4 5 I love you');
    await page.locator('.MuiRating-root > label').nth(3).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Submit Review' }).click();
    await page.waitForTimeout(2000);
    await page.getByTestId('alert-confirm-button').click();
    await page.waitForTimeout(2000);

    await expect(
      page.getByTestId('alert-confirm-button')
    ).not.toBeVisible();
  });

  test.beforeEach(async ({ page }) => {
    await loginAsHotelManager(page);
  });

  test('TC1: HotelManager can see customer reviews', async ({ page }) => {
    await page.goto(`/manage/hotels/${hotelId}`);
    await page.waitForTimeout(2000);

    await expect(
      page.locator('div').filter({ hasText: /^test from 2020$/ }),
    ).toBeVisible();
    await expect(page.getByText('hello world')).toBeVisible();
  });

  test('TC2: HotelManager can use pagination to see reviews', async ({
    page,
  }) => {
    await page.goto(`hotels/${hotelId}`);
    await page.waitForLoadState('networkidle');

    // reivew before pagination
    await expect(page.getByText('test from 2020')).toBeVisible();
    await expect(page.getByText('hello world')).toBeVisible();
    await expect(page.getByText('Sawadee krub')).not.toBeVisible();
    await expect(
      page.getByText('one two three 4 5 I love you'),
    ).not.toBeVisible();

    // Click on the "Next" button to go to the next page
    await page.getByRole('button', { name: 'Next' }).first().dblclick();
    await page.waitForTimeout(2000);

    // Verify that the reviews on the next page are displayed
    await expect(page.getByText('test from 2020')).not.toBeVisible();
    await expect(page.getByText('hello world')).not.toBeVisible();
    await expect(page.getByText('Sawadee krub')).toBeVisible();
    await expect(page.getByText('one two three 4 5 I love you')).toBeVisible();

    // Click on the "Previous" button to go back to the previous page
    await page.getByRole('button', { name: 'Previous' }).first().dblclick();
    await page.waitForTimeout(2000);
    // Verify that the reviews on the previous page are displayed
    await expect(page.getByText('test from 2020')).toBeVisible();
    await expect(page.getByText('hello world')).toBeVisible();
    await expect(page.getByText('Sawadee krub')).not.toBeVisible();
    await expect(
      page.getByText('one two three 4 5 I love you'),
    ).not.toBeVisible();
  });

  test('TC3: HotelManager can reply to customer reviews', async ({ page }) => {
    await page.goto(`/manage/hotels/${hotelId}`);
    await page.waitForLoadState('networkidle');

    // Click the "Reply" button for the first review
    await page.getByRole('button', { name: 'Reply' }).first().click();
    await page.waitForTimeout(1500);

    await page
      .getByPlaceholder('Write your reply here')
      .fill('Thank you for your feedback!');

    // Click the "Send" button
    await page.getByRole('button', { name: 'Submit Reply' }).click();
    await page.waitForTimeout(1500);

    const confirmDialog = page.getByText('Do you want to create this item?');
    await expect(confirmDialog).toBeVisible();

    await page.getByTestId('alert-confirm-button').click();
    await page.waitForTimeout(1500);

    await expect(confirmDialog).not.toBeVisible();

    // Verify that the reply is visible in the review section
    await expect(page.getByText('Thank you for your feedback!')).toBeVisible();
  });

  test('TC4: HotelManager can edit their reply', async ({ page }) => {
    await page.goto(`/manage/hotels/${hotelId}`);
    await page.waitForLoadState('networkidle');

    // Edit the reply
    await page
      .locator('div')
      .filter({
        hasText:
          /^\.\.\.Response from Hotel ManagerThank you for your feedback!$/,
      })
      .getByRole('button')
      .click();
    await page.getByRole('menuitem', { name: 'Edit' }).click();
    await page.waitForTimeout(1500);
    await page.getByText('Thank you for your feedback!').click();
    await page
      .getByText('Thank you for your feedback!')
      .fill('Sorry for the inconvenience. We will look into this matter.');
    await page.waitForTimeout(1500);

    await page
      .getByRole('button', { name: 'Save Change', exact: true })
      .click();
    await page.waitForTimeout(2000);

    const confirmDialog = page.getByText(
      'Are you sure you want to save these changes?',
    );
    await expect(confirmDialog).toBeVisible();

    const alertConfirmButton = page.getByTestId('alert-confirm-button')
    await alertConfirmButton.click();
    await page.waitForTimeout(1500);

    await expect(
      alertConfirmButton
    ).not.toBeVisible();

    // Verify that the updated reply is visible in the review section
    await expect(
      page.getByText(
        'Sorry for the inconvenience. We will look into this matter.',
      ),
    ).toBeVisible();
  });

  test('TC5: HotelManager can delete their reply', async ({ page }) => {
    await page.goto(`/manage/hotels/${hotelId}`);
    await page.waitForLoadState('networkidle');

    // Delete the reply
    await page
      .locator('div')
      .filter({
        hasText:
          /^\.\.\.Response from Hotel ManagerSorry for the inconvenience. We will look into this matter.$/,
      })
      .getByRole('button')
      .click();
    await page.waitForTimeout(1500);
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.waitForTimeout(1500);

    const confirmDialog = page.getByText(
      'Are you sure you want to delete this? This action cannot be undone.',
    );
    await expect(confirmDialog).toBeVisible();

    await page.getByTestId('alert-confirm-button').click();
    await page.waitForTimeout(1500);

    await expect(confirmDialog).not.toBeVisible();

    // Verify that the reply is no longer visible in the review section
    await expect(
      page.getByText(
        'Sorry for the inconvenience. We will look into this matter.',
      ),
    ).not.toBeVisible();
  });

  test('TC6: HotelManager can report a review', async ({ page }) => {
    await page.goto(`/manage/hotels/${hotelId}`);
    await page.waitForTimeout(1000);

    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Next' }).first().click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Next' }).first().click();
    await page.waitForTimeout(2000);

    await page.getByRole('button', { name: '...' }).first().click();

    await expect(page.getByRole('menuitem', { name: 'Report' })).toBeVisible();
    await page.getByRole('menuitem', { name: 'Report' }).click();
    await page.waitForTimeout(1500);

    for (let i = 0; i < reportReasons.length; i++) {
      await expect(
        page.getByRole('menuitem', { name: reportReasons[i] }),
      ).toBeVisible();
    }

    await page.getByRole('menuitem', { name: 'Bullying/Harassment' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Report submitted successfully')).toBeVisible();
  });
});
