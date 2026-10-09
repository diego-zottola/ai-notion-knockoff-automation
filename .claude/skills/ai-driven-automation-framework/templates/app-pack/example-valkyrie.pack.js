// EXAMPLE App Pack — Valkyrie
// Copy this file to your App Pack directory and rename to index.js
// Replace all placeholder values with real ones for your application.

import { defineAppPack } from './app-pack.schema.js';

export default defineAppPack({
  name: 'valkyrie',
  version: '1.0.0',
  description: 'Valkyrie AI platform — model training, fine-tuning, deployment',
  baseUrl: process.env.BASE_URL ?? 'https://valkyrie-dev.example.com',

  workManagement: {
    provider: 'jira',
    projectKey: 'VAL',
    readyStatus: 'Ready for QA',
  },

  autonomyPolicy: {
    explorer:  'L2',  // Explorer proposes Page Objects — human approves
    generator: 'L2',  // Generator opens PRs — human merges
    healer:    'L3',  // Healer auto-applies above confidence threshold
    analyst:   'L2',  // Analyst suggests triage — human confirms severity
    data:      'L3',  // Data agent provisions without approval
  },

  healingPolicy: {
    confidenceThreshold: 0.82,  // slightly above default for Valkyrie
    maxHealsBeforeEscalation: 3,
    autoOpenPR: true,
  },

  riskMap: [
    // Valkyrie-specific additions to DEFAULT_RISK_MAP
    { pattern: 'pages/FineTuning', grep: 'fine.tun|dataset|training' },
    { pattern: 'pages/Models',     grep: 'model|deploy|alias' },
    { pattern: 'pages/Wallet',     grep: 'wallet|credit|balance' },
  ],

  visualPolicy: {
    enabled: false,  // enable when baselines are established
    threshold: 0.02,
    noiseSelectors: [
      // '[data-testid="wallet-balance"]',  // dynamic balance — mask in visual tests
      // '[data-testid="last-updated"]',    // timestamp — mask
    ],
  },

  evaluationDataset: [
    'tests/regression/login.spec.js',     // golden tests for agent evaluation
    'tests/regression/api-keys.spec.js',
  ],

  owner: 'qa-team',
});
