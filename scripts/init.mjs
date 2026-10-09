#!/usr/bin/env node
// Guided onboarding: URL -> first look -> credentials -> optional Jira/Slack -> Claude does the rest.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import readline from 'node:readline';
import { chromium } from '@playwright/test';

const ENV_FILE = '.env';
const say = (msg = '') => console.log(msg);

function ask(question, { hidden = false, fallback = '' } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    let asked = false;
    if (hidden) {
      const write = rl._writeToOutput.bind(rl);
      rl._writeToOutput = (text) => {
        if (!asked) write(text);
      };
    }
    rl.question(`${question}${fallback ? ` [${fallback}]` : ''}: `, (answer) => {
      rl.close();
      if (hidden) say();
      resolve(answer.trim() || fallback);
    });
    asked = true;
  });
}

const yes = async (question, def = 'n') => /^y/i.test(await ask(`${question} (y/n)`, { fallback: def }));

function setEnv(values) {
  const lines = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, 'utf8').split('\n') : [];
  for (const [key, value] of Object.entries(values)) {
    const idx = lines.findIndex((l) => l.startsWith(`${key}=`));
    if (idx >= 0) lines[idx] = `${key}=${value}`;
    else lines.push(`${key}=${value}`);
  }
  writeFileSync(ENV_FILE, lines.filter((l, i, a) => l || i < a.length - 1).join('\n') + '\n');
}

function ensureGitignore() {
  const needed = ['.env', '.env.*', '!.env.example', 'auth/*.storageState.json'];
  const current = existsSync('.gitignore') ? readFileSync('.gitignore', 'utf8') : '';
  const missing = needed.filter((n) => !current.split('\n').includes(n));
  if (missing.length) appendFileSync('.gitignore', `\n# Added by init\n${missing.join('\n')}\n`);
}

function have(cmd) {
  return spawnSync(cmd, ['--version'], { stdio: 'ignore' }).status === 0;
}

async function firstLook(url, extraHeaders) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ extraHTTPHeaders: extraHeaders });
  const page = await context.newPage();
  const result = { reachable: false, protected: false, login: 'none', userField: 'username', finalUrl: url };
  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    // SPAs hydrate late: wait until a login control shows up, otherwise assume no login.
    await page
      .locator('input[type="password"], button:has-text("Google"), a:has-text("Google")')
      .first()
      .waitFor({ state: 'visible', timeout: 12000 })
      .catch(() => {});
    result.reachable = Boolean(response);
    result.finalUrl = page.url();
    const status = response?.status() ?? 0;
    const body = (await page.content()).toLowerCase();
    result.protected = status === 401 || body.includes('vercel authentication') || body.includes('_vercel/sso');
    if (!result.protected) {
      const hasPassword = (await page.locator('input[type="password"]:visible').count()) > 0;
      const hasGoogle = (await page.getByText(/google/i).first().isVisible().catch(() => false));
      const hasEmail = (await page.locator('input[type="email"]:visible').count()) > 0;
      result.userField = hasEmail ? 'email' : 'username';
      result.login = hasPassword && hasGoogle ? 'password+google' : hasPassword ? 'password' : hasGoogle ? 'google' : 'none';
    }
  } catch {
    result.reachable = false;
  } finally {
    await browser.close();
  }
  return result;
}

async function validateLogin(url, headers, user, pass) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ extraHTTPHeaders: headers });
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.locator('input[type="password"]').first().waitFor({ timeout: 15000 });
    await page.locator('input:not([type="password"]):not([type="hidden"]):visible').first().fill(user);
    await page.locator('input[type="password"]').first().fill(pass);
    await page.locator('button[type="submit"], button:visible').filter({ hasNotText: /google/i }).first().click();
    await page.locator('input[type="password"]').waitFor({ state: 'detached', timeout: 15000 });
    return true;
  } catch {
    return false;
  } finally {
    await browser.close();
  }
}

async function captureManualSession(url, headers) {
  say('\nOpening a browser: log in manually, then come back here and press Enter.');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ extraHTTPHeaders: headers });
  const page = await context.newPage();
  await page.goto(url);
  await ask('Press Enter once you are logged in');
  const { mkdirSync } = await import('node:fs');
  mkdirSync('auth', { recursive: true });
  await context.storageState({ path: 'auth/default.storageState.json' });
  await browser.close();
}

function setGithubSecrets(values) {
  if (!have('gh') || spawnSync('git', ['remote', 'get-url', 'origin'], { stdio: 'ignore' }).status !== 0) {
    say('Skipping GitHub secrets (gh CLI or git remote not available).');
    return;
  }
  for (const [key, value] of Object.entries(values)) {
    if (!value) continue;
    const r = spawnSync('gh', ['secret', 'set', key], { input: value, stdio: ['pipe', 'ignore', 'inherit'] });
    say(r.status === 0 ? `  secret ${key} set` : `  could not set ${key}`);
  }
}

async function main() {
  say('\n=== AI-driven automation: guided setup ===\n');
  if (!have('claude')) {
    say('Claude Code CLI not found. Install it first: https://docs.claude.com/claude-code');
    process.exit(1);
  }
  ensureGitignore();

  let url = await ask('Application URL (https://...)');
  if (!/^https?:\/\//.test(url)) {
    say('The URL must start with http:// or https://');
    process.exit(1);
  }
  url = url.replace(/\/$/, '');

  say('\nInstalling the browser if needed...');
  spawnSync('npx', ['playwright', 'install', 'chromium'], { stdio: 'inherit' });

  say('\nTaking a first look at the application...');
  let headers = {};
  let look = await firstLook(url, headers);
  let bypass = '';
  if (look.protected) {
    say('Vercel Deployment Protection detected.');
    bypass = await ask('Protection bypass secret (Vercel > Settings > Deployment Protection)', { hidden: true });
    headers = { 'x-vercel-protection-bypass': bypass, 'x-vercel-set-bypass-cookie': 'true' };
    look = await firstLook(url, headers);
  }
  if (!look.reachable) {
    say('Could not reach the application. Check the URL and try again.');
    process.exit(1);
  }
  say(`Login type detected: ${look.login}`);
  setEnv({ BASE_URL: url, LOGIN_TYPE: look.login, ...(bypass && { VERCEL_AUTOMATION_BYPASS_SECRET: bypass }) });

  const secrets = { VERCEL_AUTOMATION_BYPASS_SECRET: bypass };
  if (look.login === 'password' || look.login === 'password+google') {
    say('\nUse an account dedicated to QA, not a real user account.');
    for (let attempt = 1; attempt <= 3; attempt++) {
      const user = await ask(look.userField === 'email' ? 'Test user email' : 'Test user username');
      const pass = await ask('Test user password', { hidden: true });
      say('Validating credentials...');
      if (await validateLogin(url, headers, user, pass)) {
        setEnv({ TEST_USER_USERNAME: user, TEST_USER_PASSWORD: pass });
        Object.assign(secrets, { TEST_USER_USERNAME: user, TEST_USER_PASSWORD: pass });
        say('Credentials OK and saved to .env');
        break;
      }
      say('Login failed.');
      if (attempt === 3) process.exit(1);
    }
  } else if (look.login === 'google') {
    await captureManualSession(url, headers);
    say('Session saved to auth/default.storageState.json');
  } else {
    say('No login detected: the app will be explored without authentication.');
  }

  if (await yes('\nEnable Jira and Slack integrations?', 'n')) {
    setEnv({
      WORK_MANAGEMENT_PROVIDER: 'jira',
      JIRA_BASE_URL: await ask('Jira base URL'),
      JIRA_EMAIL: await ask('Jira email'),
      JIRA_API_TOKEN: await ask('Jira API token', { hidden: true }),
      CHATOPS_PROVIDER: 'slack',
      SLACK_WEBHOOK_URL: await ask('Slack webhook URL', { hidden: true }),
    });
  }

  if (await yes('\nStore the credentials as GitHub repository secrets for CI?', 'y')) setGithubSecrets(secrets);

  say('\nHanding over to Claude: exploration, test generation, first run and CI. This takes a while...\n');
  const prompt = [
    'Use the ai-driven-automation-framework skill and follow docs/business-rules.md exactly.',
    'This is a new project with no prior knowledge of the application under test.',
    'Credentials and URL are in .env (never print or commit secrets).',
    'Run the whole flow without stopping for approvals: explore the app, write docs/app-map.md,',
    'docs/business-rules.md (application rules) and docs/technical-context.md, propose and generate',
    'the test cases, run them, create the GitHub Actions workflow (cron, workflow_dispatch, Allure),',
    'commit locally, and finish with a short summary.',
  ].join(' ');
  const r = spawnSync(
    'claude',
    ['-p', prompt, '--permission-mode', 'acceptEdits', '--allowedTools', 'Bash,Read,Write,Edit,Glob,Grep,Skill'],
    { stdio: 'inherit' },
  );
  process.exit(r.status ?? 0);
}

main();
