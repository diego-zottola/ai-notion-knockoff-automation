import { test, expect, VIEWER } from '../../fixtures/base.fixture.js';

// Groups and the members screen with the QA viewer account (UC-GRP-001, UC-MEM-001, UC-PERM-001, UC-SET-001).
// Groups are named qa-auto-grp-<random> and deleted in a finally block. The viewer's workspace role is never changed
// (it is shared by parallel tests); removing members, ownership transfer and workspace creation are not automated.
// Test cases and priorities: docs/test-cases-coverage-gaps.md.
const groupName = () => `qa-auto-grp-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

test.describe('Groups', () => {
  test('TC0151 - a group can be created, renamed and deleted', async ({ workspace, groupsPage }) => {
    const name = groupName();
    const renamed = `${name}-r`;
    await workspace.open();
    await workspace.goTo('Grupos');
    let current = name;
    try {
      await groupsPage.create(name);
      await groupsPage.rename(name, renamed);
      current = renamed;
      await expect(groupsPage.groupHeading(name)).toHaveCount(0);
    } finally {
      await groupsPage.remove(current);
    }
  });

  test('TC0152 - a group name must be unique in the workspace, ignoring case', async ({ workspace, groupsPage, page }) => {
    const name = groupName();
    await workspace.open();
    await workspace.goTo('Grupos');
    try {
      await groupsPage.create(name);
      await groupsPage.name.fill(name.toUpperCase());
      await groupsPage.createButton.click();
      await expect(page.locator('[data-sonner-toast], [role="alert"]').first()).toBeVisible();
      await expect(page.getByRole('heading', { level: 2 }).filter({ hasText: new RegExp(`^${name}$`, 'i') })).toHaveCount(1);
    } finally {
      await groupsPage.remove(name);
    }
  });

  test('TC0153 - members can be added to and removed from a group', async ({ workspace, groupsPage }) => {
    const name = groupName();
    await workspace.open();
    await workspace.goTo('Grupos');
    try {
      await groupsPage.create(name);
      await groupsPage.addMember(name, VIEWER.name);
      await groupsPage.removeMember(name, VIEWER.name);
    } finally {
      await groupsPage.remove(name);
    }
  });

  test('TC0154 - a page shared with a group gives its members access, and removing them from the group revokes it', async ({ createdPage, editor, docPage, workspace, groupsPage, viewerPage, page }) => {
    const name = groupName();
    await editor.start();
    await page.keyboard.type('Group shared QA');
    await editor.expectSaved();
    await workspace.goTo('Grupos');
    try {
      await groupsPage.create(name);
      await groupsPage.addMember(name, VIEWER.name);
      await page.goto(createdPage.url);
      await docPage.share.click();
      await docPage.shareDialog.getByLabel('Grupo', { exact: true }).selectOption({ label: name });
      await docPage.shareDialog.getByRole('button', { name: 'Compartir con el grupo' }).click();
      await expect(docPage.grantRow(name)).toBeVisible();
      await docPage.closeShare();
      await viewerPage.goto(createdPage.url);
      await expect(viewerPage.getByText('Group shared QA')).toBeVisible();
      await workspace.goTo('Grupos');
      await groupsPage.removeMember(name, VIEWER.name);
      await viewerPage.reload();
      await expect(viewerPage.getByText('No encontramos esta página o no tenés acceso')).toBeVisible();
    } finally {
      await workspace.open();
      await workspace.goTo('Grupos');
      await groupsPage.remove(name);
    }
  });
});

test.describe('Members screen', () => {
  test('TC0155 - the viewer shows up as a guest of the workspace after a page was shared with them', async ({ createdPage, editor, docPage, workspace, membersPage, page }) => {
    await docPage.shareWithUser(VIEWER.email, VIEWER.name);
    await docPage.closeShare();
    await workspace.goTo('Miembros');
    const row = page.getByRole('listitem').filter({ hasText: VIEWER.name }).filter({ has: page.getByLabel(`Rol de ${VIEWER.name}`) });
    await expect(row).toBeVisible();
    await expect(row.getByLabel(`Rol de ${VIEWER.name}`)).toHaveValue(/GUEST|guest|Invitado/i);
  });

  test('TC0156 - a guest gets no groups or trash screens, and the members screen shows no directory', async ({ viewerPage }) => {
    await viewerPage.goto('/');
    await expect(viewerPage.getByRole('button', { name: 'Cambiar de espacio de trabajo' })).toBeVisible();
    for (const name of ['Grupos', 'Papelera']) {
      await expect(viewerPage.getByRole('link', { name, exact: true })).toHaveCount(0);
    }
    await viewerPage.getByRole('link', { name: 'Miembros', exact: true }).click();
    await expect(viewerPage.getByText('el directorio de miembros no está disponible')).toBeVisible();
    await expect(viewerPage.getByRole('form', { name: 'Agregar miembro' })).toHaveCount(0);
    await expect(viewerPage.getByRole('button', { name: 'Salir del espacio de trabajo' })).toBeVisible();
  });
});
