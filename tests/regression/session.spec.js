import { test, expect } from '../../fixtures/base.fixture.js';

test.describe('Session', () => {
  test('TC0027 - logout returns to the login screen and protects workspace routes', async ({ page, workspace, loginPage }) => {
    await workspace.open();
    await workspace.logout.click();
    await expect(loginPage.submit).toBeVisible();
    await page.goto('/profile');
    await expect(loginPage.submit).toBeVisible();
  });
});
