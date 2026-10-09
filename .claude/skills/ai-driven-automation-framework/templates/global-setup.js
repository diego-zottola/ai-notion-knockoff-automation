import { chromium } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PROFILES } from './environment-profile.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', `.env.${process.env.ENV ?? 'local'}`), override: false });
dotenv.config({ path: path.resolve(__dirname, '..', '.env'), override: false });

async function loginAndSave(page, url, email, password, storageStatePath) {
  await page.goto(url, { waitUntil: 'commit', timeout: 60_000 });
  await page.getByRole('textbox', { name: '{{EMAIL_FIELD_ACCESSIBLE_NAME}}' }).fill(email);
  await page.getByRole('textbox', { name: '{{PASSWORD_FIELD_ACCESSIBLE_NAME}}' }).fill(password);
  await page.getByRole('button', { name: '{{SUBMIT_BUTTON_NAME}}' }).click();
  await page.waitForURL(/{{POST_LOGIN_URL_REGEX}}/, { timeout: 30_000 });
  await page.context().storageState({ path: storageStatePath });
}

// Add roles in environment-profile.js — no changes needed here
export default async function globalSetup() {
  const browser = await chromium.launch();

  for (const profile of Object.values(PROFILES)) {
    const ctx = await browser.newContext();
    await loginAndSave(
      await ctx.newPage(),
      profile.baseUrl ?? '{{DEV_URL}}',
      process.env[`${profile.credentialsEnvPrefix}_EMAIL`],
      process.env[`${profile.credentialsEnvPrefix}_PASSWORD`],
      path.resolve(__dirname, '..', profile.storageStatePath),
    );
    await ctx.close();
  }

  await browser.close();
}
