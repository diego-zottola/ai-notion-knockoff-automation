import { BasePage } from './BasePage.js';

export class TrashPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Papelera', level: 1 });
    this.empty = page.getByRole('heading', { name: 'La papelera está vacía' });
    this.list = page.getByRole('list', { name: 'Páginas archivadas' });
  }

  item(title) {
    return this.list.getByRole('listitem', { name: title, exact: true });
  }

  async restore(title) {
    await this.item(title).getByRole('button', { name: `Restaurar ${title}` }).click();
  }

  async deleteForever(title) {
    await this.item(title).getByRole('button', { name: `Eliminar definitivamente ${title}` }).click();
    await this.page.getByRole('alertdialog').getByRole('button', { name: 'Eliminar definitivamente' }).click();
  }
}
