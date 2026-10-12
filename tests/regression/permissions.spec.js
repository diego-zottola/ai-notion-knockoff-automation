import { test, expect, VIEWER } from '../../fixtures/base.fixture.js';

// Sharing and read-only access with a second identity (UC-SHARE-001, UC-PERM-001, AC-CMT-003).
// The owner shares only its own qa-auto- test page with the QA viewer account; the page is purged in teardown, which removes
// the grant. Sharing with a non-member makes the viewer a GUEST of the QA workspace (that membership stays). No invitations
// are created (the viewer already has an account). Test cases and priorities: docs/test-cases-coverage-gaps.md.
const BODY = 'Shared body QA';
const NOT_FOUND = 'No encontramos esta página o no tenés acceso';

async function openAsViewer(viewerPage, url) {
  await viewerPage.goto(url);
  await expect(viewerPage.getByRole('textbox', { name: 'Título de la página' })).toBeVisible();
}

test.describe('Permissions - viewer', () => {
  test.beforeEach(async ({ createdPage, editor, docPage }) => {
    await editor.start();
    await editor.page.keyboard.type(BODY);
    await editor.expectSaved();
    await docPage.shareWithUser(VIEWER.email, VIEWER.name);
  });

  test('TC0137 - a page shared as "Puede ver" opens for the viewer with its title and content', async ({ createdPage, viewerPage }) => {
    await openAsViewer(viewerPage, createdPage.url);
    await expect(viewerPage.getByRole('textbox', { name: 'Título de la página' })).toHaveValue(createdPage.title);
    await expect(viewerPage.getByText(BODY)).toBeVisible();
    await expect(viewerPage.getByRole('navigation', { name: 'Páginas' }).getByRole('link', { name: createdPage.title })).toBeVisible();
  });

  test('TC0138 - the viewer sees no write controls (title, blocks, share, move, archive, add and attach)', async ({ createdPage, viewerPage }) => {
    await openAsViewer(viewerPage, createdPage.url);
    await expect(viewerPage.getByRole('textbox', { name: 'Título de la página' })).not.toBeEditable();
    for (const name of ['Compartir', 'Mover', 'Archivar', 'Agregar bloque', 'Agregar tabla', 'Agregar imagen', 'Adjuntar archivo']) {
      await expect(viewerPage.getByRole('button', { name, exact: true })).toHaveCount(0);
    }
    await expect(viewerPage.locator('[data-editor="rich"] .ProseMirror[contenteditable="true"]')).toHaveCount(0);
    await expect(viewerPage.getByText(BODY)).toBeVisible();
  });

  test('TC0139 - the viewer cannot create pages', async ({ createdPage, viewerPage }) => {
    await openAsViewer(viewerPage, createdPage.url);
    await expect(viewerPage.getByRole('button', { name: 'Nueva página' })).toHaveCount(0);
    await expect(viewerPage.getByRole('button', { name: `Agregar subpágina en ${createdPage.title}` })).toHaveCount(0);
  });

  test('TC0140 - the viewer can comment and the owner sees the viewer\'s name on it', async ({ createdPage, editor, comments, viewerPage, page }) => {
    await openAsViewer(viewerPage, createdPage.url);
    const bubble = viewerPage.getByText(BODY);
    await bubble.hover();
    await viewerPage.locator('[data-comments-bubble] button').first().click();
    const box = viewerPage.getByLabel('Agregar un comentario');
    await box.fill('Viewer comment QA');
    await box.press('Enter');
    await expect(viewerPage.getByTestId('comment').filter({ hasText: 'Viewer comment QA' })).toBeVisible();
    await page.reload();
    await editor.waitForEditor();
    await comments.openFor(BODY);
    const entry = comments.entry('Viewer comment QA');
    await expect(entry).toContainText(VIEWER.name);
    // The owner is not the author: no edit control, but the owner may delete (moderation).
    await expect(entry.getByRole('button', { name: 'Editar comentario' })).toHaveCount(0);
    await expect(entry.getByRole('button', { name: 'Eliminar comentario' })).toHaveCount(1);
  });

  test('TC0141 - the viewer cannot edit or delete the owner\'s comment', async ({ createdPage, docPage, comments, viewerPage }) => {
    await docPage.closeShare();
    await comments.openFor(BODY);
    await comments.add('Owner comment QA');
    await openAsViewer(viewerPage, createdPage.url);
    await viewerPage.getByText(BODY).hover();
    await viewerPage.locator('[data-comments-bubble] button').first().click();
    const entry = viewerPage.getByTestId('comment').filter({ hasText: 'Owner comment QA' });
    await expect(entry).toBeVisible();
    await expect(entry.getByRole('button', { name: 'Editar comentario' })).toHaveCount(0);
    await expect(entry.getByRole('button', { name: 'Eliminar comentario' })).toHaveCount(0);
  });

  test('TC0142 - changing the grant to "Puede editar" lets the viewer edit; changing it back removes that', async ({ createdPage, docPage, viewerPage, page }) => {
    await docPage.changeGrant(VIEWER.name, 'Puede editar');
    await openAsViewer(viewerPage, createdPage.url);
    const surface = viewerPage.locator('[data-editor="rich"] .ProseMirror[contenteditable="true"]');
    await expect(surface).toBeVisible();
    await surface.click();
    await viewerPage.keyboard.type(' plus');
    await expect(viewerPage.getByText(`${BODY} plus`)).toBeVisible();
    await docPage.changeGrant(VIEWER.name, 'Puede ver');
    await viewerPage.reload();
    await expect(viewerPage.getByRole('textbox', { name: 'Título de la página' })).toBeVisible();
    await expect(viewerPage.locator('[data-editor="rich"] .ProseMirror[contenteditable="true"]')).toHaveCount(0);
  });

  test('TC0143 - revoking the grant removes the viewer\'s access', async ({ createdPage, docPage, viewerPage }) => {
    await openAsViewer(viewerPage, createdPage.url);
    await docPage.revokeGrant(VIEWER.name);
    await viewerPage.reload();
    await expect(viewerPage.getByText(NOT_FOUND)).toBeVisible();
    await expect(viewerPage.getByRole('navigation', { name: 'Páginas' }).getByRole('link', { name: createdPage.title })).toHaveCount(0);
  });

  test('TC0144 - the grant is inherited by sub-pages', async ({ createdPage, workspace, docPage, viewerPage }) => {
    const child = `${createdPage.title}-c`;
    await docPage.closeShare();
    const childUrl = await workspace.createSubpage(createdPage.title, child, docPage);
    await openAsViewer(viewerPage, childUrl);
    await expect(viewerPage.getByRole('textbox', { name: 'Título de la página' })).toHaveValue(child);
  });
});

test.describe('Permissions - no grant', () => {
  test('TC0145 - a page that was not shared is not reachable by the viewer', async ({ createdPage, viewerPage }) => {
    await viewerPage.goto(createdPage.url);
    await expect(viewerPage.getByText(NOT_FOUND)).toBeVisible();
  });

  test('TC0146 - the share dialog lists who has access and the viewer\'s permission level', async ({ createdPage, docPage }) => {
    await docPage.shareWithUser(VIEWER.email, VIEWER.name, 'Puede ver');
    await expect(docPage.grantRow(VIEWER.name).getByLabel(`Permiso de ${VIEWER.name}`)).toHaveValue(/VIEWER|view|ver/i);
  });
});

test.describe('Permissions - sharing rules', () => {
  test('TC0157 - sharing again with the same person updates the grant instead of duplicating it', async ({ createdPage, docPage, viewerPage }) => {
    await docPage.shareWithUser(VIEWER.email, VIEWER.name, 'Puede ver');
    await docPage.shareWithUser(VIEWER.email, VIEWER.name, 'Puede editar');
    await expect(docPage.grantRow(VIEWER.name)).toHaveCount(1);
    await docPage.closeShare();
    await viewerPage.goto(createdPage.url);
    await expect(viewerPage.locator('[data-editor="rich"] .ProseMirror[contenteditable="true"]')).toBeVisible();
  });

  test('TC0158 - a sub-page shared on its own shows up for the viewer under "Compartido conmigo"', async ({ createdPage, workspace, docPage, viewerPage }) => {
    const child = `${createdPage.title}-c`;
    const childUrl = await workspace.createSubpage(createdPage.title, child, docPage);
    await docPage.shareWithUser(VIEWER.email, VIEWER.name);
    await docPage.closeShare();
    await viewerPage.goto(childUrl);
    await expect(viewerPage.getByRole('textbox', { name: 'Título de la página' })).toHaveValue(child);
    await expect(viewerPage.getByText('Compartido conmigo')).toBeVisible();
    await expect(viewerPage.getByRole('link', { name: child, exact: true }).first()).toBeAttached();
  });

  test('TC0159 - an address without an account becomes a pending invitation that can be cancelled', async ({ createdPage, docPage, page }) => {
    // Reserved .invalid domain: nothing is ever delivered, and "Enviar por correo" / "Enviar desde mi Gmail" are never used.
    const email = `qa-auto-nobody-${Date.now().toString(36)}@example.invalid`;
    await docPage.share.click();
    try {
      await page.getByPlaceholder('Email de la persona a invitar').fill(email);
      await docPage.shareDialog.getByRole('button', { name: 'Compartir', exact: true }).click();
      await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'Invitación pendiente' })).toBeVisible();
      const pending = docPage.shareDialog.getByRole('listitem').filter({ hasText: email });
      await expect(pending).toHaveCount(1);
      // Inviting the same address again updates the invitation, it does not add a second one.
      await page.getByPlaceholder('Email de la persona a invitar').fill(email);
      await docPage.shareDialog.getByLabel('Permiso para el email').selectOption({ label: 'Puede editar' });
      await docPage.shareDialog.getByRole('button', { name: 'Compartir', exact: true }).click();
      await expect(pending).toHaveCount(1);
      await expect(pending).toContainText('Puede editar');
    } finally {
      await docPage.shareDialog.getByRole('button', { name: `Cancelar invitación de ${email}` }).click();
      await expect(docPage.shareDialog.getByRole('listitem').filter({ hasText: email })).toHaveCount(0);
    }
  });
});
