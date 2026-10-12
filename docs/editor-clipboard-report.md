# Editor and clipboard suite: scenario matrix and defects

Chromium, against the deployed app with the QA account. Synthetic fixtures only (`data/clipboard/`).
Run: `npx playwright test tests/regression/editor-*.spec.js --project=chromium`.

## Outcome matrix (TC0028-TC0088, 61 tests)

| Area | TCs | Outcome |
|---|---|---|
| Paste HTML + text, structure and styles | TC0028-TC0029 | passed |
| Plain-text Markdown | TC0030-TC0032, TC0034 | passed |
| Mermaid fence in Markdown text | TC0033 | failed (DEF-01) |
| Paste position, replace selection, multi-block | TC0035-TC0038, TC0040 | passed |
| Fragment over a word | TC0039 | failed (DEF-02) |
| Tables | TC0041-TC0046, TC0048 | passed |
| Chained table operations | TC0047 | failed (DEF-03) |
| Code and Mermaid, unsafe and malformed content, toolbar, undo | TC0049-TC0057 | passed |
| Pasted images, limits, failures, undo | TC0058-TC0066, TC0068-TC0069 | passed |
| Undo after in-flight upload finished | TC0067 | failed (DEF-04) |
| Attachments (picker, download, refusals) | TC0070-TC0075 | passed |
| Reload persistence, 90 blocks, icon, save failures | TC0076-TC0083 | passed |
| Viewer read-only | TC0084 | skipped: missing VIEWER identity |
| Native keyboard copy/paste, Clipboard API | TC0085-TC0086 | passed (Chromium, OS clipboard usable) |
| Emulated phone | TC0087-TC0088 | passed |

Totals: 56 passed, 4 failed (known defects, kept failing on purpose), 1 skipped.

## Defects (steps, expected, actual, severity)

- **DEF-01 (medium)** TC0033. Steps: paste plain text containing a ```mermaid fence. Expected: rendered diagram (the HTML paste does this). Actual: stays a code block.
- **DEF-02 (medium)** TC0039. Steps: select a word in a paragraph, paste one inline fragment. Expected: one paragraph "One NEW three". Actual: three blocks ("One", "NEW", "three").
- **DEF-03 (medium)** TC0047. Steps: paste a table, "Agregar fila" twice. Expected 6 rows x 2 cols. Actual 5 x 2: `TableControls.tsx` builds each change from a table captured at render, so a chained operation overwrites the previous one.
- **DEF-04 (medium)** TC0067. Steps: paste an image with the upload gated, delete the placeholder, let the upload finish, undo. Expected: usable image or a retryable error. Actual: error placeholder appears but "Reintentar" does nothing (the tracker dropped the file on late success).
- **DEF-05 (low, documented only)** The attachment "Descargar" link points at the inline URL until the signed "download" URL arrives; a cross-origin `<a download>` cannot force a download before that. TC0071-TC0072 wait for the signed URL.
- **DEF-06 (WebKit only, not reproduced)** TC0080 passes on Chromium; this project runs Chromium only.
- **DEF-07 (medium)** TC0088. Steps: on a phone viewport, select text, open "Más opciones" > "Seleccionar bloques", tick blocks, tap "Terminar selección". Expected: the button is reachable. Actual: the floating formatting menu stays over the selection-mode panel and covers "Terminar selección", even after the text selection collapses.
- **DEF-08 (high, found while testing page organization)** The workspace page list is not paginated: `pagesService.listPages` selects all pages ordered by `position`, and `supabase/config.toml` has `max_rows = 1000`. Once a workspace holds more than 1000 pages (the QA account does, from leaked test pages), the newest ones are cut off: a page just created opens as "No encontramos esta página o no tenés acceso" even after reload, the move dialog omits it, and its title cannot be saved. Expected: pagination or an explicit limit that never hides pages. Not automated (needs more than 1000 pages); it is what made the suite flaky.

## Floating menu redesign (2026-10-12)

The formatting menu now appears only over a text selection (a caret does not show it) and groups actions in dropdowns: "Tipo de bloque", "Color" and "Más opciones" (undo, redo, select blocks, attach, table, image). Tests were updated: `EditorPage.format()` opens the dropdown first, `selectBlockText`/`openSelectionMode` select text to bring the menu up, undo/redo use the keyboard. TC0067 (DEF-04) passed after the redesign; confirm with the app team whether it was fixed.

## Limitations

- Chromium only; the native clipboard is not covered on WebKit/Firefox or on real phones.
- No admin client: Storage/DB are observed through the UI and signed URLs only. Files uploaded by tests live on purged `qa-auto-` pages.
- TC0012 (existing) fails against the current deployment: it uses the old "Texto" textbox, the page now has the rich editor. It needs a selector update, outside this suite.


Fix handoff for the app repo (steps, evidence, root cause, proposed fix): [defects/editor-defects-handoff.pdf](defects/editor-defects-handoff.pdf); run artifacts in `docs/defects/evidence/`.
