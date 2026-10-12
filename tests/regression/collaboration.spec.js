import { test, expect, VIEWER } from '../../fixtures/base.fixture.js';

// Live collaboration with two real sessions: the owner and the QA viewer (UC-RT-001, AC-CMT-008).
// The owner shares its own qa-auto- test page as "Puede ver"; teardown purges it. Test cases and priorities:
// docs/test-cases-coverage-gaps.md.
const BODY = 'Live body QA';

test.describe('Live collaboration', () => {
  test.beforeEach(async ({ createdPage, editor, docPage, viewerPage }) => {
    await editor.start();
    await editor.page.keyboard.type(BODY);
    await editor.expectSaved();
    await docPage.shareWithUser(VIEWER.email, VIEWER.name);
    await docPage.closeShare();
    await viewerPage.goto(createdPage.url);
    await expect(viewerPage.getByText(BODY)).toBeVisible();
  });

  test('TC0147 - text typed by the owner appears for the viewer without reloading', async ({ editor, viewerPage }) => {
    await editor.caret(BODY, 'end');
    await editor.page.keyboard.type(' plus live');
    await expect(viewerPage.getByText(`${BODY} plus live`)).toBeVisible({ timeout: 20_000 });
  });

  test('TC0148 - the owner sees that someone else is on the page, and the notice goes when they leave', async ({ page, viewerPage }) => {
    const here = page.getByText('también está acá');
    await expect(here).toBeVisible({ timeout: 30_000 });
    await viewerPage.goto('/');
    await expect(here).toHaveCount(0, { timeout: 30_000 });
  });

  test('TC0149 - a comment from the owner appears on the viewer\'s page without reloading', async ({ comments, viewerPage }) => {
    await comments.openFor(BODY);
    await comments.add('Live comment QA');
    await expect(viewerPage.locator('[data-comments-bubble] button').first()).toHaveAttribute('aria-label', '1 comentario en este bloque', { timeout: 20_000 });
  });

  test('TC0150 - a title change by the owner reaches the viewer\'s sidebar without reloading', async ({ createdPage, docPage, viewerPage }) => {
    const renamed = `${createdPage.title}-r`;
    await docPage.title.fill(renamed);
    await expect(viewerPage.getByRole('navigation', { name: 'Páginas' }).getByRole('link', { name: renamed, exact: true })).toBeVisible({ timeout: 20_000 });
  });
});
