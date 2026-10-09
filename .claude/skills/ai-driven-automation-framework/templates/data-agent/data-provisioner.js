// TEMPLATE — edit this file to update the scaffold for all future projects.
// Data Agent — synthetic data generation and test state provisioning.
// Generates realistic test data without using production data.
// Provisions and cleans up test accounts/state before/after each test.
//
// Usage in fixtures:
//   const user = await DataProvisioner.user({ role: 'admin' });
//   const dataset = await DataProvisioner.dataset({ rows: 100 });
//   // ... run test ...
//   await DataProvisioner.cleanup(user.id);

import { PROFILES } from '../environment-profile.js';

// Prefix all generated data with this to make cleanup safe
const TEST_PREFIX = process.env.DATA_TEST_PREFIX ?? 'qa-auto-';
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- strategy flag consumed by test fixtures, not here
const CLEANUP_STRATEGY = process.env.DATA_CLEANUP_STRATEGY ?? 'after-each';

export class DataProvisioner {

  // ── USER PROVISIONING ─────────────────────────────────────────────────

  /**
   * Generates a synthetic user fixture.
   * @param {object} opts
   * @param {'default'|'admin'|string} [opts.role] - maps to PROFILES
   * @param {string} [opts.emailDomain] - email domain (default: testmail.local)
   * @returns {{ email: string, password: string, role: string, _cleanup: Function }}
   */
  static user(opts = {}) {
    const role = opts.role ?? 'default';
    const domain = opts.emailDomain ?? 'testmail.local';
    const id = DataProvisioner._uid();

    return {
      email: `${TEST_PREFIX}${role}-${id}@${domain}`,
      password: DataProvisioner._password(),
      role,
      _id: id,
      _cleanup: async (api) => api?.deleteUser?.(`${TEST_PREFIX}${role}-${id}@${domain}`),
    };
  }

  /**
   * Generates a synthetic dataset fixture.
   * @param {object} opts
   * @param {number} [opts.rows] - number of rows (default: 10)
   * @param {'jsonl'|'csv'} [opts.format] - file format (default: jsonl)
   * @param {string} [opts.name] - dataset name
   * @returns {{ name: string, content: string, format: string }}
   */
  static dataset(opts = {}) {
    const rows = opts.rows ?? 10;
    const format = opts.format ?? 'jsonl';
    const name = opts.name ?? `${TEST_PREFIX}dataset-${DataProvisioner._uid()}`;

    const content = format === 'csv'
      ? DataProvisioner._csvDataset(rows)
      : DataProvisioner._jsonlDataset(rows);

    return { name, content, format, _id: name };
  }

  /**
   * Generates a synthetic API key name.
   */
  static apiKeyName(opts = {}) {
    return `${TEST_PREFIX}key-${opts.suffix ?? DataProvisioner._uid()}`;
  }

  /**
   * Generates a synthetic model name.
   */
  static modelName(opts = {}) {
    return `${TEST_PREFIX}model-${opts.suffix ?? DataProvisioner._uid()}`;
  }

  // ── CLEANUP ───────────────────────────────────────────────────────────

  /**
   * Registers a cleanup function to run after the test.
   * Call in test teardown or afterEach.
   */
  static _cleanupRegistry = [];

  static registerCleanup(fn) {
    DataProvisioner._cleanupRegistry.push(fn);
  }

  static async runCleanup(api) {
    const fns = [...DataProvisioner._cleanupRegistry];
    DataProvisioner._cleanupRegistry = [];
    for (const fn of fns) {
      try { await fn(api); }
      catch (err) { console.warn('[DataProvisioner] cleanup error:', err.message); }
    }
  }

  // ── VALIDATION ────────────────────────────────────────────────────────

  /**
   * Checks that all required env vars for a given profile are set.
   * Call in global-setup to fail fast if data provisioning isn't configured.
   */
  static validateEnv(profileName = 'default') {
    const profile = PROFILES[profileName];
    if (!profile) throw new Error(`Unknown profile: ${profileName}`);

    const prefix = profile.credentialsEnvPrefix;
    const required = [`${prefix}_EMAIL`, `${prefix}_PASSWORD`];
    const missing = required.filter(k => !process.env[k]);

    if (missing.length > 0) {
      throw new Error(
        `DataProvisioner: missing env vars for profile "${profileName}": ${missing.join(', ')}`
      );
    }
  }

  // ── PRIVATE ───────────────────────────────────────────────────────────

  static _uid() {
    return Math.random().toString(36).slice(2, 8);
  }

  static _password() {
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefghjkmnpqrstwxyz23456789!@#$';
    return Array.from({ length: 16 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  }

  static _jsonlDataset(rows) {
    return Array.from({ length: rows }, (_, i) => JSON.stringify({
      id: i + 1,
      prompt: `Synthetic prompt ${i + 1} — ${DataProvisioner._uid()}`,
      completion: `Synthetic completion ${i + 1}`,
    })).join('\n');
  }

  static _csvDataset(rows) {
    const header = 'id,prompt,completion';
    const body = Array.from({ length: rows }, (_, i) =>
      `${i + 1},"Synthetic prompt ${i + 1}","Synthetic completion ${i + 1}"`
    ).join('\n');
    return `${header}\n${body}`;
  }
}
