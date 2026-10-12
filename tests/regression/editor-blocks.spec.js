import { test, expect } from '../../fixtures/base.fixture.js';

// Block types and typing shortcuts of the rich editor (UC-BLK-001/002). Typed with the real keyboard.
// Test cases and priorities: docs/test-cases-coverage-gaps.md.
const SHORTCUTS = [
  ['TC0118', '- ', 'bulleted list', { type: 'bulletListItem' }],
  ['TC0119', '1. ', 'numbered list', { type: 'numberedListItem' }],
  ['TC0120', '[] ', 'to-do', { type: 'checkListItem' }],
  ['TC0121', '> ', 'quote', { type: 'quote' }],
  ['TC0122', '## ', 'heading 2', { type: 'heading', level: 2 }],
  ['TC0123', '### ', 'heading 3', { type: 'heading', level: 3 }],
];

test.describe('Editor - block types', () => {
  for (const [tc, shortcut, name, expected] of SHORTCUTS) {
    test(`${tc} - typing "${shortcut.trim()}" at the start of a line creates a ${name} that persists`, async ({ createdPage, editor, page }) => {
      await editor.start();
      await page.keyboard.type(`${shortcut}Item QA`);
      await expect.poll(async () => (await editor.structure())[0]).toMatchObject({ ...expected, text: 'Item QA' });
      await editor.expectSaved();
      await editor.reloadAndWait();
      expect((await editor.structure())[0]).toMatchObject({ ...expected, text: 'Item QA' });
    });
  }

  test('TC0124 - three backticks create a code block that keeps its text after reload', async ({ createdPage, editor, page }) => {
    await editor.start();
    await page.keyboard.type('``` ');
    await page.keyboard.type('const answer = 42');
    await expect.poll(async () => (await editor.structure())[0]).toMatchObject({ type: 'codeBlock', text: 'const answer = 42' });
    await editor.expectSaved();
    await editor.reloadAndWait();
    expect((await editor.structure())[0]).toMatchObject({ type: 'codeBlock', text: 'const answer = 42' });
  });

  test('TC0125 - three dashes and Enter create a divider and the next text goes below it', async ({ createdPage, editor, page }) => {
    await editor.start();
    await page.keyboard.type('Above QA');
    await page.keyboard.press('Enter');
    await page.keyboard.type('---');
    await page.keyboard.press('Enter');
    await page.keyboard.type('Below QA');
    await expect.poll(async () => (await editor.structure()).map((b) => b.type)).toEqual(['paragraph', 'divider', 'paragraph']);
    expect(await editor.visibleTexts()).toEqual(['Above QA', 'Below QA']);
  });

  test('TC0126 - a to-do can be checked and stays checked after reload', async ({ createdPage, editor, page }) => {
    await editor.start();
    await page.keyboard.type('[] Pay QA');
    const box = editor.surface.locator('input[type=checkbox]');
    await box.check();
    await expect(box).toBeChecked();
    await editor.expectSaved();
    await editor.reloadAndWait();
    await expect(box).toBeChecked();
  });

  test('TC0127 - Tab nests list items up to three levels and Shift+Tab lifts them', async ({ createdPage, editor, page }) => {
    await editor.start();
    await page.keyboard.type('- Level one');
    for (const label of ['Level two', 'Level three']) {
      await page.keyboard.press('Enter');
      await page.keyboard.press('Tab');
      await page.keyboard.type(label);
    }
    await expect.poll(async () => (await editor.structure()).map((b) => b.depth)).toEqual([0, 1, 2]);
    await page.keyboard.press('Shift+Tab');
    await expect.poll(async () => (await editor.structure()).map((b) => b.depth)).toEqual([0, 1, 1]);
    await editor.expectSaved();
    await editor.reloadAndWait();
    expect((await editor.structure()).map((b) => b.depth)).toEqual([0, 1, 1]);
  });

  test('TC0128 - Enter in the middle of a paragraph splits it into two blocks', async ({ createdPage, editor, page }) => {
    await editor.start({ saved: ['Alpha Beta QA'] });
    await editor.caret('Alpha Beta QA', 'offset', 6);
    await page.keyboard.press('Enter');
    await expect.poll(() => editor.visibleTexts()).toEqual(['Alpha ', 'Beta QA'].map((t) => t.trim()));
  });

  test('TC0129 - Ctrl/Cmd+A selects the content of the whole page, not the browser page', async ({ createdPage, editor, page }) => {
    await editor.start({ saved: ['First QA', 'Second QA', 'Third QA'] });
    await editor.caret('Second QA', 'end');
    await page.keyboard.press('ControlOrMeta+a');
    const selected = await editor.selectedText();
    for (const text of ['First QA', 'Second QA', 'Third QA']) expect(selected).toContain(text);
    expect(selected).not.toContain('Compartir');
  });
});
