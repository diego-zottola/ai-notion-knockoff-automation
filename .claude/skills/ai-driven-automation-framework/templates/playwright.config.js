import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.ENV ?? 'local'}`, override: false });
dotenv.config({ path: '.env', override: false });

const env = process.env.ENV ?? 'local';
const storageStatePath = env === 'local' ? './auth/storageState.json' : `./auth/${env}_storageState.json`;

// MCP integration:
// In CI: Playwright MCP runs as a background service (see workflows/).
// In local dev: start manually with `npx @playwright/mcp@latest`
// The PLAYWRIGHT_MCP_PORT env var (default 3000) is read by MCP-aware
// Page Objects to connect to the running server.
export default defineConfig({
  testDir: './tests',
  globalSetup: './auth/global-setup.js',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : undefined,
  expect: { timeout: 15_000 },
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
  ],
  use: {
    baseURL: process.env.BASE_URL ?? '{{DEV_URL}}',
    // Uncomment ONLY if exploration (step 6) confirms the CDN/WAF blocks Playwright's default UA:
    // userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    storageState: storageStatePath,
    screenshot: process.env.CI ? 'only-on-failure' : 'on',
    video: process.env.CI ? 'retain-on-failure' : 'on',
    trace: process.env.CI ? 'retain-on-failure' : 'on',
    actionTimeout: 10_000,
    navigationTimeout: 30_000, // raise to 120_000 only if slow cold-starts are confirmed (see step 6)
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      // Add launchOptions: { args: ['--disable-quic'] } only if exploration justifies it
    },
  ],
  outputDir: 'test-results',
  timeout: 60_000,
});
