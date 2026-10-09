import { test, expect } from '../../fixtures/base.fixture.js';

test.describe('Members, groups, preferences and profile', () => {
  test.beforeEach(async ({ workspace }) => {
    await workspace.open();
  });

  test('TC0019 - member invite button is disabled until an email is entered (boundary: empty)', async ({ workspace, membersPage }) => {
    await workspace.goTo('Miembros');
    await expect(membersPage.addButton).toBeDisabled();
  });

  test('TC0020 - member invite offers the three roles with Miembro as default', async ({ workspace, membersPage }) => {
    await workspace.goTo('Miembros');
    await expect(membersPage.role.getByRole('option')).toHaveText(['Administrador', 'Miembro', 'Invitado']);
    await expect(membersPage.role).toHaveValue(/.+/);
    await expect(membersPage.role.locator('option:checked')).toHaveText('Miembro');
  });

  test('TC0021 - the current user is listed as owner of the workspace', async ({ workspace, membersPage }) => {
    await workspace.goTo('Miembros');
    await expect(membersPage.members.filter({ hasText: '(vos)' })).toContainText('Propietario');
  });

  test('TC0022 - group create button is disabled with an empty name', async ({ workspace, groupsPage }) => {
    await workspace.goTo('Grupos');
    await expect(groupsPage.createButton).toBeDisabled();
  });

  test('TC0023 - theme selector offers light, dark and system', async ({ workspace, preferencesPage }) => {
    await workspace.goTo('Preferencias');
    for (const name of ['Claro', 'Oscuro', 'Sistema']) {
      await expect(preferencesPage.themeGroup.getByRole('radio', { name })).toBeVisible();
    }
  });

  test('TC0024 - profile save button is disabled until the name changes', async ({ workspace, profilePage }) => {
    await workspace.goTo('Perfil');
    await expect(profilePage.saveName).toBeDisabled();
    await profilePage.nameField.press('End');
    await profilePage.nameField.pressSequentially('x');
    await expect(profilePage.saveName).toBeEnabled();
    await profilePage.nameField.press('Backspace');
    await expect(profilePage.saveName).toBeDisabled();
  });

  test('TC0025 - profile lists the user spaces', async ({ workspace, profilePage }) => {
    await workspace.goTo('Perfil');
    await expect(profilePage.spaces.getByRole('listitem').first()).toBeVisible();
  });

  test('TC0026 - workspace switcher lists spaces and the create option', async ({ workspace, page }) => {
    await workspace.switcher.click();
    await expect(page.getByRole('menuitem', { name: 'Crear espacio de trabajo' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: /Propietario/ }).first()).toBeVisible();
  });
});
