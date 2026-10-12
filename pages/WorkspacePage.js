import { expect } from '@playwright/test';
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
    const before = this.page.url();
    await this.sidebarNewPage.click();
    await this.page.waitForURL((url) => url.href !== before && /\/p\//.test(url.href));
    // The URL changes before the new page renders: wait for its empty title so a rename never lands on the previous page.
    const title = this.page.getByRole('textbox', { name: 'Título de la página' });
    try {
      await expect(title).toHaveValue('', { timeout: 8_000 });
    } catch {
      // Intermittent: the new page can open as "No encontramos esta página" until it is reloaded.
      await this.page.reload();
      await expect(title).toHaveValue('');
    }
  }

  /** Row actions menu of a page in the sidebar tree ("Subir", "Bajar", "Mover a…", "Archivar"). */
  async rowAction(title, action) {
    await this.page.getByRole('button', { name: `Acciones de ${title}`, exact: true }).click();
    await this.page.getByRole('menuitem', { name: action, exact: true }).click();
  }

  /** "Mover a…" dialog: picks the destination (a page title, or the workspace root) and confirms. */
  async movePage(title, destination) {
    await this.rowAction(title, 'Mover a…');
    const dialog = this.page.getByRole('dialog', { name: 'Mover página' });
    await dialog.getByRole('option', { name: destination === 'root' ? 'Raíz del espacio de trabajo' : new RegExp(`${destination}$`) }).click();
    await dialog.getByRole('button', { name: 'Mover', exact: true }).click();
    await dialog.waitFor({ state: 'hidden' });
  }

  /** Creates a sub-page under `parent` from its sidebar "Agregar subpágina" button, titles it and returns its URL. */
  async createSubpage(parent, title, doc) {
    const before = this.page.url();
    await this.page.getByRole('button', { name: `Agregar subpágina en ${parent}`, exact: true }).click();
    await this.page.waitForURL((url) => url.href !== before);
    await expect(doc.title).toHaveValue('');
    await doc.setTitle(title);
    return this.page.url();
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
