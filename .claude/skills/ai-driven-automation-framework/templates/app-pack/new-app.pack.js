// TEMPLATE — copy this file to your App Pack directory and rename to index.js
// This is the starting point for onboarding a new application.
// Replace ALL {{PLACEHOLDER}} values before using.
//
// Onboarding steps:
//   1. Copy this file to packs/<your-app>/index.js
//   2. Fill in all {{PLACEHOLDER}} values
//   3. Run the Explorer agent to generate initial Page Objects
//   4. Review and merge the Explorer's PR
//   5. The Generator will start producing specs from your tickets

import { defineAppPack } from './app-pack.schema.js';

export default defineAppPack({
  name: '{{APP_NAME}}',            // kebab-case e.g. 'my-app'
  version: '1.0.0',
  description: '{{APP_DESCRIPTION}}',
  baseUrl: process.env.BASE_URL ?? '{{APP_BASE_URL}}',

  workManagement: {
    provider: process.env.WORK_MANAGEMENT_PROVIDER ?? 'jira',
    projectKey: '{{PROJECT_KEY}}',  // e.g. 'MYAPP', 'PROJ'
    readyStatus: process.env.JIRA_READY_FOR_QA_STATUS ?? 'Ready for QA',
  },

  // Autonomy levels — start conservative (L2) and promote to L3
  // after reviewing the audit log and confirming reliability.
  autonomyPolicy: {
    explorer:  'L2',  // promotes to L3 after N successful Page Object proposals
    generator: 'L2',  // promotes to L3 after N clean spec generations
    healer:    'L3',  // safe to start at L3 — always below confidence threshold initially
    analyst:   'L2',  // promotes to L3 after triage accuracy is validated
    data:      'L3',  // safe to start at L3 — generates data, never deletes production
  },

  healingPolicy: {
    confidenceThreshold: 0.80,
    maxHealsBeforeEscalation: 3,
    autoOpenPR: true,
  },

  // Add app-specific file→test mappings here.
  // The Orchestrator merges this with DEFAULT_RISK_MAP in risk-selector.js.
  riskMap: [
    // { pattern: 'pages/{{PAGE_NAME}}', grep: '{{TEST_GREP_PATTERN}}' },
  ],

  visualPolicy: {
    enabled: false,   // enable after establishing baselines
    threshold: 0.02,
    noiseSelectors: [
      // Add selectors for dynamic regions (timestamps, avatars, balances)
      // '[data-testid="{{DYNAMIC_ELEMENT}}"]',
    ],
  },

  // Golden test files used by the agent evaluation framework.
  // Add your most stable, well-understood tests here.
  evaluationDataset: [
    // 'tests/regression/{{CORE_FLOW}}.spec.js',
  ],

  owner: '{{TEAM_OR_PERSON}}',
});
