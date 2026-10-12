import { test, expect } from '../../fixtures/base.fixture.js';

// Preferences persisted on the device, the classic editor fallback, session resume and profile editing
// (UC-PROF-001, AC-BLK-025, UC-AUTH-001). Test cases and priorities: docs/test-cases-coverage-gaps.md.
// Preferences live in the browser (per device), and every test gets a fresh context, so nothing leaks between tests.
test.describe('Preferences and classic editor', () => {
  test('TC0130 - the dark theme applies immediately and persists after reload', async ({ page, workspace, preferencesPage }) => {
    await page.goto('/settings');
    await preferencesPage.themeGroup.getByText('Oscuro', { exact: true }).click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await page.reload();
    await expect(preferencesPage.themeGroup.getByRole('radio', { name: 'Oscuro' })).toBeChecked();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await preferencesPage.themeGroup.getByText('Claro', { exact: true }).click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('TC0131 - "Vista compacta" can be switched on and persists after reload', async ({ page, preferencesPage }) => {
    await page.goto('/settings');
    await expect(preferencesPage.compactSwitch).not.toBeChecked();
    await preferencesPage.compactSwitch.click();
    await expect(preferencesPage.compactSwitch).toBeChecked();
    await page.reload();
    await expect(preferencesPage.compactSwitch).toBeChecked();
  });

  test('TC0132 - with "Editor con formato" off, a page opens in the classic editor and the switch restores the rich one', async ({ page, createdPage, editor, preferencesPage, workspace }) => {
    await editor.waitForEditor();
    await page.goto('/settings');
    const rich = page.getByRole('switch', { name: 'Editor con formato' });
    await expect(rich).toBeChecked();
    await rich.click();
    await expect(rich).not.toBeChecked();
    await page.goto(createdPage.url);
    await expect(page.getByRole('button', { name: 'Agregar bloque' })).toBeVisible();
    await expect(editor.surface).toHaveCount(0);
    await page.goto('/settings');
    await rich.click();
    await expect(rich).toBeChecked();
    await page.goto(createdPage.url);
    await editor.waitForEditor();
  });

  test('TC0133 - a block typed in the classic editor persists after reload', async ({ page, createdPage, editor, docPage }) => {
    await editor.waitForEditor();
    await page.goto('/settings');
    await page.getByRole('switch', { name: 'Editor con formato' }).click();
    await page.goto(createdPage.url);
    await docPage.addBlock.click();
    const saved = page.waitForResponse((r) => ['POST', 'PATCH'].includes(r.request().method()) && r.url().includes('/rest/v1/blocks') && r.ok());
    await docPage.firstBlock.fill('Classic QA text');
    await saved;
    await page.reload();
    await expect(docPage.firstBlock).toHaveValue('Classic QA text');
  });
});

test.describe('Session and profile', () => {
  test('TC0134 - the session survives a reload and /login redirects a signed-in user away', async ({ page, workspace }) => {
    await workspace.open();
    await page.reload();
    await expect(workspace.switcher).toBeVisible();
    await page.goto('/login');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(workspace.switcher).toBeVisible();
  });

  test('TC0135 - the display name can be changed and persists; a blank name is rejected; the name is restored', async ({ page, workspace, profilePage }) => {
    await page.goto('/profile');
    await expect(profilePage.nameField).not.toHaveValue('');
    const original = await profilePage.nameField.inputValue();
    // Always different from the saved name, even if an earlier aborted run left the suffix behind.
    const renamed = original.endsWith(' QA2') ? original.slice(0, -4) : `${original} QA2`;
    try {
      await profilePage.nameField.fill('   ');
      await expect(profilePage.saveName).toBeDisabled();
      await profilePage.nameField.fill(renamed);
      await profilePage.saveName.click();
      await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'Nombre actualizado' })).toBeVisible();
      await page.reload();
      await expect(profilePage.nameField).toHaveValue(renamed);
    } finally {
      await profilePage.nameField.fill(original);
      await profilePage.saveName.click();
      await expect(page.locator('[data-sonner-toast]').filter({ hasText: 'Nombre actualizado' })).toBeVisible();
      await page.reload();
      await expect(profilePage.nameField).toHaveValue(original);
    }
  });

  test('TC0136 - leaving with unsaved changes asks for confirmation, and not when everything is saved', async ({ page, createdPage, editor }) => {
    await editor.start();
    await editor.expectSaved();
    const quiet = await page.evaluate(() => { const e = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(e); return e.defaultPrevented; });
    expect(quiet).toBe(false);
    await page.keyboard.type('Unsaved QA');
    await expect(editor.saved).toHaveText(/Sin guardar|Guardando/);
    const prompted = await page.evaluate(() => { const e = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(e); return e.defaultPrevented; });
    expect(prompted).toBe(true);
    await editor.expectSaved();
  });

  test('TC0160 - the unsaved local draft is removed from the device at logout', async ({ createdPage, editor, page, workspace, loginPage }) => {
    const draftKeys = () => page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('workspace:draft:')));
    await editor.start();
    await page.route('**/rest/v1/blocks*', (route) => (['POST', 'PATCH'].includes(route.request().method()) ? route.abort('failed') : route.continue()));
    await page.keyboard.type('Draft QA text');
    await expect.poll(draftKeys).toHaveLength(1);
    await page.unroute('**/rest/v1/blocks*');
    try {
      await workspace.logout.click();
      await expect(loginPage.submit).toBeVisible();
      expect(await draftKeys()).toEqual([]);
    } finally {
      // The fixture teardown needs a session to purge the page.
      if (!(await workspace.switcher.isVisible())) {
        await loginPage.login(process.env.TEST_USER_USERNAME, process.env.TEST_USER_PASSWORD);
        await workspace.switcher.waitFor();
      }
    }
  });
});
