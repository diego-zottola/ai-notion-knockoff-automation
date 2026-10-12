# Business rules — application under test (Workspace)

Rules learned during exploration, with the evidence that supports them. Append new findings after each run.
The framework's own rules live in [framework-flow.md](framework-flow.md). Never put secrets or real customer data here.

## Access and roles

- BR-01 Login is required for every route; a logged-out visit to `/settings` or `/profile` shows the login form. (TC0004, TC0027)
- BR-02 Invalid credentials keep the user on the login screen. (TC0002)
- BR-03 Valid credentials land in a workspace where the user is "Propietario". (TC0003, TC0021)
- BR-04 A user can belong to several workspaces and switch between them from the sidebar. (TC0025, TC0026)
- BR-05 Member roles offered on invitation: Administrador, Miembro (default), Invitado. (TC0020)
- BR-06 Share permissions: Puede ver (default), Puede editar, Acceso total. Access is inherited by subpages and the highest permission always wins. (stated by the app in the Share dialog, not yet tested)
- BR-07 If a shared email has no account yet it becomes a pending invitation, activated when that person signs in with Google; if they are not a member of the space they join as guest. (stated by the app, not yet tested)

## Pages

- BR-08 A new page is created as "Sin título" and appears in the sidebar and in "Recientes". (TC0011)
- BR-09 Title and block edits autosave (debounced); content survives a reload. (TC0011, TC0012)
- BR-10 Pages can be nested; a parent with children shows an expand/collapse control. (TC0015)
- BR-11 Markdown-like shortcuts format blocks (`# ` becomes Título 1). (TC0012)
- BR-12 Search matches by page title (and, per the app, by content); no match shows no results. (TC0013, TC0014)

## Archive and trash

- BR-13 Archiving always asks for confirmation; cancelling keeps the page. (TC0016)
- BR-14 Archiving a page also archives all its subpages; only the owner can delete them forever. (stated by the app; TC0017 covers the single page case)
- BR-15 Archived pages leave the tree and show up in Papelera with who and when archived them. (TC0017)
- BR-16 Restore returns the page to the tree. (TC0017)
- BR-17 "Eliminar definitivamente" asks for confirmation, is irreversible and removes the page from search. (TC0018)

## Editor, paste and files

- BR-21 A paste with HTML plus text/plain imports once (no duplicates); headings, inline styles, links, quotes, lists and nesting are kept. (TC0028, TC0029)
- BR-22 Plain-text Markdown becomes formatted blocks; text that only resembles Markdown stays plain. (TC0030-TC0032, TC0034)
- BR-23 Executable link schemes (`javascript:`, `data:`, `vbscript:`, `file:`) and scripts never reach the page; the link dialog accepts only https, http or mailto. (TC0051, TC0053)
- BR-24 An image that arrives only as an external URL becomes a link plus a notice; it is never fetched. (TC0062)
- BR-25 Limits: files up to 5 MB; images PNG/JPEG/GIF/WebP; attachments PDF/text/CSV/ZIP/Word/Excel. Refused files show a toast and leave the page untouched. (TC0063, TC0068, TC0069, TC0073-TC0075)
- BR-26 A failed save keeps the text on screen, shows "No se pudo guardar" with Reintentar, and unsaved content is recovered from the device draft after a reload. (TC0082, TC0083)
- BR-27 A failed image upload ends in an error with Reintentar and Quitar, never a stuck placeholder. (TC0064)
- BR-28 A large mixed paste is one undo step and one redo step. (TC0057)
- BR-29 A wide table scrolls inside the page on a phone instead of overflowing it. (TC0087)

## Forms and validation

- BR-18 Primary action buttons are disabled until the form is valid: invite member (empty email), create group (empty name), save profile name (unchanged name). (TC0019, TC0022, TC0024)

## Data hygiene (testing rules that follow from the above)

- BR-19 Tests only create pages whose title starts with `qa-auto-`, and always purge them (archive + delete forever) in fixture teardown.
- BR-20 The QA account owns other spaces; tests only operate in the default workspace opened after login.
