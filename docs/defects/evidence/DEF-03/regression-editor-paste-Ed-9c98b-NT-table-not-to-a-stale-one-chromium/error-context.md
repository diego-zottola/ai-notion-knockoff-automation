# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regression/editor-paste.spec.js >> Editor paste - tables and nested lists >> TC0047 - consecutive table operations apply to the CURRENT table, not to a stale one
- Location: tests/regression/editor-paste.spec.js:185:3

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
    "cols": 2,
-   "rows": 6,
+   "rows": 5,
  }
```

# Page snapshot

```yaml
- generic [ref=f2e3]:
  - region "Notifications alt+T"
```

# Test source

```ts
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
  119 |     expect(await editor.visibleTexts()).toEqual(['One NEW three', 'Final QA']);
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
> 194 |     expect(await editor.tableSize()).toEqual({ rows: 6, cols: 2 });
      |                                      ^ Error: expect(received).toEqual(expected) // deep equality
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
  220 |     expect(blocks.find((b) => b.type === 'codeBlock')?.text).toContain('console.log(total);');
  221 |     expect(blocks.map((b) => b.text).filter(Boolean)[0]).toBe('Before the code QA');
  222 |     expect(blocks.at(-1)?.text).toBe('After the diagram QA');
  223 |   });
  224 | 
  225 |   test('TC0050 - an invalid Mermaid source shows a clear message and keeps its source editable', async ({ createdPage, editor, page }) => {
  226 |     await editor.start();
  227 |     await editor.pasteSynthetic({ html: fixtureText('mermaid-invalid.html') });
  228 |     await expect(editor.diagram.getByText('No se pudo dibujar el diagrama')).toBeVisible({ timeout: 20_000 });
  229 |     await page.getByRole('button', { name: 'Editar diagrama' }).click();
  230 |     const source = page.getByLabel('Código del diagrama');
  231 |     await expect(source).toContainText('this is not a valid diagram');
  232 |     await source.fill(fixtureText('mermaid-valid.mmd'));
  233 |     await editor.clickOutsideEditor();
  234 |     await expect(editor.diagram.locator('[role="img"] svg')).toBeVisible({ timeout: 20_000 });
  235 |   });
  236 | });
  237 | 
  238 | test.describe('Editor paste - unsafe and malformed content', () => {
  239 |   test('TC0051 - executable link schemes and scripts never reach the page', async ({ createdPage, editor, page }) => {
  240 |     await editor.start();
  241 |     await editor.pasteSynthetic({ html: fixtureText('edge/unsafe-links.html') });
  242 |     const hrefs = await editor.surface.locator('a').evaluateAll((links) => links.map((a) => a.getAttribute('href')));
  243 |     expect(hrefs.sort()).toEqual(['https://example.com/seguro', 'mailto:qa@example.test']);
  244 |     const texts = await editor.texts();
  245 |     for (const label of ['Javascript link QA', 'Data link QA', 'Vbscript link QA', 'File link QA']) expect(texts).toContain(label);
  246 |     expect(await page.evaluate(() => window.__xss)).toBeUndefined();
  247 |     await expect(editor.surface.locator('[onclick], script')).toHaveCount(0);
  248 |   });
  249 | 
  250 |   test('TC0052 - malformed HTML is repaired without crashing and keeps text and order', async ({ createdPage, editor }) => {
  251 |     await editor.start();
  252 |     await editor.pasteSynthetic({ html: fixtureText('edge/malformed.html') });
  253 |     expect(await editor.visibleTexts()).toEqual(['Open paragraph QA unclosed bold', 'Second paragraph QA', 'Unclosed item QA', 'Another item QA', 'Broken title QA']);
  254 |   });
  255 | 
  256 |   test('TC0053 - the link dialog rejects executable URLs and creates nothing', async ({ createdPage, editor, page }) => {
  257 |     await editor.start({ saved: ['Dangerous link QA'] });
  258 |     await editor.selectRange('Dangerous link QA', 0, 9);
  259 |     for (const url of ['javascript:alert(1)', 'data:text/html;base64,AAAA', 'vbscript:msgbox(1)']) {
  260 |       await editor.button('Enlace').click();
  261 |       await editor.linkInput.fill(url);
  262 |       await page.getByRole('button', { name: 'Aplicar enlace', exact: true }).click();
  263 |       await expect(page.getByRole('alert').filter({ hasText: 'enlace https, http o mailto válido' })).toBeVisible();
  264 |       await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  265 |       await editor.selectRange('Dangerous link QA', 0, 9);
  266 |     }
  267 |     await expect(editor.surface.locator('a')).toHaveCount(0);
  268 |   });
  269 | });
  270 | 
  271 | test.describe('Editor - editing and toolbar', () => {
  272 |   test('TC0054 - clicking formatted text edits it in place and never shows Markdown source', async ({ createdPage, editor, page }) => {
  273 |     await editor.start();
  274 |     await editor.pasteSynthetic(clipboardOf('rich-page'));
  275 |     await editor.surface.locator('strong', { hasText: 'bold' }).click();
  276 |     await page.keyboard.type('XX');
  277 |     expect(await editor.surface.innerText()).not.toMatch(/\*\*|~~|\]\(|^#/m);
  278 |     const styles = await editor.inlineStyles('Paragraph with');
  279 |     expect(styles.bold.join('')).toContain('XX');
  280 |     expect(styles.links).toHaveLength(1);
  281 |   });
  282 | 
  283 |   test('TC0055 - the toolbar shows while editing and hides on interaction outside the editor', async ({ createdPage, editor }) => {
  284 |     await editor.start({ saved: ['Toolbar QA'] });
  285 |     await editor.block('Toolbar QA').click();
  286 |     await expect(editor.toolbar).toBeVisible();
  287 |     await editor.clickOutsideEditor();
  288 |     await expect(editor.toolbar).toHaveCount(0);
  289 |   });
  290 | 
  291 |   test('TC0056 - bold, italic, colours, headings and lists keep the text selection', async ({ createdPage, editor }) => {
  292 |     await editor.start({ saved: ['Alpha beta gamma QA'] });
  293 |     await editor.selectRange('Alpha beta gamma QA', 6, 10);
  294 |     for (const name of ['Negrita', 'Cursiva', 'Color red']) {
```