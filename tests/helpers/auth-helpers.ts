// tests/helpers/auth-helpers.ts
import { Page } from '@playwright/test';

export async function loginAsCustomer(page: Page) {
  await page.goto('/api/auth/login');
  await page.fill('input[id="email"]', 'prem@user.com');
  await page.fill('input[id="password"]', 'premprem');
  await page.click('button[type="submit"]');
  // Wait for navigation after login
  await page.waitForURL('/*');
}

export async function loginAsAdmin(page: Page) {
  await page.goto('/api/auth/login');
  await page.fill('input[id="email"]', 'prem@hotel.com');
  await page.fill('input[id="password"]', 'premprem');
  await page.click('button[type="submit"]');
  // Wait for navigation after login
  await page.waitForURL('/*');
}

export async function loginAsHotelManager(page: Page) {
  await page.goto('/api/auth/login');
  await page.fill('input[id="email"]', 'prem@gmail.com');
  await page.fill('input[id="password"]', 'premprem');
  await page.click('button[type="submit"]');
  // Wait for navigation after login
  await page.waitForURL('/*');
}