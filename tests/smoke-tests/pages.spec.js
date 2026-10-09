import { test, expect } from '../../fixtures/base.fixture.js';

test.describe('Page lifecycle (smoke)', () => {
  test('TC0011 - a new page is created, titled and survives a reload', async ({ page, createdPage, docPage, workspace }) => {
    await page.reload();
    await expect(docPage.title).toHaveValue(createdPage.title);
    await expect(workspace.sidebarLink(createdPage.title)).toBeVisible();
  });
});
