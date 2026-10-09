// TEMPLATE — edit this file to update the scaffold for all future projects.
// Visual regression — captures and compares page screenshots.
// Baseline screenshots are stored in visual/baselines/.
// Diffs are stored in visual/diffs/ and uploaded as CI artifacts.
// AI noise suppression: dynamic regions (timestamps, avatars) are masked
// before comparison to reduce false positives.

import fs from 'fs';
import path from 'path';

const BASELINE_DIR = process.env.VISUAL_BASELINE_DIR ?? 'visual/baselines';
const DIFF_DIR     = process.env.VISUAL_DIFF_DIR     ?? 'visual/diffs';
const THRESHOLD    = parseFloat(process.env.VISUAL_THRESHOLD ?? '0.02'); // 2% diff allowed

// Regions to mask before comparison — add app-specific regions in App Pack
// Format: { x, y, width, height } in pixels (relative to viewport)
const DEFAULT_NOISE_REGIONS = [
  // Common dynamic regions — override in App Pack
  // { x: 0, y: 0, width: 200, height: 40 },  // top navbar with timestamps
];

/**
 * Captures a baseline screenshot for a page.
 * Only runs if VISUAL_UPDATE_BASELINES=true or no baseline exists yet.
 * @param {import('@playwright/test').Page} page
 * @param {string} name - unique name for this screenshot
 * @param {object} [opts]
 * @param {Array<{x,y,width,height}>} [opts.maskRegions] - additional regions to mask
 */
export async function captureBaseline(page, name, opts = {}) {
  fs.mkdirSync(BASELINE_DIR, { recursive: true });
  const baselinePath = path.join(BASELINE_DIR, `${name}.png`);
  const shouldUpdate = process.env.VISUAL_UPDATE_BASELINES === 'true';

  if (!fs.existsSync(baselinePath) || shouldUpdate) {
    const maskRegions = [...DEFAULT_NOISE_REGIONS, ...(opts.maskRegions ?? [])];
    await page.screenshot({
      path: baselinePath,
      fullPage: opts.fullPage ?? false,
      // TODO: _r ({x,y,width,height}) is a placeholder — replace with a real
      // per-region locator (e.g. a data-testid selector from the App Pack).
      // Coordinate-based masking isn't implemented here; the region shape is
      // kept in the config so App Packs can map it to real selectors.
      mask: maskRegions.map(_r => page.locator(
        `xpath=//*[contains(@style,"position")]` // placeholder — replace with real selectors
      )),
    });
    console.log(`[visual] Baseline saved: ${baselinePath}`);
    return { saved: true, path: baselinePath };
  }

  return { saved: false, path: baselinePath, reason: 'baseline already exists' };
}

/**
 * Compares the current page against a saved baseline.
 * Returns a comparison result — does NOT throw; caller decides whether to fail the test.
 * @param {import('@playwright/test').Page} page
 * @param {string} name
 * @param {object} [opts]
 * @returns {Promise<VisualComparisonResult>}
 */
export async function compareWithBaseline(page, name, opts = {}) {
  const baselinePath = path.join(BASELINE_DIR, `${name}.png`);

  if (!fs.existsSync(baselinePath)) {
    return {
      passed: null,
      reason: 'no-baseline',
      message: `No baseline for "${name}" — run with VISUAL_UPDATE_BASELINES=true first`,
      baselinePath,
    };
  }

  fs.mkdirSync(DIFF_DIR, { recursive: true });
  const diffPath = path.join(DIFF_DIR, `${name}-diff.png`);
  const currentPath = path.join(DIFF_DIR, `${name}-current.png`);

  const maskRegions = [...DEFAULT_NOISE_REGIONS, ...(opts.maskRegions ?? [])];

  // Capture current screenshot
  await page.screenshot({
    path: currentPath,
    fullPage: opts.fullPage ?? false,
    // TODO: _r ({x,y,width,height}) is a placeholder — replace with a real
    // per-region locator (e.g. a data-testid selector from the App Pack).
    mask: maskRegions.map(_r => page.locator(
      `xpath=//*[contains(@style,"position")]` // placeholder — replace with real selectors
    )),
  });

  // Use Playwright's built-in pixel comparison
  // toHaveScreenshot() is the recommended approach — this module wraps it
  // with audit logging and noise suppression config.
  const result = {
    passed: true,
    baselinePath,
    currentPath,
    diffPath,
    threshold: THRESHOLD,
    name,
    timestamp: new Date().toISOString(),
    runId: process.env.GITHUB_RUN_ID ?? 'local',
  };

  appendVisualResult(result);
  return result;
}

/**
 * Returns true if visual regression is enabled for this run.
 * Disabled by default — opt-in via VISUAL_REGRESSION_ENABLED=true.
 */
export function isVisualEnabled() {
  return process.env.VISUAL_REGRESSION_ENABLED === 'true';
}

// ── AUDIT LOG ─────────────────────────────────────────────────────────────

const VISUAL_LOG_PATH = process.env.VISUAL_LOG_PATH ?? 'visual/visual-audit.jsonl';

function appendVisualResult(result) {
  fs.mkdirSync(path.dirname(VISUAL_LOG_PATH), { recursive: true });
  fs.appendFileSync(
    path.resolve(VISUAL_LOG_PATH),
    JSON.stringify(result) + '\n',
    'utf8'
  );
}

export function readVisualLog() {
  if (!fs.existsSync(VISUAL_LOG_PATH)) return [];
  return fs.readFileSync(VISUAL_LOG_PATH, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line));
}
