import { test, expect } from '../../fixtures/base.fixture.js';
import { MOD, clipboardOf, fixtureUrl } from '../../utils/clipboard.js';

// NATIVE clipboard: a real keyboard copy from the local reference page, a real keyboard paste into the editor, and the
// async Clipboard API. These are the only tests that say anything about the native clipboard; the DataTransfer tests
// elsewhere are deterministic but synthetic.
//
// Limitations: headless browsers may have no usable OS clipboard, so each test probes it first and is SKIPPED (never
// reported as passed) when unavailable. Playwright cannot drive an OS paste menu or a physical phone keyboard, so the
// native clipboard is exercised on the desktop profile only.

async function nativeClipboardWorks(context) {
  const probe = await context.newPage();
  try {
    await probe.setContent('<textarea id="t"></textarea>');
    const box = probe.locator('#t');
    await box.fill('PROBE-QA');
    await box.press(`${MOD}+A`);
    await box.press(`${MOD}+C`);
    await box.fill('');
    await box.press(`${MOD}+V`);
    return (await box.inputValue()) === 'PROBE-QA';
  } finally {
    await probe.close();
  }
}

/** What a faithful paste of the reference page must contain (a subset: browsers add their own wrapper markup). */
async function expectReferenceContent(editor) {
  const blocks = await editor.structure();
  expect(blocks).toContainEqual(expect.objectContaining({ type: 'heading', level: 1, text: 'Title one QA' }));
  expect(blocks).toContainEqual(expect.objectContaining({ type: 'quote', text: 'Test quote QA' }));
  expect(blocks).toContainEqual(expect.objectContaining({ type: 'bulletListItem', depth: 2, text: 'Bullet grandchild' }));
  expect(blocks.find((block) => block.type === 'table')?.rows[0]).toEqual(['Key', 'Value', 'Note']);
  await expect(editor.diagram.locator('[role="img"] svg')).toBeVisible({ timeout: 20_000 });
  const texts = blocks.map((block) => block.text);
  const at = (text) => texts.indexOf(text);
  expect(at('Text before the image QA')).toBeGreaterThan(-1);
  expect(blocks[at('Text before the image QA') + 1].type).toBe('wsImage');
  expect(at('Text between images QA')).toBe(at('Text before the image QA') + 2);
  expect(blocks[at('Text between images QA') + 1].type).toBe('wsImage');
  expect(blocks.filter((block) => block.text === 'Document closing QA')).toHaveLength(1);
}

test.describe('Editor native clipboard', () => {
  test('TC0085 - select the reference page, copy with the keyboard, paste into the editor', async ({ createdPage, editor, page, context }) => {
    test.setTimeout(120_000);
    test.skip(!(await nativeClipboardWorks(context)), 'The native OS clipboard is not usable in this browser/headless environment: NOT verified');
    await editor.waitForEditor();
    const source = await context.newPage();
    await source.goto(fixtureUrl('manual-copy.html'));
    await source.locator('#select-all').click();
    await source.keyboard.press(`${MOD}+C`);
    await source.close();
    await page.bringToFront();
    await editor.surface.click();
    await editor.nativePaste();
    await expectReferenceContent(editor);
    await editor.expectSaved(60_000);
    await editor.reloadAndWait();
    await expectReferenceContent(editor);
  });

  test('TC0086 - the async Clipboard API (HTML + plain text) pasted with the keyboard imports the HTML once', async ({ createdPage, editor, page, context, browserName }) => {
    if (browserName === 'chromium') await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await editor.waitForEditor();
    const { html, text } = clipboardOf('rich-page');
    // A real click supplies the user activation the Clipboard API requires.
    await page.evaluate((payload) => {
      const button = document.createElement('button');
      button.id = 'qa-copy';
      button.textContent = 'copy QA';
      button.style.cssText = 'position:fixed;top:0;right:0;z-index:99999';
      button.onclick = async () => {
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([payload.html], { type: 'text/html' }), 'text/plain': new Blob([payload.text], { type: 'text/plain' }) })]);
          window.__qaCopy = 'ok';
        } catch (error) { window.__qaCopy = `error:${error.name}`; }
      };
      document.body.append(button);
    }, { html, text });
    await page.locator('#qa-copy').click();
    await expect.poll(() => page.evaluate(() => window.__qaCopy)).toBeTruthy();
    const outcome = await page.evaluate(() => window.__qaCopy);
    test.skip(outcome !== 'ok', `navigator.clipboard.write is not available in ${browserName} here (${outcome}): NOT verified`);
    await editor.surface.click();
    await editor.nativePaste();
    await expect.poll(async () => (await editor.visibleTexts()).length).toBeGreaterThan(10);
    const texts = await editor.visibleTexts();
    expect(texts.filter((t) => t === 'Title one QA')).toHaveLength(1);
    expect(texts.filter((t) => t === 'Document closing QA')).toHaveLength(1);
  });
});
