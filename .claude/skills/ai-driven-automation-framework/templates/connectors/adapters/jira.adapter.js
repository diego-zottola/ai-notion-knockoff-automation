// TEMPLATE — edit this file to update the scaffold for all future projects.
// Work Management Connector — Jira adapter.
// Reads env vars: JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN, JIRA_PROJECT_KEY
// Ready-for-QA status is configurable via JIRA_READY_FOR_QA_STATUS (default: "Ready for QA")

import { WorkManagementConnector } from '../work-management.interface.js';

export class JiraAdapter extends WorkManagementConnector {
  constructor() {
    super();
    this.baseUrl = process.env.JIRA_BASE_URL;
    this.email = process.env.JIRA_EMAIL;
    this.token = process.env.JIRA_API_TOKEN;
    this.project = process.env.JIRA_PROJECT_KEY;
    this.readyStatus = process.env.JIRA_READY_FOR_QA_STATUS ?? 'Ready for QA';

    if (!this.baseUrl || !this.email || !this.token) {
      throw new Error(
        'JiraAdapter requires JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN'
      );
    }
  }

  async fetchTicket(id) {
    const res = await this._request(`/rest/api/3/issue/${id}`);
    return this._normalize(res);
  }

  async listReadyForQA() {
    const jql = encodeURIComponent(
      `project = ${this.project} AND status = "${this.readyStatus}" ORDER BY updated DESC`
    );
    const res = await this._request(`/rest/api/3/search?jql=${jql}&maxResults=50`);
    return (res.issues ?? []).map(i => this._normalize(i));
  }

  async updateTicket(id, update) {
    if (update.comment) {
      await this._request(`/rest/api/3/issue/${id}/comment`, 'POST', {
        body: {
          type: 'doc', version: 1,
          content: [{ type: 'paragraph',
            content: [{ type: 'text', text: update.comment }] }],
        },
      });
    }
    if (update.status) {
      const transitions = await this._request(
        `/rest/api/3/issue/${id}/transitions`
      );
      const target = transitions.transitions?.find(
        t => t.name.toLowerCase() === update.status.toLowerCase()
      );
      if (target) {
        await this._request(`/rest/api/3/issue/${id}/transitions`, 'POST', {
          transition: { id: target.id },
        });
      }
    }
  }

  async attachEvidence(id, evidence) {
    // Note: file upload requires multipart/form-data —
    // add implementation when needed in the App Pack
    await this.updateTicket(id, {
      comment: `Evidence attached: ${evidence.type} — ${evidence.description ?? evidence.path}`,
    });
  }

  async watchNewTickets(callback) {
    // Polling fallback — replace with webhook in production
    const POLL_INTERVAL = parseInt(process.env.JIRA_POLL_MS ?? '30000');
    const seen = new Set();
    setInterval(async () => {
      const tickets = await this.listReadyForQA();
      for (const ticket of tickets) {
        if (!seen.has(ticket.id)) {
          seen.add(ticket.id);
          callback(ticket);
        }
      }
    }, POLL_INTERVAL);
  }

  // ── PRIVATE ───────────────────────────────────────────────────────────

  _normalize(issue) {
    const f = issue.fields ?? {};
    return {
      id: issue.key,
      title: f.summary ?? '',
      description: f.description?.content?.[0]?.content?.[0]?.text ?? '',
      status: f.status?.name ?? '',
      acceptanceCriteria: this._extractAC(f.description),
      assignee: f.assignee?.emailAddress ?? '',
      url: `${this.baseUrl}/browse/${issue.key}`,
    };
  }

  _extractAC(description) {
    if (!description) return [];
    const text = description.content
      ?.flatMap(b => b.content ?? [])
      ?.filter(n => n.type === 'text')
      ?.map(n => n.text)
      ?.join('\n') ?? '';
    const match = text.match(/acceptance criteria[:\n]([\s\S]*?)(\n\n|$)/i);
    if (!match) return [];
    return match[1].split('\n').map(l => l.replace(/^[-*]\s*/, '').trim()).filter(Boolean);
  }

  async _request(path, method = 'GET', body) {
    const url = `${this.baseUrl}${path}`;
    const headers = {
      Authorization: `Basic ${Buffer.from(`${this.email}:${this.token}`).toString('base64')}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const res = await fetch(url, {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!res.ok) throw new Error(`Jira API ${method} ${path} → ${res.status}`);
    if (method === 'GET') return res.json();
  }
}
