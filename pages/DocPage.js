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
    await this.title.fill(text);
    // Title autosaves; wait for it to show in the sidebar tree before moving on.
    await this.page.getByRole('navigation', { name: 'Páginas' }).getByRole('link', { name: text, exact: true }).waitFor();
  }

  async archiveConfirmed() {
    await this.archive.click();
    await this.confirmDialog.getByRole('button', { name: 'Archivar' }).click();
  }
}
