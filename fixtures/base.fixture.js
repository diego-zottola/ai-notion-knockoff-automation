import { test as base, expect } from '@playwright/test';
import { PROFILES, useEnvironment } from '../auth/environment-profile.js';
import { LoginPage } from '../pages/LoginPage.js';
import { WorkspacePage } from '../pages/WorkspacePage.js';
import { DocPage } from '../pages/DocPage.js';
import { EditorPage } from '../pages/EditorPage.js';
import { CommentsPage } from '../pages/CommentsPage.js';
import { TrashPage } from '../pages/TrashPage.js';
import { MembersPage, GroupsPage, PreferencesPage, ProfilePage } from '../pages/SettingsPages.js';

// Test data is prefixed so cleanup never touches pages the QA account owned before the run.
export const VIEWER = { email: process.env.VIEWER_USER_USERNAME, name: 'QA Viewer' };
export const TEST_PREFIX = 'qa-auto-';

export const test = base.extend({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  workspace: async ({ page }, use) => use(new WorkspacePage(page)),
  docPage: async ({ page }, use) => use(new DocPage(page)),
  editor: async ({ page }, use) => use(new EditorPage(page)),
  comments: async ({ page, editor }, use) => use(new CommentsPage(page, editor)),
  trashPage: async ({ page }, use) => use(new TrashPage(page)),
  membersPage: async ({ page }, use) => use(new MembersPage(page)),
  groupsPage: async ({ page }, use) => use(new GroupsPage(page)),
  preferencesPage: async ({ page }, use) => use(new PreferencesPage(page)),
  profilePage: async ({ page }, use) => use(new ProfilePage(page)),
  // Second identity (GUEST of the QA workspace, VIEWER only where a page is shared with it): its own browser context.
  viewerPage: async ({ browser, baseURL }, use) => {
    const context = await browser.newContext({ baseURL, storageState: PROFILES.viewer.storageStatePath });
    await use(await context.newPage());
    await context.close();
  },
  environmentProfile: async ({}, use) => use(PROFILES.default),
  // Creates a titled page and purges it (archive + delete forever) after the test.
  createdPage: async ({ page, workspace, docPage }, use) => {
    await workspace.open();
    await workspace.createPageFromSidebar();
    const title = `${TEST_PREFIX}${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    try {
      await docPage.setTitle(title);
      await use({ title, url: page.url() });
    } finally {
      // Also runs when the setup fails, so a page whose title never saved is not leaked on the QA account.
      await workspace.open();
      await workspace.purgePagesByPrefix(title);
    }
  },
});

export { expect, useEnvironment };
