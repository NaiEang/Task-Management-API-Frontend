import { test, expect } from '@playwright/test';

test.describe('Task Management Frontend - Exam Suite', () => {

  test('Authentication UI: Successful Login', async ({ page }) => {
    await page.goto('/');
    await page.locator('#username').fill('naieang');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText('Project Workspace')).toBeVisible({ timeout: 10000 });
  });

  test('Error Handling: Invalid Login Message', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /login/i }).click();
    const errorBox = page.locator('#error-msg');
    await expect(errorBox).toBeVisible();
    await expect(errorBox).toContainText('required');
  });

  test('CRUD UI: Create Task and Verify Visibility', async ({ page }) => {
    await page.goto('/');
    await page.locator('#username').fill('naieang');
    await page.getByRole('button', { name: /login/i }).click();

    await page.waitForSelector('h1');

    const testTask = 'Automated Exam Task';
    await page.locator('#task-input').fill(testTask);
    await page.getByRole('button', { name: /add/i }).click();

    const taskItem = page.locator('.task-item').last();
    await expect(taskItem).toContainText(testTask);
  });

  test('Edge Case: Prevent Empty Task Creation', async ({ page }) => {
    await page.goto('/');
    await page.locator('#username').fill('naieang');
    await page.getByRole('button', { name: /login/i }).click();

    await page.waitForSelector('h1');
    
    await page.waitForTimeout(500);

    const countBefore = await page.locator('.task-item').count();
    await page.getByRole('button', { name: /add/i }).click();
    
    const countAfter = await page.locator('.task-item').count();
    expect(countBefore).toBe(countAfter);
  });
});