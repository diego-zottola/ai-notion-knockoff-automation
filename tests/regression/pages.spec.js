import { test, expect } from '../../fixtures/base.fixture.js';

test.describe('Pages', () => {
  test('TC0012 - block text typed with # shortcut becomes a heading block and persists', async ({ page, createdPage, editor }) => {
    const heading = () => editor.structure().then((blocks) => blocks.find((b) => b.type === 'heading'));
    await editor.start();
    await page.keyboard.type('# Hola QA');
    await expect.poll(heading).toMatchObject({ level: 1, text: 'Hola QA' });
    await editor.expectSaved();
    await editor.reloadAndWait();
    await expect.poll(heading).toMatchObject({ level: 1, text: 'Hola QA' });
  });

  test('TC0013 - a page can be found through search by its title', async ({ createdPage, workspace }) => {
    await workspace.search(createdPage.title);
    await expect(workspace.searchDialog.getByRole('link', { name: createdPage.title })).toBeVisible();
  });

  test('TC0014 - search with no matches shows no result links', async ({ workspace }) => {
    await workspace.open();
    await workspace.search(`qa-auto-no-such-page-${Date.now()}`);
    await expect(workspace.searchDialog.getByRole('link')).toHaveCount(0);
  });

  test('TC0015 - a subpage is nested under its parent in the sidebar', async ({ page, createdPage, workspace }) => {
    await workspace.pageTree.getByRole('button', { name: `Agregar subpágina en ${createdPage.title}` }).click();
    await page.waitForURL(/\/p\//);
    await expect(workspace.pageTree.getByRole('button', { name: `Contraer ${createdPage.title}` })).toBeVisible();
  });

  test('TC0016 - cancelling the archive dialog keeps the page', async ({ createdPage, docPage, workspace }) => {
    await docPage.archive.click();
    await docPage.confirmDialog.getByRole('button', { name: 'Cancelar' }).click();
    await expect(docPage.confirmDialog).toBeHidden();
    await expect(workspace.sidebarLink(createdPage.title)).toBeVisible();
  });

  test('TC0017 - archived page leaves the tree, appears in trash and can be restored', async ({ createdPage, docPage, workspace, trashPage }) => {
    await docPage.archiveConfirmed();
    await expect(workspace.sidebarLink(createdPage.title)).toHaveCount(0);
    await workspace.goTo('Papelera');
    await expect(trashPage.item(createdPage.title)).toBeVisible();
    await trashPage.restore(createdPage.title);
    await expect(trashPage.item(createdPage.title)).toHaveCount(0);
    await expect(workspace.sidebarLink(createdPage.title)).toBeVisible();
  });

  test('TC0018 - deleting from trash removes the page for good', async ({ createdPage, docPage, workspace, trashPage }) => {
    await docPage.archiveConfirmed();
    await workspace.goTo('Papelera');
    await trashPage.deleteForever(createdPage.title);
    await expect(trashPage.item(createdPage.title)).toHaveCount(0);
    await workspace.search(createdPage.title);
    await expect(workspace.searchDialog.getByRole('link')).toHaveCount(0);
  });
});
