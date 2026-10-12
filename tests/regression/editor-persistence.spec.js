import { test, expect, VIEWER } from '../../fixtures/base.fixture.js';
import { clipboardOf, largeExpected } from '../../utils/clipboard.js';

// Save, reload and recovery. Save failures are simulated with client-side routes on the blocks endpoint, so the deployed
// backend is never put in a failing state. Every test runs on a purged `qa-auto-` page.

const failSaves = (route) => (['POST', 'PATCH'].includes(route.request().method()) ? route.abort('failed') : route.continue());
const BLOCKS = '**/rest/v1/blocks*';

test.describe('Editor persistence', () => {
  for (const [tc, base] of [['TC0076', 'rich-page'], ['TC0077', 'tables'], ['TC0078', 'code-mermaid']]) {
    test(`${tc} - ${base} pasted with HTML + text is saved and identical after reload`, async ({ createdPage, editor }) => {
      await editor.start();
      await editor.pasteSynthetic(clipboardOf(base));
      if (base === 'code-mermaid') await expect(editor.diagram.locator('[role="img"] svg')).toBeVisible({ timeout: 20_000 });
      await editor.expectSaved();
      const before = await editor.structure();
      await editor.reloadAndWait();
      if (base === 'code-mermaid') await expect(editor.diagram.locator('[role="img"] svg')).toBeVisible({ timeout: 20_000 });
      expect(await editor.structure()).toEqual(before);
      expect(await editor.surface.innerText()).not.toMatch(/\*\*|~~|\]\(|\|\s*---/);
    });
  }

  test('TC0079 - 90 blocks pasted between saved blocks keep their order after reload', async ({ createdPage, editor }) => {
    test.setTimeout(180_000);
    await editor.start({ saved: ['Start QA', 'Final QA'] });
    await editor.caret('Start QA', 'end');
    await editor.pasteSynthetic(clipboardOf('large-page'));
    await editor.expectSaved(90_000);
    const expected = ['Start QA', ...largeExpected(), 'Final QA'];
    expect(await editor.visibleTexts()).toEqual(expected);
    await editor.reloadAndWait();
    await expect.poll(() => editor.visibleTexts(), { timeout: 30_000 }).toEqual(expected);
  });

  // Known defect DEF-06 (seen on WebKit in the app repo; this project runs Chromium only, so it may not reproduce here).
  test('TC0080 - editing and navigating away immediately keeps the last edit, also when coming straight back', async ({ createdPage, editor, workspace, page }, testInfo) => {
    testInfo.annotations.push({ type: 'defect', description: 'DEF-06 (WebKit): returning to the page right away shows the stale text until reload, although the database has the edit' });
    await editor.start({ saved: ['Base text QA'] });
    const firstUrl = page.url();
    await workspace.sidebarNewPage.click();
    await page.waitForURL((url) => url.href !== firstUrl);
    // The URL changes before the new page renders: wait for its empty title so the rename does not hit the first page.
    await expect(editor.title).toHaveValue('');
    await editor.waitForEditor();
    await editor.setTitle(`${createdPage.title}-b`);
    await page.goto(firstUrl);
    await editor.waitForEditor();
    await editor.caret('Base text QA', 'end');
    await page.keyboard.type(' LAST EDIT');
    await expect(editor.saved).toHaveText(/Sin guardar|Guardando/);
    await workspace.sidebarLink(`${createdPage.title}-b`).click();
    await page.goBack();
    await editor.waitForEditor();
    await expect(editor.block('Base text QA')).toHaveText('Base text QA LAST EDIT');
  });

  test('TC0081 - the page icon can be changed and removed, and persists after reload', async ({ createdPage, editor, page }) => {
    await editor.waitForEditor();
    await editor.pageIcon.click();
    await page.getByRole('button', { name: 'Usar ícono 🛠️', exact: true }).click();
    await expect(editor.pageIcon).toHaveText('🛠️');
    await page.reload();
    await expect(editor.pageIcon).toHaveText('🛠️');
    await editor.pageIcon.click();
    await page.getByRole('button', { name: 'Sin ícono', exact: true }).click();
    await expect(editor.pageIcon).toHaveText('📄');
    await page.reload();
    await expect(editor.pageIcon).toHaveText('📄');
  });
});

test.describe('Editor save failures and recovery', () => {
  test('TC0082 - a failed save shows the notice, keeps the content and Reintentar recovers it', async ({ createdPage, editor, page }) => {
    await editor.start();
    await page.route(BLOCKS, failSaves);
    await editor.pasteSynthetic({ html: '<p>Do not lose this text QA</p>', text: 'Do not lose this text QA' });
    const alert = page.getByRole('alert').filter({ hasText: 'No se pudo guardar' });
    await expect(alert).toBeVisible({ timeout: 20_000 });
    await expect(alert).toContainText('Tu texto sigue en pantalla');
    await expect(editor.block('Do not lose this text QA')).toBeVisible();
    await page.unroute(BLOCKS, failSaves);
    await alert.getByRole('button', { name: 'Reintentar' }).click();
    await editor.expectSaved();
    await editor.reloadAndWait();
    expect(await editor.visibleTexts()).toEqual(['Do not lose this text QA']);
  });

  test('TC0083 - reloading while saves fail recovers the unsaved paste from the device draft', async ({ createdPage, editor, page }) => {
    await editor.start();
    await page.route(BLOCKS, failSaves);
    await editor.pasteSynthetic({ html: '<p>Draft one QA</p><p>Draft two QA</p>' });
    await expect(page.getByRole('alert').filter({ hasText: 'No se pudo guardar' })).toBeVisible({ timeout: 20_000 });
    await page.unroute(BLOCKS, failSaves);
    page.once('dialog', (dialog) => dialog.accept());
    await page.reload();
    await editor.waitForEditor();
    await expect(page.getByText('Recuperamos cambios sin guardar')).toBeVisible({ timeout: 20_000 });
    await editor.expectSaved();
    expect(await editor.visibleTexts()).toEqual(['Draft one QA', 'Draft two QA']);
  });
});

test.describe('Editor read-only access', () => {
  // Uses the QA viewer account: the owner shares its own qa-auto- page as "Puede ver" (see permissions.spec.js).
  test('TC0084 - a viewer sees no write controls and cannot change the page by keyboard or paste', async ({ createdPage, editor, docPage, viewerPage, page }) => {
    await editor.start();
    await page.keyboard.type('Read only QA');
    await editor.expectSaved();
    await docPage.shareWithUser(VIEWER.email, VIEWER.name);
    await viewerPage.goto(createdPage.url);
    await expect(viewerPage.getByText('Read only QA')).toBeVisible();
    await viewerPage.getByText('Read only QA').click();
    await viewerPage.keyboard.type('HACKED');
    await viewerPage.evaluate(() => {
      const target = document.querySelector('[data-editor="rich"] .ProseMirror');
      const clipboardData = new DataTransfer();
      clipboardData.setData('text/plain', 'PASTED');
      target?.dispatchEvent(new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true }));
    });
    await expect(viewerPage.getByText('Read only QA')).toBeVisible();
    await expect(viewerPage.getByText('HACKED')).toHaveCount(0);
    await expect(viewerPage.getByText('PASTED')).toHaveCount(0);
    // The owner's copy is untouched.
    await editor.reloadAndWait();
    expect(await editor.visibleTexts()).toEqual(['Read only QA']);
  });
});
