# DevFrame

DevFrame is a portfolio builder for developers. Users sign in, choose a ready-made template, fill in a guided form, and publish a portfolio at a route like `/p/regie`.

This repo is set up as an MVP SaaS starter with:

- Next.js 16 App Router
- Tailwind CSS 4
- shadcn-style UI primitives
- Clerk authentication
- Supabase PostgreSQL
- Supabase Storage-ready architecture
- React Hook Form + Zod
- Vercel-friendly deployment setup

## What is included

- Marketing homepage for DevFrame
- Clerk sign-in and sign-up routes
- Protected dashboard, templates, and builder pages
- Template catalog with three starter portfolio styles
- Public portfolio route at `/p/[slug]`
- API routes for templates and public portfolio fetches
- Server action for saving portfolio data
- Cookie-backed preview mode when Supabase is not configured yet
- Supabase schema file for real persistence

## Local setup

1. Install dependencies.

```bash
npm install
```

2. Copy the example environment file.

```bash
cp .env.example .env.local
```

3. Create a Clerk app and add:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_AUTHORIZED_PARTIES` if you want to override the default origin allowlist

4. Create a Supabase project and add:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

5. Run the SQL in [supabase/schema.sql](/d:/concept/supabase/schema.sql:1) inside the Supabase SQL editor.

6. Start the app.

```bash
npm run dev
```

Open `http://localhost:3000`.

## Before deploying to Vercel

- Set `NEXT_PUBLIC_APP_URL` to your production origin, for example `https://your-domain.com`.
- Clerk `authorizedParties` is now enforced in `src/proxy.ts`.
- By default it allows `NEXT_PUBLIC_APP_URL` plus the current Vercel deployment URL(s).
- If you want an explicit fixed allowlist, set `CLERK_AUTHORIZED_PARTIES` as a comma-separated list such as `https://your-domain.com,https://your-project.vercel.app`.
- Leave Vercel's `Automatically expose System Environment Variables` setting enabled so preview deployments can use `VERCEL_BRANCH_URL`, `VERCEL_URL`, and `VERCEL_PROJECT_PRODUCTION_URL`.

## Recommended Vercel branch flow

| Branch | Purpose | Vercel deployment |
| --- | --- | --- |
| `main` | Production | Live site |
| `staging` | Testing | Preview |
| `feature/*` | Dev | Preview |

### Dashboard setup

1. Import the repo into Vercel and keep `main` as the Production Branch.
2. Add your shared secrets to the correct Vercel environments:
   - Production: real production values, including `NEXT_PUBLIC_APP_URL=https://your-domain.com`
   - Preview: shared preview values for non-production branches
   - Development: local `vercel dev` / `vercel env pull` usage
3. For `staging`, add branch-specific Preview overrides only for values that should differ from other preview branches.
   - Example: set `NEXT_PUBLIC_APP_URL=https://staging.your-domain.com` only for the `staging` preview branch if you want a stable staging URL
4. If you want a stable `staging` domain, assign that domain to the `staging` Git branch in Vercel.
5. Let `feature/*` branches use the default generated Preview URLs unless you have a specific reason to override them.

### Repo behavior

- Production deploys use `NEXT_PUBLIC_APP_URL` when you set it.
- Preview deploys now automatically fall back to the active Vercel branch/deployment URL when `NEXT_PUBLIC_APP_URL` is not set for Preview.
- That means `staging` and `feature/*` previews no longer fall back to `http://localhost:3000` for metadata and generated portfolio links.

## Auth choice

This project is wired for Clerk because it is the fastest way to ship an MVP auth flow. As of April 15, 2026, Clerk's official pricing page lists a free `Hobby` tier with up to `50,000 monthly active users`, so it is a practical option for an MVP.

Source:

- https://clerk.com/pricing

## How persistence works

- If Clerk and Supabase are configured, portfolio submissions are saved to Supabase.
- If Supabase is missing, the builder still works in preview mode using a secure cookie so you can keep designing the experience locally.
- Public portfolio pages always try Supabase first, then fall back to local seeded examples and preview mode.

## Suggested next steps

- Add image upload flows with Supabase Storage
- Add more template variants
- Add a custom domain workflow
- Add an editor for multiple projects, testimonials, and blog posts
- Add billing once the core product flow feels good

## Customizing & Adding Templates

DevFrame uses a modular template system. Each template is a standalone React component registered in a central registry.

### How to customize a template
1. **Specific Template**: Edit the file in `src/templates/`. For example, to change the "Nova" template, edit `src/templates/nova/index.tsx`.
2. **Shared Components**: Common elements like `LinkPill` or `SkillBadge` are located in `src/templates/base-components.tsx`. Changing these will update all templates simultaneously.
3. **Global Styles**: Core design tokens (colors, fonts) are defined as CSS variables in `src/app/globals.css`.

### How to add a new template
1. **Create the component**: Create a new file (e.g., `src/templates/my-new-template.tsx`).
2. **Register it**: Call `registerTemplate("my-slug", MyComponent)` at the bottom of your file.
3. **Import it**: Add an import for your new template in `src/templates/index.ts`.
4. **Update Catalog**: Add your template metadata (slug, name, tagline, etc.) to `src/lib/template-catalog.ts` so it appearing in the builder.
5. **(Optional) Add Seed Data**: Add a sample portfolio for your template in `src/lib/portfolio-storage.ts` to enable instant previews.

### Template Architecture
- `src/templates/registry.ts`: The central registry mapping slugs to components.
- `src/components/portfolio-renderer.tsx`: The main renderer that dynamically loads the correct template.
