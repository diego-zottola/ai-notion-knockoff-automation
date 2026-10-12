# Test cases — Block comments (UC-CMT-001)

Source: `feature-inventory.md` §8 and AC-CMT-001..009 of the app spec. Scope: comments are the only feature the inventory marks as new.
Priority: **High** = core flow or data loss/permission risk; **Medium** = important rule or secondary flow; **Low** = cosmetic, rare or costly to set up.
Only High and Medium are automated (`tests/regression/editor-comments.spec.js`). Low cases and anything needing a second identity stay manual.

| ID | Case | Priority | Automation |
|---|---|---|---|
| CMT-01 | Hovering a block offers the "Comentar en este bloque" bubble (AC-CMT-009) | High | TC0089 |
| CMT-02 | Adding a comment shows it with its author; bubble shows "1 comentario en este bloque" (AC-CMT-001, 009) | High | TC0090 |
| CMT-03 | A comment persists after reload (AC-CMT-001) | High | TC0091 |
| CMT-04 | Empty or whitespace-only comment cannot be sent (AC-CMT-001) | High | TC0093 |
| CMT-05 | Reply joins the same thread; bubble counts root + replies (AC-CMT-002) | High | TC0094 |
| CMT-06 | Resolve hides the thread and the bubble reads "Comentarios resueltos"; Reabrir restores it (AC-CMT-006) | High | TC0095 |
| CMT-07 | Author deletes own comment; bubble returns to empty (AC-CMT-007) | High | TC0099 |
| CMT-08 | Deleting the root comment removes its replies (AC-CMT-007) | High | TC0100 |
| CMT-09 | Deleting a block removes its comments and bubble (AC-CMT-007) | High | TC0102 |
| CMT-10 | VIEWER/GUEST can read and write comments (AC-CMT-003) | High | Manual: no VIEWER/GUEST identity (same gap as TC0084) |
| CMT-11 | A user without page access neither sees nor writes comments; nobody comments as another person (AC-CMT-004) | High | Manual: needs a second identity |
| CMT-12 | Enter sends; Shift+Enter adds a new line | Medium | TC0092 |
| CMT-13 | "Ver resueltos (N)" lists resolved threads; "Ocultar resueltos" hides them (AC-CMT-006) | Medium | TC0096 |
| CMT-14 | Author edits own comment (AC-CMT-005) | Medium | TC0097 |
| CMT-15 | Cancelling an edit keeps the original text | Medium | TC0098 |
| CMT-16 | Comments on different blocks stay independent | Medium | TC0101 |
| CMT-17 | Comment box limits input to 4000 characters (attribute check only; the server limit is manual) | Medium | TC0103 |
| CMT-18 | Another user cannot edit my comment; OWNER/ADMIN delete any comment (AC-CMT-005, 007) | Medium | Manual: needs a second identity |
| CMT-19 | Live updates: a comment from another user appears without reload (AC-CMT-008) | Medium | Manual: needs two sessions with distinct users |
| CMT-20 | "Comentar" in the rich editor's floating menu opens the thread | Medium | Not automated yet: selection toolbar entry needs exploration |
| CMT-21 | Comments work in the classic editor (`data-testid="block-<id>"`) | Low | Not automated |
| CMT-22 | Author avatar/name snapshot visible to a GUEST | Low | Not automated |
| CMT-23 | Bubble position on a phone viewport (`-mr-1`) | Low | Not automated |
| CMT-24 | Date format of each entry | Low | Not automated |
| CMT-25 | Bubble stays while the mouse crosses the gap (350 ms grace) | Low | Not automated |

## Findings

- The bubble count includes replies (`openCount` sums roots and replies): a thread with one reply reads "2 comentarios". Matches the code, so TC0094 asserts it.
- No defects found in the automated flows. A readonly page title after creating a page (permissions race) made setup flaky; `DocPage.setTitle` now reloads once when the title does not become editable.
