import { test, expect } from '@playwright/test';

test.describe('Task Management Frontend - Exam Suite', () => {
  // In-memory mock tasks for route handlers
  let tasks: any[] = [];

  test.beforeEach(async ({ page }) => {
    // reset tasks before each test
    tasks = [];

    // Debug: forward page console to test output
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

    // Mock login endpoint to always succeed (match absolute and relative URLs)
    const fulfillLogin = (route: any) => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ access_token: 'fake-token' }),
    });
    await page.route('**/auth/login', fulfillLogin);
    await page.route('http://localhost:3000/auth/login', fulfillLogin);

    // Mock tasks endpoints with minimal in-memory behavior
    await page.route('**/tasks', async (route, request) => {
      if (request.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(tasks),
        });
      } else if (request.method() === 'POST') {
        const postData = request.postData() || '{}';
        const body = JSON.parse(postData);
        const newTask = {
          id: String(tasks.length + 1),
          title: body.title,
          status: 'open',
          priority: body.priority || 'normal',
          assignee: body.assignee || 'Me',
        };
        tasks.push(newTask);
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(newTask),
        });
      } else {
        await route.continue();
      }
    });
    // Also ensure absolute URL for tasks is mocked
    await page.route('http://localhost:3000/tasks', async (route, request) => {
      if (request.method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(tasks) });
      } else if (request.method() === 'POST') {
        const postData = request.postData() || '{}';
        const body = JSON.parse(postData);
        const newTask = { id: String(tasks.length + 1), title: body.title, status: 'open', priority: body.priority || 'normal', assignee: body.assignee || 'Me' };
        tasks.push(newTask);
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(newTask) });
      } else {
        await route.continue();
      }
    });
  });

  test('Authentication UI: Successful Login', async ({ page }) => {
    await page.goto('/');
    await page.locator('#username').fill('naieang');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.getByText('Project Workspace')).toBeVisible({ timeout: 10000 });
  });

  test('Error Handling: Invalid Login Message', async ({ page }) => {
    await page.goto('/');
    // click login without username to trigger client-side validation
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