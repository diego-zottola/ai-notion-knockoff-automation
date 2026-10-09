// TEMPLATE — edit this file to update the scaffold for all future projects.
// ChatOps Connector — Slack adapter.
// Outbound: uses SLACK_WEBHOOK_URL (simple, no OAuth needed).
// Inbound commands + queries: uses SLACK_BOT_TOKEN + SLACK_SIGNING_SECRET.
// Reads SLACK_CHANNEL (default: '#qa-automation').

import { ChatOpsConnector } from '../chatops.interface.js';

export class SlackAdapter extends ChatOpsConnector {
  constructor() {
    super();
    this.webhookUrl = process.env.SLACK_WEBHOOK_URL;
    this.botToken = process.env.SLACK_BOT_TOKEN;
    this.signingSecret = process.env.SLACK_SIGNING_SECRET;
    this.channel = process.env.SLACK_CHANNEL ?? '#qa-automation';
    this._commandHandlers = [];
    this._queryHandlers = [];
  }

  async notify(event) {
    if (!this.webhookUrl) {
      console.warn('[SlackAdapter] SLACK_WEBHOOK_URL not set — skipping notify');
      return;
    }
    const payload = this._buildPayload(event);
    const res = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Slack webhook failed: ${res.status}`);
  }

  onCommand(handler) {
    this._commandHandlers.push(handler);
  }

  onQuery(handler) {
    this._queryHandlers.push(handler);
  }

  async listen() {
    // Slack Socket Mode or Events API — wire up in App Pack
    // This is a placeholder that logs available commands on startup
    console.log('[SlackAdapter] Listening for commands in', this.channel);
    console.log('[SlackAdapter] Available commands:');
    console.log('  /qa run [smoke|regression] [environment]');
    console.log('  /qa status');
    console.log('  /qa approve-heal [heal-id]');
    console.log('  /qa why-failed [test-title]');
    console.log('  /qa coverage-gaps');
  }

  // ── PRIVATE ───────────────────────────────────────────────────────────

  _buildPayload(event) {
    const icon = {
      'run-complete': '✅',
      'heal-applied':  '🔧',
      'escalation':    '🚨',
      'pr-opened':     '📬',
      'flaky-detected':'⚠️',
    }[event.type] ?? 'ℹ️';

    const color = {
      info:    '#2EB67D',
      warning: '#ECB22E',
      error:   '#E01E5A',
    }[event.severity ?? 'info'];

    return {
      channel: this.channel,
      attachments: [{
        color,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `${icon} *${event.summary}*`,
            },
          },
          ...(event.url ? [{
            type: 'actions',
            elements: [{
              type: 'button',
              text: { type: 'plain_text', text: 'View details' },
              url: event.url,
            }],
          }] : []),
        ],
      }],
    };
  }
}
