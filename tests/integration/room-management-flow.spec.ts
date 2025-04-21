// tests/integration/room-management-flow.spec.ts
import { test, expect } from '@playwright/test';
import { loginAsAdmin, loginAsCustomer } from '../helpers/auth-helpers';

test.describe('TC1: End-to-End Room Management and Booking Flow', () => {
  const hotelId = '644b1f1e1a1e1f1e1a1e1f3e';
  const roomName = `Test Suite ${Date.now()}`;
  
  test('Admin creates, customer books, admin edits, and finally deletes a room', async ({ page, browser }) => {
    // Step 1: Admin creates a new room
    await loginAsAdmin(page);
    await page.goto(`/manage/hotels/${hotelId}`);
    
    // Click Create Room button
    await page.click('button:has-text("Create Room")');
    
    // Wait for the dialog to appear (shadcn/ui AlertDialog)
    await expect(page.locator('.bg-bg-box text=Add New Room')).toBeVisible();
    
    // Fill room details in shadcn/ui form
    await page.fill('input[id="roomType"]', roomName);
    await page.fill('input[id="capacity"]', '2');
    await page.fill('input[id="maxCount"]', '5');
    await page.fill('input[id="price"]', '199.99');
    await page.fill('input[id="picture"]', 'https://example.com/integration-test-room.jpg');
    
    // Create the room using the shadcn/ui AlertDialogAction button
    await page.click('.bg-bg-box button:has-text("Create Room")');
    
    // Verify success message from sonner toast
    await expect(page.locator('text=Room created successfully')).toBeVisible();
    await expect(page.locator(`text=${roomName}`)).toBeVisible();
    
    // Step 2: Customer books the newly created room
    // Create a new context for the customer session
    const customerContext = await browser.newContext();
    const customerPage = await customerContext.newPage();
    
    // Login as customer
    await loginAsCustomer(customerPage);
    
    // Navigate to the hotel
    await customerPage.goto(`/hotels/${hotelId}`);
    
    // Select check-in date using MUI DatePicker
    await customerPage.locator('.MuiDatePicker-root').first().click({ force: true });
    await customerPage.waitForSelector('.MuiPickersPopper-root');
    
    // Select a date that is at least 1 day in the future
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDay = tomorrow.getDate().toString();
    
    // Find and click on the tomorrow date in the calendar
    await customerPage.locator(`.MuiPickersDay-root:text("${tomorrowDay}"):not([disabled])`).first().click();
    
    // Select check-out date
    await customerPage.locator('.MuiDatePicker-root').nth(1).click({ force: true });
    await customerPage.waitForSelector('.MuiPickersPopper-root');
    
    // Select a date that is 2 days in the future
    const checkoutDate = new Date(tomorrow);
    checkoutDate.setDate(checkoutDate.getDate() + 2);
    const checkoutDay = checkoutDate.getDate().toString();
    
    // Find and click on the checkout date in the calendar
    await customerPage.locator(`.MuiPickersDay-root:text("${checkoutDay}"):not([disabled])`).first().click();
    
    // Check availability
    await customerPage.click('button:has-text("Check Available")');
    await expect(customerPage.locator('text=Rooms Available!')).toBeVisible();
    
    // Find and select the newly created room
    await customerPage.locator(`h2:has-text("${roomName}")`).first().locator('xpath=ancestor::div[contains(@class, "w-")]//*[contains(text(), "Select Room")]').click();
    
    // Book the room
    await customerPage.click('button:has-text("Book Now")');
    
    // Confirm booking in the shadcn/ui AlertDialog
    await customerPage.click('button:has-text("Confirm Booking")');
    
    // Verify booking confirmation in sonner toast
    await expect(customerPage.locator('text=Booking Confirmed!')).toBeVisible();
    
    // Close customer session
    await customerContext.close();
    
    // Step 3: Admin edits the room
    await page.reload();
    
    // Find the room and click manage
    await page.locator(`text=${roomName}`).first().locator('xpath=ancestor::div[contains(@class, "w-")]//*[contains(text(), "Manage Room")]').click();
    
    // Wait for the edit dialog to appear (shadcn/ui component)
    await expect(page.locator('.bg-bg-box text=Edit Room Details')).toBeVisible();
    
    // Edit room details
    const updatedRoomName = `${roomName} - Updated`;
    await page.fill('input[id="roomType"]', updatedRoomName);
    await page.fill('input[id="price"]', '249.99');
    
    // Save changes using the shadcn/ui AlertDialogAction button
    await page.click('button:has-text("Update Room")');
    
    // Verify success message in sonner toast
    await expect(page.locator('text=Room updated successfully')).toBeVisible();
    await expect(page.locator(`text=${updatedRoomName}`)).toBeVisible();
    
    // Step 4: Admin deletes the room
    // Find the updated room and click manage
    await page.locator(`text=${updatedRoomName}`).first().locator('xpath=ancestor::div[contains(@class, "w-")]//*[contains(text(), "Manage Room")]').click();
    
    // Wait for the edit dialog to appear
    await expect(page.locator('.bg-bg-box text=Edit Room Details')).toBeVisible();
    
    // Click delete button with trash icon
    await page.click('button:has-text("Delete Room"):has(.lucide-trash-2)');
    
    // Verify delete confirmation dialog appears with the warning text
    await expect(page.locator('text=Are you sure you want to delete this room? This action cannot be undone.')).toBeVisible();
    
    // Confirm deletion in the nested dialog
    await page.click('.bg-red-600:has-text("Delete Room")');
    
    // Verify success message in sonner toast
    await expect(page.locator('text=Room deleted successfully')).toBeVisible();
    await expect(page.locator(`text=${updatedRoomName}`)).not.toBeVisible();
  });
});