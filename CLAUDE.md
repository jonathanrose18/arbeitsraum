# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev            # Start all apps (runs db:generate first via Turbo)
pnpm build          # Build all apps
pnpm lint           # Lint all packages
pnpm check-types    # Type-check all packages
pnpm format         # Format all files with Prettier

# Database
pnpm db-dev:up      # Start local Postgres container (docker-compose.dev.yml)
pnpm db-dev:down    # Stop local Postgres container
pnpm db:migrate     # Create and apply a new Prisma migration
pnpm db:generate    # Regenerate Prisma client after schema changes
pnpm db:studio      # Open Prisma Studio

# Production Docker
pnpm prod:build     # Build Docker images
pnpm prod:up        # Start production stack
pnpm prod:down      # Stop production stack
```

Environment variables are loaded from `.env` at the repo root (copy from `.env.example`). The web app's `dev` and `build` scripts use `dotenv-cli` to inject them automatically.

## Architecture

This is a **pnpm + Turborepo monorepo** with the following packages:

- `apps/web` — Next.js 16 app (`@arbeitsraum/web`), built with `output: 'standalone'`
- `packages/database` — Prisma client package (`@arbeitsraum/db`), exports `prisma` singleton and all generated types
- `packages/eslint-config` — Shared ESLint config
- `packages/typescript-config` — Shared TypeScript config

### Auth

Authentication is handled by **better-auth** with a Prisma adapter backed by PostgreSQL.

- `apps/web/lib/auth.ts` — Server-side auth instance (marked `server-only`), exports `Session` and `User` types
- `apps/web/lib/auth-client.ts` — Client-side auth client, exports `signIn`, `signOut`, `signUp`, `useSession`
- `apps/web/app/api/auth/[...all]/route.ts` — Catch-all route that delegates to better-auth
- `apps/web/hoc/with-auth.tsx` — `withAuth` HOC that wraps server components to enforce authentication. All pages and layouts inside `app/(protected)` use this HOC instead of inline auth checks. It calls `getAuth()` and redirects to `/sign-in` if no session is found, then passes `user` as a prop to the wrapped component.

### Database

The `@arbeitsraum/db` package uses the `@prisma/adapter-pg` driver adapter for native PostgreSQL connections. The Prisma client is generated into `packages/database/generated/prisma/` and the schema lives at `packages/database/prisma/schema.prisma`. The schema currently contains only the tables required by better-auth: `User`, `Session`, `Account`, and `Verification`.

Turbo ensures `db:generate` runs before `dev` and `build`.

### UI

The web app uses **Tailwind CSS v4**, **shadcn/ui** (via the `shadcn` CLI), **Radix UI**, and **Lucide React** for icons. Prettier is configured with `prettier-plugin-tailwindcss` for class sorting.

### Testing

- Unit and integration tests live **co-located with their feature**: `features/<feature>/*.test.ts`
- E2E tests live in a separate `apps/e2e/` Playwright app
- Use **Vitest** for unit/integration tests, **Playwright** for E2E
- Test `queries.ts` and `actions.ts` directly — no need to mock Prisma for integration tests, use a real test database
- `app/` pages and layouts are thin by design; test feature components instead
- Run tests via Turbo: `pnpm test` runs all unit tests across the monorepo

### Feature-vertical slices (`apps/web`)

All feature code in `apps/web` follows a vertical slice architecture. The structure that scales best with App Router:

```
apps/web/
  app/                          # Routing only — pages, layouts, API routes
    (auth)/
      sign-in/page.tsx
      sign-up/page.tsx
    (protected)/
      ~/page.tsx
    api/
      auth/[...all]/route.ts
    layout.tsx

  features/                     # Feature-first — vertical slices
    auth/
      components/               # sign-in form, etc.
        sign-in-form.tsx
      actions.ts                # server actions (mutations)
      queries.ts                # data fetching (reads)
      types.ts                  # feature-specific types
    dashboard/
      components/
      queries.ts

  components/
    ui/                         # shadcn components (generated)

  hoc/                          # Server-component higher-order components
    with-auth.tsx               # Enforces auth, passes user prop to wrapped component

  lib/                          # Infrastructure singletons
    auth.ts                     # better-auth server instance
    auth-client.ts              # better-auth client instance
    utils.ts                    # cn() etc.
```

The mental model:

- `app/` — where things live (routing)
- `features/` — what things do (all code for a domain concept)
- `lib/` — infrastructure that features depend on
- `components/ui/` — generic, unstyled building blocks
- `components` — generic components which are used in multiple features

The implicit layers within each feature:

| File          | Role                           | Runs on          |
| ------------- | ------------------------------ | ---------------- |
| `queries.ts`  | Read data, direct Prisma calls | Server           |
| `actions.ts`  | Mutations, server actions      | Server           |
| `components/` | UI, uses queries + actions     | Client or Server |

Key rules:

1. `app/` pages are thin — they just compose feature components and pass params. No logic there.
2. Query directly with Prisma — no repository layer. Prisma is already a good abstraction. Add a repository only if you genuinely need to swap data sources.
3. Co-locate by feature — when you delete a feature, you delete one folder.
4. `lib/` never imports from `features/` — dependencies flow one way.
