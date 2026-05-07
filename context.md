# Agent Context: DevFrame Template System

> [!IMPORTANT]
> This project uses a **Registry Pattern**. Direct edits to `PortfolioRenderer.tsx` for adding templates are forbidden.

## 🏗️ Architecture & Paths

- **Registry Entry**: `src/templates/index.ts` (Import new templates here)
- **Registry Logic**: `src/templates/registry.ts`
- **Shared UI**: `src/templates/base-components.tsx` (Use for Pills/Badges/Gallery)
- **Design Standards**: `design.md` (Refer to this for styling rules)
- **Catalog Metadata**: `src/lib/template-catalog.ts` (Add metadata here)
- **Seed Data**: `src/lib/portfolio-storage.ts` (Add preview records here)

## Persistence Architecture

- Auth comes from Clerk. Do not model passwords or auth sessions in Supabase.
- Persist portfolio ownership through `public.profiles` keyed by `clerk_user_id`.
- `public.portfolios` is now a one-to-many child of `profiles`, with `is_primary` representing the portfolio the current builder edits by default.
- Content child tables: `portfolio_projects`, `portfolio_experience`, `portfolio_recommendations`, `portfolio_assets`, `portfolio_domains`, `portfolio_sections`.

### Template-Specific Data — Settled Architecture

> [!IMPORTANT]
> **NEVER create per-template tables** (e.g., `portfolio_nova_config`). This creates O(n) migration debt and breaks the registry abstraction.

Use two additive mechanisms instead:

1. **`template_settings JSONB`** (column on `portfolios`): Stores UI/presentation preferences that are template-specific but do not affect content — e.g., `defaultMode`, `accentOverride`, `heroLayout`. Each template casts this to its own local type with safe defaults. This column is NOT part of `portfolioFormSchema`; it is managed by a separate template-config UI.

2. **`portfolio_sections` table**: For optional structured content sections that only some templates surface (e.g., `stat_bar`, `cta_block`, `certifications`). Each row has `section_type text`, `display_order`, `is_enabled`, and `data jsonb`. Templates query only the `section_type` values they support and ignore the rest. New AI-generated templates can declare new `section_type` strings without any migration.

**Gallery images** are served from `portfolio_assets WHERE kind = 'gallery-image'`. Templates must fall back to placeholder SVGs when the asset list is empty. Do NOT hardcode gallery image arrays inside template files.

## 🚦 Verification Protocols

After any modification to templates or the registry:

1. **Always run**: `npm run lint` to catch import/type errors.
2. **State & Hooks**: If a template uses `useState`, `useEffect`, or any interactive logic, it **MUST** have `"use client"` at the very top.
3. **Mandatory Build Check**: Run `npm run build` after adding any stateful template to verify Client/Server boundary safety across the entire app.

## 📝 Code Patterns (Token Optimization)

_Do not open existing templates to find registration patterns. Use this snippet:_

```tsx
import { registerTemplate } from "@/templates/registry";
import {
  LinkPill,
  SkillBadge,
  SectionLabel,
} from "@/templates/base-components";

function MyTemplate({ portfolio }: TemplateComponentProps) {
  /* ... */
}

registerTemplate("slug-name", MyTemplate);
```

- Theme-specific gallery sections should be image-only and placed as the last visible content section, while professional resume sections should be synthesized from existing portfolio fields when the schema does not provide dedicated media slots.
- Use `TemplateGallery` from `src/templates/base-components.tsx` for gallery sections so transition timing and carousel behavior stay consistent across templates.
- `TemplateGallery` supports a `transitionClassName` prop for template-specific motion tuning.

## ⚠️ Anti-Patterns (Do NOT do these)

- Do NOT use relative paths (`../`) for template imports; always use `@/templates/`.
- Do NOT create custom "Pill" or "Badge" styles; use the `base-components.tsx` primitives **unless** the template is marked as "Isolated."
- Do NOT bypass the `TEMPLATE_REGISTRY` in the renderer.
- Do NOT create per-template Supabase tables (e.g., `portfolio_nova_config`). Use `template_settings JSONB` + `portfolio_sections` instead.
- Do NOT hardcode gallery image arrays inside template files. Read from `portfolio_assets WHERE kind = 'gallery-image'` with SVG fallbacks.
- Do NOT add template-specific fields to `portfolioFormSchema` in `portfolio-schema.ts`. Template settings have their own separate config surface.

## 🧠 Agent Self-Correction & Evolution

- **Auto-Context**: Whenever a new architectural principle or design standard is established during a session, the agent **MUST** update `context.md` or `design.md` immediately to reflect it for future sessions.
- **Isolated Templates**: Some templates (e.g., `vertex`) are intentionally decoupled from the global CSS theme. For these templates, hardcode colors and create local components instead of using the global UI library.
