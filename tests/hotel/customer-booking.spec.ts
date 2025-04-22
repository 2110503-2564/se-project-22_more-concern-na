// tests/hotel/customer-booking.spec.ts
import { test, expect } from '@playwright/test';
import { loginAsCustomer } from '../helpers/auth-helpers';

test.describe('TC1: Customer Booking Functionality', () => {
  const hotelId = '644b1f1e1a1e1f1e1a1e1f3e';
  
  test.beforeEach(async ({ page }) => {
    await loginAsCustomer(page);
  });

  test('A1: Customer can select a booking date and room type', async ({ page }) => {
    // Navigate to a specific hotel page
    await page.goto(`/hotels/${hotelId}`);
    
    // Select check-in date using MUI DatePicker
    await page.locator('.MuiDatePicker-root').first().click({ force: true });
    await page.waitForSelector('.MuiPickersPopper-root');
    
    // Select a date that is at least 1 day in the future
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDay = tomorrow.getDate().toString();
    
    // Find and click on the tomorrow date in the calendar
    await page.locator(`.MuiPickersDay-root:text("${tomorrowDay}"):not([disabled])`).first().click();
    
    // Select check-out date
    await page.locator('.MuiDatePicker-root').nth(1).click({ force: true });
    await page.waitForSelector('.MuiPickersPopper-root');
    
    // Select a date that is 2 days in the future
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    const dayAfterTomorrowDay = dayAfterTomorrow.getDate().toString();
    
    // Find and click on the day after tomorrow date in the calendar
    await page.locator(`.MuiPickersDay-root:text("${dayAfterTomorrowDay}"):not([disabled])`).first().click();
    
    // Click "Check Available" button
    await page.click('button:has-text("Check Available")');
    
    // Wait for availability check
    await expect(page.locator('text=Rooms Available!')).toBeVisible();
    
    // Select a room
    await page.click('button:has-text("Select Room")');
    
    // Verify room was added to booking
    await expect(page.locator('text=Selected Rooms')).toBeVisible();
    
    // Click book now
    await page.click('button:has-text("Book Now")');
    
    // Confirm booking in the shadcn/ui AlertDialog
    await page.click('button:has-text("Confirm Booking")');
    
    // Verify success message in sonner toast
    await expect(page.locator('text=Booking Confirmed!')).toBeVisible();
  });

  test('A2: Customer can view and update their booking', async ({ page }) => {
    // Navigate to bookings page
    await page.goto('/bookings');
    
    // Find a booking and click to view details
    await page.click('.booking-card');
    
    // Verify booking details are displayed
    await expect(page.locator('.booking-details')).toBeVisible();
    
    // Click to update booking
    await page.click('button:has-text("Modify Booking")');
    
    // Change check-out date
    const newCheckoutDate = new Date();
    newCheckoutDate.setDate(newCheckoutDate.getDate() + 3);
    const newCheckoutFormatted = newCheckoutDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '');
    
    // Select the new date
    await page.click('input[id^="checkout-date"]');
    await page.click(`[aria-label*="${newCheckoutFormatted}"]`);
    
    // Save changes
    await page.click('button:has-text("Save Changes")');
    
    // Verify confirmation message
    await expect(page.locator('text=Booking updated successfully')).toBeVisible();
    
    // Verify updated checkout date appears in booking details
    const formattedDateForDisplay = newCheckoutDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    await expect(page.locator(`.booking-details:has-text("${formattedDateForDisplay}")`)).toBeVisible();
  });
});