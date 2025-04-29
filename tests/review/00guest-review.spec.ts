import {test, expect} from "@playwright/test";

test.describe('guest review functionality', () => {
    const hotelId = '644b1f1e1a1e1f1e1a1e1f3e';
    const bookingId = '6807ae727f0c3ffa95790820';
  
    test('TC1: Guest can see their review', async ({ page }) => {
      await page.goto(`hotels/${hotelId}`);
      await page.waitForLoadState('networkidle');
  
      await expect(page.getByText('great, great', {exact:true})).toBeVisible();
      await expect(page.getByText('hello').first()).toBeVisible();
    });
  
    test('TC2: Guest can use pagination to see reviews', async ({ page }) => {
      await page.goto(`hotels/${hotelId}`);
      await page.waitForLoadState('networkidle');
  
      // reivew before pagination
      await expect(page.getByText('great, great', {exact:true})).toBeVisible();
      await expect(page.getByText('hello').first()).toBeVisible();
      await expect(page.getByText('ttt')).not.toBeVisible();
      await expect(
        page.getByText('LGTM'),
      ).not.toBeVisible();
      // Click on the "Next" button to go to the next page
      await page.getByRole('button', { name: 'Next' }).first().click();
      await page.waitForTimeout(1000);
      // Verify that the reviews on the next page are displayed
      await expect(page.getByText('great, great', {exact:true})).not.toBeVisible();
      await expect(page.getByText('hello').first()).not.toBeVisible();
      await expect(page.getByText('ttt')).toBeVisible();
      await expect(
        page.getByText('LGTM'),
      ).toBeVisible();

      // Click on the "Previous" button to go back to the previous page
      await page.getByRole('button', { name: 'Previous' }).first().click();
      await page.waitForTimeout(1000);
      // Verify that the reviews on the previous page are displayed
      await expect(page.getByText('great, great', {exact:true})).toBeVisible();
      await expect(page.getByText('hello').first()).toBeVisible();
      await expect(page.getByText('ttt')).not.toBeVisible();
      await expect(
        page.getByText('LGTM'),
      ).not.toBeVisible();
    });
});