// TEMPLATE — edit this file to update the scaffold for all future projects.
// ChatOps Connector — factory.
// Reads CHATOPS_PROVIDER env var (default: 'slack').
// To add a new provider: import its adapter and add a case.

import { SlackAdapter } from './adapters/slack.adapter.js';

const ADAPTERS = {
  slack: SlackAdapter,
  // teams:       TeamsAdapter,   // add in App Pack when needed
  // discord:     DiscordAdapter,
  // googlechat:  GoogleChatAdapter,
};

/**
 * Returns a configured ChatOpsConnector for the active provider.
 * Usage: const chat = createChatOps(); await chat.notify({ type: 'run-complete', summary: '...' });
 */
export function createChatOps() {
  const provider = process.env.CHATOPS_PROVIDER ?? 'slack';
  const Adapter = ADAPTERS[provider];
  if (!Adapter) {
    throw new Error(
      `Unknown CHATOPS_PROVIDER: "${provider}". ` +
      `Available: ${Object.keys(ADAPTERS).join(', ')}`
    );
  }
  return new Adapter();
}
