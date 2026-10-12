import { readFileSync } from 'node:fs';
import { test, expect } from '../../fixtures/base.fixture.js';
import { FIVE_MB, clipboardOf, fixtureBytes, fixtureText, pngPayload } from '../../utils/clipboard.js';

// Images and attachments. Content enters through paste or the real upload controls. Storage failures and slow uploads are
// simulated with client-side routes (page.route), so the deployed backend is never put in a failing state.
// Files uploaded by these tests belong to `qa-auto-` pages that are purged afterwards; the app owns Storage cleanup.

// The app renames pasted images itself, so image blocks are matched by their .png name.
const IMAGE_ORDER = ['Text before the image QA', expect.stringMatching(/\.png$/), 'Text between images QA', expect.stringMatching(/\.png$/), 'Text after the images QA'];
const uploadFailure = (editor) => editor.surface.getByRole('alert').filter({ hasText: 'No se pudo subir la imagen' });
const uploading = (editor) => editor.surface.getByRole('status').filter({ hasText: 'Subiendo imagen' });

test.describe('Editor images - pasted from the clipboard', () => {
  test('TC0058 - text, image, text, image, text keeps its order and survives reload', async ({ createdPage, editor }) => {
    await editor.start();
    await editor.pasteSynthetic(clipboardOf('images'));
    const order = async () => (await editor.structure()).filter((b) => b.text).map((b) => b.text);
    await expect.poll(order).toEqual(IMAGE_ORDER);
    await editor.expectSaved();
    await editor.reloadAndWait();
    await expect.poll(order).toEqual(IMAGE_ORDER);
    await expect.poll(() => editor.imagesLoaded()).toEqual([true, true]);
  });

  test('TC0059 - images in the middle of one paragraph split it without losing either side', async ({ createdPage, editor }) => {
    await editor.start();
    await editor.pasteSynthetic({ html: fixtureText('images-inline.html') });
    await expect.poll(async () => (await editor.structure()).map((b) => [b.type, b.type === 'wsImage' ? 'image' : b.text])).toEqual([
      ['paragraph', 'Before'], ['wsImage', 'image'], ['paragraph', 'after in the same paragraph QA'],
    ]);
  });

  test('TC0060 - an image file on the clipboard (screenshot) becomes an image, never a stuck placeholder', async ({ createdPage, editor }) => {
    await editor.start();
    await editor.pasteSynthetic({ files: [pngPayload('green', 'capture.png')] });
    await expect(editor.surface.getByRole('img')).toHaveCount(1, { timeout: 20_000 });
    await expect(uploading(editor)).toHaveCount(0);
    await expect(editor.surface.getByRole('alert')).toHaveCount(0);
    await editor.expectSaved();
    await editor.reloadAndWait();
    await expect.poll(() => editor.imagesLoaded()).toEqual([true]);
  });

  test('TC0061 - HTML with an <img> plus the image file imports ONE image (no duplicate)', async ({ createdPage, editor }) => {
    await editor.start();
    await editor.pasteSynthetic({ html: '<p>With photo QA</p><img src="https://images.example.test/a.png" alt="a.png">', files: [pngPayload('red', 'a.png')] });
    await expect(editor.surface.getByRole('img')).toHaveCount(1, { timeout: 20_000 });
  });

  test('TC0062 - an external image that arrives only as a URL becomes a link plus a notice, with no request to it', async ({ createdPage, editor, page }) => {
    const external = [];
    page.on('request', (request) => { if (request.url().startsWith('https://images.example.test')) external.push(request.url()); });
    await editor.start();
    await editor.pasteSynthetic({ html: fixtureText('edge/external-image.html') });
    await expect(editor.toasts.filter({ hasText: 'imagen(es) externas no se importaron' })).toBeVisible();
    await expect(editor.surface.getByRole('img')).toHaveCount(0);
    await expect(editor.surface.getByRole('link', { name: 'External photo QA' })).toHaveAttribute('href', 'https://images.example.test/external-photo.png');
    const texts = await editor.visibleTexts();
    expect(texts[0]).toBe('Before the external image QA');
    expect(texts.at(-1)).toBe('After the external image QA');
    expect(external).toEqual([]);
  });

  test('TC0063 - an embedded image over 5 MB is rejected on paste while the surrounding text is kept', async ({ createdPage, editor }) => {
    await editor.start();
    const huge = `data:image/png;base64,${Buffer.alloc(FIVE_MB + 100_000, 1).toString('base64')}`;
    await editor.pasteSynthetic({ html: `<p>Before huge QA</p><p><img src="${huge}" alt="huge.png"></p><p>After huge QA</p>` });
    await expect(editor.toasts.filter({ hasText: 'supera el máximo de 5 MB' })).toBeVisible({ timeout: 20_000 });
    await expect.poll(() => editor.visibleTexts()).toEqual(['Before huge QA', 'After huge QA']);
    await expect(editor.surface.getByRole('img')).toHaveCount(0);
  });
});

test.describe('Editor images - upload failures, undo and limits', () => {
  test('TC0064 - a failed upload ends in a recoverable error: Reintentar imports it, Quitar removes it', async ({ createdPage, editor, page }) => {
    const fail = (route) => route.abort('failed');
    await page.route('**/storage/v1/object/**', fail);
    await editor.start();
    await editor.pasteSynthetic({ html: fixtureText('images-inline.html') });
    const failed = uploadFailure(editor);
    await expect(failed).toBeVisible({ timeout: 20_000 });
    await expect(uploading(editor)).toHaveCount(0);
    await page.unroute('**/storage/v1/object/**', fail);
    await failed.getByRole('button', { name: 'Reintentar' }).click();
    await expect(editor.surface.getByRole('img')).toHaveCount(1, { timeout: 20_000 });
    await editor.expectSaved();

    await page.route('**/storage/v1/object/**', fail);
    await editor.caret('after in the same paragraph QA', 'end');
    await editor.pasteSynthetic({ files: [pngPayload('red', 'second.png')] });
    await expect(failed).toBeVisible({ timeout: 20_000 });
    await failed.getByRole('button', { name: 'Quitar' }).click();
    await expect(failed).toHaveCount(0);
    await page.unroute('**/storage/v1/object/**', fail);
    await editor.expectSaved();
    await expect(editor.surface.getByRole('img')).toHaveCount(1);
  });

  test('TC0065 - an image deleted and restored with undo is recovered, saved, and still there after reload', async ({ createdPage, editor }) => {
    await editor.start();
    await editor.pasteSynthetic({ files: [pngPayload('blue', 'restore.png')] });
    const image = editor.surface.getByRole('img');
    await expect(image).toBeVisible({ timeout: 20_000 });
    await editor.expectSaved();
    await editor.deleteViaSelection(/\.png/);
    await expect(image).toHaveCount(0);
    await editor.undo.click();
    await expect(image).toBeVisible();
    await editor.expectSaved();
    await editor.reloadAndWait();
    await expect.poll(() => editor.imagesLoaded()).toEqual([true]);
  });

  test('TC0066 - upload, delete and undo in quick succession (upload still in flight) recovers the image', async ({ createdPage, editor, page }) => {
    let release;
    const gate = new Promise((resolve) => { release = resolve; });
    await page.route('**/storage/v1/object/**', async (route) => {
      if (route.request().method() === 'POST') await gate;
      await route.continue();
    });
    await editor.start();
    await editor.pasteSynthetic({ files: [pngPayload('red', 'quick.png')] });
    await expect(uploading(editor)).toBeVisible();
    await editor.deleteViaSelection(/Bloque vacío/);
    await expect(uploading(editor)).toHaveCount(0);
    await editor.undo.click();
    await expect(uploading(editor)).toBeVisible();
    release();
    await expect(editor.surface.getByRole('img')).toBeVisible({ timeout: 20_000 });
    await editor.expectSaved();
    await editor.reloadAndWait();
    await expect.poll(() => editor.imagesLoaded()).toEqual([true]);
  });

  // Known defect DEF-04.
  test('TC0067 - undo AFTER the in-flight upload finished while the image was deleted still restores a usable image', async ({ createdPage, editor, page }, testInfo) => {
    testInfo.annotations.push({ type: 'defect', description: 'DEF-04: the upload finishing while the placeholder is deleted discards the file, so undo restores a broken placeholder' });
    let release;
    const gate = new Promise((resolve) => { release = resolve; });
    await page.route('**/storage/v1/object/**', async (route) => {
      if (route.request().method() === 'POST') await gate;
      await route.continue();
    });
    await editor.start();
    await editor.pasteSynthetic({ files: [pngPayload('green', 'late.png')] });
    await expect(uploading(editor)).toBeVisible();
    await editor.deleteViaSelection(/Bloque vacío/);
    const uploaded = page.waitForResponse((r) => r.url().includes('/storage/v1/object/') && r.request().method() === 'POST');
    release();
    await uploaded;
    await editor.expectSaved();
    await editor.undo.click();
    // Acceptable outcomes: the image, or an error the person can recover from with "Reintentar".
    const image = editor.surface.getByRole('img');
    const failed = uploadFailure(editor);
    await expect(image.or(failed)).toBeVisible({ timeout: 20_000 });
    if (await failed.isVisible()) await failed.getByRole('button', { name: 'Reintentar' }).click();
    await expect(image).toBeVisible({ timeout: 20_000 });
    await editor.expectSaved();
    await editor.reloadAndWait();
    await expect.poll(() => editor.imagesLoaded()).toEqual([true]);
  });

  for (const [tc, label, file] of [
    ['TC0068', 'an unsupported image format', { name: 'logo.bmp', mimeType: 'image/bmp', buffer: Buffer.from('BM-not-supported') }],
    ['TC0069', 'an image over 5 MB', { name: 'huge.png', mimeType: 'image/png', buffer: Buffer.alloc(FIVE_MB + 1, 1) }],
  ]) {
    test(`${tc} - ${label} is refused with a message and the page content is untouched`, async ({ createdPage, editor }) => {
      await editor.start({ saved: ['Previous content QA'] });
      await editor.imageInput.setInputFiles(file);
      await expect(editor.toasts.filter({ hasText: /Solo se pueden subir imágenes|supera el máximo de 5 MB/ })).toBeVisible();
      await expect(editor.surface.getByRole('img')).toHaveCount(0);
      await expect(editor.block('Previous content QA')).toBeVisible();
      await editor.expectSaved();
      await editor.reloadAndWait();
      expect(await editor.visibleTexts()).toEqual(['Previous content QA']);
    });
  }
});

test.describe('Editor attachments', () => {
  test('TC0070 - opening the file picker does not unmount the toolbar or the input (emulating the dialog blur)', async ({ createdPage, editor, page }) => {
    await editor.start({ focus: false });
    const chooser = await editor.openAttachmentChooser();
    // A native dialog blurs the page with no related target. The OS dialog itself cannot be driven by Playwright.
    await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
    await expect(editor.toolbar).toBeVisible();
    await expect(editor.attachmentInput).toBeAttached();
    await chooser.setFiles({ name: 'reporte-qa.txt', mimeType: 'text/plain', buffer: fixtureBytes('attachments/reporte-qa.txt') });
    await expect(editor.attachmentRow('reporte-qa.txt')).toBeVisible({ timeout: 20_000 });
  });

  for (const [tc, name, mimeType] of [['TC0071', 'reporte-qa.txt', 'text/plain'], ['TC0072', 'datos-qa.csv', 'text/csv']]) {
    test(`${tc} - ${name} can be attached, opened, downloaded with its content, and persists after reload`, async ({ createdPage, editor, page }) => {
      await editor.start({ focus: false });
      const buffer = fixtureBytes(`attachments/${name}`);
      const chooser = await editor.openAttachmentChooser();
      await chooser.setFiles({ name, mimeType, buffer });
      const row = editor.attachmentRow(name);
      await expect(row).toBeVisible({ timeout: 20_000 });
      await editor.expectSaved();

      const downloadLink = row.getByRole('link', { name: 'Descargar', exact: true });
      // Observable state: the link carries the server-signed "download" URL. Before that it points at the inline URL,
      // which a cross-origin <a download> cannot turn into a download (DEF-05).
      const serverSide = async () => {
        await expect(downloadLink).toHaveAttribute('href', /download=/);
        const open = await row.getByRole('link', { name: 'Abrir', exact: true }).getAttribute('href');
        const opened = await page.context().request.get(open);
        expect(opened.ok()).toBe(true);
        expect(Buffer.from(await opened.body()).equals(buffer)).toBe(true);
        const attachment = await page.context().request.get(await downloadLink.getAttribute('href'));
        expect(attachment.headers()['content-disposition']).toMatch(new RegExp(`attachment.*${name.replace('.', '\\.')}`));
        expect(Buffer.from(await attachment.body()).equals(buffer)).toBe(true);
      };
      await test.step('open, server-side download and real browser download', async () => {
        await serverSide();
        const downloadEvent = page.waitForEvent('download');
        await downloadLink.click();
        const download = await downloadEvent;
        expect(download.suggestedFilename()).toBe(name);
        expect(await download.failure()).toBeNull();
        expect(readFileSync(await download.path()).equals(buffer)).toBe(true);
      });
      await editor.reloadAndWait();
      await expect(row).toBeVisible({ timeout: 20_000 });
      // A second download in the same WebKit page session emits no event, so after the reload persistence is verified
      // through the same signed URLs the links use.
      await test.step('after reload: open and download URLs still serve the file', serverSide);
    });
  }

  for (const [tc, label, file] of [
    ['TC0073', 'an executable', { name: 'script-qa.exe', mimeType: 'application/x-msdownload', buffer: fixtureBytes('attachments/script-qa.exe') }],
    ['TC0074', 'an HTML file', { name: 'pagina-qa.html', mimeType: 'text/html', buffer: fixtureBytes('attachments/pagina-qa.html') }],
    ['TC0075', 'a PDF over 5 MB', { name: 'big-qa.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(FIVE_MB + 1, 1) }],
  ]) {
    test(`${tc} - ${label} is refused with a message and the page keeps its content`, async ({ createdPage, editor }) => {
      await editor.start({ saved: ['Previous content QA'], focus: false });
      const chooser = await editor.openAttachmentChooser();
      await chooser.setFiles(file);
      await expect(editor.toasts.filter({ hasText: /Formato no admitido|supera el máximo de 5 MB/ })).toBeVisible();
      await expect(editor.surface.locator('[data-content-type="wsFile"]')).toHaveCount(0);
      await expect(editor.block('Previous content QA')).toBeVisible();
      await editor.expectSaved();
      await editor.reloadAndWait();
      expect(await editor.visibleTexts()).toEqual(['Previous content QA']);
    });
  }
});
