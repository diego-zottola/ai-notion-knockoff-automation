import { BasePage } from './BasePage.js';

export class WorkspacePage extends BasePage {
  constructor(page) {
    super(page);
    this.switcher = page.getByRole('button', { name: 'Cambiar de espacio de trabajo' });
    this.sidebarNewPage = page.getByRole('list').getByRole('button', { name: 'Nueva página' });
    this.searchButton = page.getByRole('button', { name: /^Buscar/ });
    this.pageTree = page.getByRole('navigation', { name: 'Páginas' });
    this.recent = page.getByRole('region', { name: 'Páginas recientes' });
    this.heading = page.getByRole('heading', { level: 1 });
    this.logout = page.getByRole('button', { name: 'Cerrar sesión' });
    this.searchBox = page.getByRole('searchbox', { name: 'Buscar páginas' });
    this.searchDialog = page.getByRole('dialog', { name: 'Buscar' });
  }

  async open() {
    await this.page.goto('/');
    await this.page.waitForURL(/\/w\//);
    await this.switcher.waitFor();
  }

  sidebarLink(title) {
    return this.pageTree.getByRole('link', { name: title, exact: true });
  }

  async createPageFromSidebar() {
    await this.sidebarNewPage.click();
    await this.page.waitForURL(/\/p\//);
  }

  async goTo(linkName) {
    await this.page.getByRole('link', { name: linkName, exact: true }).click();
  }

  async search(text) {
    await this.searchButton.click();
    await this.searchBox.fill(text);
  }

  // Test-data cleanup: archive, then delete forever. Only touches pages whose title starts with the prefix.
  async purgePagesByPrefix(prefix) {
    for (let i = 0; i < 20; i++) {
      const link = this.pageTree.getByRole('link', { name: new RegExp(`^${prefix}`) }).first();
      if (!(await link.isVisible().catch(() => false))) break;
      await link.click();
      await this.page.getByRole('button', { name: 'Archivar' }).click();
      await this.page.getByRole('alertdialog').getByRole('button', { name: 'Archivar' }).click();
      await this.page.getByRole('alertdialog').waitFor({ state: 'hidden' });
    }
    await this.page.goto(this.page.url().replace(/\/(p|settings)\/.*$|\/trash$/, '') + '/trash');
    for (let i = 0; i < 20; i++) {
      const del = this.page.getByRole('listitem', { name: new RegExp(`^${prefix}`) }).getByRole('button', { name: /^Eliminar definitivamente/ }).first();
      if (!(await del.isVisible().catch(() => false))) break;
      await del.click();
      await this.page.getByRole('alertdialog').getByRole('button', { name: 'Eliminar definitivamente' }).click();
      await this.page.getByRole('alertdialog').waitFor({ state: 'hidden' });
    }
  }
}
