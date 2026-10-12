# AI-Driven Automation Framework

Reusable test automation template extracted from the production Carwire QA framework
(`carwire-carwire-qaa-strategy-`). This repo is the template itself, not a specific application under test.

## What this is

A Playwright E2E automation architecture — Page Object Model, fixture injection, Allure reporting, multi-env
`dotenv`, MCP-driven UI exploration, and ISTQB-based test design rules — packaged as a Claude Code skill so it
can be bootstrapped onto any new application in a single prompt.

## How to use it

Invoke the `ai-driven-automation-framework` skill (see `.claude/skills/ai-driven-automation-framework/SKILL.md`)
from any project directory, providing: app name, dev/login URL, test credentials, and any known quirks
(CDN/WAF, multi-role auth, metered/billed actions to avoid). The skill scaffolds the folder structure, copies
the reusable files as-is, parameterizes the app-specific ones, then drives a live MCP exploration of the target
app to fill in the real selectors and gotchas.

## Relationship to Carwire

Carwire (`carwire-carwire-qaa-strategy-`) is the reference implementation this framework was extracted from —
it is a real, live QA project for a specific application, not a template. When the skill needs an as-is file
(e.g. `BasePage.js`) or a decision precedent (e.g. how multi-role `global-setup.js` is structured), it points
back to that repo. Changes to Carwire's conventions should be reflected here if they represent a genuine
framework improvement, not a Carwire-specific one-off.

## Language

Code, comments, identifiers, file names, and all project artifacts are in English — see the global
`~/.claude/CLAUDE.md` rule. Conversational replies may be in the user's language.

## App under test: Workspace (Notion-like)

- URL and credentials: `.env` (`BASE_URL`, `TEST_USER_USERNAME`, `TEST_USER_PASSWORD`). Never print or commit them.
- Context lives in the repo; read it before exploring or generating, and append new findings after each run:
  - [docs/app-map.md](docs/app-map.md): screens, routes, flows.
  - [docs/business-rules.md](docs/business-rules.md): rules of the application under test.
  - [docs/technical-context.md](docs/technical-context.md): login, data, cleanup, pitfalls.
  - [docs/framework-flow.md](docs/framework-flow.md): rules of the framework's onboarding flow.

### Test inventory

Last TC: TC0160 (160 tests total)
- `tests/smoke-tests/auth.spec.js`: TC0001-TC0004 (login screen, invalid and valid login, route protection)
- `tests/smoke-tests/navigation.spec.js`: TC0005-TC0010 (shell and sidebar sections)
- `tests/smoke-tests/pages.spec.js`: TC0011 (create page, persists after reload)
- `tests/regression/pages.spec.js`: TC0012-TC0018 (blocks, search, subpages, archive, restore, delete forever)
- `tests/regression/settings.spec.js`: TC0019-TC0026 (members, groups, preferences, profile, switcher)
- `tests/regression/session.spec.js`: TC0027 (logout)
- `tests/regression/editor-paste.spec.js`: TC0028-TC0057 (synthetic paste: HTML/text, Markdown, position and selection, tables, code and Mermaid, unsafe content, toolbar, undo)
- `tests/regression/editor-files.spec.js`: TC0058-TC0075 (pasted and uploaded images, upload failures, attachments)
- `tests/regression/editor-persistence.spec.js`: TC0076-TC0084 (reload, 90 blocks, icon, save failures; TC0084 now uses the viewer account)
- `tests/regression/editor-native.spec.js`: TC0085-TC0086 (native keyboard copy/paste and async Clipboard API; skipped when the OS clipboard is unusable)
- `tests/regression/editor-mobile.spec.js`: TC0087-TC0088 (emulated phone)
- `tests/regression/editor-comments.spec.js`: TC0089-TC0103 (block comments; cases and priorities in [docs/test-cases-comments.md](docs/test-cases-comments.md), only High and Medium automated)
- `tests/regression/pages-organization.spec.js`: TC0104-TC0112 (move, reorder, breadcrumb, trash with sub-pages)
- `tests/regression/search.spec.js`: TC0113-TC0117 (search by title, block text, table cells)
- `tests/regression/editor-blocks.spec.js`: TC0118-TC0129 (block types, Markdown shortcuts, nesting, Ctrl+A)
- `tests/regression/preferences-session.spec.js`: TC0130-TC0136, TC0160 (theme, compact, classic editor, session, profile, beforeunload, draft purge)
- `tests/regression/permissions.spec.js`: TC0137-TC0146, TC0157-TC0159 (sharing and read-only access with the QA viewer account); TC0084 lives in editor-persistence
- `tests/regression/collaboration.spec.js`: TC0147-TC0150 (live updates between owner and viewer)
- `tests/regression/groups-members.spec.js`: TC0151-TC0156 (groups, group sharing, members screen as owner and guest)
- Second identity: `viewer` profile (`VIEWER_USER_USERNAME` / `VIEWER_USER_PASSWORD` in `.env` and GitHub secrets), fixture `viewerPage`. Cases, priorities and the manual ones: [docs/test-cases-coverage-gaps.md](docs/test-cases-coverage-gaps.md)
- Known-defect tests (kept failing on purpose, annotated `defect`): TC0033 DEF-01, TC0039 DEF-02, TC0047 DEF-03, TC0067 DEF-04 (passes since the floating-menu redesign, confirm whether the app fixed it), TC0088 DEF-07 (test.fail(): remove it once the app is fixed). Report: [docs/editor-clipboard-report.md](docs/editor-clipboard-report.md)
- Editor page object: `pages/EditorPage.js` (extends `DocPage`); comments: `pages/CommentsPage.js`; fixtures in `data/clipboard/` (regenerate with `node data/clipboard/build-fixtures.mjs`), loaders in `utils/clipboard.js`
