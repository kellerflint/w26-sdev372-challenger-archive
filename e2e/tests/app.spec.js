import { test, expect } from '@playwright/test';

// Home page
test.describe('Home page', () => {
  test('shows the page title and description', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /challenger archive/i })).toBeVisible();
    await expect(page.getByText(/Where MMA and Pool Meet./i)).toBeVisible();
  });

  test('header navigation links are present', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /home/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /mma leaderboard/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /pool leaderboard/i })).toBeVisible();
  });
});

// Navigation
test.describe('Navigation', () => {
  test('navigates to MMA form page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /mma form/i }).click();
    await expect(page).toHaveURL(/\/mmaform/);
    await expect(page.getByRole('heading', { name: /mma form/i })).toBeVisible();
  });

  test('navigates to Pool form page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /pool form/i }).click();
    await expect(page).toHaveURL(/\/poolform/);
  });
});

// MMA Form page
test.describe('MMA Form page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mmaform');
  });

  test('renders Fighter One and Fighter Two sections', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /fighter one/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /fighter two/i })).toBeVisible();
  });

  test('renders the date, location, and submit button', async ({ page }) => {
    await expect(page.locator('input[type="datetime-local"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Location"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /submit/i })).toBeVisible();
  });

  test('renders name inputs for both fighters', async ({ page }) => {
    const nameInputs = page.locator('input[placeholder="Name"]');
    await expect(nameInputs).toHaveCount(2);
  });
});
