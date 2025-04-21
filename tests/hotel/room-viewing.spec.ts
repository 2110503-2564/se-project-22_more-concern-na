// tests/hotel/room-viewing.spec.ts
import { test, expect } from '@playwright/test';

test.describe('TC1: Guest Room Viewing Functionality', () => {
  const hotelId = '644b1f1e1a1e1f1e1a1e1f3e';
  
  test('A1: Guest can view room availability status', async ({ page }) => {
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
    
    // Wait for rooms to display with availability status
    await expect(page.locator('text=Rooms Available!')).toBeVisible();
    
    // Verify that rooms show availability status
    await expect(page.locator('.absolute:has-text("Available")').first()).toBeVisible();
    
    // Some rooms might show "Not Available" depending on inventory
    const notAvailableRooms = await page.locator('button:has-text("Not Available")').count();
    console.log(`Found ${notAvailableRooms} unavailable rooms`);
  });

  test('A2: Guest can view room details', async ({ page }) => {
    // Navigate to a specific hotel page
    await page.goto(`/hotels/${hotelId}`);
    
    // Find all room cards
    const roomCards = page.locator('.w-\\[70\\%\\]');
    
    // Check if room cards exist
    expect(await roomCards.count()).toBeGreaterThan(0);
    
    // For each room card, verify they display necessary information
    const roomCount = await roomCards.count();
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
      await expect(card.locator('button:has-text("Select Room")')).toBeVisible();
    }
  });
});