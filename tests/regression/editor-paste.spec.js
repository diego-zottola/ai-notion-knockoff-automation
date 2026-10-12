import { test, expect } from '../../fixtures/base.fixture.js';
import { clipboardOf, fixtureText } from '../../utils/clipboard.js';

// Synthetic paste (DataTransfer + ClipboardEvent): deterministic, but NOT evidence that the native clipboard works.
// The native keyboard/Clipboard API tests live in editor-native.spec.js.
// Every test runs on its own `qa-auto-` page (createdPage) and the page is purged afterwards.

test.describe('Editor paste - HTML and plain text', () => {
  test('TC0028 - HTML plus text/plain imports once, with no duplicate content', async ({ createdPage, editor }) => {
    await editor.start();
    await editor.pasteSynthetic(clipboardOf('rich-page'));
    const texts = await editor.texts();
    expect(texts.filter((t) => t.startsWith('Title one QA'))).toHaveLength(1);
    expect(texts.filter((t) => t.includes('Document closing QA'))).toHaveLength(1);
    expect(texts.filter((t) => t.includes('First numbered'))).toHaveLength(1);
  });

  test('TC0029 - headings, styles, links, quote, lists and order are preserved', async ({ createdPage, editor }) => {
    await editor.start();
    await editor.pasteSynthetic(clipboardOf('rich-page'));
    const structure = (await editor.structure()).filter((b) => b.text);
    expect(structure.map((b) => [b.type, b.level ?? b.depth, b.text])).toEqual([
      ['heading', 1, 'Title one QA'],
      ['paragraph', 0, 'Paragraph with bold, italic, strike and a safe link.'],
      ['heading', 2, 'Title two QA'],
      ['paragraph', 0, 'Text with red colour and blue colour.'],
      ['heading', 3, 'Title three QA'],
      ['quote', 0, 'Test quote QA'],
      ['numberedListItem', 0, 'First numbered'],
      ['numberedListItem', 0, 'Second numbered'],
      ['bulletListItem', 0, 'Bullet one'],
      ['bulletListItem', 1, 'Bullet child'],
      ['bulletListItem', 2, 'Bullet grandchild'],
      ['bulletListItem', 0, 'Bullet two'],
      ['paragraph', 0, 'Document closing QA'],
    ]);
    const styles = await editor.inlineStyles('Paragraph with bold');
    expect(styles.bold).toEqual(['bold']);
    expect(styles.italic).toEqual(['italic']);
    expect(styles.strike).toEqual(['strike']);
    expect(styles.links).toEqual([['a safe link', 'https://example.com/doc']]);
    const colours = await editor.inlineStyles('Text with red colour');
    expect(colours.color.map(([text]) => text)).toEqual(['red colour', 'blue colour']);
  });
});

test.describe('Editor paste - plain-text Markdown', () => {
  for (const [tc, base] of [['TC0030', 'rich-page'], ['TC0031', 'tables'], ['TC0032', 'code-mermaid']]) {
    test(`${tc} - ${base}.md pasted as plain text becomes formatted blocks, not Markdown source`, async ({ createdPage, editor }) => {
      await editor.start();
      await editor.pasteSynthetic({ text: fixtureText(`${base}.md`) });
      const surface = await editor.surface.innerText();
      expect(surface).not.toMatch(/^#{1,3} /m);
      expect(surface).not.toContain('**');
      expect(surface).not.toContain('| ---');
      expect(surface).not.toContain('```');
      const types = (await editor.structure()).map((b) => b.type);
      if (base === 'rich-page') expect(types).toEqual(expect.arrayContaining(['heading', 'quote', 'numberedListItem', 'bulletListItem']));
      if (base === 'tables') expect(types).toContain('table');
      if (base === 'code-mermaid') expect(types).toContain('codeBlock');
    });
  }

  // Known defect DEF-01: kept as a failing test on purpose, never weakened.
  test('TC0033 - a ```mermaid fence in pasted Markdown text becomes a rendered diagram', async ({ createdPage, editor }, testInfo) => {
    testInfo.annotations.push({ type: 'defect', description: 'DEF-01: plain-text Markdown mermaid fence stays a code block (the HTML paste converts it)' });
    await editor.start();
    await editor.pasteSynthetic({ text: fixtureText('code-mermaid.md') });
    await expect(editor.diagram.locator('[role="img"] svg')).toBeVisible({ timeout: 20_000 });
  });

  test('TC0034 - ordinary text that only resembles Markdown stays ordinary text', async ({ createdPage, editor }) => {
    await editor.start();
    const plain = 'Total 3 * 4 = 12 and the price is $5 # not a title\nSecond line with snake_case and a*b';
    await editor.pasteSynthetic({ text: plain });
    const structure = await editor.structure();
    expect(structure.filter((b) => b.text).every((b) => b.type === 'paragraph')).toBe(true);
    expect(await editor.visibleTexts()).toEqual(plain.split('\n'));
  });
});

test.describe('Editor paste - position and selection', () => {
  const paste = { html: '<p>PASTED QA</p>', text: 'PASTED QA' };
  for (const [tc, where, expected] of [
    ['TC0035', 'start', ['PASTED QA', 'Hello world QA', 'Final QA']],
    ['TC0036', 'end', ['Hello world QA', 'PASTED QA', 'Final QA']],
    ['TC0037', 'offset', ['Hell', 'PASTED QA', 'o world QA', 'Final QA']],
  ]) {
    test(`${tc} - pasting at the ${where} of a paragraph keeps the text before and after, also after reload`, async ({ createdPage, editor }) => {
      await editor.start({ saved: ['Hello world QA', 'Final QA'] });
      await editor.caret('Hello world QA', where, 4);
      await editor.pasteSynthetic(paste);
      await expect.poll(() => editor.visibleTexts()).toEqual(expected);
      await editor.expectSaved();
      await editor.reloadAndWait();
      expect(await editor.visibleTexts()).toEqual(expected);
    });
  }

  test('TC0038 - pasting over selected text replaces only that text', async ({ createdPage, editor }) => {
    await editor.start({ saved: ['One REPLACE three', 'Final QA'] });
    await editor.selectRange('One REPLACE three', 4, 11);
    expect(await editor.selectedText()).toBe('REPLACE');
    await editor.pasteSynthetic({ html: '<p>NEW</p>', text: 'NEW' });
    const texts = await editor.visibleTexts();
    expect(texts.join('|')).toContain('NEW');
    expect(texts.join('|')).not.toContain('REPLACE');
    expect(texts).toContain('One');
    expect(texts).toContain('three');
    expect(texts.at(-1)).toBe('Final QA');
  });

  // Known defect DEF-02.
  test('TC0039 - a single-line fragment pasted over a word stays inside the same paragraph', async ({ createdPage, editor }, testInfo) => {
    testInfo.annotations.push({ type: 'defect', description: 'DEF-02: a one-paragraph HTML paste in the middle of a paragraph splits it into three blocks' });
    await editor.start({ saved: ['One REPLACE three', 'Final QA'] });
    await editor.selectRange('One REPLACE three', 4, 11);
    await editor.pasteSynthetic({ html: '<span>NEW</span>', text: 'NEW' });
    expect(await editor.visibleTexts()).toEqual(['One NEW three', 'Final QA']);
  });

  test('TC0040 - pasting over a selection spanning several blocks removes it and keeps the rest', async ({ createdPage, editor }) => {
    await editor.start({ saved: ['Before QA', 'Middle one QA', 'Middle two QA', 'After QA'] });
    await editor.selectAcross('Middle one QA', 'Middle two QA');
    await editor.pasteSynthetic({ html: '<p>SUBSTITUTE QA</p>', text: 'SUBSTITUTE QA' });
    const texts = await editor.visibleTexts();
    expect(texts).toContain('Before QA');
    expect(texts).toContain('SUBSTITUTE QA');
    expect(texts).toContain('After QA');
    expect(texts.join('|')).not.toContain('Middle');
    expect(texts.indexOf('Before QA')).toBeLessThan(texts.indexOf('SUBSTITUTE QA'));
    expect(texts.indexOf('SUBSTITUTE QA')).toBeLessThan(texts.indexOf('After QA'));
  });
});

test.describe('Editor paste - tables and nested lists', () => {
  test('TC0041 - a pasted table keeps header, empty cells, cell formatting and line breaks, with no Markdown', async ({ createdPage, editor }) => {
    await editor.start();
    await editor.pasteSynthetic(clipboardOf('tables'));
    const table = (await editor.structure()).find((b) => b.type === 'table');
    expect(table?.rows).toEqual([
      ['Key', 'Value', 'Note'],
      ['One', 'Two\nThree', ''],
      ['', 'Italic cell', 'Link cell'],
      ['End', '', 'Last'],
    ]);
    await expect(editor.surface.locator('table strong', { hasText: 'Two' })).toBeVisible();
    await expect(editor.surface.locator('table em', { hasText: 'Italic cell' })).toBeVisible();
    await expect(editor.surface.locator('table a[href="https://example.com/celda"], table a[href="https://example.com/cell"]')).toBeVisible();
    expect(await editor.surface.innerText()).not.toMatch(/\|\s*---|\*\*/);
    expect(await editor.texts()).toContain('Text after the table QA');
  });

  // One operation per fresh table: each control works on its own. Chaining operations is DEF-03 (TC0047).
  for (const [tc, control, expected] of [
    ['TC0042', 'Agregar fila', { rows: 5, cols: 3 }],
    ['TC0043', 'Agregar columna', { rows: 4, cols: 4 }],
    ['TC0044', 'Quitar última fila', { rows: 3, cols: 3 }],
    ['TC0045', 'Quitar última columna', { rows: 4, cols: 2 }],
  ]) {
    test(`${tc} - "${control}" changes the pasted table by exactly one row or column`, async ({ createdPage, editor }) => {
      await editor.start();
      await editor.pasteSynthetic(clipboardOf('tables'));
      await editor.surface.locator('td', { hasText: 'One' }).click();
      await editor.button(control).click();
      await expect.poll(() => editor.tableSize()).toEqual(expected);
    });
  }

  test('TC0046 - the header row can be switched off and on', async ({ createdPage, editor }) => {
    await editor.start();
    await editor.pasteSynthetic(clipboardOf('tables'));
    await editor.surface.locator('td', { hasText: 'One' }).click();
    const header = editor.button('Fila de encabezado');
    await expect(header).toHaveAttribute('aria-pressed', 'true');
    await expect(editor.surface.locator('table th')).not.toHaveCount(0);
    await header.click();
    await expect(header).toHaveAttribute('aria-pressed', 'false');
    await expect(editor.surface.locator('table th')).toHaveCount(0);
    await header.click();
    await expect(editor.surface.locator('table th')).not.toHaveCount(0);
  });

  // Known defect DEF-03.
  test('TC0047 - consecutive table operations apply to the CURRENT table, not to a stale one', async ({ createdPage, editor }, testInfo) => {
    testInfo.annotations.push({ type: 'defect', description: 'DEF-03: table controls act on a snapshot one operation behind' });
    await editor.start();
    await editor.pasteSynthetic(clipboardOf('tables'));
    await editor.surface.locator('td', { hasText: 'One' }).click();
    await editor.button('Agregar fila').click();
    await editor.button('Agregar fila').click();
    expect(await editor.tableSize()).toEqual({ rows: 6, cols: 3 });
    await editor.button('Quitar última columna').click();
    expect(await editor.tableSize()).toEqual({ rows: 6, cols: 2 });
  });

  test('TC0048 - after pasting an indented list you keep editing with formatting, no Markdown shown', async ({ createdPage, editor, page }) => {
    await editor.start();
    await editor.pasteSynthetic(clipboardOf('rich-page'));
    await editor.caret('Bullet grandchild', 'end');
    await page.keyboard.press('Enter');
    await page.keyboard.type('New child QA');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.type(' lower level');
    await editor.selectRange('New child QA lower level', 0, 3);
    await editor.format('Negrita');
    const created = (await editor.structure()).find((b) => b.text === 'New child QA lower level');
    expect(created).toMatchObject({ type: 'bulletListItem', depth: 1 });
    expect((await editor.inlineStyles('New child QA lower level')).bold).toEqual(['New']);
    expect(await editor.surface.innerText()).not.toContain('**');
  });
});

test.describe('Editor paste - code and Mermaid', () => {
  test('TC0049 - a pasted Mermaid block renders as a diagram and code stays code', async ({ createdPage, editor }) => {
    await editor.start();
    await editor.pasteSynthetic(clipboardOf('code-mermaid'));
    await expect(editor.diagram.locator('[role="img"] svg')).toBeVisible({ timeout: 20_000 });
    const blocks = await editor.structure();
    expect(blocks.find((b) => b.type === 'codeBlock')?.text).toContain('console.log(total);');
    expect(blocks.map((b) => b.text).filter(Boolean)[0]).toBe('Before the code QA');
    expect(blocks.at(-1)?.text).toBe('After the diagram QA');
  });

  test('TC0050 - an invalid Mermaid source shows a clear message and keeps its source editable', async ({ createdPage, editor, page }) => {
    await editor.start();
    await editor.pasteSynthetic({ html: fixtureText('mermaid-invalid.html') });
    await expect(editor.diagram.getByText('No se pudo dibujar el diagrama')).toBeVisible({ timeout: 20_000 });
    await page.getByRole('button', { name: 'Editar diagrama' }).click();
    const source = page.getByLabel('Código del diagrama');
    await expect(source).toContainText('this is not a valid diagram');
    await source.fill(fixtureText('mermaid-valid.mmd'));
    await editor.clickOutsideEditor();
    await expect(editor.diagram.locator('[role="img"] svg')).toBeVisible({ timeout: 20_000 });
  });
});

test.describe('Editor paste - unsafe and malformed content', () => {
  test('TC0051 - executable link schemes and scripts never reach the page', async ({ createdPage, editor, page }) => {
    await editor.start();
    await editor.pasteSynthetic({ html: fixtureText('edge/unsafe-links.html') });
    const hrefs = await editor.surface.locator('a').evaluateAll((links) => links.map((a) => a.getAttribute('href')));
    expect(hrefs.sort()).toEqual(['https://example.com/seguro', 'mailto:qa@example.test']);
    const texts = await editor.texts();
    for (const label of ['Javascript link QA', 'Data link QA', 'Vbscript link QA', 'File link QA']) expect(texts).toContain(label);
    expect(await page.evaluate(() => window.__xss)).toBeUndefined();
    await expect(editor.surface.locator('[onclick], script')).toHaveCount(0);
  });

  test('TC0052 - malformed HTML is repaired without crashing and keeps text and order', async ({ createdPage, editor }) => {
    await editor.start();
    await editor.pasteSynthetic({ html: fixtureText('edge/malformed.html') });
    expect(await editor.visibleTexts()).toEqual(['Open paragraph QA unclosed bold', 'Second paragraph QA', 'Unclosed item QA', 'Another item QA', 'Broken title QA']);
  });

  test('TC0053 - the link dialog rejects executable URLs and creates nothing', async ({ createdPage, editor, page }) => {
    await editor.start({ saved: ['Dangerous link QA'] });
    await editor.selectRange('Dangerous link QA', 0, 9);
    for (const url of ['javascript:alert(1)', 'data:text/html;base64,AAAA', 'vbscript:msgbox(1)']) {
      await editor.button('Enlace').click();
      await editor.linkInput.fill(url);
      await page.getByRole('button', { name: 'Aplicar enlace', exact: true }).click();
      await expect(page.getByRole('alert').filter({ hasText: 'enlace https, http o mailto válido' })).toBeVisible();
      await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
      await editor.selectRange('Dangerous link QA', 0, 9);
    }
    await expect(editor.surface.locator('a')).toHaveCount(0);
  });
});

test.describe('Editor - editing and toolbar', () => {
  test('TC0054 - clicking formatted text edits it in place and never shows Markdown source', async ({ createdPage, editor, page }) => {
    await editor.start();
    await editor.pasteSynthetic(clipboardOf('rich-page'));
    await editor.surface.locator('strong', { hasText: 'bold' }).click();
    await page.keyboard.type('XX');
    expect(await editor.surface.innerText()).not.toMatch(/\*\*|~~|\]\(|^#/m);
    const styles = await editor.inlineStyles('Paragraph with');
    expect(styles.bold.join('')).toContain('XX');
    expect(styles.links).toHaveLength(1);
  });

  test('TC0055 - the floating menu shows over a text selection (not on a plain caret) and hides on interaction outside the editor', async ({ createdPage, editor }) => {
    await editor.start({ saved: ['Toolbar QA'] });
    await editor.block('Toolbar QA').click();
    await expect(editor.toolbar).toHaveCount(0);
    await editor.selectBlockText('Toolbar QA');
    await editor.clickOutsideEditor();
    await expect(editor.toolbar).toHaveCount(0);
  });

  test('TC0056 - bold, italic, colours, headings and lists keep the text selection', async ({ createdPage, editor }) => {
    await editor.start({ saved: ['Alpha beta gamma QA'] });
    await editor.selectRange('Alpha beta gamma QA', 6, 10);
    for (const name of ['Negrita', 'Cursiva', 'Color red']) {
      await editor.format(name);
      expect(await editor.selectedText()).toBe('beta');
    }
    const styles = await editor.inlineStyles('Alpha beta gamma QA');
    expect(styles.bold).toEqual(['beta']);
    expect(styles.italic).toEqual(['beta']);
    expect(styles.color).toEqual([['beta', 'red']]);
    await editor.format('Título 2');
    expect((await editor.structure()).filter((b) => b.text)).toEqual([expect.objectContaining({ type: 'heading', level: 2, text: 'Alpha beta gamma QA' })]);
    await editor.format('Viñetas');
    expect((await editor.structure())[0]).toMatchObject({ type: 'bulletListItem' });
    await editor.format('Numeración');
    expect((await editor.structure())[0]).toMatchObject({ type: 'numberedListItem' });
  });
});

test.describe('Editor - undo and redo', () => {
  test('TC0057 - a large mixed paste is ONE undo step and one redo step', async ({ createdPage, editor }) => {
    await editor.start({ saved: ['Base QA'] });
    await editor.caret('Base QA', 'end');
    await editor.pasteSynthetic(clipboardOf('rich-page'));
    const pasted = await editor.visibleTexts();
    expect(pasted.length).toBeGreaterThan(10);
    await editor.undoLast();
    await expect.poll(() => editor.visibleTexts()).toEqual(['Base QA']);
    await editor.redoLast();
    await expect.poll(() => editor.visibleTexts()).toEqual(pasted);
  });
});
