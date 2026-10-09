// TEMPLATE — edit this file to update the scaffold for all future projects.
// Memory / RAG layer — persistent knowledge store across sessions and projects.
// Stores: heal patterns, recurring failures, agent decisions, app conventions.
// Retrieval: keyword search over JSONL entries (vector embeddings in Phase 5+).
//
// This is the system's long-term memory — separate from the per-run audit logs.
// Audit logs are append-only run artifacts. Memory is curated, queryable knowledge.

import fs from 'fs';
import path from 'path';

const MEMORY_DIR  = process.env.MEMORY_DIR  ?? '.qa-memory';
const MEMORY_FILE = process.env.MEMORY_FILE ?? 'memory.jsonl';

/**
 * @typedef {object} MemoryEntry
 * @property {string} id         - unique identifier
 * @property {string} type       - 'heal-pattern' | 'failure' | 'convention' | 'decision'
 * @property {string} appPack    - which App Pack this knowledge belongs to ('*' = global)
 * @property {string} content    - the knowledge itself (text)
 * @property {object} [metadata] - extra context (locator, category, severity, etc.)
 * @property {string} createdAt
 * @property {number} useCount   - how many times this entry was retrieved and used
 */

// ── WRITE ──────────────────────────────────────────────────────────────────

/**
 * Saves a new memory entry.
 * @param {Omit<MemoryEntry, 'id'|'createdAt'|'useCount'>} entry
 * @returns {MemoryEntry}
 */
export function remember(entry) {
  fs.mkdirSync(path.resolve(MEMORY_DIR), { recursive: true });
  const full = {
    ...entry,
    id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
    useCount: 0,
  };
  fs.appendFileSync(
    path.resolve(MEMORY_DIR, MEMORY_FILE),
    JSON.stringify(full) + '\n',
    'utf8'
  );
  return full;
}

/**
 * Bulk-imports entries (e.g. from heal audit log at end of CI run).
 */
export function rememberBatch(entries) {
  return entries.map(e => remember(e));
}

// ── READ ───────────────────────────────────────────────────────────────────

/**
 * Returns all memory entries, optionally filtered by appPack and/or type.
 */
export function recall(filter = {}) {
  const all = _readAll();
  return all.filter(e => {
    if (filter.type && e.type !== filter.type) return false;
    if (filter.appPack && e.appPack !== '*' && e.appPack !== filter.appPack) return false;
    return true;
  });
}

/**
 * Keyword search over memory entries.
 * Returns entries whose content contains any of the query terms.
 * @param {string} query - space-separated keywords
 * @param {object} [filter] - optional { type, appPack }
 * @returns {MemoryEntry[]}
 */
export function search(query, filter = {}) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const entries = recall(filter);
  return entries.filter(e =>
    terms.some(term => e.content.toLowerCase().includes(term))
  );
}

/**
 * Increments useCount for a memory entry (call when an entry is acted on).
 */
export function markUsed(id) {
  const filePath = path.resolve(MEMORY_DIR, MEMORY_FILE);
  if (!fs.existsSync(filePath)) return;

  const entries = _readAll();
  const updated = entries.map(e =>
    e.id === id ? { ...e, useCount: (e.useCount ?? 0) + 1 } : e
  );
  fs.writeFileSync(
    filePath,
    updated.map(e => JSON.stringify(e)).join('\n') + '\n',
    'utf8'
  );
}

// ── PROMOTE FROM AUDIT LOGS ────────────────────────────────────────────────

/**
 * Promotes healed locators from the audit log into long-term memory.
 * Only promotes heals that were applied and had high confidence.
 * Call at end of CI run to accumulate knowledge.
 * @param {object[]} healLog - from readHealLog()
 * @param {string} appPack
 */
export function promoteHeals(healLog, appPack) {
  const promotable = healLog.filter(h =>
    h.status === 'applied' && h.confidence >= 0.80 && h.healed
  );
  return rememberBatch(promotable.map(h => ({
    type: 'heal-pattern',
    appPack,
    content: `Locator "${h.original}" healed to "${h.healed}" (confidence: ${h.confidence})`,
    metadata: { original: h.original, healed: h.healed, confidence: h.confidence, tier: h.tier },
  })));
}

/**
 * Promotes recurring failures into long-term memory.
 * Call after generateReport() to capture patterns.
 * @param {object[]} diagnoses - from readDiagnosisLog()
 * @param {string} appPack
 */
export function promoteFailures(diagnoses, appPack) {
  const recurring = diagnoses.filter(d => d.relatedHeals > 0);
  return rememberBatch(recurring.map(d => ({
    type: 'failure',
    appPack,
    content: `Test "${d.testTitle}" fails with category "${d.category}": ${d.summary}`,
    metadata: { category: d.category, severity: d.severity, testTitle: d.testTitle },
  })));
}

// ── STATS ──────────────────────────────────────────────────────────────────

export function memoryStats() {
  const all = _readAll();
  const byType = {};
  const byApp = {};
  for (const e of all) {
    byType[e.type] = (byType[e.type] ?? 0) + 1;
    byApp[e.appPack] = (byApp[e.appPack] ?? 0) + 1;
  }
  return { total: all.length, byType, byApp };
}

// ── PRIVATE ────────────────────────────────────────────────────────────────

function _readAll() {
  const filePath = path.resolve(MEMORY_DIR, MEMORY_FILE);
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line));
}
