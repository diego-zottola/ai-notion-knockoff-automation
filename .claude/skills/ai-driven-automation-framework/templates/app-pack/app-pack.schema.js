// TEMPLATE — edit this file to update the scaffold for all future projects.
// App Pack schema — formal contract for every app under test.
// One App Pack per application. The Core never imports app-specific code directly.
// Everything app-specific flows through this schema.
//
// Usage:
//   import { defineAppPack } from '../app-pack/app-pack.schema.js';
//   export default defineAppPack({ ... }); // in your App Pack's index.js

/**
 * Validates and returns a normalized App Pack configuration.
 * Call this in your App Pack's index.js as the default export.
 *
 * @param {AppPackConfig} config
 * @returns {AppPackConfig}
 */
export function defineAppPack(config) {
  validateAppPack(config);
  return {
    // Defaults
    version: '1.0.0',
    autonomyPolicy: defaultAutonomyPolicy(),
    healingPolicy: defaultHealingPolicy(),
    riskMap: [],
    visualPolicy: defaultVisualPolicy(),
    ...config,
    // Always override these with normalized values
    name: config.name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
  };
}

/**
 * @typedef {object} AppPackConfig
 * @property {string} name              - kebab-case app identifier e.g. 'valkyrie'
 * @property {string} version           - semver e.g. '1.0.0'
 * @property {string} description       - human-readable description
 * @property {string} baseUrl           - app URL (overrides BASE_URL env var if set)
 * @property {object} workManagement    - Work Management Connector config
 * @property {string} workManagement.provider   - 'jira' | 'linear' | 'azuredevops' etc.
 * @property {string} workManagement.projectKey - project key in the WM tool
 * @property {string} [workManagement.readyStatus] - status meaning "ready for QA"
 * @property {AutonomyPolicy} autonomyPolicy
 * @property {HealingPolicy} healingPolicy
 * @property {Array<{pattern:string,grep:string}>} riskMap - extends DEFAULT_RISK_MAP
 * @property {VisualPolicy} visualPolicy
 * @property {string[]} [evaluationDataset] - paths to golden test files for agent eval
 * @property {string} [owner]           - team or person responsible for this App Pack
 */

/**
 * @typedef {object} AutonomyPolicy
 * @property {'L2'|'L3'} explorer    - default L2
 * @property {'L2'|'L3'} generator   - default L2
 * @property {'L2'|'L3'} healer      - default L3 (above confidence threshold)
 * @property {'L2'|'L3'} analyst     - default L2
 * @property {'L2'|'L3'} data        - default L3
 */

/**
 * @typedef {object} HealingPolicy
 * @property {number} confidenceThreshold  - 0.0-1.0, default 0.80
 * @property {number} maxHealsBeforeEscalation - default 3
 * @property {boolean} autoOpenPR         - open PR for high-confidence heals, default true
 */

/**
 * @typedef {object} VisualPolicy
 * @property {boolean} enabled          - default false
 * @property {number} threshold         - pixel diff ratio, default 0.02
 * @property {Array<{selector:string}>} [noiseSelectors] - dynamic regions to mask
 */

// ── DEFAULTS ──────────────────────────────────────────────────────────────

function defaultAutonomyPolicy() {
  return {
    explorer:  'L2',
    generator: 'L2',
    healer:    'L3',
    analyst:   'L2',
    data:      'L3',
  };
}

function defaultHealingPolicy() {
  return {
    confidenceThreshold: parseFloat(
      process.env.HEAL_CONFIDENCE_THRESHOLD ?? '0.80'
    ),
    maxHealsBeforeEscalation: 3,
    autoOpenPR: true,
  };
}

function defaultVisualPolicy() {
  return {
    enabled: false,
    threshold: parseFloat(process.env.VISUAL_THRESHOLD ?? '0.02'),
    noiseSelectors: [],
  };
}

// ── VALIDATION ────────────────────────────────────────────────────────────

function validateAppPack(config) {
  const required = ['name', 'description', 'baseUrl', 'workManagement'];
  const missing = required.filter(k => !config[k]);
  if (missing.length > 0) {
    throw new Error(
      `defineAppPack: missing required fields: ${missing.join(', ')}`
    );
  }
  if (!config.workManagement.provider) {
    throw new Error('defineAppPack: workManagement.provider is required');
  }
  if (!config.workManagement.projectKey) {
    throw new Error('defineAppPack: workManagement.projectKey is required');
  }
}
