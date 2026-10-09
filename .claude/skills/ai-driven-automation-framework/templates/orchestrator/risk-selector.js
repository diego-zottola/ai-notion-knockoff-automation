// TEMPLATE — edit this file to update the scaffold for all future projects.
// Orchestrator — Risk-based test selection.
// Analyzes git diff to determine which tests are relevant to the change.
// Prevents running the full suite on every commit — faster feedback loop.
//
// Usage in CI:
//   const grep = await buildGrepPattern();
//   npx playwright test --grep "${grep}"
//
// Falls back to full suite if diff is too broad or selection is empty.

import { execSync } from 'child_process';

// Map of file path patterns → test grep patterns
// Customize this map in the App Pack config for your specific app.
// Key: regex string matching changed file paths
// Value: Playwright --grep pattern to run for that change
const DEFAULT_RISK_MAP = [
  { pattern: 'pages/Login',        grep: 'login|auth|session' },
  { pattern: 'pages/Register',     grep: 'register|signup' },
  { pattern: 'pages/Wallet',       grep: 'wallet|balance|payment' },
  { pattern: 'pages/ApiKeys',      grep: 'api.key|deployment.key' },
  { pattern: 'pages/Datasets',     grep: 'dataset|upload|file' },
  { pattern: 'pages/FineTuning',   grep: 'fine.tun|finetun' },
  { pattern: 'pages/Models',       grep: 'model|deploy' },
  { pattern: 'pages/Aliases',      grep: 'alias' },
  { pattern: 'pages/Usage',        grep: 'usage|billing' },
  { pattern: 'pages/Help',         grep: 'help|support' },
  { pattern: 'global-setup',       grep: 'login|smoke' },
  { pattern: 'playwright.config',  grep: '.*' }, // config change → run all
  { pattern: 'fixtures/',          grep: '.*' }, // fixture change → run all
  { pattern: 'BasePage',           grep: '.*' }, // base class change → run all
];

// Safety net: if selected tests are fewer than this % of the suite,
// run the full suite instead (avoids under-testing risky changes).
const MIN_COVERAGE_RATIO = parseFloat(
  process.env.RISK_MIN_COVERAGE_RATIO ?? '0.10'
);

/**
 * Returns a Playwright --grep pattern based on the current git diff.
 * @param {object} options
 * @param {string} [options.base] - base ref for diff (default: origin/main)
 * @param {string} [options.riskMap] - custom risk map (default: DEFAULT_RISK_MAP)
 * @param {number} [options.totalTests] - total test count for safety net check
 * @returns {{ grep: string, reason: string, runAll: boolean }}
 */
export function buildGrepPattern(options = {}) {
  const base = options.base ?? process.env.RISK_BASE_REF ?? 'origin/main';
  const riskMap = options.riskMap ?? DEFAULT_RISK_MAP;

  let changedFiles;
  try {
    changedFiles = execSync(`git diff --name-only ${base}...HEAD`, {
      encoding: 'utf8',
    }).trim().split('\n').filter(Boolean);
  } catch {
    return {
      grep: '.*',
      reason: 'git diff failed — running full suite',
      runAll: true,
    };
  }

  if (changedFiles.length === 0) {
    return {
      grep: '.*',
      reason: 'no changed files detected — running full suite',
      runAll: true,
    };
  }

  // Collect matching grep patterns
  const matchedGreps = new Set();
  let runAll = false;

  for (const file of changedFiles) {
    for (const { pattern, grep } of riskMap) {
      if (new RegExp(pattern, 'i').test(file)) {
        if (grep === '.*') {
          runAll = true;
          break;
        }
        matchedGreps.add(grep);
      }
    }
    if (runAll) break;
  }

  if (runAll) {
    return {
      grep: '.*',
      reason: `high-risk change detected in: ${changedFiles.join(', ')}`,
      runAll: true,
    };
  }

  if (matchedGreps.size === 0) {
    return {
      grep: '.*',
      reason: 'no risk map match — running full suite as safety net',
      runAll: true,
    };
  }

  // Safety net: if the caller knows the total suite size and the selection
  // covers less than MIN_COVERAGE_RATIO of it, fall back to the full suite
  // rather than risk under-testing a change that touched many patterns.
  if (options.totalTests) {
    const coverageRatio = matchedGreps.size / options.totalTests;
    if (coverageRatio < MIN_COVERAGE_RATIO) {
      return {
        grep: '.*',
        reason: `selection covers ${(coverageRatio * 100).toFixed(1)}% of suite ` +
          `(< ${(MIN_COVERAGE_RATIO * 100).toFixed(0)}% minimum) — running full suite as safety net`,
        runAll: true,
      };
    }
  }

  const grep = [...matchedGreps].join('|');
  return {
    grep,
    reason: `matched ${matchedGreps.size} pattern(s) for ${changedFiles.length} changed file(s)`,
    runAll: false,
    changedFiles,
    matchedPatterns: [...matchedGreps],
  };
}

/**
 * Prints the selection result to stdout — useful as a CI step.
 * Sets PLAYWRIGHT_GREP env var for subsequent steps if running in GitHub Actions.
 */
export async function reportSelection(result) {
  console.log('\n── Risk-based Test Selection ────────────────────');
  console.log(`Run all:  ${result.runAll}`);
  console.log(`Grep:     ${result.grep}`);
  console.log(`Reason:   ${result.reason}`);
  if (result.changedFiles) {
    console.log(`Changed:  ${result.changedFiles.join(', ')}`);
  }
  console.log('─────────────────────────────────────────────────\n');

  // Write to GitHub Actions output if available
  if (process.env.GITHUB_OUTPUT) {
    const fs = await import('fs');
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `playwright_grep=${result.grep}\n`
    );
  }
}
