// tests/hotel/hotel-manager-room-management.spec.ts
import { test, expect } from '@playwright/test';
import { loginAsHotelManager } from '../helpers/auth-helpers';

test.describe('TC1: Hotel Manager Room Management Functionality', () => {
  const hotelId = 'manager-hotel-id'; // Replace with the manager's hotel ID
  
  test.beforeEach(async ({ page }) => {
    await loginAsHotelManager(page);
  });

  test('A1: Hotel manager can access add room form', async ({ page }) => {
    // Navigate to manager's hotel page
    await page.goto(`/manage/hotels/${hotelId}`);
    
    // Verify the Create Room button is visible
    await expect(page.locator('button:has-text("Create Room")')).toBeVisible();

    // Verify the new room appears in the list
    await expect(page.locator('text=Manager Suite Test')).toBeVisible();
  });

  test('A1: Hotel manager can edit room details', async ({ page }) => {
    // Navigate to hotel management page
    await page.goto(`/manage/hotels/${hotelId}`);
    
    // Find the created room and click manage
    await page.locator('text=Manager Suite Test').first().locator('xpath=ancestor::div[contains(@class, "w-")]//*[contains(text(), "Manage Room")]').click();
    
    // Wait for the edit dialog to appear (shadcn/ui component)
    await expect(page.locator('.bg-bg-box text=Edit Room Details')).toBeVisible();
    
    // Modify room details in the shadcn/ui form
    await page.fill('input[id="roomType"]', 'Updated Manager Suite');
    await page.fill('input[id="capacity"]', '5');
    await page.fill('input[id="price"]', '449.99');
    
    // Save changes using the shadcn/ui AlertDialogAction button
    await page.click('button:has-text("Update Room")');
    
    // Verify success message in sonner toast
    await expect(page.locator('text=Room updated successfully')).toBeVisible();
  });

  test('A2: Changes to room by hotel manager are reflected immediately', async ({ page }) => {
    // Navigate to hotel management page
    await page.goto(`/manage/hotels/${hotelId}`);
    
    // Verify the updated room details are displayed
    await expect(page.locator('text=Updated Manager Suite')).toBeVisible();
    
    // Navigate to the public hotel page to verify changes are reflected there too
    await page.goto(`/hotels/${hotelId}`);
    
    // Verify the updated room is visible on the public page
    await expect(page.locator('text=Updated Manager Suite')).toBeVisible();
  });

  test('A1: Hotel manager can delete a room', async ({ page }) => {
    // Navigate to hotel management page
    await page.goto(`/manage/hotels/${hotelId}`);
    
    // Find the updated room and click manage
    await page.locator('text=Updated Manager Suite').first().locator('xpath=ancestor::div[contains(@class, "w-")]//*[contains(text(), "Manage Room")]').click();
    
    // Wait for the edit dialog to appear
    await expect(page.locator('.bg-bg-box text=Edit Room Details')).toBeVisible();
    
    // Click the delete button with the trash icon
    await page.click('button:has-text("Delete Room"):has(.lucide-trash-2)');
    
    // Verify confirmation dialog appears (nested AlertDialog)
    await expect(page.locator('text=Are you sure you want to delete this room? This action cannot be undone.')).toBeVisible();
    
    // Confirm deletion in the nested dialog
    await page.click('.bg-red-600:has-text("Delete Room")');
    
    // Verify success message in sonner toast
    await expect(page.locator('text=Room deleted successfully')).toBeVisible();
  });

  test('A2: Deleted room by hotel manager no longer appears in the system', async ({ page }) => {
    // Navigate to hotel management page
    await page.goto(`/manage/hotels/${hotelId}`);
    
    // Verify the deleted room is no longer visible
    await expect(page.locator('text=Updated Manager Suite')).not.toBeVisible();
    
    // Navigate to the public hotel page
    await page.goto(`/hotels/${hotelId}`);
    
    // Verify the deleted room is not visible on the public page either
    await expect(page.locator('text=Updated Manager Suite')).not.toBeVisible();
    
    // Check if bookings for this room type are removed
    // This would require either API checking or UI verification through bookings page
    // For this example, we'll check the bookings page for simplicity
    await page.goto('/bookings');
    
    // Verify no bookings exist with the deleted room type
    const pageContent = await page.content();
    expect(pageContent.includes('Updated Manager Suite')).toBe(false);
  });
});