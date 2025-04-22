import { test, expect } from '@playwright/test';

test.describe('TC1: Date Picker Component', () => {
  const hotelId = '644b1f1e1a1e1f1e1a1e1f3e';
  
  test('Should correctly select dates and enforce date constraints', async ({ page }) => {
    // Navigate to a hotel page where the date picker is used
    await page.goto(`/hotels/${hotelId}`);
    
    // Check that the check-out date picker is disabled before check-in date is selected
    const checkOutDatepicker = page.locator('.MuiDatePicker-root').nth(1);
    await expect(checkOutDatepicker).toBeDisabled();
    
    // Select check-in date
    await page.locator('.MuiDatePicker-root').first().click({ force: true });
    
    // Wait for the MUI date picker dialog to appear
    await page.waitForSelector('.MuiPickersPopper-root');
    
    // Select a date that is at least 1 day in the future
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Format date for MUI DatePicker selector
    // In MUI DatePicker, buttons typically have a format like "15" for the day
    // and we need to find it in the correct month
    const tomorrowDay = tomorrow.getDate().toString();
    
    // Select the day button that's not disabled
    const dayButton = page.locator(`.MuiPickersDay-root:text("${tomorrowDay}"):not([disabled])`).first();
    await dayButton.click();
    
    // Now check-out date picker should be enabled
    await expect(page.locator('.MuiDatePicker-root').nth(1)).toBeEnabled();
    
    // Select check-out date
    await page.locator('.MuiDatePicker-root').nth(1).click({ force: true });
    
    // Wait for the MUI date picker dialog to appear
    await page.waitForSelector('.MuiPickersPopper-root');
    
    // Select a valid check-out date (check-in date + 2 days)
    const validCheckout = new Date(tomorrow);
    validCheckout.setDate(validCheckout.getDate() + 2);
    const validCheckoutDay = validCheckout.getDate().toString();
    
    // Select the day for checkout
    await page.locator(`.MuiPickersDay-root:text("${validCheckoutDay}"):not([disabled])`).first().click();
    
    // Verify "Check Available" button is now enabled with both dates selected
    const checkAvailableButton = page.locator('button:has-text("Check Available")');
    await expect(checkAvailableButton).toBeEnabled();
    
    // Try to select a date more than 3 days after check-in (should be disabled)
    await page.locator('.MuiDatePicker-root').nth(1).click({ force: true });
    
    // Wait for the MUI date picker dialog to appear
    await page.waitForSelector('.MuiPickersPopper-root');
    
    const invalidCheckout = new Date(tomorrow);
    invalidCheckout.setDate(invalidCheckout.getDate() + 4); // This is 4 days after check-in, which exceeds the 3-day limit
    const invalidCheckoutDay = invalidCheckout.getDate().toString();
    
    // Find the day button for the invalid date - if it exists, it should be disabled
    const invalidDayButton = page.locator(`.MuiPickersDay-root:text("${invalidCheckoutDay}")`);
    if (await invalidDayButton.count() > 0) {
      await expect(invalidDayButton).toHaveAttribute('disabled', '');
    }
    
    // Close the date picker dialog by clicking outside
    await page.keyboard.press('Escape');
  });
  
  test('Should update available rooms when dates are changed', async ({ page }) => {
    // Navigate to hotel page
    await page.goto(`/hotels/${hotelId}`);
    
    // Select check-in date (tomorrow)
    await page.locator('.MuiDatePicker-root').first().click({ force: true });
    await page.waitForSelector('.MuiPickersPopper-root');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDay = tomorrow.getDate().toString();
    await page.locator(`.MuiPickersDay-root:text("${tomorrowDay}"):not([disabled])`).first().click();
    
    // Select check-out date (2 days after check-in)
    await page.locator('.MuiDatePicker-root').nth(1).click({ force: true });
    await page.waitForSelector('.MuiPickersPopper-root');
    
    const checkoutDate = new Date(tomorrow);
    checkoutDate.setDate(checkoutDate.getDate() + 2);
    const checkoutDay = checkoutDate.getDate().toString();
    await page.locator(`.MuiPickersDay-root:text("${checkoutDay}"):not([disabled])`).first().click();
    
    // Check availability
    await page.click('button:has-text("Check Available")');
    
    // Wait for availability check
    await expect(page.locator('text=Rooms Available!')).toBeVisible();
    
    // Change check-in date and verify availability is reset
    await page.locator('.MuiDatePicker-root').first().click({ force: true });
    await page.waitForSelector('.MuiPickersPopper-root');
    
    const newCheckin = new Date();
    newCheckin.setDate(newCheckin.getDate() + 2);
    const newCheckinDay = newCheckin.getDate().toString();
    await page.locator(`.MuiPickersDay-root:text("${newCheckinDay}"):not([disabled])`).first().click();
    
    // Verify the "Available ✓" button has changed back to "Check Available"
    const checkAvailableButton = page.locator('button:has-text("Check Available")');
    await expect(checkAvailableButton).toBeVisible();
    await expect(page.locator('button:has-text("Available ✓")')).not.toBeVisible();
  });
});