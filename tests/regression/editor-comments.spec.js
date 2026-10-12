import { test, expect } from '../../fixtures/base.fixture.js';

// Block comments (UC-CMT-001). Test cases and priorities: docs/test-cases-comments.md (only High and Medium are automated).
// Everything runs as the single QA account, so author-only rules for other users are manual cases.
const FIRST = 'QA primer bloque';
const SECOND = 'QA segundo bloque';

test.describe('Block comments', () => {
  test.beforeEach(async ({ createdPage, editor }) => {
    await editor.start({ saved: [FIRST, SECOND] });
  });

  test('TC0089 - hovering a block shows the "Comentar en este bloque" bubble', async ({ editor, comments }) => {
    await editor.block(FIRST).hover();
    await expect(comments.bubbles.first()).toHaveAttribute('aria-label', 'Comentar en este bloque');
  });

  test('TC0090 - adding a comment shows it with its author and counts it on the bubble', async ({ editor, comments }) => {
    await comments.openFor(FIRST);
    await comments.add('QA comentario uno');
    await expect(comments.entries).toHaveCount(1);
    await expect(comments.entries.first()).not.toContainText('Alguien');
    await comments.close();
    await comments.expectLabel(FIRST, '1 comentario en este bloque');
  });

  test('TC0091 - a comment persists after reloading the page', async ({ editor, comments }) => {
    await comments.openFor(FIRST);
    await comments.add('QA comentario persistente');
    await comments.close();
    await editor.reloadAndWait();
    await comments.expectLabel(FIRST, '1 comentario en este bloque');
    await comments.openFor(FIRST);
    await expect(comments.entry('QA comentario persistente')).toBeVisible();
  });

  test('TC0092 - Enter sends the comment and Shift+Enter adds a new line', async ({ comments }) => {
    await comments.openFor(FIRST);
    await comments.composer.fill('linea uno');
    await comments.composer.press('Shift+Enter');
    await comments.composer.pressSequentially('linea dos');
    await expect(comments.entries).toHaveCount(0);
    await comments.composer.press('Enter');
    await expect(comments.entries).toHaveCount(1);
    await expect(comments.entries.first()).toContainText('linea uno');
    await expect(comments.entries.first()).toContainText('linea dos');
  });

  test('TC0093 - an empty or whitespace-only comment cannot be sent', async ({ comments }) => {
    await comments.openFor(FIRST);
    await expect(comments.send).toBeDisabled();
    await comments.composer.fill('   ');
    await expect(comments.send).toBeDisabled();
    await comments.composer.press('Enter');
    await expect(comments.entries).toHaveCount(0);
    await comments.composer.fill('QA texto real');
    await expect(comments.send).toBeEnabled();
  });

  test('TC0094 - replying adds to the same thread and the bubble counts root and replies', async ({ comments }) => {
    await comments.openFor(FIRST);
    await comments.add('QA raiz');
    await comments.reply('QA respuesta');
    await expect(comments.openThreads).toHaveCount(1);
    await expect(comments.entries).toHaveCount(2);
    await comments.close();
    await comments.expectLabel(FIRST, '2 comentarios en este bloque');
  });

  test('TC0095 - resolving a thread marks the block as resolved and reopening restores it', async ({ comments }) => {
    await comments.openFor(FIRST);
    await comments.add('QA para resolver');
    await comments.resolve();
    await expect(comments.panel.getByText('No hay comentarios abiertos.')).toBeVisible();
    await comments.close();
    await comments.expectLabel(FIRST, 'Comentarios resueltos en este bloque');
    await comments.openFor(FIRST);
    await comments.reopen();
    await expect(comments.openThreads).toHaveCount(1);
    await comments.close();
    await comments.expectLabel(FIRST, '1 comentario en este bloque');
  });

  test('TC0096 - "Ver resueltos" lists resolved threads and hides them again', async ({ comments }) => {
    await comments.openFor(FIRST);
    await comments.add('QA hilo resuelto');
    await comments.resolve();
    await comments.panel.getByRole('button', { name: 'Ver resueltos (1)' }).click();
    await expect(comments.resolvedThreads).toHaveCount(1);
    await expect(comments.entry('QA hilo resuelto')).toBeVisible();
    await comments.panel.getByRole('button', { name: 'Ocultar resueltos' }).click();
    await expect(comments.resolvedThreads).toHaveCount(0);
  });

  test('TC0097 - the author edits their own comment', async ({ comments }) => {
    await comments.openFor(FIRST);
    await comments.add('QA texto original');
    await comments.entry('QA texto original').getByRole('button', { name: 'Editar comentario' }).click();
    const edit = comments.panel.getByRole('textbox', { name: 'Editar comentario' });
    await edit.fill('QA texto editado');
    await comments.panel.getByRole('button', { name: 'Guardar', exact: true }).click();
    await expect(comments.entry('QA texto editado')).toBeVisible();
    await expect(comments.entry('QA texto original')).toHaveCount(0);
  });

  test('TC0098 - cancelling an edit keeps the original text', async ({ comments }) => {
    await comments.openFor(FIRST);
    await comments.add('QA no cambiar');
    await comments.entry('QA no cambiar').getByRole('button', { name: 'Editar comentario' }).click();
    await comments.panel.getByRole('textbox', { name: 'Editar comentario' }).fill('QA descartado');
    await comments.panel.getByRole('button', { name: 'Cancelar', exact: true }).click();
    await expect(comments.entry('QA no cambiar')).toBeVisible();
    await expect(comments.entry('QA descartado')).toHaveCount(0);
  });

  test('TC0099 - the author deletes their own comment and the bubble returns to empty', async ({ comments }) => {
    await comments.openFor(FIRST);
    await comments.add('QA para borrar');
    await comments.entry('QA para borrar').getByRole('button', { name: 'Eliminar comentario' }).click();
    await expect(comments.entries).toHaveCount(0);
    await expect(comments.panel.getByText('Todavía no hay comentarios en este bloque.')).toBeVisible();
    await comments.close();
    await comments.expectLabel(FIRST, 'Comentar en este bloque');
  });

  test('TC0100 - deleting the root comment removes its replies', async ({ comments }) => {
    await comments.openFor(FIRST);
    await comments.add('QA raiz borrada');
    await comments.reply('QA respuesta huerfana');
    await comments.entry('QA raiz borrada').getByRole('button', { name: 'Eliminar comentario' }).click();
    await expect(comments.entries).toHaveCount(0);
    await comments.close();
    await comments.expectLabel(FIRST, 'Comentar en este bloque');
  });

  test('TC0101 - comments on different blocks stay independent', async ({ comments }) => {
    await comments.openFor(FIRST);
    await comments.add('QA solo primero');
    await comments.close();
    await comments.openFor(SECOND);
    await expect(comments.entries).toHaveCount(0);
    await comments.add('QA solo segundo');
    await comments.close();
    await comments.expectLabel(FIRST, '1 comentario en este bloque');
    await comments.expectLabel(SECOND, '1 comentario en este bloque');
    await comments.openFor(FIRST);
    await expect(comments.entry('QA solo segundo')).toHaveCount(0);
  });

  test('TC0102 - deleting a block removes its comments and its bubble', async ({ editor, comments }) => {
    await comments.openFor(SECOND);
    await comments.add('QA bloque condenado');
    await comments.close();
    await editor.block(SECOND).locator('.bn-inline-content').click();
    await editor.page.keyboard.press('ControlOrMeta+a');
    await editor.page.keyboard.press('Backspace');
    await editor.page.keyboard.press('Backspace');
    await expect(editor.block(SECOND)).toHaveCount(0);
    await editor.expectSaved();
    await editor.reloadAndWait();
    await expect(comments.bubbles).toHaveCount(0);
  });

  test('TC0103 - the comment box limits the text to 4000 characters', async ({ comments }) => {
    await comments.openFor(FIRST);
    await expect(comments.composer).toHaveAttribute('maxlength', '4000');
  });
});
