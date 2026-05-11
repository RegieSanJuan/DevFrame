# DevFrame Design System

## Product Feel

DevFrame should read like a polished developer product, not a generic template
marketplace. The current system is:

- dark-first
- calm and tool-like
- editorial on marketing pages
- tighter and more operational inside builder, dashboard, auth, and studio

The old green-first "Supabase look" is no longer the global shell. The live app
now leans on dark neutrals with a warm metallic accent.

## Type Stack

- Sans: `Manrope`
- Mono: `IBM Plex Mono`

Use Manrope for product copy and headings. Use IBM Plex Mono sparingly for route
labels, numbered steps, and compact technical details.

Uppercase helper labels are a real pattern in this repo. Reuse the existing
badge and `section-label` treatments instead of inventing new eyebrow styles.

## Color Tokens

The source of truth is `src/app/globals.css`.

Light mode:

- Background: `#ffffff`
- Background alt: `#fafafa`
- Surface: `#f4f4f5`
- Surface strong: `#e4e4e7`
- Border: `#e4e4e7`
- Accent: `#b48e4b`
- Accent strong: `#8f6e33`
- Accent soft: `#fdfaf2`

Dark mode:

- Background: `#0f0f0f`
- Background alt: `#0a0a0a`
- Surface: `#161616`
- Surface strong: `#1e1e1e`
- Border: `#222222`
- Accent: `#c9a96e`
- Accent strong: `#e2c488`
- Accent soft: `#1e1a12`

Do not document or reintroduce the old global green accent as the primary app
identity.

## Shared Primitives

### Buttons

Use `src/components/ui/button.tsx`.

Variants:

- `default`
- `secondary`
- `accent`
- `ghost`
- `outline`

Sizes:

- `xs`
- `default`
- `sm`
- `lg`
- `icon`

The `accent` button is the main action pattern. `ghost` is for low-emphasis nav
and utility controls. Avoid ad hoc button classes when one of the shared
variants already fits.

### Cards

Use `src/components/ui/card.tsx` for framed surfaces.

Current card language:

- `rounded-[28px]`
- subtle border
- low-contrast vertical highlight
- heavy but soft shadow
- backdrop blur on major panels

Inner statistic tiles and compact info blocks often step down to `rounded-2xl`
or `rounded-[20px]` while keeping the same border and surface vocabulary.

### Badges and Labels

Use `src/components/ui/badge.tsx` and the shared `.section-label` class.

Patterns already established:

- uppercase
- small type
- wide tracking
- rounded-full silhouette

`Badge` variants are currently `default`, `success`, and `warning`.

## Surface Modes

### Marketing

Marketing pages can be more cinematic than the app shell, but they still need
to feel product-grounded. Current homepage patterns include:

- large type
- controlled GSAP reveal motion
- perspective hero panel
- template cards with a thin accent rule
- dense, product-like content blocks instead of fluffy marketing sections

### Dashboard and Builder

These surfaces should feel like a compact internal tool:

- summary band first
- short explanatory copy
- grouped information cards
- clear route, template, and access status
- setup readiness visible without leaving the workflow

### Studio

Studio is the most app-like surface in the repo:

- near-black frame
- fixed-height split editor/preview
- mobile toggle between editor and preview
- utility-first header
- minimal ornament, maximum focus

Do not style Studio like the homepage.

### Auth

Auth pages now use custom route-local forms, not stock Clerk screens.

The established pattern is:

- centered single-column form
- icon-led inputs
- strong primary CTA
- secondary Google entry
- concise copy
- graceful empty state when Clerk keys are missing

Keep auth surfaces aligned with the app shell and Clerk appearance config in
`src/lib/clerk-auth-appearance.ts`.

## Layout Rules

- `container-shell` is the main max-width wrapper for product pages.
- Main marketing and dashboard sections often use asymmetrical two-column grids.
- Public sections can use larger radii and looser spacing than Studio.
- Keep route and status data in small framed blocks instead of loose inline text.

## Motion

- GSAP + `ScrollTrigger` are used on the homepage only.
- Motion should support hierarchy and reveal, not spectacle.
- Sticky surfaces use blur and border changes on scroll as a subtle state cue.

If a new surface is operational rather than promotional, prefer calm transitions
over entrance-heavy animation.

## Template Presentation Rules

- Template identity belongs in template components and catalog accents.
- The surrounding product shell should stay visually consistent.
- Template settings should change presentation details, not rewrite the entire
  app shell.

Current templates can have distinct personalities, but they still sit inside
one shared DevFrame system.

## Guardrails

- Do not drift back to a globally green Supabase-branded shell.
- Do not create one-off card, badge, or button systems when shared primitives
  already exist.
- Do not make builder, dashboard, or studio pages feel like landing-page
  sections.
- When in doubt, choose readable, dense, and calm over flashy.
