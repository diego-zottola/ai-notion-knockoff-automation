import { test, expect } from '../../fixtures/base.fixture.js';

test.describe('Workspace navigation', () => {
  test.beforeEach(async ({ workspace }) => {
    await workspace.open();
  });

  test('TC0005 - authenticated home shows workspace shell', async ({ workspace }) => {
    await expect(workspace.heading).toBeVisible();
    await expect(workspace.searchButton).toBeVisible();
    await expect(workspace.sidebarNewPage).toBeVisible();
    await expect(workspace.logout).toBeVisible();
  });

  const sections = [
    { tc: 'TC0006', link: 'Papelera', heading: 'Papelera' },
    { tc: 'TC0007', link: 'Miembros', heading: 'Miembros' },
    { tc: 'TC0008', link: 'Grupos', heading: 'Grupos' },
    { tc: 'TC0009', link: 'Preferencias', heading: 'Preferencias' },
    { tc: 'TC0010', link: 'Perfil', heading: 'Perfil' },
  ];
  for (const { tc, link, heading } of sections) {
    test(`${tc} - sidebar link "${link}" opens its screen`, async ({ page, workspace }) => {
      await workspace.goTo(link);
      await expect(page.getByRole('heading', { name: heading, level: 1 })).toBeVisible();
    });
  }
});
