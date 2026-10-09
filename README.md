# AI-Driven Automation Framework

Reusable Playwright + MCP test automation template, extracted from the production-proven Carwire QA framework.
Bootstrap a full E2E test automation project for any new application with a single prompt.

## What's inside

- Page Object Model, fixture injection, Allure reporting, multi-env `dotenv`
- MCP-driven live exploration of the target app (login, navigation, gotchas)
- ISTQB-based test design rules baked into the generated `CLAUDE.md`
- Four portable Claude Code commands (`/automate-ticket`, `/manual-test`, `/get-full-context`,
  `/save-session-context`) with tool-agnostic integration points for Jira/Linear/Azure DevOps/none
- A seeded memory directory (`memory-templates/`) so the commands above have something to read from session one
- Generic `utils/db.js` (multi-env DB client) and a generic k6 load-test harness (`performance-tests/`),
  both copy-ready and opt-in
- GitHub Actions CI templates (scheduled smoke + manual regression, `test_grep` filtering, optional Slack
  notifications, optional multi-environment / GitHub Pages add-ons)
- Packaged as a Claude Code skill: `.claude/skills/ai-driven-automation-framework/SKILL.md`

## How to use it

1. `git clone git@github.com:azumo/ai-driven-automation-framework.git`
2. `cd ai-driven-automation-framework`
3. `claude`
4. Send the prompt form with the new app's data
5. The skill creates the new project folder (as a sibling directory)
6. `npm run setup` — installs dependencies and Playwright browsers in one command, run automatically within the same prompt
7. `npx playwright test --project=chromium` — run automatically within the same prompt
8. `git init`
9. `git add .`
10. `git commit -m "Initial scaffolding from template"`
11. `git remote add origin <new-repo-url>`
12. `git push -u origin main`

Steps 5–7 run automatically as part of step 4. You only drive steps 1–4 and 11–12 — creating the new app's
GitHub repo and giving Claude its URL.

## Prompt template

Copy this into step 4 above and fill in the blanks — that single message is enough to run the whole bootstrap:

```
App name: <AppName>
Dev URL: <https://...>
Test user email: <...>
Test user password: <...>
Additional roles (optional): <no / yes, which ones>
Actions to AVOID (if the product is metered/billed): <...>
Target directory (optional): <default: sibling folder named <app-slug>-qa-automation>
GitHub remote (optional, if the repo already exists): <...>
Ticket tracker tool (optional): <Jira / Linear / Azure DevOps / none>
CI + perf testing (optional): <ask me during the run, or specify here>
```

The last two lines are new and both optional — omit them and the skill asks live when it needs to know, with
safe "no/skip" defaults. Only worth spelling out upfront when you specifically want this run to exercise CI or
the k6 harness without back-and-forth.

See the full input table in
[`SKILL.md`](.claude/skills/ai-driven-automation-framework/SKILL.md#0--expected-inputs) for every optional
field and what each one controls.

## Relationship to Carwire

Carwire (`carwire-carwire-qaa-strategy-`) is the reference implementation this framework was extracted from —
a real, live QA project for a specific application, not a template. See [`CLAUDE.md`](CLAUDE.md) for details.
