# DevFrame Design System & Style Guide

## Core Design Principles
1. **Developer First**: The aesthetic should feel like high-end developer tools (Linear, Vercel, Supabase).
2. **Data-Decoupled**: Styling must never assume the existence of specific user content; use fallbacks for empty states.
3. **Typography-Driven**: Focus on high-quality sans-serif fonts and generous letter-spacing for uppercase labels.

## Design Tokens (globals.css)
- **Accent**: `#3ecf8e` (Supabase Green) - Used for primary actions and success states.
- **Surface**: The secondary background color for cards and panels.
- **Muted**: Low-contrast text for secondary information.

## Layout Primitives
- **Grid System**: Most templates follow a `1.16fr 0.84fr` or similar asymmetric grid for editorial feel.
- **Rounded Corners**:
  - Small elements (Buttons, Pills): `full`
  - Medium elements (Small Cards): `24px`
  - Large containers (Main Cards): `32px`

## Template Component Patterns
- **Section Labels**: Always uppercase, tracked (`0.24em`), and semi-bold.
- **Pills**: Used for links and tags. Always rounded-full with an icon.
- **Cards**: Use the `Card` and `CardContent` components from `@/components/ui/card` with `bg-surface` or `bg-surface-strong`.

## Visual Effects
- **Gradients**: Use subtle radial gradients for background depth (e.g., in Atlas template).
- **Glassmorphism**: Use `backdrop-blur-xl` and `bg-background/80` for sticky headers.
- **Borders**: Stick to `border-border` (subtle) and `border-accent/20` (highlight).
