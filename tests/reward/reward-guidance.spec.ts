// tests/reward/reward-guidance.spec.ts
import { expect, test } from '@playwright/test';
import { loginAsCustomer } from '../helpers/auth-helpers';

test.describe('Reward Guidance Functionality', () => {
  test('TC1: Customer can view reward information', async ({ page }) => {
    await loginAsCustomer(page);
    
    // Navigate to reward info page
    await page.goto('/reward');
    
    // Verify reward information is displayed based on Figma design
    await expect(page.getByRole('heading', { name: 'Reward Information' })).toBeVisible();
    await expect(page.getByText('Shop, stay, get rewarded using benefits')).toBeVisible();
    
    // Check for "How Our Rewards Program Works" section
    await expect(page.getByRole('heading', { name: 'How Our Rewards Program Works' })).toBeVisible();
    
    // Check for the 3 steps as seen in the Figma design
    await expect(page.getByText('1. Book & Earn')).toBeVisible();
    await expect(page.getByText('2. Collect Benefits')).toBeVisible();
    await expect(page.getByText('3. Redeem Rewards')).toBeVisible();
    
    // Check for coupon and gift sections
    await expect(page.getByRole('heading', { name: 'Coupons' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Gift' })).toBeVisible();
  });

  test('TC2: Customer can navigate to redeemables from reward page', async ({ page }) => {
    await loginAsCustomer(page);
    
    // Navigate to reward info page
    await page.goto('/reward');
    
    // Find and click "view all coupons" link
    await page.getByText('View all coupons').click();
    
    // Verify we're now on the redeemables page
    await expect(page).toHaveURL('/reward/redeemables');
    
    // Check that we're viewing the coupons section
    await expect(page.getByRole('heading', { name: 'Coupons' })).toBeVisible();
  });

  test('TC3: Guest can view reward information', async ({ page }) => {
    // Navigate to reward info page
    await page.goto('/reward');
    
    // Verify reward information is displayed based on Figma design
    await expect(page.getByRole('heading', { name: 'Reward Information' })).toBeVisible();
    await expect(page.getByText('Shop, stay, get rewarded using benefits')).toBeVisible();
    
    // Check for "How Our Rewards Program Works" section
    await expect(page.getByRole('heading', { name: 'How Our Rewards Program Works' })).toBeVisible();
    
    // Check for the 3 steps as seen in the Figma design
    await expect(page.getByText('1. Book & Earn')).toBeVisible();
    await expect(page.getByText('2. Collect Benefits')).toBeVisible();
    await expect(page.getByText('3. Redeem Rewards')).toBeVisible();
    
    // Check for coupon and gift sections
    await expect(page.getByRole('heading', { name: 'Coupons' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Gift' })).toBeVisible();
  });

  test('TC4: Guest can navigate to redeemables from reward page', async ({ page }) => {
    // Navigate to reward info page
    await page.goto('/reward');
    
    // Find and click "view all coupons" link
    await page.getByText('View all coupons').click();
    
    // Verify we're now on the redeemables page
    await expect(page).toHaveURL('/reward/redeemables');
    
    // Check that we're viewing the coupons section
    await expect(page.getByRole('heading', { name: 'Coupons' })).toBeVisible();
  });
});