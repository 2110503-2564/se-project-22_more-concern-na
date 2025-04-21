import { expect, test } from '@playwright/test';
import { loginAsAdmin } from '../helpers/auth-helpers';

test.describe('Admin Room Management Functionality', () => {
  const hotelId = '644b1f1e1a1e1f1e1a1e1f3e';

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('TC1: Admin can access add room option', async ({ page }) => {
    // Navigate to hotel management page
    await page.goto(`/manage/hotels/${hotelId}`);

    // Verify the Add Room button is visible
    await expect(page.locator('button:has-text("Create Room")')).toBeVisible();
  });

  //invavid add room
  test('TC2: Admin cannot add a room with invalid details', async ({
    page,
  }) => {
    // Navigate to hotel management page
    await page.goto(`/manage/hotels/${hotelId}`);

    // Click on Create Room button
    await page.click('button:has-text("Create Room")');

    // Wait for the shadcn/ui AlertDialog to appear
    await expect(page.locator('text=Create New Room')).toBeVisible();

    // Fill the room details with invalid data
    await page.fill('input[id="roomType"]', ''); // Empty room type
    await page.fill('input[id="roomCapacity"]', '0'); // Invalid capacity
    await page.fill('input[id="maxCount"]', '0'); // Invalid max count
    await page.fill('input[id="roomPrice"]', '-100'); // Invalid price

    // Submit the form using the shadcn/ui AlertDialogAction button
    await page.click('.bg-bg-box button:has-text("Create Room")');

    await expect(
      page.locator('text=Please fill in all required fields with valid values'),
    ).toBeVisible();
  });

  test('TC3: Admin can add a new room', async ({ page }) => {
    // Navigate to hotel management page
    await page.goto(`/manage/hotels/${hotelId}`);

    // Click on Create Room button
    await page.click('button:has-text("Create Room")');

    // Wait for the shadcn/ui AlertDialog to appear
    await expect(page.locator('text=Create New Room')).toBeVisible();

    // Fill the room details in the shadcn/ui form
    await page.fill('input[id="roomType"]', 'Deluxe Suite Test');
    await page.fill('input[id="roomCapacity"]', '2');
    await page.fill('input[id="maxCount"]', '5');
    await page.fill('input[id="roomPrice"]', '299.99');

    // Submit the form using the shadcn/ui AlertDialogAction button
    await page.click('.bg-bg-box button:has-text("Create Room")');

    // Verify the new room appears in the list
    await page.waitForSelector('text=Deluxe Suite Test', {
      state: 'visible',
      timeout: 5000,
    });

    await expect(page.locator('text=Deluxe Suite Test')).toBeVisible();
  });

  test('TC4: Admin can edit room details', async ({ page }) => {
    // Navigate to hotel management page
    await page.goto(`/manage/hotels/${hotelId}`);

    await page.reload();

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');

    // Find a room and click the manage room button
    // Find all room cards, filter to the one with "Deluxe Suite Test", then click its button
    await page
      .locator('h2.text-xl', { hasText: 'Deluxe Suite Test' })
      .locator('xpath=../..') // Go up to the parent container
      .getByRole('button', { name: 'Manage Room' })
      .click();

    // Wait for the edit dialog to appear (using shadcn/ui AlertDialog)
    await expect(page.locator('text=Edit Room Details')).toBeVisible();

    // Modify room details in the shadcn/ui form
    await page.fill('input[id="roomType"]', 'Updated Suite Name');
    await page.fill('input[id="capacity"]', '3');
    await page.fill('input[id="price"]', '349.99');

    // Save changes using the AlertDialogAction button
    await page.click('button:has-text("Update Room")');

    // Verify success message in sonner toast
    await expect(
      page.getByText('Room updated successfully').first(),
    ).toBeVisible();

    // Verify room update success display on card
    await expect(page.locator('text=Updated Suite Name')).toBeVisible();
  });

  test('TC5: Changes to room are reflected immediately', async ({ page }) => {
    // Navigate to hotel management page
    await page.goto(`/manage/hotels/${hotelId}`);

    await page.reload();

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');

    // Verify the updated room details are displayed
    await expect(page.locator('text=Updated Suite Name')).toBeVisible();

    // Navigate to the public hotel page to verify changes are reflected there too
    await page.goto(`/hotels/${hotelId}`);

    // Verify the updated room is visible on the public page
    await expect(page.locator('text=Updated Suite Name')).toBeVisible();
  });

  test('TC6: Admin can delete a room with confirmation', async ({ page }) => {
    // Navigate to hotel management page
    await page.goto(`/manage/hotels/${hotelId}`);

    await page.reload();

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');

    // Find the updated room and click manage
    await page
      .locator('text=Updated Suite Name')
      .first()
      .locator(
        'xpath=ancestor::div[contains(@class, "w-")]//*[contains(text(), "Manage Room")]',
      )
      .click();

    // Wait for the Room Management dialog to appear
    await expect(page.locator('text=Edit Room Details')).toBeVisible();

    // Click the delete button to trigger the nested delete dialog
    await page.click('button:has-text("Delete Room"):has(.lucide-trash-2)');

    // Verify delete confirmation dialog appears with the warning text
    await expect(
      page.locator(
        'text=Are you sure you want to delete this room? This action cannot be undone.',
      ),
    ).toBeVisible();

    // Cancel first to test the cancellation flow
    await page
      .locator('text=Delete Room')
      .locator('xpath=ancestor::div[contains(@role, "alertdialog")]')
      .getByRole('button', { name: 'Cancel' })
      .click();

    // Dialog should close - the delete confirmation dialog should not be visible
    await expect(
      page.locator(
        'text=Are you sure you want to delete this room? This action cannot be undone.',
      ),
    ).not.toBeVisible();

    // The main edit dialog should still be visible
    await expect(page.locator('text=Edit Room Details')).toBeVisible();

    // Click delete again
    await page.click('button:has-text("Delete Room"):has(.lucide-trash-2)');

    // Wait for the confirmation dialog
    await expect(
      page.locator(
        'text=Are you sure you want to delete this room? This action cannot be undone.',
      ),
    ).toBeVisible();

    // Now confirm deletion in the nested dialog
    await page
      .locator('text=Delete Room')
      .locator('xpath=ancestor::div[contains(@role, "alertdialog")]')
      .getByRole('button', { name: 'Delete Room' })
      .click();

    // Verify success message
    await expect(page.locator('text=Room deleted successfully')).toBeVisible();
  });

  test('TC7: Deleted room no longer appears in the list', async ({ page }) => {
    // Navigate to hotel management page
    await page.goto(`/manage/hotels/${hotelId}`);

    // Verify the deleted room is no longer visible
    await expect(page.locator('text=Updated Suite Name')).not.toBeVisible();

    // Navigate to the public hotel page
    await page.goto(`/hotels/${hotelId}`);

    // Verify the deleted room is not visible on the public page either
    await expect(page.locator('text=Updated Suite Name')).not.toBeVisible();
  });
});
