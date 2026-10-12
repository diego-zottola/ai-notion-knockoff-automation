import { devices } from '@playwright/test';
import { test as base, expect, TEST_PREFIX } from '../../fixtures/base.fixture.js';
import { WorkspacePage } from '../../pages/WorkspacePage.js';
import { EditorPage } from '../../pages/EditorPage.js';

// Emulated phone (viewport, touch, mobile user agent). It is an emulation: real device keyboards, touch selection handles
// and the OS clipboard are not covered.
// The sidebar is a sheet on a phone, so the QA page is created and purged from a desktop-sized context (same page
// objects) and only the editing under test happens on the phone page.
const test = base.extend({
  phonePage: async ({ browser, baseURL, page }, use) => {
    const desktop = await browser.newContext({ baseURL, storageState: './auth/default.storageState.json', viewport: { width: 1280, height: 800 } });
    const desktopPage = await desktop.newPage();
    const workspace = new WorkspacePage(desktopPage);
    const doc = new EditorPage(desktopPage);
    await workspace.open();
    await workspace.createPageFromSidebar();
    const title = `${TEST_PREFIX}${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    await doc.setTitle(title);
    await page.goto(desktopPage.url());
    await use({ title });
    await workspace.open();
    await workspace.purgePagesByPrefix(title);
    await desktop.close();
  },
});

test.use({ ...devices['Pixel 7'] });

const cells = (tag) => Array.from({ length: 8 }, (_, i) => `<${tag}>Wide column number ${i + 1} QA</${tag}>`).join('');

test.describe('Editor on a phone', () => {
  test('TC0087 - a wide table scrolls horizontally inside the page instead of overflowing it', async ({ phonePage, editor, page }) => {
    await editor.start();
    await editor.pasteSynthetic({ html: `<table><tr>${cells('th')}</tr><tr>${cells('td')}</tr></table>` });
    const wrapper = editor.surface.locator('.tableWrapper').first();
    const metrics = await wrapper.evaluate((el) => ({ client: el.clientWidth, scroll: el.scrollWidth, overflowX: getComputedStyle(el).overflowX }));
    expect(metrics.overflowX).toBe('auto');
    expect(metrics.scroll).toBeGreaterThan(metrics.client);
    await editor.surface.locator('td').last().scrollIntoViewIfNeeded();
    expect(await wrapper.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });

  // Known defect DEF-07.
  test('TC0088 - block selection and editor controls are reachable by touch', async ({ phonePage, editor, page }, testInfo) => {
    testInfo.annotations.push({ type: 'defect', description: 'DEF-07: on a phone the floating menu stays over the block-selection panel and covers "Terminar selección", even after the text selection collapses' });
    await editor.start({ saved: ['Touch one QA', 'Touch two QA', 'Touch three QA'], focus: false });
    await editor.openSelectionMode('Touch three QA', 'tap');
    await page.getByRole('checkbox', { name: /Touch one QA/ }).check();
    await page.getByRole('checkbox', { name: /Touch two QA/ }).check();
    await expect(page.getByRole('button', { name: 'Eliminar 2 bloques', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Terminar selección', exact: true }).tap();
    await editor.selectBlockText('Touch three QA');
    for (const name of ['Negrita', 'Cursiva', 'Enlace', 'Más opciones']) {
      const box = await editor.button(name).boundingBox();
      expect(box, name).not.toBeNull();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize().width);
    }
  });
});
