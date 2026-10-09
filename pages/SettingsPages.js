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
