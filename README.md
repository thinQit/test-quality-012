# test-quality-012

A simple CRUD dashboard app for managing test items. Provides list, create, read, update, delete operations for Item entities, a dashboard overview, and a health endpoint.

## Features
- Dashboard with total item count and recent items
- Items list with pagination and optional search
- Create, update, and delete item workflows
- Health endpoint for diagnostics
- Responsive, accessible UI components

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM (SQLite for local dev)
- Jest + React Testing Library
- Playwright for E2E tests

## Prerequisites
- Node.js 18+
- npm

## Quick Start
### macOS/Linux
```bash
./install.sh
```

### Windows PowerShell
```powershell
./install.ps1
```

Then start the dev server:
```bash
npm run dev
```

## Environment Variables
Copy `.env.example` to `.env`:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-min-32-chars-change-in-production"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

## Project Structure
```
src/
  app/              # Next.js routes and layouts
  components/       # Reusable UI components
  lib/              # Utilities and API helpers
  providers/        # Context providers
  types/            # Shared TypeScript types
prisma/             # Prisma schema and seeds
```

## API Endpoints
- `GET /api/health` — Health check
- `GET /api/items` — List items (pagination, optional search)
- `POST /api/items` — Create item
- `GET /api/items/{id}` — Get item by id
- `PUT /api/items/{id}` — Update item
- `DELETE /api/items/{id}` — Delete item

## Available Scripts
- `npm run dev` — Start dev server
- `npm run build` — Build for production
- `npm run start` — Run production server
- `npm run lint` — Run lint checks
- `npm run test` — Run unit tests
- `npm run test:e2e` — Run Playwright tests

## Testing
- Unit tests: `npm run test`
- E2E tests: `npm run test:e2e`

## Notes
- Prisma database setup is included in install scripts.
- The app is structured for easy expansion into full CRUD flows and API routes.
