import { test, expect } from '../../fixtures/base.fixture.js';

// Search by title and block text (UC-SRCH-001). Test cases and priorities: docs/test-cases-coverage-gaps.md.
// Each test types a unique token so results never depend on the rest of the account.
const token = () => `zq${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

test.describe('Search', () => {
  test('TC0113 - search finds a page by text inside its blocks', async ({ createdPage, editor, workspace }) => {
    const word = token();
    await editor.start();
    await editor.page.keyboard.type(`Body ${word} text`);
    await editor.expectSaved();
    await workspace.search(word);
    await expect(workspace.searchDialog.getByRole('link', { name: createdPage.title })).toBeVisible();
  });

  test('TC0114 - search is a case-insensitive substring match', async ({ createdPage, editor, workspace }) => {
    const word = token();
    await editor.start();
    await editor.page.keyboard.type(`Body ${word} text`);
    await editor.expectSaved();
    await workspace.search(word.slice(1, -1).toUpperCase());
    await expect(workspace.searchDialog.getByRole('link', { name: createdPage.title })).toBeVisible();
  });

  test('TC0115 - a title match is listed before a body-only match', async ({ createdPage, editor, workspace, docPage }) => {
    const word = token();
    await editor.start();
    await editor.page.keyboard.type(`Only in the body ${word}`);
    await editor.expectSaved();
    const titled = `${createdPage.title}-${word}`;
    await workspace.createPageFromSidebar();
    await docPage.setTitle(titled);
    await workspace.search(word);
    const links = workspace.searchDialog.getByRole('link');
    // Body matches arrive after title matches: wait until both pages are listed, then compare their order.
    await expect(links.filter({ hasText: titled })).toBeVisible();
    await expect(links.filter({ hasText: new RegExp(`^${createdPage.title}$`) })).toBeVisible();
    const order = await links.allInnerTexts();
    expect(order.indexOf(titled)).toBeGreaterThanOrEqual(0);
    expect(order.indexOf(titled)).toBeLessThan(order.indexOf(createdPage.title));
  });

  test('TC0116 - an archived page no longer appears in search', async ({ createdPage, editor, workspace, docPage }) => {
    const word = token();
    await editor.start();
    await editor.page.keyboard.type(`Body ${word}`);
    await editor.expectSaved();
    await workspace.search(word);
    await expect(workspace.searchDialog.getByRole('link', { name: createdPage.title })).toBeVisible();
    await editor.page.keyboard.press('Escape');
    await docPage.archiveConfirmed();
    await workspace.search(word);
    await expect(workspace.searchDialog.getByRole('link', { name: createdPage.title })).toHaveCount(0);
  });

  test('TC0117 - search finds text inside a table cell', async ({ createdPage, editor, workspace }) => {
    const word = token();
    await editor.start();
    await editor.pasteSynthetic({ html: `<table><tr><th>Head</th></tr><tr><td>Cell ${word}</td></tr></table>` });
    await editor.expectSaved();
    await workspace.search(word);
    await expect(workspace.searchDialog.getByRole('link', { name: createdPage.title })).toBeVisible();
  });
});
