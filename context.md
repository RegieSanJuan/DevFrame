# Agent Context: DevFrame System

> Important
> This repo is on Next.js `16.2.3` and the App Router lives under `src/app`.
> Before making framework-level changes, read the relevant guide in
> `node_modules/next/dist/docs/`.

## Core Map

- App shell: `src/app/layout.tsx`
- Main route group: `src/app/(main)`
- Auth route group: `src/app/(auth)`
- Marketing shell: `src/app/(main)/layout.tsx`
- Header split: `src/components/site-header.tsx` (server auth) +
  `src/components/site-header-surface.tsx` (client scroll state)
- Builder: `src/app/(main)/builder/page.tsx`
- Dashboard: `src/app/(main)/dashboard/page.tsx`
- Studio: `src/app/(main)/studio/page.tsx`
- Public portfolio route: `src/app/(main)/p/[slug]/page.tsx`
- Public portfolio API: `src/app/api/portfolios/[slug]/route.ts`

## Product Surfaces

This repo is no longer just a template gallery. It has four distinct surfaces
that need to stay coherent:

1. Marketing pages (`/`, `/templates`, `/support`)
2. Authenticated builder and dashboard flows
3. The no-account studio flow (`/studio`) with live preview
4. Public portfolio output at `/p/[slug]`

When updating docs or UI, describe the system in terms of those surfaces, not
just "templates".

## Runtime Model

- Environment source of truth: `src/lib/env.ts`
- Auth helper layer: `src/lib/auth.ts`
- Supabase client wiring: `src/lib/supabase.ts`
- Setup readiness summary: `src/lib/setup-status.ts`

Key behavior:

- Clerk is optional at runtime.
- If Clerk keys are missing, the app intentionally falls back to `demoMode`
  instead of hard-failing. `getViewerContext()` returns a synthetic
  `"demo-user"` and protected flows remain usable in preview mode.
- If Clerk is configured, `requireViewer()` redirects unauthenticated users to
  `/sign-in`.

Do not remove preview-mode usability unless the product requirement changes.

## Auth Architecture

- Recent auth work moved sign-in and sign-up logic directly into
  `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx` and
  `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`.
- The custom auth UI now lives in:
  - `src/components/auth/custom-sign-in.tsx`
  - `src/components/auth/custom-sign-up.tsx`
  - `src/components/auth/auth-sso-callback.tsx`
- The current flow supports Google OAuth, email/password auth, and email-code
  verification for sign-up.
- SSO callback routes live under:
  - `src/app/(auth)/sign-in/sso-callback/page.tsx`
  - `src/app/(auth)/sign-up/sso-callback/page.tsx`
- Clerk is backend/session infrastructure only in this repo. Do not reintroduce
  Clerk UI surfaces such as `SignIn`, `SignUp`, `UserButton`, or
  `AuthenticateWithRedirectCallback`.
- The signed-in header control is now custom and lives in
  `src/components/site-header-account-menu.tsx`.
- Keep auth checks on the server when possible. The site header pattern is the
  reference: server-side `auth()` in `site-header.tsx`, client-only scroll UI
  in `site-header-surface.tsx`.

## Persistence and Preview Rules

- Server writes enter through `src/app/actions.ts` via `savePortfolioAction`.
- `savePortfolioAction` always validates the shared portfolio schema first.
- `src/lib/portfolio-storage.ts` always writes a preview cookie before trying
  Supabase persistence.
- If `SUPABASE_SERVICE_ROLE_KEY` is missing, saves still succeed in preview
  mode and the UI should explain that the public route is not fully persisted.
- Public reads prefer Supabase, then fall back to preview cookie data, then to
  seed portfolios.

Current persistence shape:

- Ownership is anchored by Clerk user id.
- `profiles` is upserted on save.
- `portfolios` stores the main record, including `template_settings`.
- Related reads currently hydrate:
  - `portfolio_experience`
  - `portfolio_recommendations`
  - `portfolio_assets` (`kind = 'gallery-image'`)

`PortfolioSection` types already exist in `src/lib/portfolio-schema.ts` for
optional structured sections, but current storage hydration is still centered on
experience, recommendation, and gallery assets.

## Template System Rules

- Renderer: `src/components/portfolio-renderer.tsx`
- Dynamic registry: `src/templates/registry.ts`
- Catalog metadata: `src/lib/template-catalog.ts`
- Template-specific builder fields: `src/lib/template-field-registry.ts`
- Shared schema: `src/lib/portfolio-schema.ts`

Important guardrails:

- Do not add conditionals to `portfolio-renderer.tsx` to special-case template
  behavior. Extend the catalog, registry, and template component instead.
- Do not create per-template database tables.
- Template-specific presentation settings belong in `templateSettings`.
- Template-specific builder controls belong in
  `template-field-registry.ts`.
- Gallery visuals should come from `portfolio_assets` or safe fallbacks, not
  hardcoded image arrays.

When adding a template, update all of these together:

1. `src/lib/template-catalog.ts`
2. `src/templates/registry.ts`
3. The template component under `src/templates/<slug>`
4. `src/lib/template-field-registry.ts` if the template needs custom settings
5. Seed preview coverage in `src/lib/portfolio-storage.ts` if needed

## Studio-Specific Notes

- `src/components/studio/studio-shell.tsx` is a client-side editing surface
  with a split editor/preview layout.
- Studio supports unauthenticated drafting first, then resumes save after auth.
- The save bridge stores intent in session storage and opens Clerk only when a
  real save is requested.

Treat Studio as a product surface of its own. It is not just a wrapper around
the builder page.

## Recent System Changes Reflected Here

- `21ada2f`: introduced `(main)` and `(auth)` route groups plus the shared
  shell structure.
- `39d5d2c`: added template settings, field registry plumbing, and Supabase
  persistence for template config.
- `d02385a`, `c579694`, `87dcfac`: moved the app onto custom Clerk-powered auth pages with Google OAuth, email/password, email verification, and callback routes.
- `e7f2a1b`: migrated to Tailwind CSS v4 and optimized dev environment memory limits.

## Development Environment

### Memory and Performance
- The project requires a higher Node memory limit for stable development due to the size of the template system and Turbopack usage.
- The `dev` script is pre-configured with `cross-env NODE_OPTIONS='--max-old-space-size=4096'`. Do not lower this limit unless strictly necessary.

### Styling System
- **Tailwind CSS v4**: The project uses Tailwind v4 via `@tailwindcss/postcss`.
- **CSS Entry Point**: `src/app/globals.css` uses the `@import "tailwindcss";` syntax.
- **Config**: Do not reintroduce a legacy `tailwind.config.js` unless it's strictly required for a tool that doesn't yet support v4 native CSS config.

### Configuration
- Use `next.config.ts` for all Next.js configuration. Redundant `next.config.js` files should be removed to avoid resolution conflicts.

## Verification

After touching architecture-sensitive areas:

1. Run targeted lint for the files you changed.
2. Run `npm run build` when you change route behavior, server/client boundaries,
   auth flows, or shared rendering contracts.
3. If you change persistence behavior, verify both preview-mode fallback and
   the Supabase-backed path.
