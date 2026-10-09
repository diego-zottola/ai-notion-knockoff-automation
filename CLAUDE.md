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

Last TC: TC0027 (27 tests total)
- `tests/smoke-tests/auth.spec.js`: TC0001-TC0004 (login screen, invalid and valid login, route protection)
- `tests/smoke-tests/navigation.spec.js`: TC0005-TC0010 (shell and sidebar sections)
- `tests/smoke-tests/pages.spec.js`: TC0011 (create page, persists after reload)
- `tests/regression/pages.spec.js`: TC0012-TC0018 (blocks, search, subpages, archive, restore, delete forever)
- `tests/regression/settings.spec.js`: TC0019-TC0026 (members, groups, preferences, profile, switcher)
- `tests/regression/session.spec.js`: TC0027 (logout)
