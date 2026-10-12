import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class MembersPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Miembros', level: 1 });
    this.form = page.getByRole('form', { name: 'Agregar miembro' });
    this.email = page.getByRole('textbox', { name: 'Email' });
    this.role = page.getByRole('combobox', { name: 'Rol del nuevo miembro' });
    this.addButton = this.form.getByRole('button', { name: 'Agregar', exact: true });
    this.members = page.getByRole('listitem');
  }
}

export class GroupsPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Grupos', level: 1 });
    this.name = page.getByRole('textbox', { name: 'Nombre del grupo' });
    this.createButton = page.getByRole('button', { name: 'Crear', exact: true });
  }

  groupHeading(name) { return this.page.getByRole('heading', { name, level: 2, exact: true }); }

  async create(name) {
    await this.name.fill(name);
    await this.createButton.click();
    await expect(this.groupHeading(name)).toBeVisible();
  }

  /** Adds a person to the group from the card's "Agregar miembro a <group>" picker. */
  async addMember(group, person) {
    const picker = this.page.getByLabel(`Agregar miembro a ${group}`);
    await picker.selectOption({ label: person });
    await picker.locator('xpath=ancestor::*[.//button[normalize-space()="Agregar"]][1]').getByRole('button', { name: 'Agregar', exact: true }).click();
    await expect(this.page.getByRole('button', { name: `Quitar a ${person} de ${group}` })).toBeVisible();
  }

  async removeMember(group, person) {
    await this.page.getByRole('button', { name: `Quitar a ${person} de ${group}` }).click();
    await expect(this.page.getByRole('button', { name: `Quitar a ${person} de ${group}` })).toHaveCount(0);
  }

  async rename(group, next) {
    await this.page.getByRole('button', { name: `Renombrar grupo ${group}` }).click();
    await this.page.getByLabel('Nuevo nombre').fill(next);
    await this.page.getByRole('button', { name: 'Guardar', exact: true }).click();
    await expect(this.groupHeading(next)).toBeVisible();
  }

  async remove(group) {
    await this.page.getByRole('button', { name: `Eliminar grupo ${group}` }).click();
    await this.page.getByRole('alertdialog').getByRole('button', { name: 'Eliminar', exact: true }).click();
    await expect(this.groupHeading(group)).toHaveCount(0);
  }
}

export class PreferencesPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Preferencias', level: 1 });
    this.themeGroup = page.getByRole('radiogroup', { name: 'Tema' });
    this.compactSwitch = page.getByRole('switch', { name: 'Vista compacta' });
  }
}

export class ProfilePage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Perfil', level: 1 });
    this.nameField = page.getByRole('textbox', { name: 'Nombre' });
    this.saveName = page.getByRole('button', { name: 'Guardar nombre' });
    this.spaces = page.getByRole('list', { name: 'Tus espacios' });
  }
}
