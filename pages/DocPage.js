import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

// Editor page (/w/:ws/p/:id)
export class DocPage extends BasePage {
  constructor(page) {
    super(page);
    this.title = page.getByRole('textbox', { name: 'Título de la página' });
    this.breadcrumb = page.getByRole('navigation', { name: 'Ruta de la página' });
    this.share = page.getByRole('button', { name: 'Compartir' });
    this.move = page.getByRole('button', { name: 'Mover' });
    this.archive = page.getByRole('button', { name: 'Archivar' });
    this.addBlock = page.getByRole('button', { name: 'Agregar bloque' });
    this.firstBlock = page.getByRole('textbox', { name: 'Texto' }).first();
    this.confirmDialog = page.getByRole('alertdialog');
  }

  async setTitle(text) {
    // A new page sometimes opens with a readonly title that never becomes editable (permissions race); reloading recovers it.
    try {
      await expect(this.title).toBeEditable({ timeout: 8_000 });
    } catch {
      await this.page.reload();
    }
    await this.title.fill(text);
    // Title autosaves; wait for it to show in the sidebar tree before moving on.
    await this.page.getByRole('navigation', { name: 'Páginas' }).getByRole('link', { name: text, exact: true }).waitFor();
  }

  /** Share dialog (UC-SHARE-001): shares the page with a registered user and waits for the grant row. */
  get shareDialog() { return this.page.getByRole('dialog').filter({ has: this.page.getByPlaceholder('Email de la persona a invitar') }); }
  grantRow(name) { return this.shareDialog.getByRole('listitem').filter({ hasText: name }); }

  async shareWithUser(email, name, permission = 'Puede ver') {
    if (!(await this.shareDialog.isVisible())) await this.share.click();
    await this.page.getByPlaceholder('Email de la persona a invitar').fill(email);
    await this.shareDialog.getByLabel('Permiso para el email').selectOption({ label: permission });
    await this.shareDialog.getByRole('button', { name: 'Compartir', exact: true }).click();
    await expect(this.grantRow(name)).toBeVisible();
  }

  async changeGrant(name, permission) {
    await this.grantRow(name).getByLabel(`Permiso de ${name}`).selectOption({ label: permission });
  }

  async revokeGrant(name) {
    await this.grantRow(name).getByRole('button', { name: `Quitar acceso de ${name}` }).click();
    await expect(this.grantRow(name)).toHaveCount(0);
  }

  async closeShare() {
    await this.shareDialog.getByRole('button', { name: 'Close' }).click();
    await expect(this.shareDialog).toBeHidden();
  }

  async archiveConfirmed() {
    await this.archive.click();
    await this.confirmDialog.getByRole('button', { name: 'Archivar' }).click();
  }
}
