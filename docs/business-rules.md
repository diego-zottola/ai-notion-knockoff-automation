# Business rules — guided onboarding flow

This document fixes the rules of the framework before implementation. This repository
(`ai-driven-automation-framework-template`) is the parent of every QA project in the company.
Existing skills and modules (analyst, data-agent, memory, orchestrator, visual, connectors)
are reused and extended, not replaced.

## Flow

1. Create the project with "Use this template" on GitHub.
2. Clone it locally and run `npm install`.
3. Run `npm run init`. It asks for the application URL.
4. Claude takes a first look at the app and detects the login type
   (username/password, Google, none) and whether Vercel Deployment Protection is on.
5. `init` asks for the credentials that match the detected login type.
   It then asks whether to enable the Jira and Slack integrations (default: no).
6. Claude runs the full exploration, proposes the test cases, generates the tests,
   runs them and creates the CI workflow, without stopping in between.
7. At the end it shows a summary (app map, test cases, first report, CI status).

## Rules

- **No prior context:** the framework starts with no knowledge of the business of the application
  under test. It receives only the URL and credentials, runs an exploratory pass, and derives the
  app map and the first test cases from it. That context lives in the generated project, never in
  this parent template.
- **Shared, evolving context:** the generated project keeps its context inside the repo, versioned
  in git, so anyone who clones it can use it with Claude Code without any local memory:
  - `docs/app-map.md`: screens, routes and flows.
  - `docs/business-rules.md`: business rules of the application under test, learned during exploration.
  - `docs/technical-context.md`: how the app is tested (login, data, cleanup, known pitfalls).
  - The project `CLAUDE.md` points to these files; the `app-pack` is the structured format.
  Every user can add a learning, technical or business, to these files (by hand or by asking
  Claude), commit it, and the whole team reuses it. Claude reads them before exploring or
  generating and appends new findings after each run. Learnings must never include secrets or
  real customer data, since the generated repo may be public.
- **Credentials:** provided by the framework user. The framework asks for them, stores them
  in `.env` and in the repository secrets (never through chat), and validates them by trying
  to log in. It shows a fixed notice: use an account dedicated to QA.
- **Environment:** the framework does not restrict where tests run, including production.
  That decision belongs to the company.
- **Approvals:** none in the middle of the flow. Claude explores, proposes and generates
  everything on its own and presents a summary at the end.
- **Healer:** may only heal selectors. It never changes assertions.
- **Claude access:** `init` drives Claude Code in non-interactive mode (`claude -p`) using
  the user's existing session, so no API key is needed for onboarding.

- **Jira and Slack (optional):** `init` asks whether to enable them; the default is no.
  If yes, it asks for the Jira URL and token and the Slack webhook, stores them in `.env`
  and in the repository secrets, and enables the existing connectors module (`ticket-loop`).
  If no, the flow is unchanged.

## Out of scope for now

- Automatic updates of projects created from this template.
