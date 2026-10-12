import { expect } from '@playwright/test';

/**
 * Block comments (UC-CMT-001): the margin bubble of a block and the thread popover it opens.
 * Bubbles carry no block id, so a block's bubble is the one vertically closest to the block.
 */
export class CommentsPage {
  constructor(page, editor) {
    this.page = page;
    this.editor = editor;
    this.bubbles = page.locator('[data-comments-bubble] button');
    this.panel = page.getByRole('dialog').filter({ has: page.getByLabel('Agregar un comentario') });
    this.composer = page.getByLabel('Agregar un comentario');
    this.send = this.panel.getByRole('button', { name: 'Enviar', exact: true });
    this.entries = this.panel.getByTestId('comment');
    this.openThreads = this.panel.getByRole('region', { name: 'Hilo de comentarios' });
    this.resolvedThreads = this.panel.getByRole('region', { name: 'Hilo resuelto' });
  }

  /** Margin bubble of the block that contains `text` (hovering first so it exists). */
  async bubbleFor(text) {
    const block = this.editor.block(text);
    await block.hover();
    await expect(this.bubbles.first()).toBeVisible();
    const box = await block.boundingBox();
    const index = await this.bubbles.evaluateAll((buttons, top) => {
      let best = 0;
      buttons.forEach((button, i) => {
        if (Math.abs(button.getBoundingClientRect().top - top) < Math.abs(buttons[best].getBoundingClientRect().top - top)) best = i;
      });
      return best;
    }, box.y);
    return this.bubbles.nth(index);
  }

  async openFor(text) {
    await (await this.bubbleFor(text)).click();
    await expect(this.panel).toBeVisible();
  }

  async close() {
    await this.page.keyboard.press('Escape');
    await expect(this.panel).toBeHidden();
  }

  /** Types and sends a comment (or reply when `reply` is given the thread index) with Enter. */
  async add(body) {
    await this.composer.fill(body);
    await this.composer.press('Enter');
    await expect(this.entries.filter({ hasText: body })).toBeVisible();
  }

  async reply(body, thread = 0) {
    const box = this.openThreads.nth(thread).getByLabel('Responder');
    await box.fill(body);
    await box.press('Enter');
    await expect(this.entries.filter({ hasText: body })).toBeVisible();
  }

  entry(body) { return this.entries.filter({ hasText: body }); }
  async resolve(thread = 0) { await this.openThreads.nth(thread).getByRole('button', { name: 'Resolver' }).click(); }
  async reopen() {
    await this.panel.getByRole('button', { name: 'Ver resueltos' }).click();
    await this.resolvedThreads.first().getByRole('button', { name: 'Reabrir' }).click();
  }
  async expectLabel(text, label) { await expect(await this.bubbleFor(text)).toHaveAttribute('aria-label', label); }
}
