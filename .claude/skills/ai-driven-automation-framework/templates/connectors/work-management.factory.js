// TEMPLATE — edit this file to update the scaffold for all future projects.
// Work Management Connector — factory.
// Reads WORK_MANAGEMENT_PROVIDER env var (default: 'jira').
// To add a new provider: import its adapter here and add a case.

import { JiraAdapter } from './adapters/jira.adapter.js';

const ADAPTERS = {
  jira: JiraAdapter,
  // linear: LinearAdapter,      // add in App Pack when needed
  // azuredevops: AzureAdapter,  // add in App Pack when needed
  // notion: NotionAdapter,
  // github: GitHubIssuesAdapter,
};

/**
 * Returns a configured WorkManagementConnector for the active provider.
 * Usage: const wm = createWorkManagement(); await wm.listReadyForQA();
 */
export function createWorkManagement() {
  const provider = process.env.WORK_MANAGEMENT_PROVIDER ?? 'jira';
  const Adapter = ADAPTERS[provider];
  if (!Adapter) {
    throw new Error(
      `Unknown WORK_MANAGEMENT_PROVIDER: "${provider}". ` +
      `Available: ${Object.keys(ADAPTERS).join(', ')}`
    );
  }
  return new Adapter();
}
