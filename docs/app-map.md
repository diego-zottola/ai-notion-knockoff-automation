# App map — Workspace (Notion-like collaborative workspace)

Learned from a first exploratory pass with no prior knowledge. The UI is in Spanish (rioplatense).
No secrets or customer data in this file.

- Production URL: see `BASE_URL` in `.env`. Hosted on Vercel, no Deployment Protection. React SPA (React Router) with a Supabase-style REST backend (`/rest/v1/...`).
- Login type: username + password, plus "Continuar con Google" (not automated).

## Routes

| Route | Screen | Notes |
|---|---|---|
| `/` | Login ("Bienvenido") when logged out; redirects to the workspace when logged in | SPA hydrates late (about 1-2 s) |
| `/w/:workspaceId` | Workspace home | Heading = workspace name, "Nueva página" button, "Recientes" region |
| `/w/:workspaceId/p/:pageId` | Page editor | Breadcrumb, Compartir, Mover, Archivar, title, blocks, image |
| `/w/:workspaceId/trash` | Papelera | Restore or delete forever |
| `/w/:workspaceId/settings/members` | Miembros | Invite by email with a role |
| `/w/:workspaceId/settings/groups` | Grupos | Create, rename, delete groups; add or remove members |
| `/settings` | Preferencias | Theme (Claro/Oscuro/Sistema), Vista compacta switch, app version |
| `/profile` | Perfil | Display name, username (read only), list of the user's spaces |

## Sidebar (all workspace screens)

Workspace switcher (menu: spaces list + "Crear espacio de trabajo"), "Buscar ⌘K" (search dialog), "Nueva página",
page tree (per page: link, "Agregar subpágina en X", "Acciones de X" menu with Subir / Bajar / Mover a… / Archivar,
expand/collapse button when it has children), then Papelera, Miembros, Grupos, Preferencias, Perfil, Cerrar sesión.

## Flows

1. **Login:** fill Usuario + Contraseña, "Ingresar", land on `/w/:id`.
2. **Create page:** "Nueva página" (sidebar or home) creates an untitled page ("Sin título") and opens the editor.
3. **Edit:** title textbox autosaves; "Agregar bloque" adds a text block; typing `# `, `- `, `[]`, `>` formats the block (`# ` becomes "Título 1").
4. **Search:** dialog with a searchbox; searches by title or content.
5. **Share:** dialog to share by email (Puede ver / Puede editar / Acceso total) or with a group; access is inherited by subpages.
6. **Move:** dialog with destination list ("Mover" disabled until one is chosen).
7. **Archive:** confirmation alertdialog, page (and subpages) goes to Papelera; then Restaurar or Eliminar definitivamente (second confirmation).
8. **Logout:** "Cerrar sesión" returns to login.

## Coverage

See the test inventory in `CLAUDE.md`. Not covered yet (backlog): sharing and member invitations (they create real invitations, so they need a data-cleanup strategy), page move, reordering (Subir/Bajar), image upload, workspace creation, theme/compact persistence, Google login.
