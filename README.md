# KAOS Dashboard

A self-hosted homelab dashboard — a single-page app that displays your services grouped by category in a clean, responsive grid with live Docker container status indicators.

## Features

- **Service grid** — categories with app cards, logos, descriptions, and direct links
- **Live container status** — color-coded dots (green/red/gray) polled every 5 seconds via the Docker socket
- **Fuzzy search** — filter apps by name or description across all categories instantly
- **Config-driven** — add or remove apps and categories by editing a single JSON file, no code changes needed
- **Responsive** — 4-column grid on desktop, single column on mobile
- **Dracula-inspired dark theme**

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript + Vite |
| UI | MUI (Material UI) |
| Search | Fuse.js |
| Styling | MUI `sx` + Tailwind CSS |
| Status API | Node.js (zero dependencies) |
| Production | nginx + supervisord in a single Docker image |

## Project Structure

```
src/
  App.tsx              # Root — search state, renders Header + Dashboard
  theme.ts             # MUI dark theme definition
  icons.ts             # Static icon registry: name string → MUI SvgIconComponent
  dashboard.json       # Config: categories and apps
  assets/              # SVG logos
  pages/
    Dashboard.tsx      # Responsive grid, fuzzy filtering, status polling
  components/
    Header.tsx         # Two-strip AppBar: logo/title + nav/search
    CategoryCard.tsx   # Category heading + app cards with status dots
server/
  status.mjs           # Node.js HTTP API: GET /api/status → { name: state }
```

## Getting Started

### Development

```bash
docker compose up
```

The dev server runs on `http://localhost:5173`. Container status dots will show gray unless you also run the status API:

```bash
node server/status.mjs
```

### Production (Docker)

```bash
docker build --target production -t kaos-dashboard .
docker run -p 80:80 -v /var/run/docker.sock:/var/run/docker.sock:ro kaos-dashboard
```

The production image runs nginx + the Node.js status API together via supervisord. Mounting the Docker socket is required for container status polling.

## Configuration

Everything is driven by [`src/dashboard.json`](src/dashboard.json).

### Adding an app

```jsonc
{
  "id": "my-container",      // Docker container name — used for status lookup
  "name": "My App",
  "logo": "myapp.svg",       // Drop the SVG into src/assets/
  "address": "https://myapp.example.com",
  "description": "Short description"
}
```

For apps without a Docker container (external sites, services running outside Docker), add `"isContainer": false` — no status dot will be rendered.

### Adding a category

```jsonc
{
  "id": "my-category",
  "name": "My Category",
  "icon": "Settings",        // Must match a key in src/icons.ts
  "apps": []
}
```

To use a new MUI icon, add it to [`src/icons.ts`](src/icons.ts):

```ts
import FooIcon from '@mui/icons-material/Foo'

export const iconRegistry = {
  Foo: FooIcon,
  // ...
}
```

## Container Status

The status API (`server/status.mjs`) shells out to `docker ps -a` and returns a JSON map of container names to their state. In production, nginx proxies `GET /api/status` to the API running on port 3001.

| Dot color | Meaning |
|-----------|---------|
| Green | Container is running |
| Red | Container is stopped |
| Gray | No data or `isContainer: false` |
