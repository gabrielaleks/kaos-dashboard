# KAOS Dashboard — Claude Agent Context

## Project Overview
A homelab dashboard single-page app (SPA) that displays services grouped by category in a responsive grid. All configuration is driven by `src/dashboard.json` — no code changes needed to add/remove apps or categories.

## Tech Stack
- **React + TypeScript + Vite**
- **MUI (Material UI) v7** — dark Dracula-inspired theme
- **Fuse.js** — fuzzy search
- **Tailwind CSS** — present but minimal use; MUI `sx` prop is the primary styling mechanism

## Theme Colors (Dracula-ish)
| Token | Value |
|-------|-------|
| `background.default` | `#282a36` |
| `background.paper` | `#2f3142` |
| Header strip 1 bgcolor | `#282a36` |
| Header strip 2 bgcolor | `#2f3142` |
| Status running | `#50fa7b` (green) |
| Status stopped | `#ff5555` (red) |
| Status unknown | `#6272a4` (gray) |

## Project Structure
```
src/
  App.tsx              # Root — holds searchQuery state, renders Header + Dashboard
  theme.ts             # MUI dark theme definition
  icons.ts             # Static registry: icon name string → MUI SvgIconComponent
  dashboard.json       # Config: categories → apps (id, name, logo, address, description, isContainer)
  assets/              # SVG logos (e.g. portainer.svg, traefik.svg)
  pages/
    Dashboard.tsx      # 4-col responsive grid (1-col on mobile), fuse.js filtering, status polling
  components/
    Header.tsx         # Two-strip AppBar (logo+title strip, nav+search strip) — responsive
    CategoryCard.tsx   # Category heading + one Card per app + status dot
server/
  status.mjs           # Node.js HTTP server: GET /api/status → { containerName: state }
supervisord.conf       # Runs nginx + status API as co-processes in production container
public/
  kaos-logo.png        # Favicon and header logo
```

## Key Architectural Decisions

### dashboard.json schema
```jsonc
{
  "categories": [
    {
      "id": "unique-id",        // used as React key
      "name": "Display Name",
      "icon": "Lan",            // must match a key in src/icons.ts iconRegistry
      "apps": [
        {
          "id": "container-name", // Docker container name; used to look up status
          "name": "App Name",
          "logo": "filename.svg", // must exist in src/assets/
          "address": "https://...",
          "description": "Short description"
          // "isContainer": false  // add this for apps with no Docker container (e.g. external sites)
        }
      ]
    }
  ]
}
```
Apps without `isContainer: false` are assumed to be Docker containers. Their `id` must match the container name exactly as returned by `docker ps`.

### Container status
- `server/status.mjs` is a zero-dependency Node.js script that shells out to `docker ps -a --format '{{.Names}}\t{{.State}}'` and returns JSON
- In production, nginx proxies `GET /api/status` → `http://localhost:3001/api/status` (see `nginx.conf`)
- `supervisord.conf` starts both nginx and the status API inside the single production container
- The production container must mount `/var/run/docker.sock:/var/run/docker.sock:ro`
- `Dashboard.tsx` fetches `/api/status` on mount and polls every 5 seconds; passes `containerStatus` map down to `CategoryCard`
- `CategoryCard.tsx` renders an 8px dot per app: green = running, red = stopped, gray = no data; no dot when `isContainer: false`

### SVG logo loading
Uses Vite's `import.meta.glob` at module level in Dashboard.tsx:
```ts
const logos = import.meta.glob('../assets/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>
```
Accessed as `logos[`../assets/${app.logo}`]`. New SVG files in `src/assets/` are picked up automatically.

### Dynamic MUI icons
True dynamic imports are not feasible with tree-shaken MUI icons. Solution: static registry in `src/icons.ts`:
```ts
export const iconRegistry: Record<string, SvgIconComponent> = {
  Home: HomeIcon,
  Lan: LanIcon,
  Person: PersonIcon,
  Settings: SettingsIcon,
}
```
To add a new icon: import it at the top of `icons.ts` and add an entry to `iconRegistry`.

### Search (Fuse.js)
- `fuse` index and `allApps` array are created at module level in `Dashboard.tsx` (once, not per-render)
- Keys: `['name', 'description']`, threshold: `0.3`
- State lifted to `App.tsx` → passed as `onSearch` to `Header`, `searchQuery` to `Dashboard`
- `filteredCategories` computed with `useMemo`; categories with 0 matching apps are hidden

### Responsive layout
- Dashboard grid: `{ xs: '1fr', md: 'repeat(4, 1fr)' }` — 1 column below 900px, 4 columns above
- Header toolbars use `px: { xs: 2, md: 10 }` — reduced padding on mobile
- Logo scales: `{ xs: 36, md: 48 }` px; title uses `noWrap` with responsive font size

### Header padding consistency
Both Toolbar strips and the Dashboard Box use `px: { xs: 2, md: 10 }` so content aligns horizontally. `disableGutters` on each Toolbar prevents MUI's default padding from interfering. `bgcolor` is set per-Toolbar (not on AppBar) to avoid background bleed.

## Common Tasks

### Add a new app
Edit `src/dashboard.json` — add an entry to the relevant category's `apps` array. Set `id` to the Docker container name. Drop the SVG logo into `src/assets/`. For external sites with no container, add `"isContainer": false`.

### Add a new category
Edit `src/dashboard.json` — add a new category object. Make sure the `icon` string matches a key in `iconRegistry`. If it doesn't exist, add it to `src/icons.ts`.

### Add a new icon
1. `src/icons.ts`: `import FooIcon from '@mui/icons-material/Foo'`
2. Add `Foo: FooIcon` to `iconRegistry`
3. Use `"icon": "Foo"` in `dashboard.json`

### Change responsive breakpoint
In `src/pages/Dashboard.tsx`, change the `gridTemplateColumns` breakpoint key (`xs`/`sm`/`md`/`lg`/`xl` → 0/600/900/1200/1536 px).