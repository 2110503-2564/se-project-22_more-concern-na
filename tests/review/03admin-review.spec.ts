import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "../helpers/auth-helpers";

test.describe("Admin Review Functionality", () => {
  const hotelId = "644b1f1e1a1e1f1e1a1e1f3e";
  const bookingId = "6807ae727f0c3ffa95790820";

  const reportReasons:any = [
    'Child Exploitation',
    'Bullying/Harassment',
    'Self-Harm/Suicide Content',
    'Violence/Graphic Content',
    'NSFW/Adult Content',
    'Spam/Unwanted Content',
    'Scam/Fraudulent Activity',
  ];

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("TC1: Admin can see all reported reviews", async ({ page }) => {
    await page.goto(`/admin/report`);
    await page.waitForTimeout(1000);
    
    await expect(page.getByText('Report Reason').first()).toBeVisible();

    await expect(page.getByText('Sawadee krub')).toBeVisible();
    await expect(page.getByText('one two three 4 5 I love you')).toBeVisible();

    // verify reported review to be visible
    const reviewCard = page.locator('.relative.bg-\\[\\#434A5B\\]')
    .filter({ hasText: 'Sawadee krub' })
    .filter({ hasText: 'one two three 4 5 I love you' });
    await expect(reviewCard).toHaveCount(1);
    const trashIcon = reviewCard.locator('.absolute.top-2.right-6 svg.lucide-trash').first();
    await expect(trashIcon).toBeVisible();

  });

  test("TC2: Admin can decide to delete reported reviews", async ({ page }) => {
    await page.goto(`/admin/report`);
    await page.waitForTimeout(1500);
    
    await expect(page.getByText('Report Reason').first()).toBeVisible();

    await expect(page.getByText('Sawadee krub')).toBeVisible();
    await expect(page.getByText('one two three 4 5 I love you')).toBeVisible();

    const reviewCard = page.locator('.relative.bg-\\[\\#434A5B\\]')
    .filter({ hasText: 'Sawadee krub' })
    .filter({ hasText: 'one two three 4 5 I love you' });
    await expect(reviewCard).toHaveCount(1);
    const trashIcon = reviewCard.locator('.absolute.top-2.right-6 svg.lucide-trash').first();
    await expect(trashIcon).toBeVisible();
    await trashIcon.click();

    const confirmDialog = page.getByText(
      'Are you sure you want to delete this? This action cannot be undone.',
    );
    await expect(confirmDialog).toBeVisible();
    
    await page.getByTestId('alert-confirm-button').click();

    await expect(confirmDialog).not.toBeVisible();
    await page.waitForTimeout(2000);

    await expect(page.getByText('Sawadee krub')).not.toBeVisible();
    await expect(page.getByText('one two three 4 5 I love you')).not.toBeVisible();

    await page.goto(`/manage/hotels/${hotelId}`);
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Next' }).first().click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    await expect(page.getByText('Sawadee krub')).not.toBeVisible();
    await expect(page.getByText('one two three 4 5 I love you')).not.toBeVisible();
  });
});