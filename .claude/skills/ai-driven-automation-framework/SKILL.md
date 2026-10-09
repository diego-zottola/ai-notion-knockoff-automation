---
name: ai-driven-automation-framework
description: Bootstrap a new E2E test automation project by reusing a production-proven architecture (Playwright + JS ESM + POM + fixtures + Allure + multi-env dotenv + MCP-driven exploration + ISTQB test design rules). Use when onboarding a NEW application under test. Triggers: "new app under testing", "bootstrap ai-driven automation framework", "reuse the automation framework for a new app", "start automation for [app]".
---

# AI-Driven Automation Framework — New Project Bootstrap

This skill is NOT generic like `playwright-pom` — it reproduces a production-proven framework architecture
(`pages/`, `fixtures/`, Allure, `global-setup` + `storageState`, MCP-first exploration, ISTQB rules from
`CLAUDE.md`). Use it when the goal is to reuse THIS specific framework for a different app, not to start a
fresh Playwright project under a different convention.

**How this runs:** invoke this skill from anywhere. It creates the new project as a **sibling folder** using
absolute paths — Bash, Write, and Edit all work outside the current working directory. It scaffolds the folder,
installs dependencies, runs the first test, and initializes git — all in one pass.

## File index — what's in each referenced file

| File | Contains |
|---|---|
| `templates/BasePage.js` | §3 AS-IS — shared Page Object base class |
| `templates/helpers.js` | §3 AS-IS — generic test helpers |
| `templates/email.js` | §3 AS-IS, conditional — IMAP email-verification helper |
| `templates/db.js` | §3 AS-IS, conditional — generic DB client, prefix-parametrized |
| `templates/load-test.js` + `templates/get-token.js` | §3 AS-IS, conditional — k6 perf runners |
| `templates/env.example` | §4 — `.env.example` source, trim to what applies |
| `templates/package.json.template` | §4 — scripts + devDependencies to merge |
| `templates/CLAUDE.md.template` | §4 — app-agnostic sections to copy AS-IS + skeleton for the rewritten ones |
| `templates/fixtures.base.fixture.js` | §4 — `test.extend` pattern skeleton |
| `templates/playwright.config.js` | §4 — full config skeleton with `{{DEV_URL}}` placeholder |
| `templates/global-setup.js` | §4 — loops over `environment-profile.js`'s `PROFILES`, one login per profile |
| `templates/environment-profile.js` | §4 — Environment Profile primitive: named role/env → baseUrl, credentials prefix, storageState path |
| `workflows/smoke.yml` | §10 — scheduled + manual smoke workflow, `test_grep` input |
| `workflows/regression.yml` | §10 — manual-only regression workflow |
| `commands/*.md` (already in `.claude/commands/`) | §3 — the four mandatory portable commands, copy verbatim + fill placeholders |
| `memory-templates/*` (repo root, already exists) | §9 — seed files for the new project's memory directory |
| `templates/registry/FilterableTable.js` | Reusable filterable table pattern — compose in any Page Object |
| `templates/analyst/root-cause.js` | Analyst agent — root-cause categorization and diagnosis builder |
| `templates/analyst/flaky-detector.js` | Analyst agent — flaky test detection and quarantine management |
| `templates/analyst/reporter.js` | Analyst agent — enriched CI report combining heals, diagnosis, flaky, escalations |
| `templates/connectors/work-management.interface.js` | Work Management Connector — universal interface (Universal Context) |
| `templates/connectors/adapters/jira.adapter.js` | Jira adapter — fetchTicket, listReadyForQA, updateTicket, attachEvidence |
| `templates/connectors/work-management.factory.js` | Factory — returns active adapter via WORK_MANAGEMENT_PROVIDER env var |
| `templates/connectors/chatops.interface.js` | ChatOps Connector — bidirectional interface (notify, onCommand, onQuery) |
| `templates/connectors/adapters/slack.adapter.js` | Slack adapter — webhook outbound, bot inbound, /qa commands |
| `templates/connectors/chatops.factory.js` | Factory — returns active adapter via CHATOPS_PROVIDER env var |
| `templates/generator/spec-generator.js` | Generator agent — ticket→spec, Page Object skeleton, anti-tautological gate |
| `templates/analyst/ticket-updater.js` | Analyst agent — posts diagnosis to tickets, marks verified on pass |
| `templates/orchestrator/risk-selector.js` | Orchestrator — risk-based test selection, git diff → grep pattern |
| `templates/data-agent/data-provisioner.js` | Data agent — synthetic users, datasets, API keys, cleanup registry |
| `templates/visual/visual-comparator.js` | Visual regression — baseline capture, comparison, noise masking, audit log |
| `templates/memory/memory-store.js` | Memory / RAG — persistent knowledge store, heal patterns, keyword search, promote from audit logs |
| `templates/app-pack/app-pack.schema.js` | App Pack schema — defineAppPack(), autonomy policy, healing policy, validation |
| `templates/app-pack/example-valkyrie.pack.js` | Example App Pack — Valkyrie reference implementation |
| `templates/app-pack/new-app.pack.js` | New App Pack template — fill placeholders to onboard any app |
| `templates/app-pack/ONBOARDING.md` | App Pack onboarding guide — steps, checklist, autonomy promotion |

## 0 — Expected inputs

Ask before touching a single file if any of these are missing from the initial prompt: App name, Dev/Login URL,
test user email/password (required); target directory, additional roles, preferred env var names, known
CDN/WAF, shares the source project's deploy infra (if no, skip `scripts/run-tests.sh`/`remote-deploy.sh`/
`harden-ssh.sh`), actions to avoid (metered/billed product), ticket tracker (default "none"), DB access needed
(→ copy `templates/db.js`), k6 load testing needed (→ copy `templates/load-test.js` + `get-token.js`), GitHub
destination (ask explicit confirmation before creating/pushing, every run, no standing consent), CI workflows
(only if asked by name this run; ask smoke time + timezone), Slack webhook for CI (optional add-on to CI),
scope of first pass (default: full scaffold + login/nav smoke test).

## 1 — Prerequisite: Playwright MCP at `user` scope

`claude mcp list | grep playwright`. If `Scope: User config` → proceed. If missing/project-scoped, offer
`claude mcp add --scope user playwright -- npx @playwright/mcp@latest` (warn: one-time session restart, not
per-project). If the user prefers project scope, copy the source project's `mcp/mcp.config.json` to `.mcp.json`
and warn a restart is needed before step 6.

## 2 — Create the target project folder

`mkdir -p <target-directory>/{pages,fixtures,auth,utils,data,tests/smoke-tests,tests/regression,.claude/commands}`
— absolute sibling path unless step 0 gave a different target.

## 3 — Files copied AS-IS

See `templates/BasePage.js`, `templates/helpers.js`. Conditional: `templates/email.js` (only if email-verification
flows; needs `GMAIL_USER`/`GMAIL_APP_PASSWORD` + `imap-simple`); `templates/db.js` (only if DB access requested,
parametrized by env prefix, don't fork it into per-environment functions — the prefix parameter already covers
that); `templates/load-test.js` + `templates/get-token.js` (only if perf testing requested — edit only the
`CONFIG` block / login response field, merge the `perf:*` scripts from `templates/package.json.template`).

The four `.claude/commands/*.md` files are **mandatory for every project** — copy verbatim from this repo's
`commands/`, fill in `{{TICKET_TOOL}}`/`{{TICKET_PREFIX}}`/`{{DEV_URL}}`/etc. from step 0; leave unresolved
placeholders as bracketed integration-point comments rather than deleting them.

Registry patterns (templates/registry/): copy only the patterns the app actually needs — do not copy all of
them by default.

## 4 — Files that get PARAMETERIZED

**Project identity first** — derive a kebab-case slug from App name and propagate to `package.json` (`name`,
`description`), `CLAUDE.md` (H1 title, "Project purpose"), `README.md`, and grep for any leftover "Carwire" as a
proper noun.

See `templates/fixtures.base.fixture.js`, `templates/playwright.config.js` (baseURL/storageState/reporters,
uncomment UA override only if step 6 confirms CDN/WAF blocking).

See `templates/environment-profile.js` — declare one `PROFILES` entry per role. `global-setup.js` loops over
`PROFILES` automatically. In specs, use: `test.use(useEnvironment('admin'))`.

`.env.example`: copy `templates/env.example` verbatim then delete inapplicable optional blocks (no dead
placeholders). `.env.local` (gitignored): same shape, real values filled in.

`package.json`: merge scripts/devDependencies from `templates/package.json.template`.

`CLAUDE.md`: copy the app-agnostic sections from `templates/CLAUDE.md.template` AS-IS (testing philosophy/ISTQB,
test techniques, naming, test type placement); rewrite "Project purpose", "Stack", `## App: {{APP_NAME}}` from
scratch (gotchas filled in only after step 6). Start the test inventory **inline** in `CLAUDE.md`; split into a
standalone `TEST_INVENTORY.md` only once it crosses ~30-40 tests or gotchas crowd out the rest of the file —
do this proactively, don't wait to be asked.

## 5 — What NOT to copy unless the user confirms it applies

`scripts/run-tests.sh`, `remote-deploy.sh`, `harden-ssh.sh`, `notify-slack.sh` (the source project's EC2/Docker/
ECR/SSH setup — step 10 writes a fresh GitHub-Actions-native `notify-slack.sh` instead); `prod-smoke/` (only if
a separate prod env exists); `utils/vin.js` (source-project-specific business logic, never reuse); the generic
`templates/load-test.js`/`get-token.js`/`db.js` from §3 are copy-ready, gated on step 0 answers, not excluded —
use these template versions, not the source project's legacy pre-genericization copies.

## 6 — MCP-guided exploration (mandatory, never skipped)

Navigate to Dev URL → snapshot the login screen for real `ref`s (never assume the source project's accessible
names) → log in with step-0 credentials, confirm redirect → walk main nav without mutations if actions-to-avoid
were flagged → note gotchas (spinners, router guards, cold-start timing, CDN/WAF UA bounce). **Do not trust the
URL from a snapshot taken right after a click** as the post-login target (client-side redirects can complete
after the snapshot) — assert "no longer on the login path" in tests/global-setup, not an exact URL, unless
step 8's real run confirms one.

## 7 — Fill in the templates with what was learned in step 6

Replace `{{PLACEHOLDER}}`s in `auth/global-setup.js` and `playwright.config.js`; fill `## App: {{APP_NAME}}` in
`CLAUDE.md`; create `pages/LoginPage.js` + register its fixture; write the first smoke test (login + nav, no
mutations).

## 8 — Install dependencies and run the first test (mandatory, never skipped)

`cd <target-directory> && npm run setup && npx playwright test --project=chromium --reporter=list`. Always use
`npm run setup` (never the two commands split out). Fix root causes on failure and re-run — **never report the
bootstrap done on a red test.**

## 9 — Seed the memory directory (mandatory, never skipped)

Resolve `$HOME/.claude/projects/<hashed-target-path>/memory`, copy every file from `memory-templates/` (repo
root), filling `{{APP_NAME}}`/`{{N}}`/`{{TICKET_TOOL}}`/etc. `MEMORY.md`, `project_context.md`,
`project_next_task.md`, `reference_ticket_board.md` (rename per tracker if not "none"), `reference_coverage_map.md`
are always mandatory. `project_db_access.md` only if DB access was requested (else remove its `MEMORY.md` line);
`project_ci_infrastructure.md` only if CI was scaffolded (fill in cron/secrets after step 10, not before). Do not
invent coverage/task-queue content — those files stay genuinely empty skeletons until real tickets exist.

## 10 — CI: smoke + regression GitHub Actions workflows (only if requested in step 0)

Add `test:smoke`/`test:regression` scripts to `package.json`; `mkdir -p tests/regression && touch
tests/regression/.gitkeep` if missing (note: `regression.yml` will fail "no tests found" until a spec lands —
expected, not a bug). See `workflows/smoke.yml` (cron converted from requested local time/timezone to UTC,
`workflow_dispatch` with `test_grep` — deliberately calls `playwright test` directly, not via `npm run`, since
`npm run <script> -- --grep` breaks an `&&`-chained script) and `workflows/regression.yml` (same shape,
`workflow_dispatch`-only, no schedule). For any timezone, compute the UTC offset explicitly and flag DST drift.
If a Slack webhook was given, write a fresh GitHub-Actions-native `scripts/notify-slack.sh` (reads
`results.json` via `jq`, posts pass/fail + "View Run" link) — never reuse the source project's SSH/Bitbucket
version.

**Optional CI add-ons — build only when asked by name, keep out of default templates:** multi-environment runs
(GitHub Environments + a `workflow_dispatch` `environment` choice input, requires the user to create matching
Environments + secrets once); persistent Allure report via GitHub Pages (`upload-pages-artifact` +
`deploy-pages`, needs `pages: write, id-token: write` permissions and Pages enabled once — deploys latest report
only, overwrites each run; run-history needs a per-run subpath scheme, don't build unless asked).

## 11 — Initialize git, create the repo, push, and load secrets

`git init && git add . && git commit -m "Initial scaffolding from the AI-Driven Automation Framework template"`.
**Ask explicit confirmation before creating a repo or pushing, every run** — no standing consent from a prior
project's step-0 answer. New repo: `gh repo create <org>/<repo> --private --source=. --remote=origin --push`
(swap `--public` only if asked). Existing remote: `git remote add origin <url> && git push -u origin main`.
Before the first push containing workflow YAML, `gh auth status` and confirm the `workflow` token scope; if
missing, `gh auth refresh -h github.com -s workflow`. **Secrets never through chat** — if CI was scaffolded, ask
the user to save real values into a local gitignored file (e.g. `~/{{app-slug}}-secrets.env`), then
`gh secret set --repo <org>/<repo> --env-file ~/{{app-slug}}-secrets.env`. If no GitHub destination was given,
stop after the local commit.

## 12 — Exit checklist

- [ ] Project identity propagated everywhere, no leftover "Carwire" as a proper noun
- [ ] `.mcp.json` resolved, MCP responds before proceeding
- [ ] `global-setup.js` runs and generates `storageState.json` without error
- [ ] `CLAUDE.md` complete (generic + app-specific)
- [ ] First smoke test passes for real (step 8 actually run)
- [ ] Memory directory seeded (step 9), placeholders filled with real values
- [ ] `.env.example` copied and trimmed to only the sections this project uses
- [ ] New project committed, pushed if the user confirmed a GitHub destination
- [ ] If CI requested: workflows created, scripts added, Slack wired if given, secrets loaded via `--env-file`
- [ ] If CI requested: told the user `regression.yml` will fail until a first regression spec exists
- [ ] Reported to the user what's left as 🔴 "build from scratch" (per-screen Page Objects) as backlog
