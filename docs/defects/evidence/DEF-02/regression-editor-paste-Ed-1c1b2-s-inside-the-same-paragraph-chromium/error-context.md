# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regression/editor-paste.spec.js >> Editor paste - position and selection >> TC0039 - a single-line fragment pasted over a word stays inside the same paragraph
- Location: tests/regression/editor-paste.spec.js:114:3

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

  Array [
-   "One NEW three",
+   "One",
+   "NEW",
+   "three",
    "Final QA",
  ]
```

# Page snapshot

```yaml
- generic [ref=f3e3]:
  - region "Notifications alt+T"
```

# Test source

```ts
  19  |     await editor.start();
  20  |     await editor.pasteSynthetic(clipboardOf('rich-page'));
  21  |     const structure = (await editor.structure()).filter((b) => b.text);
  22  |     expect(structure.map((b) => [b.type, b.level ?? b.depth, b.text])).toEqual([
  23  |       ['heading', 1, 'Title one QA'],
  24  |       ['paragraph', 0, 'Paragraph with bold, italic, strike and a safe link.'],
  25  |       ['heading', 2, 'Title two QA'],
  26  |       ['paragraph', 0, 'Text with red colour and blue colour.'],
  27  |       ['heading', 3, 'Title three QA'],
  28  |       ['quote', 0, 'Test quote QA'],
  29  |       ['numberedListItem', 0, 'First numbered'],
  30  |       ['numberedListItem', 0, 'Second numbered'],
  31  |       ['bulletListItem', 0, 'Bullet one'],
  32  |       ['bulletListItem', 1, 'Bullet child'],
  33  |       ['bulletListItem', 2, 'Bullet grandchild'],
  34  |       ['bulletListItem', 0, 'Bullet two'],
  35  |       ['paragraph', 0, 'Document closing QA'],
  36  |     ]);
  37  |     const styles = await editor.inlineStyles('Paragraph with bold');
  38  |     expect(styles.bold).toEqual(['bold']);
  39  |     expect(styles.italic).toEqual(['italic']);
  40  |     expect(styles.strike).toEqual(['strike']);
  41  |     expect(styles.links).toEqual([['a safe link', 'https://example.com/doc']]);
  42  |     const colours = await editor.inlineStyles('Text with red colour');
  43  |     expect(colours.color.map(([text]) => text)).toEqual(['red colour', 'blue colour']);
  44  |   });
  45  | });
  46  | 
  47  | test.describe('Editor paste - plain-text Markdown', () => {
  48  |   for (const [tc, base] of [['TC0030', 'rich-page'], ['TC0031', 'tables'], ['TC0032', 'code-mermaid']]) {
  49  |     test(`${tc} - ${base}.md pasted as plain text becomes formatted blocks, not Markdown source`, async ({ createdPage, editor }) => {
  50  |       await editor.start();
  51  |       await editor.pasteSynthetic({ text: fixtureText(`${base}.md`) });
  52  |       const surface = await editor.surface.innerText();
  53  |       expect(surface).not.toMatch(/^#{1,3} /m);
  54  |       expect(surface).not.toContain('**');
  55  |       expect(surface).not.toContain('| ---');
  56  |       expect(surface).not.toContain('```');
  57  |       const types = (await editor.structure()).map((b) => b.type);
  58  |       if (base === 'rich-page') expect(types).toEqual(expect.arrayContaining(['heading', 'quote', 'numberedListItem', 'bulletListItem']));
  59  |       if (base === 'tables') expect(types).toContain('table');
  60  |       if (base === 'code-mermaid') expect(types).toContain('codeBlock');
  61  |     });
  62  |   }
  63  | 
  64  |   // Known defect DEF-01: kept as a failing test on purpose, never weakened.
  65  |   test('TC0033 - a ```mermaid fence in pasted Markdown text becomes a rendered diagram', async ({ createdPage, editor }, testInfo) => {
  66  |     testInfo.annotations.push({ type: 'defect', description: 'DEF-01: plain-text Markdown mermaid fence stays a code block (the HTML paste converts it)' });
  67  |     await editor.start();
  68  |     await editor.pasteSynthetic({ text: fixtureText('code-mermaid.md') });
  69  |     await expect(editor.diagram.locator('[role="img"] svg')).toBeVisible({ timeout: 20_000 });
  70  |   });
  71  | 
  72  |   test('TC0034 - ordinary text that only resembles Markdown stays ordinary text', async ({ createdPage, editor }) => {
  73  |     await editor.start();
  74  |     const plain = 'Total 3 * 4 = 12 and the price is $5 # not a title\nSecond line with snake_case and a*b';
  75  |     await editor.pasteSynthetic({ text: plain });
  76  |     const structure = await editor.structure();
  77  |     expect(structure.filter((b) => b.text).every((b) => b.type === 'paragraph')).toBe(true);
  78  |     expect(await editor.visibleTexts()).toEqual(plain.split('\n'));
  79  |   });
  80  | });
  81  | 
  82  | test.describe('Editor paste - position and selection', () => {
  83  |   const paste = { html: '<p>PASTED QA</p>', text: 'PASTED QA' };
  84  |   for (const [tc, where, expected] of [
  85  |     ['TC0035', 'start', ['PASTED QA', 'Hello world QA', 'Final QA']],
  86  |     ['TC0036', 'end', ['Hello world QA', 'PASTED QA', 'Final QA']],
  87  |     ['TC0037', 'offset', ['Hell', 'PASTED QA', 'o world QA', 'Final QA']],
  88  |   ]) {
  89  |     test(`${tc} - pasting at the ${where} of a paragraph keeps the text before and after, also after reload`, async ({ createdPage, editor }) => {
  90  |       await editor.start({ saved: ['Hello world QA', 'Final QA'] });
  91  |       await editor.caret('Hello world QA', where, 4);
  92  |       await editor.pasteSynthetic(paste);
  93  |       await expect.poll(() => editor.visibleTexts()).toEqual(expected);
  94  |       await editor.expectSaved();
  95  |       await editor.reloadAndWait();
  96  |       expect(await editor.visibleTexts()).toEqual(expected);
  97  |     });
  98  |   }
  99  | 
  100 |   test('TC0038 - pasting over selected text replaces only that text', async ({ createdPage, editor }) => {
  101 |     await editor.start({ saved: ['One REPLACE three', 'Final QA'] });
  102 |     await editor.selectRange('One REPLACE three', 4, 11);
  103 |     expect(await editor.selectedText()).toBe('REPLACE');
  104 |     await editor.pasteSynthetic({ html: '<p>NEW</p>', text: 'NEW' });
  105 |     const texts = await editor.visibleTexts();
  106 |     expect(texts.join('|')).toContain('NEW');
  107 |     expect(texts.join('|')).not.toContain('REPLACE');
  108 |     expect(texts).toContain('One');
  109 |     expect(texts).toContain('three');
  110 |     expect(texts.at(-1)).toBe('Final QA');
  111 |   });
  112 | 
  113 |   // Known defect DEF-02.
  114 |   test('TC0039 - a single-line fragment pasted over a word stays inside the same paragraph', async ({ createdPage, editor }, testInfo) => {
  115 |     testInfo.annotations.push({ type: 'defect', description: 'DEF-02: a one-paragraph HTML paste in the middle of a paragraph splits it into three blocks' });
  116 |     await editor.start({ saved: ['One REPLACE three', 'Final QA'] });
  117 |     await editor.selectRange('One REPLACE three', 4, 11);
  118 |     await editor.pasteSynthetic({ html: '<span>NEW</span>', text: 'NEW' });
> 119 |     expect(await editor.visibleTexts()).toEqual(['One NEW three', 'Final QA']);
      |                                         ^ Error: expect(received).toEqual(expected) // deep equality
  120 |   });
  121 | 
  122 |   test('TC0040 - pasting over a selection spanning several blocks removes it and keeps the rest', async ({ createdPage, editor }) => {
  123 |     await editor.start({ saved: ['Before QA', 'Middle one QA', 'Middle two QA', 'After QA'] });
  124 |     await editor.selectAcross('Middle one QA', 'Middle two QA');
  125 |     await editor.pasteSynthetic({ html: '<p>SUBSTITUTE QA</p>', text: 'SUBSTITUTE QA' });
  126 |     const texts = await editor.visibleTexts();
  127 |     expect(texts).toContain('Before QA');
  128 |     expect(texts).toContain('SUBSTITUTE QA');
  129 |     expect(texts).toContain('After QA');
  130 |     expect(texts.join('|')).not.toContain('Middle');
  131 |     expect(texts.indexOf('Before QA')).toBeLessThan(texts.indexOf('SUBSTITUTE QA'));
  132 |     expect(texts.indexOf('SUBSTITUTE QA')).toBeLessThan(texts.indexOf('After QA'));
  133 |   });
  134 | });
  135 | 
  136 | test.describe('Editor paste - tables and nested lists', () => {
  137 |   test('TC0041 - a pasted table keeps header, empty cells, cell formatting and line breaks, with no Markdown', async ({ createdPage, editor }) => {
  138 |     await editor.start();
  139 |     await editor.pasteSynthetic(clipboardOf('tables'));
  140 |     const table = (await editor.structure()).find((b) => b.type === 'table');
  141 |     expect(table?.rows).toEqual([
  142 |       ['Key', 'Value', 'Note'],
  143 |       ['One', 'Two\nThree', ''],
  144 |       ['', 'Italic cell', 'Link cell'],
  145 |       ['End', '', 'Last'],
  146 |     ]);
  147 |     await expect(editor.surface.locator('table strong', { hasText: 'Two' })).toBeVisible();
  148 |     await expect(editor.surface.locator('table em', { hasText: 'Italic cell' })).toBeVisible();
  149 |     await expect(editor.surface.locator('table a[href="https://example.com/celda"], table a[href="https://example.com/cell"]')).toBeVisible();
  150 |     expect(await editor.surface.innerText()).not.toMatch(/\|\s*---|\*\*/);
  151 |     expect(await editor.texts()).toContain('Text after the table QA');
  152 |   });
  153 | 
  154 |   // One operation per fresh table: each control works on its own. Chaining operations is DEF-03 (TC0047).
  155 |   for (const [tc, control, expected] of [
  156 |     ['TC0042', 'Agregar fila', { rows: 5, cols: 3 }],
  157 |     ['TC0043', 'Agregar columna', { rows: 4, cols: 4 }],
  158 |     ['TC0044', 'Quitar última fila', { rows: 3, cols: 3 }],
  159 |     ['TC0045', 'Quitar última columna', { rows: 4, cols: 2 }],
  160 |   ]) {
  161 |     test(`${tc} - "${control}" changes the pasted table by exactly one row or column`, async ({ createdPage, editor }) => {
  162 |       await editor.start();
  163 |       await editor.pasteSynthetic(clipboardOf('tables'));
  164 |       await editor.surface.locator('td', { hasText: 'One' }).click();
  165 |       await editor.button(control).click();
  166 |       await expect.poll(() => editor.tableSize()).toEqual(expected);
  167 |     });
  168 |   }
  169 | 
  170 |   test('TC0046 - the header row can be switched off and on', async ({ createdPage, editor }) => {
  171 |     await editor.start();
  172 |     await editor.pasteSynthetic(clipboardOf('tables'));
  173 |     await editor.surface.locator('td', { hasText: 'One' }).click();
  174 |     const header = editor.button('Fila de encabezado');
  175 |     await expect(header).toHaveAttribute('aria-pressed', 'true');
  176 |     await expect(editor.surface.locator('table th')).not.toHaveCount(0);
  177 |     await header.click();
  178 |     await expect(header).toHaveAttribute('aria-pressed', 'false');
  179 |     await expect(editor.surface.locator('table th')).toHaveCount(0);
  180 |     await header.click();
  181 |     await expect(editor.surface.locator('table th')).not.toHaveCount(0);
  182 |   });
  183 | 
  184 |   // Known defect DEF-03.
  185 |   test('TC0047 - consecutive table operations apply to the CURRENT table, not to a stale one', async ({ createdPage, editor }, testInfo) => {
  186 |     testInfo.annotations.push({ type: 'defect', description: 'DEF-03: table controls act on a snapshot one operation behind' });
  187 |     await editor.start();
  188 |     await editor.pasteSynthetic(clipboardOf('tables'));
  189 |     await editor.surface.locator('td', { hasText: 'One' }).click();
  190 |     await editor.button('Agregar fila').click();
  191 |     await editor.button('Agregar fila').click();
  192 |     expect(await editor.tableSize()).toEqual({ rows: 6, cols: 3 });
  193 |     await editor.button('Quitar última columna').click();
  194 |     expect(await editor.tableSize()).toEqual({ rows: 6, cols: 2 });
  195 |   });
  196 | 
  197 |   test('TC0048 - after pasting an indented list you keep editing with formatting, no Markdown shown', async ({ createdPage, editor, page }) => {
  198 |     await editor.start();
  199 |     await editor.pasteSynthetic(clipboardOf('rich-page'));
  200 |     await editor.caret('Bullet grandchild', 'end');
  201 |     await page.keyboard.press('Enter');
  202 |     await page.keyboard.type('New child QA');
  203 |     await page.keyboard.press('Shift+Tab');
  204 |     await page.keyboard.type(' lower level');
  205 |     await editor.selectRange('New child QA lower level', 0, 3);
  206 |     await editor.format('Negrita');
  207 |     const created = (await editor.structure()).find((b) => b.text === 'New child QA lower level');
  208 |     expect(created).toMatchObject({ type: 'bulletListItem', depth: 1 });
  209 |     expect((await editor.inlineStyles('New child QA lower level')).bold).toEqual(['New']);
  210 |     expect(await editor.surface.innerText()).not.toContain('**');
  211 |   });
  212 | });
  213 | 
  214 | test.describe('Editor paste - code and Mermaid', () => {
  215 |   test('TC0049 - a pasted Mermaid block renders as a diagram and code stays code', async ({ createdPage, editor }) => {
  216 |     await editor.start();
  217 |     await editor.pasteSynthetic(clipboardOf('code-mermaid'));
  218 |     await expect(editor.diagram.locator('[role="img"] svg')).toBeVisible({ timeout: 20_000 });
  219 |     const blocks = await editor.structure();
```