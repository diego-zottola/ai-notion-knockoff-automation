import { expect } from '@playwright/test';
import { DocPage } from './DocPage.js';
import { MOD } from '../utils/clipboard.js';

const LINE_START = process.platform === 'darwin' ? 'Meta+ArrowLeft' : 'Home';
const LINE_END = process.platform === 'darwin' ? 'Meta+ArrowRight' : 'End';

/**
 * Rich text editor (BlockNote/ProseMirror) of a page, driven the way a person uses it: paste, select, format, save,
 * reload. Extends DocPage, so title, archive, confirm dialog and the other page controls are reused.
 */
export class EditorPage extends DocPage {
  constructor(page) {
    super(page);
    this.surface = page.locator('[data-editor="rich"] .ProseMirror');
    this.saved = page.getByLabel('Estado de guardado');
    this.toolbar = page.getByRole('toolbar', { name: 'Formato de texto' });
    this.toasts = page.locator('[data-sonner-toast]');
    this.blocks = this.surface.locator('.bn-block-content');
    this.diagram = this.surface.locator('[data-content-type="wsDiagram"]');
    this.linkInput = page.getByLabel('Dirección del enlace');
    this.imageInput = page.getByLabel('Agregar imagen', { exact: true });
    this.selectionMode = page.getByRole('button', { name: 'Seleccionar bloques', exact: true });
    this.undo = page.getByRole('button', { name: 'Deshacer', exact: true }).first();
    this.redo = page.getByRole('button', { name: 'Rehacer', exact: true }).first();
    this.pageIcon = page.getByLabel('Cambiar ícono de página');
  }

  button(name) { return this.toolbar.getByRole('button', { name, exact: true }); }
  block(text) { return this.blocks.filter({ hasText: text }).first(); }

  async waitForEditor() { await expect(this.surface).toBeVisible({ timeout: 20_000 }); }
  async expectSaved(timeout = 20_000) { await expect(this.saved).toHaveText('Guardado', { timeout }); }
  async reloadAndWait() {
    await this.page.reload();
    await this.waitForEditor();
  }

  /**
   * Pre-existing saved paragraphs, typed through the editor and reloaded, so the test starts from saved content and an
   * empty undo history. Content under test is always pasted, never inserted through internal editor APIs.
   */
  async seedSaved(lines) {
    await this.waitForEditor();
    await this.surface.click();
    for (const [index, line] of lines.entries()) {
      await this.page.keyboard.type(line);
      if (index < lines.length - 1) await this.page.keyboard.press('Enter');
    }
    await this.expectSaved();
    await this.reloadAndWait();
    await expect(this.block(lines.at(-1))).toBeVisible();
  }

  /** Ready-to-use editor: waits for it, optionally starts from saved paragraphs, and focuses the surface. */
  async start({ saved = [], focus = true } = {}) {
    await this.waitForEditor();
    if (saved.length) await this.seedSaved(saved);
    if (focus) await this.surface.click();
  }

  /**
   * Delivers a clipboard through real `DataTransfer` + `ClipboardEvent('paste')`. Deterministic and good for
   * combinations, but SYNTHETIC: it is not evidence that the native browser clipboard works (see nativePaste).
   * `files` are {name, mimeType, buffer} payloads attached as clipboard files.
   */
  async pasteSynthetic({ html, text, files = [] } = {}) {
    const encoded = files.map((file) => ({ name: file.name, mimeType: file.mimeType, base64: Buffer.from(file.buffer).toString('base64') }));
    await this.surface.evaluate((element, payload) => {
      const clipboardData = new DataTransfer();
      if (payload.html !== undefined) clipboardData.setData('text/html', payload.html);
      if (payload.text !== undefined) clipboardData.setData('text/plain', payload.text);
      for (const file of payload.files) {
        const bytes = Uint8Array.from(atob(file.base64), (c) => c.charCodeAt(0));
        clipboardData.items.add(new File([bytes], file.name, { type: file.mimeType }));
      }
      element.dispatchEvent(new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true }));
    }, { html, text, files: encoded });
  }

  /** Real keyboard paste of whatever the browser clipboard currently holds. */
  async nativePaste() { await this.page.keyboard.press(`${MOD}+V`); }

  /** Caret inside the block that contains `text`: at its start, end, or after `offset` characters. */
  async caret(text, where = 'end', offset = 0) {
    await this.block(text).locator('.bn-inline-content').click();
    await this.page.keyboard.press(LINE_START);
    if (where === 'end') await this.page.keyboard.press(LINE_END);
    if (where === 'offset') for (let i = 0; i < offset; i += 1) await this.page.keyboard.press('ArrowRight');
  }

  /** Selects characters [from, to) of the block that contains `text` (a real DOM selection). */
  async selectRange(text, from, to) {
    const inline = this.block(text).locator('.bn-inline-content');
    await inline.click();
    await inline.evaluate((element, [a, b]) => {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      let seen = 0;
      let start;
      let end;
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const length = n.nodeValue.length;
        if (!start && a <= seen + length) start = [n, a - seen];
        if (!end && b <= seen + length) end = [n, b - seen];
        seen += length;
      }
      const range = document.createRange();
      range.setStart(...start);
      range.setEnd(...end);
      const selection = getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }, [from, to]);
  }

  /** Selects from the start of the block containing `first` to the end of the one containing `last`. */
  async selectAcross(first, last) {
    await this.block(first).locator('.bn-inline-content').click();
    await this.page.evaluate(([a, b]) => {
      const surface = document.querySelector('[data-editor="rich"] .ProseMirror');
      const inline = (text) => [...surface.querySelectorAll('.bn-block-content')].find((el) => el.textContent.includes(text)).querySelector('.bn-inline-content');
      const range = document.createRange();
      range.setStart(inline(a), 0);
      const tail = inline(b);
      range.setEnd(tail, tail.childNodes.length);
      const selection = getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }, [first, last]);
  }

  selectedText() { return this.page.evaluate(() => getSelection().toString()); }

  /**
   * Comparable structure of the document: block types, heading levels, nesting depth, visible text, table rows and
   * special blocks. No generated ids and no internal HTML, so it survives editor upgrades.
   */
  async structure() {
    return this.surface.evaluate((root) => {
      const depthOf = (el) => {
        let depth = 0;
        for (let n = el.parentElement; n && n !== root; n = n.parentElement) if (n.classList.contains('bn-block-group')) depth += 1;
        return Math.max(0, depth - 1);
      };
      return [...root.querySelectorAll('.bn-block-content')].map((el) => {
        const type = el.getAttribute('data-content-type');
        const item = { type, depth: depthOf(el) };
        if (type === 'heading') item.level = Number(el.getAttribute('data-level') ?? 1);
        if (type === 'table') item.rows = [...el.querySelectorAll('tr')].map((tr) => [...tr.children].map((cell) => cell.innerText.trim()));
        else if (type === 'wsImage') item.text = el.querySelector('img')?.getAttribute('alt') ?? (el.querySelector('[role="alert"]') ? 'error' : el.querySelector('[role="status"]') ? 'uploading' : 'pending');
        else if (type === 'wsFile') item.text = el.querySelector('span')?.textContent.trim();
        else if (type === 'wsDiagram') item.text = el.querySelector('[role="img"] svg') ? 'diagram' : el.textContent.trim();
        else item.text = (el.querySelector('.bn-inline-content')?.innerText ?? '').trim();
        return item;
      });
    });
  }

  /** Visible text of the paragraph-like blocks, in order (tables, images, files and diagrams are left out). */
  async texts() {
    return (await this.structure()).filter((b) => b.text !== undefined && !['wsImage', 'wsFile', 'wsDiagram'].includes(b.type)).map((b) => b.text);
  }

  /** Non-empty paragraph texts: the editor keeps a trailing empty block that tests never care about. */
  async visibleTexts() { return (await this.texts()).filter(Boolean); }

  /** Inline styles inside the block that contains `text`: bold, italic, strike, colour and links, by visible text. */
  async inlineStyles(text) {
    return this.block(text).evaluate((el) => ({
      bold: [...el.querySelectorAll('strong')].map((n) => n.textContent),
      italic: [...el.querySelectorAll('em')].map((n) => n.textContent),
      strike: [...el.querySelectorAll('s, del, strike')].map((n) => n.textContent),
      color: [...el.querySelectorAll('[data-style-type="textColor"]')].map((n) => [n.textContent, n.getAttribute('data-value')]),
      links: [...el.querySelectorAll('a')].map((n) => [n.textContent, n.getAttribute('href')]),
    }));
  }

  async format(name) { await this.button(name).click(); }

  async applyLink(url) {
    await this.button('Enlace').click();
    await this.linkInput.fill(url);
    await this.page.getByRole('button', { name: 'Aplicar enlace', exact: true }).click();
  }

  async clickOutsideEditor() { await this.page.mouse.click(2, 2); }

  async tableSize() {
    return this.surface.locator('table').evaluate((t) => ({ rows: t.querySelectorAll('tr').length, cols: t.querySelector('tr').children.length }));
  }

  /** Opens the real attachment control and returns the intercepted file chooser (the OS dialog itself is not drivable). */
  async openAttachmentChooser() {
    await this.surface.click();
    const chooser = this.page.waitForEvent('filechooser');
    await this.page.getByText('Adjuntar archivo', { exact: true }).click();
    return chooser;
  }
  get attachmentInput() { return this.page.getByLabel('Adjuntar archivo', { exact: true }); }
  attachmentRow(name) { return this.surface.locator('[data-content-type="wsFile"]').filter({ hasText: name }); }

  /** Block selection mode, tick the blocks whose label matches, delete them (one undoable action). */
  async deleteViaSelection(...labels) {
    await this.selectionMode.click();
    for (const label of labels) await this.page.getByRole('checkbox', { name: label }).check();
    await this.page.getByRole('button', { name: `Eliminar ${labels.length} bloques`, exact: true }).click();
  }

  async imagesLoaded() {
    return this.surface.getByRole('img').evaluateAll((images) => images.map((image) => image.complete && image.naturalWidth > 0));
  }
}
