import { test, expect } from '../../fixtures/base.fixture.js';

test.describe('Authentication', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('TC0001 - login screen offers password and Google sign-in', async ({ loginPage }) => {
    await loginPage.open();
    await expect(loginPage.welcome).toBeVisible();
    await expect(loginPage.username).toBeVisible();
    await expect(loginPage.password).toBeVisible();
    await expect(loginPage.submit).toBeVisible();
    await expect(loginPage.googleButton).toBeVisible();
  });

  test('TC0002 - invalid credentials are rejected and the user stays on login', async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.login('qa-invalid-user', 'not-a-real-password');
    await expect(loginPage.submit).toBeVisible();
    await expect(page).not.toHaveURL(/\/w\//);
  });

  test('TC0003 - valid credentials land in the personal workspace', async ({ page, loginPage, workspace }) => {
    await loginPage.open();
    await loginPage.login(process.env.TEST_USER_USERNAME, process.env.TEST_USER_PASSWORD);
    await page.waitForURL(/\/w\//);
    await expect(workspace.switcher).toContainText('Propietario');
  });

  test('TC0004 - unauthenticated access to a workspace route does not expose the app', async ({ page, loginPage }) => {
    await page.goto('/settings');
    await expect(loginPage.submit).toBeVisible();
  });
});
