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
