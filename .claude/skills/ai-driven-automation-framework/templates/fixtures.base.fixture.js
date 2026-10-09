import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { PROFILES, useEnvironment } from './environment-profile.js';
// add one import + fixture per new Page Object

// BEFORE: test.use({ storageState: 'auth/admin.storageState.json' })
// AFTER:  test.use(useEnvironment('admin'))

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  environmentProfile: async (_, use) => {
    await use(PROFILES.default);
  },
  // ...
});

export { expect, useEnvironment };
