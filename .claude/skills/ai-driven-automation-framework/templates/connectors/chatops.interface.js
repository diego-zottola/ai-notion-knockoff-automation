// TEMPLATE — edit this file to update the scaffold for all future projects.
// ChatOps Connector — bidirectional chat interface.
// Adapters: Slack (default), Teams, Discord, Google Chat.
// Three flows: outbound notifications, inbound commands, conversational queries.

/**
 * @typedef {object} QAEvent
 * @property {string} type - 'run-complete' | 'heal-applied' | 'escalation' | 'pr-opened' | 'flaky-detected'
 * @property {string} summary
 * @property {string} [url]
 * @property {'info'|'warning'|'error'} [severity]
 * @property {object} [data]
 */

/**
 * @typedef {object} Command
 * @property {string} name - 'run' | 'status' | 'approve-heal' | 'why-failed' | 'coverage-gaps'
 * @property {string[]} args
 * @property {string} requestedBy
 */

export class ChatOpsConnector {
  // Outbound: send notification to chat
  async notify(_event) { throw new Error('Not implemented'); }

  // Inbound: register a command handler
  onCommand(_handler) { throw new Error('Not implemented'); }

  // Conversational: register a query handler
  onQuery(_handler) { throw new Error('Not implemented'); }

  // Start listening for inbound messages
  async listen() { throw new Error('Not implemented'); }
}
