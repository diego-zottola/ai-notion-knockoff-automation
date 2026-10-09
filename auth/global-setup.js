import { chromium } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', `.env.${process.env.ENV ?? 'local'}`), override: false });
dotenv.config({ path: path.resolve(__dirname, '..', '.env'), override: false });

const { PROFILES } = await import('./environment-profile.js');

async function loginAndSave(page, url, username, password, storageStatePath) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.getByRole('textbox', { name: 'Usuario' }).fill(username);
  await page.getByRole('textbox', { name: 'Contraseña' }).fill(password);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForURL(/\/w\//, { timeout: 30_000 });
  await page.getByRole('button', { name: 'Cambiar de espacio de trabajo' }).waitFor();
  await page.context().storageState({ path: storageStatePath });
}

export default async function globalSetup() {
  const browser = await chromium.launch();
  for (const profile of Object.values(PROFILES)) {
    const ctx = await browser.newContext();
    await loginAndSave(
      await ctx.newPage(),
      profile.baseUrl,
      process.env[`${profile.credentialsEnvPrefix}_USERNAME`],
      process.env[`${profile.credentialsEnvPrefix}_PASSWORD`],
      path.resolve(__dirname, '..', profile.storageStatePath),
    );
    await ctx.close();
  }
  await browser.close();
}
