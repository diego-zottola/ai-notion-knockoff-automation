# Test cases — coverage gaps (second pass)

Source: `feature-inventory.md` of the app repo, compared with the existing suite. Google login is out of scope.
Priority: **High** = core flow, data loss or permission risk. **Medium** = important rule or secondary flow. **Low** = cosmetic, rare or costly to set up.
Only High and Medium are automated. "Manual" means not automated, with the reason.
The QA viewer account (`VIEWER_USER_*`) is a GUEST of the QA workspace; its role is never changed because parallel tests share it.

## Pages: hierarchy, order, navigation, trash (`pages-organization.spec.js`)

| TC | Case | Priority |
|---|---|---|
| TC0104 | "Mover a…" moves a page under another; breadcrumb shows the new parent | High |
| TC0105 | A sub-page can be moved back to the workspace root | High |
| TC0106 | The move dialog never offers the page itself or its sub-pages | Medium |
| TC0107 | "Mover" is disabled until a destination is chosen | Medium |
| TC0108 | "Bajar"/"Subir" reorder siblings and the order persists | High |
| TC0109 | Breadcrumb lists ancestors; an ancestor link navigates | Medium |
| TC0110 | A new sub-page shows under its parent without reload | Medium |
| TC0111 | Archiving a parent archives its sub-pages; restoring brings them back | High |
| TC0112 | Deleting a parent forever removes its sub-pages | High |
| — | Move under an archived page is rejected; guest cannot move | Manual: needs an archived destination in the dialog / a writer guest |

## Search (`search.spec.js`)

| TC | Case | Priority |
|---|---|---|
| TC0113 | Finds a page by text inside its blocks | High |
| TC0114 | Case-insensitive substring | Medium |
| TC0115 | Title matches are listed before body-only matches | Medium |
| TC0116 | Archived pages do not appear | High |
| TC0117 | Finds text inside a table cell | Medium |

## Block types and shortcuts (`editor-blocks.spec.js`)

| TC | Case | Priority |
|---|---|---|
| TC0118-TC0121 | `- `, `1. `, `[] `, `> ` create bulleted list, numbered list, to-do, quote; persist | High |
| TC0122-TC0123 | `## ` and `### ` create headings 2 and 3; persist | High |
| TC0124 | Three backticks create a code block that persists | High |
| TC0125 | `---` + Enter creates a divider | Medium |
| TC0126 | A to-do can be checked and stays checked | Medium |
| TC0127 | Tab nests list items to three levels, Shift+Tab lifts | Medium |
| TC0128 | Enter splits a paragraph | Medium |
| TC0129 | Ctrl/Cmd+A selects the page content only | High |
| — | Code block language selector | Low |
| — | Fourth nesting level is refused | Low |

## Preferences, classic editor, session, profile (`preferences-session.spec.js`)

| TC | Case | Priority |
|---|---|---|
| TC0130 | Dark theme applies and persists | High |
| TC0131 | "Vista compacta" persists | Medium |
| TC0132 | "Editor con formato" off opens the classic editor; on restores it | High |
| TC0133 | A block typed in the classic editor persists | Medium |
| TC0134 | Session survives reload; `/login` redirects a signed-in user | High |
| TC0135 | Display name changes and persists; blank rejected; name restored | Medium |
| TC0136 | `beforeunload` only when there are unsaved changes | Medium |
| TC0160 | The unsaved local draft is removed from the device at logout | Medium |
| — | Drafts purged after 7 days | Medium, manual: needs seven days or a clock change |
| — | Classic editor: Tab nesting, Ctrl+B/I/K | Low |

## Permissions with the viewer (`permissions.spec.js`, `editor-persistence.spec.js`)

| TC | Case | Priority |
|---|---|---|
| TC0084 | Viewer cannot change the page by keyboard or paste (was skipped) | High |
| TC0137 | A page shared as "Puede ver" opens with title and content | High |
| TC0138 | Viewer sees no write controls | High |
| TC0139 | Viewer cannot create pages | High |
| TC0140 | Viewer can comment; owner sees the author and may delete it | High |
| TC0141 | Viewer cannot edit or delete the owner's comment | Medium |
| TC0142 | Changing the grant to "Puede editar" lets the viewer edit; back to "Puede ver" removes it | Medium |
| TC0143 | Revoking removes access | High |
| TC0144 | Grant is inherited by sub-pages | Medium |
| TC0145 | An unshared page is not reachable | High |
| TC0146 | Share dialog lists who has access and their level | Medium |
| TC0157 | Sharing again updates the grant, no duplicate | Medium |
| TC0158 | A sub-page shared alone shows under "Compartido conmigo" | Medium |
| TC0159 | Unregistered address becomes a pending invitation; re-invite updates; cancel removes | Medium |
| — | Server rejects writes from a viewer (RLS) | High, manual: needs direct API access, not available |
| — | Archived pages cannot be shared | Low |

## Live collaboration (`collaboration.spec.js`)

| TC | Case | Priority |
|---|---|---|
| TC0147 | Text typed by the owner appears for the viewer without reload | High |
| TC0148 | Owner sees that someone else is on the page; notice goes when they leave | Medium |
| TC0149 | A comment from the owner appears for the viewer live | Medium |
| TC0150 | A title change reaches the viewer's sidebar live | Medium |
| — | Resync after connection loss | Low |

## Groups and members (`groups-members.spec.js`)

| TC | Case | Priority |
|---|---|---|
| TC0151 | Create, rename and delete a group | High |
| TC0152 | Group name unique ignoring case | Medium |
| TC0153 | Add and remove group members | Medium |
| TC0154 | Page shared with a group grants access; removing the member revokes it | High |
| TC0155 | Viewer shows as a guest in Miembros | Medium |
| TC0156 | Guest gets no Grupos/Papelera and no member directory | High |
| — | Change a member's role, remove a member, leave the workspace | Medium, manual: the shared viewer account would change for parallel tests |
| — | Ownership transfer | High, manual: irreversible on the QA workspace |
| — | Create a workspace | Medium, manual: no way to delete it afterwards |
| — | Verified-domain auto-join, first sign-in bootstrap | Medium, manual: needs new Google accounts |
| — | Stale-tab recovery after a deploy (PWA) | Low, manual: needs a deploy |
| — | Notion sub-page paste (real child pages with icon) | Medium, not automated: needs Notion's private clipboard format; a synthetic event would not prove it |

## Findings

- A new page sometimes opens as "No encontramos esta página" until reloaded; `createPageFromSidebar` reloads once.
- On a phone the floating menu covers "Terminar selección" in block-selection mode (DEF-07, TC0088).
- The QA account accumulated about 630 leftover `qa-auto-` pages (plus untitled ones) from earlier failed runs. Past 1000 pages the app hides the newest ones (DEF-08), so new pages open as "not found" and the suite fails. Clean them with a database query, not the UI.
- Presence for a guest shows "también está acá" without a name.
