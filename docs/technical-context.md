# Technical context — how Workspace is tested

No secrets here. Credentials live in `.env` locally and in repository secrets in CI.

## Setup

- `npm run setup` installs dependencies and the Playwright browsers. Config: `playwright.config.js`, JS ESM.
- `.env` keys: `BASE_URL`, `LOGIN_TYPE`, `TEST_USER_USERNAME`, `TEST_USER_PASSWORD`, optional `ENV` (loads `.env.<ENV>`).
- Use an account dedicated to QA. Tests may run against production; that decision belongs to the company.

## Login

- Username + password form (`Usuario`, `Contraseña`, `Ingresar`). Google sign-in exists and is not automated.
- `auth/global-setup.js` logs in once per profile in `auth/environment-profile.js` and saves `auth/default.storageState.json` (gitignored). It waits for `/w/` in the URL, not for an exact URL (the workspace id differs per user).
- Logged-out tests use `test.use({ storageState: { cookies: [], origins: [] } })`.

## Structure

- `pages/` Page Objects extending `BasePage` (healing helpers `heal_click/heal_fill/heal_select`). The healer may only heal selectors, never assertions.
- `fixtures/base.fixture.js` injects page objects and the `createdPage` fixture.
- `tests/smoke-tests/` TC0001-TC0011, `tests/regression/` TC0012-TC0027. Reports: Playwright HTML + Allure (`npm run allure`).

## Data and cleanup

- `createdPage` creates a page titled `qa-auto-<random>` and, in teardown, archives it and deletes it forever from Papelera. Cleanup filters by the exact title, so parallel workers do not touch each other's pages.
- Tests run in parallel against one shared account, so never assert on global counts (sidebar length, "Recientes" order); always locate by the unique title.

## Known pitfalls

- The SPA hydrates late: the first snapshot after `goto` can be empty. Wait on a concrete element, never on fixed sleeps.
- Autosave is debounced. Before reloading to check persistence, wait for the write: `PATCH /rest/v1/blocks` for block text (the first write after "Agregar bloque" is a `POST`).
- A fresh page has no text block; click "Agregar bloque" before filling `Texto`.
- Role-name collisions: "Agregar" also matches every "Agregar subpágina en X" button, so scope it to its form with `exact: true`. "Nueva página" exists in the sidebar and the home; `Buscar ⌘K` has a keyboard hint in its name.
- The sidebar page tree and the "Recientes" region both link to the same page: scope links to `navigation "Páginas"`.
- The archive and delete confirmations are `alertdialog`s, whose confirm button has the same name as the trigger.
- Invitations, shares, group creation and workspace creation have side effects on real accounts or other people; they are not automated until a cleanup strategy exists.

## CI

`.github/workflows/smoke.yml` (daily cron at 10:00 UTC plus `workflow_dispatch` with `test_grep`) and `regression.yml` (manual). Both upload the Playwright and Allure reports as artifacts. Required repository secrets: `BASE_URL`, `TEST_USER_USERNAME`, `TEST_USER_PASSWORD`. Set them with `gh secret set`, never through chat.
