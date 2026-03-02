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

## Project Structure
```
src/
  App.tsx              # Root — holds searchQuery state, renders Header + Dashboard
  theme.ts             # MUI dark theme definition
  icons.ts             # Static registry: icon name string → MUI SvgIconComponent
  dashboard.json       # Config: categories → apps (name, logo, address, description, icon)
  assets/              # SVG logos (e.g. portainer.svg, traefik.svg)
  pages/
    Dashboard.tsx      # 4-col responsive grid (1-col on mobile), fuse.js filtering
  components/
    Header.tsx         # Two-strip AppBar (logo+title strip, nav+search strip)
    CategoryCard.tsx   # Category heading + one Card per app
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
          "name": "App Name",
          "logo": "filename.svg", // must exist in src/assets/
          "address": "https://...",
          "description": "Short description"
        }
      ]
    }
  ]
}
```

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
Dashboard grid: `{ xs: '1fr', md: 'repeat(4, 1fr)' }` — 1 column below 900px, 4 columns above.

### Header padding consistency
Both Toolbar strips and the Dashboard Box use `px: 10` so content aligns horizontally across the full page. `disableGutters` on each Toolbar prevents MUI's default padding from interfering. `bgcolor` is set per-Toolbar (not on AppBar) to avoid background bleed.

## Common Tasks

### Add a new app
Edit `src/dashboard.json` — add an entry to the relevant category's `apps` array. Drop the SVG logo into `src/assets/`.

### Add a new category
Edit `src/dashboard.json` — add a new category object. Make sure the `icon` string matches a key in `iconRegistry`. If it doesn't exist, add it to `src/icons.ts`.

### Add a new icon
1. `src/icons.ts`: `import FooIcon from '@mui/icons-material/Foo'`
2. Add `Foo: FooIcon` to `iconRegistry`
3. Use `"icon": "Foo"` in `dashboard.json`

### Change responsive breakpoint
In `src/pages/Dashboard.tsx`, change the `gridTemplateColumns` breakpoint key (`xs`/`sm`/`md`/`lg`/`xl` → 0/600/900/1200/1536 px).
