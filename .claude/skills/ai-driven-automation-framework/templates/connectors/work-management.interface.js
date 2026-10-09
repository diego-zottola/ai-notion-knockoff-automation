// TEMPLATE — edit this file to update the scaffold for all future projects.
// Work Management Connector — Universal Context interface.
// All agents talk to this interface, never directly to Jira/Linear/Azure.
// To add a new provider: implement this interface and register the adapter
// in work-management.factory.js.

/**
 * @typedef {object} Ticket
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} status
 * @property {string[]} acceptanceCriteria
 * @property {string} assignee
 * @property {string} url
 */

/**
 * @typedef {object} TicketUpdate
 * @property {string} [comment]
 * @property {string} [status]
 * @property {string} [severity]
 */

/**
 * @typedef {object} Evidence
 * @property {string} type - 'screenshot' | 'trace' | 'report'
 * @property {string} path
 * @property {string} [description]
 */

/**
 * Base interface — all adapters must implement these methods.
 * Throw NotImplementedError for methods not supported by the provider.
 */
export class WorkManagementConnector {
  async fetchTicket(_id) { throw new Error('Not implemented'); }
  async listReadyForQA() { throw new Error('Not implemented'); }
  async updateTicket(_id, _update) { throw new Error('Not implemented'); }
  async attachEvidence(_id, _evidence) { throw new Error('Not implemented'); }
  async watchNewTickets(_callback) { throw new Error('Not implemented'); }
}
