import { test, expect } from '../../fixtures/base.fixture.js';

// Page hierarchy, ordering, breadcrumbs, and trash with sub-pages (UC-HIER, UC-ORD, UC-NAV, UC-ARCH, UC-REST, UC-DEL).
// Test cases and priorities: docs/test-cases-coverage-gaps.md. Every page is a sub-page of the `createdPage` (or a sibling of
// it) and is purged by title prefix in teardown.
test.describe('Pages - organization', () => {
  test('TC0104 - "Mover a…" moves a page under another and the breadcrumb shows the new parent', async ({ createdPage, workspace, docPage, page }) => {
    const sibling = `${createdPage.title}-b`;
    await workspace.createPageFromSidebar();
    await docPage.setTitle(sibling);
    await workspace.movePage(sibling, createdPage.title);
    await page.goto(page.url());
    await expect(docPage.breadcrumb).toContainText(createdPage.title);
    await expect(docPage.breadcrumb).toContainText(sibling);
  });

  test('TC0105 - a sub-page can be moved back to the workspace root', async ({ createdPage, workspace, docPage }) => {
    const child = `${createdPage.title}-c`;
    await workspace.createSubpage(createdPage.title, child, docPage);
    await workspace.movePage(child, 'root');
    await expect(docPage.breadcrumb.getByRole('link')).toHaveCount(0);
    await expect(workspace.sidebarLink(child)).toBeVisible();
  });

  test('TC0106 - the move dialog never offers the page itself or its sub-pages as a destination', async ({ createdPage, workspace, docPage, page }) => {
    const child = `${createdPage.title}-c`;
    await workspace.createSubpage(createdPage.title, child, docPage);
    await workspace.rowAction(createdPage.title, 'Mover a…');
    const dialog = page.getByRole('dialog', { name: 'Mover página' });
    await expect(dialog.getByRole('option').first()).toBeVisible();
    await expect(dialog.getByRole('option', { name: new RegExp(`${createdPage.title}(-c)?$`) })).toHaveCount(0);
  });

  test('TC0107 - "Mover" stays disabled until a destination is chosen', async ({ createdPage, workspace, docPage, page }) => {
    const other = `${createdPage.title}-b`;
    await workspace.createPageFromSidebar();
    await docPage.setTitle(other);
    await workspace.rowAction(other, 'Mover a…');
    const dialog = page.getByRole('dialog', { name: 'Mover página' });
    await expect(dialog.getByRole('button', { name: 'Mover', exact: true })).toBeDisabled();
    await dialog.getByRole('option', { name: new RegExp(`${createdPage.title}$`) }).click();
    await expect(dialog.getByRole('button', { name: 'Mover', exact: true })).toBeEnabled();
  });

  test('TC0108 - "Bajar" and "Subir" reorder siblings and the order persists after reload', async ({ createdPage, workspace, docPage, page }) => {
    const first = `${createdPage.title}-1`;
    const second = `${createdPage.title}-2`;
    await workspace.createSubpage(createdPage.title, first, docPage);
    await workspace.sidebarLink(createdPage.title).click();
    await workspace.createSubpage(createdPage.title, second, docPage);
    const order = async () => (await workspace.pageTree.getByRole('link', { name: new RegExp(`^${createdPage.title}-[12]$`) }).allInnerTexts());
    await expect.poll(order).toEqual([first, second]);
    await workspace.rowAction(first, 'Bajar');
    await expect.poll(order).toEqual([second, first]);
    await page.reload();
    await expect.poll(order).toEqual([second, first]);
    await workspace.rowAction(first, 'Subir');
    await expect.poll(order).toEqual([first, second]);
  });

  test('TC0109 - the breadcrumb lists the ancestors and an ancestor link navigates to it', async ({ createdPage, workspace, docPage, page }) => {
    const child = `${createdPage.title}-c`;
    await workspace.createSubpage(createdPage.title, child, docPage);
    await expect(docPage.breadcrumb).toContainText(`${createdPage.title}`);
    await docPage.breadcrumb.getByRole('link', { name: createdPage.title }).click();
    await expect(docPage.title).toHaveValue(createdPage.title);
  });

  test('TC0110 - the page tree shows a new sub-page under its parent without reloading', async ({ createdPage, workspace, docPage }) => {
    const child = `${createdPage.title}-c`;
    await workspace.createSubpage(createdPage.title, child, docPage);
    await expect(workspace.sidebarLink(child)).toBeVisible();
    await expect(workspace.sidebarLink(createdPage.title)).toBeVisible();
  });

  test('TC0111 - archiving a parent archives its sub-pages and restoring brings them back', async ({ createdPage, workspace, docPage, trashPage, page }) => {
    const child = `${createdPage.title}-c`;
    await workspace.createSubpage(createdPage.title, child, docPage);
    await workspace.sidebarLink(createdPage.title).click();
    await docPage.archiveConfirmed();
    await expect(workspace.sidebarLink(child)).toHaveCount(0);
    await workspace.goTo('Papelera');
    await expect(trashPage.item(createdPage.title)).toBeVisible();
    await trashPage.restore(createdPage.title);
    await expect(trashPage.item(createdPage.title)).toHaveCount(0);
    await expect(workspace.sidebarLink(createdPage.title)).toBeVisible();
    await expect(workspace.sidebarLink(child)).toBeVisible();
  });

  test('TC0112 - deleting a parent forever from the trash removes its sub-pages too', async ({ createdPage, workspace, docPage, trashPage, page }) => {
    const child = `${createdPage.title}-c`;
    await workspace.createSubpage(createdPage.title, child, docPage);
    await workspace.sidebarLink(createdPage.title).click();
    await docPage.archiveConfirmed();
    await workspace.goTo('Papelera');
    await trashPage.deleteForever(createdPage.title);
    await expect(trashPage.item(createdPage.title)).toHaveCount(0);
    await workspace.search(child);
    await expect(workspace.searchDialog.getByRole('link', { name: child })).toHaveCount(0);
  });
});
