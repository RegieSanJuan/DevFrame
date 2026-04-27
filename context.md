# Agent Context: DevFrame Template System

> [!IMPORTANT]
> This project uses a **Registry Pattern**. Direct edits to `PortfolioRenderer.tsx` for adding templates are forbidden.

## 🏗️ Architecture & Paths
- **Registry Entry**: `src/templates/index.ts` (Import new templates here)
- **Registry Logic**: `src/templates/registry.ts`
- **Shared UI**: `src/templates/base-components.tsx` (Use for Pills/Badges)
- **Catalog Metadata**: `src/lib/template-catalog.ts` (Add metadata here)
- **Seed Data**: `src/lib/portfolio-storage.ts` (Add preview records here)

## 🚦 Verification Protocols
After any modification to templates or the registry:
1. **Always run**: `npm run lint` to catch import/type errors.
2. **If adding hooks/state**: Run `npm run build` to verify Client/Server boundary safety.

## 📝 Code Patterns (Token Optimization)
*Do not open existing templates to find registration patterns. Use this snippet:*
```tsx
import { registerTemplate } from "@/templates/registry";
import { LinkPill, SkillBadge, SectionLabel } from "@/templates/base-components";

function MyTemplate({ portfolio }: TemplateComponentProps) { 
  /* ... */ 
}

registerTemplate("slug-name", MyTemplate);
```

## ⚠️ Anti-Patterns (Do NOT do these)
- Do NOT use relative paths (`../`) for template imports; always use `@/templates/`.
- Do NOT create custom "Pill" or "Badge" styles; use the `base-components.tsx` primitives.
- Do NOT bypass the `TEMPLATE_REGISTRY` in the renderer.
