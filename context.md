# Agent Context: DevFrame System

> [!IMPORTANT]
> This repository is built on Next.js `16.2.3` and the App Router resides under `src/app`.
> Before making framework-level changes, consult the Next.js API guide in `node_modules/next/dist/docs/`. Heed framework deprecations.

---

## 1. Core Map

- **App Shell**: `src/app/layout.tsx`
- **Main Route Group**: `src/app/(main)`
- **Auth Route Group**: `src/app/(auth)`
- **Marketing & Layout Shell**: `src/app/(main)/layout.tsx`
- **Header Split System**:
  - `src/components/site-header.tsx` (Server auth context)
  - `src/components/site-header-surface.tsx` (Client scroll, responsiveness, & mobile menu state)
- **Operational Product Pages**:
  - **Builder**: `src/app/(main)/builder/page.tsx`
  - **Dashboard**: `src/app/(main)/dashboard/page.tsx`
  - **Studio**: `src/app/(main)/studio/page.tsx`
- **Public Output Routes**:
  - **Public Portfolio Route**: `src/app/(main)/p/[slug]/page.tsx`
  - **Public Portfolio API Endpoint**: `src/app/api/portfolios/[slug]/route.ts`

---

## 2. Product Surfaces

DevFrame consists of four core surfaces that must maintain structural and visual coherence:

1. **Marketing Surfaces** (`/`, `/templates`, `/support`): Expressive, dark-first editorial layout.
2. **Authenticated Builder & Dashboard**: High operational density fields for bio, resume details, and custom parameters.
3. **No-Account Studio Flow** (`/studio`): Immediate live sidebar editing and split-panel responsive preview.
4. **Public Portfolio Output** (`/p/[slug]`): Production-grade static and dynamic server/client rendered portfolios.

---

## 3. Runtime Model

- **Environment Config**: `src/lib/env.ts` (Dynamic and static variables, validation schemas)
- **Auth Helper Layer**: `src/lib/auth.ts`
- **Supabase Integration**: `src/lib/supabase.ts`
- **Setup Readiness Status**: `src/lib/setup-status.ts`

### Fallback Behavior
- **Clerk Integration**: Optional at runtime. If Clerk credentials are absent, the application gracefully activates `demoMode` rather than crashing. `getViewerContext()` provides a synthetic `"demo-user"` context so features remain fully interactive in preview mode.
- **Supabase Integration**: If `SUPABASE_SERVICE_ROLE_KEY` is missing, data saves trigger local preview cookies so draft updates persist locally on the browser.

---

## 4. Auth Architecture

- **Auth Pages**: Direct path overrides inside `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx` and `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`.
- **Custom UI Components**: Custom widgets handle sign-in, signup, email verification, and OAuth.
  - `src/components/auth/custom-sign-in.tsx`
  - `src/components/auth/custom-sign-up.tsx`
  - `src/components/auth/auth-sso-callback.tsx`
- **Clerk Constraints**: Clerk serves strictly as the backend session infrastructure. **Do not reintroduce standard Clerk UI overlays** (`SignIn`, `SignUp`, `UserButton`, etc.). Custom navigation flows utilize `src/components/site-header-account-menu.tsx` for signed-in actions.
- **Server Guarding**: Always keep authentication checks on the server level when possible (`site-header.tsx`), delegating UI rendering to the client components.

---

## 5. Persistence, Uploads, & Swapping Rules

### A. Single Portfolio Record Rule
To avoid duplicate portfolios and table bloat, changing a portfolio's visual template **modifies the single, shared portfolio record** rather than creating new entries. The update modifies `template_settings` and `template_slug` while keeping existing user bio, education, experience, and custom sections intact.

### B. Upload Route Guards & Image Verification
- **Upload Utility**: `src/lib/portfolio-image-uploads.ts` manages image constraints:
  - Allowed formats: `.jpg, .jpeg, .png, .webp` (max `5MB`).
  - Storage bucket: `portfolio-assets`.
- **Security Middlewares**: `src/lib/security/request-guard.ts` intercepts incoming mutation requests. **Critical Guard**: Keep the request guards configured to allow valid file uploads and dynamic assets, preventing `405 Method Not Allowed` errors.

### C. Asset Switch & Preservation Rules
- **Preserved Assets**: User-uploaded profile images and portfolio gallery images are template-agnostic. They are retained globally when switching templates.
- **Managed Assets**: `src/lib/portfolio-storage.ts` maintains a `MANAGED_ASSET_KINDS` array containing specific, non-persistent, or template-dependent asset items. Ensure that this checklist is safely managed so template-agnostic files do not get cleaned up or lost during template transitions.

---

## 6. Template System Rules

- **Visual Renderer**: `src/components/portfolio-renderer.tsx` (Avoid placing inline template-specific conditionals here; let the registry handle dynamic matching)
- **Dynamic Registry**: `src/templates/registry.ts`
- **Catalog Metadata**: `src/lib/template-catalog.ts`
- **Dynamic Builder Fields**: `src/lib/template-field-registry.ts`
- **Shared Schema**: `src/lib/portfolio-schema.ts`

### Steps to Register a New Template
1. Create metadata inside `src/lib/template-catalog.ts`.
2. Add dynamic mapping to `src/templates/registry.ts`.
3. Build the core component inside `src/templates/<slug>`.
4. Configure any unique interactive settings in `src/lib/template-field-registry.ts`.
5. Seed mock portfolio fallbacks in `src/lib/portfolio-storage.ts`.

---

## 7. Recent System Changes

- **Clerk Custom Flow Integration**: Replaced pre-packaged widgets with custom callbacks, supporting custom styling and direct OAuth integrations.
- **Tailwind CSS v4 Migration**: Transitioned styles completely to Tailwind CSS v4 using `@tailwindcss/postcss` and dynamic `@import "tailwindcss"` setups.
- **Upload Route Fix**: Audited upload routes and updated request guard boundaries (`request-guard.ts`) to resolve 405 error cases on direct client uploads.
- **Single Instance Persistence**: Reconstructed persistence layers in `savePortfolioAction` to prevent duplicate row creation upon changing portfolio templates.
- **Asset Lifecycle Management**: Introduced strict asset segregation in `portfolio-storage.ts` via `MANAGED_ASSET_KINDS` to ensure profile and gallery photos are preserved across layout swaps.

---

## 8. Verification & QA Protocol

Always execute this protocol before completing changes:

1. **Linting Verification**: Run targeted lint tests for modified directories to check types and imports.
2. **Build Validation**: Execute `npm run build` locally when altering page router maps, middleware, server-client borders, or authentication callbacks.
3. **Double Persistence Verification**: Verify that saves work seamlessly across both:
   - *Preview fallback mode* (Local browser cookies, unauthenticated draft mode).
   - *Supabase authenticated persistence mode* (Real PostgreSQL write operations).
