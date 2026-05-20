import type { Metadata } from "next";

import { DevFrameStaticPage } from "@/components/marketing/devframe-static-page";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Setup and usage documentation for DevFrame's portfolio builder workflow.",
};

const docSections = [
  {
    eyebrow: "Start",
    title: "Getting started",
    description:
      "Install dependencies, copy the example environment file, and start the App Router development server.",
    codeItems: [
      "npm install",
      "cp .env.example .env.local",
      "npm run dev",
    ],
    items: [
      "Open `http://localhost:3000` and start in Studio or choose a template from `/templates`.",
      "Clerk and Supabase can stay empty for demo-mode exploration.",
    ],
  },
  {
    eyebrow: "Environment",
    title: "Environment variables",
    description:
      "DevFrame reads app runtime configuration from `.env.local` and validates it through the environment helper layer.",
    codeItems: [
      "NEXT_PUBLIC_APP_URL=http://localhost:3000",
      "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...",
      "CLERK_SECRET_KEY=...",
      "NEXT_PUBLIC_SUPABASE_URL=...",
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...",
      "SUPABASE_SERVICE_ROLE_KEY=...",
    ],
    items: [
      "Optional rate limiting can use Upstash Redis or Vercel KV-compatible REST variables.",
      "DATABASE_URL and DIRECT_URL are for Supabase CLI or ORM workflows, not normal app runtime reads.",
    ],
  },
  {
    eyebrow: "Auth",
    title: "Auth setup",
    description:
      "Clerk provides sessions, but DevFrame keeps the sign-in, sign-up, OAuth, and callback screens custom.",
    items: [
      "Auth pages live in `src/app/(auth)` and UI components live in `src/components/auth`.",
      "The global header reads auth server-side and passes only display state into the client header surface.",
      "If Clerk keys are missing, `getViewerContext()` activates demo mode with a synthetic user.",
    ],
  },
  {
    eyebrow: "Persistence",
    title: "Supabase setup",
    description:
      "Supabase stores the published portfolio record, related projects, experience, sections, and managed assets.",
    items: [
      "Run `supabase/schema.sql` or the current migrations against your Supabase project.",
      "Set `SUPABASE_SERVICE_ROLE_KEY` for server-side portfolio writes and signed upload URL creation.",
      "When Supabase is unavailable, saves fall back to a secure preview cookie.",
    ],
  },
  {
    eyebrow: "Workflow",
    title: "Creating and editing a portfolio",
    description:
      "Studio is the primary live editor, Builder is the structured/mobile editor, and Dashboard is the control center.",
    items: [
      "Use Studio for fast visual editing with a central live preview.",
      "Use Builder when you want dense form controls for content, template settings, and mobile editing.",
      "The single portfolio record rule means template switches update one owner record instead of creating duplicates.",
    ],
  },
  {
    eyebrow: "Publish",
    title: "Publishing to `/p/[slug]`",
    description:
      "A valid slug publishes to a public portfolio route rendered through the shared `PortfolioRenderer` and template registry.",
    items: [
      "Public pages try Supabase first, then preview cookie data, then seeded examples when available.",
      "Owners can return from a public portfolio page into Studio when they are signed in.",
      "Public routes stay template-agnostic: Nova, Vertex, and Drift all consume the same portfolio record shape.",
    ],
  },
] as const;

export default function DocumentationPage() {
  return (
    <DevFrameStaticPage
      badge="Documentation"
      title="Build, edit, and publish portfolios through one App Router system."
      description="These docs summarize the current DevFrame workflow: custom Clerk auth, Supabase persistence, demo-mode fallback, Studio live editing, Builder content management, and public `/p/[slug]` rendering."
      primaryAction={{ href: "/studio", label: "Open Studio" }}
      secondaryAction={{ href: "/api-reference", label: "API Reference", variant: "secondary" }}
      stats={[
        { label: "App", value: "Next.js 16", detail: "App Router under `src/app`" },
        { label: "Auth", value: "Clerk", detail: "Custom UI, server sessions" },
        { label: "Data", value: "Supabase", detail: "Portfolio persistence and storage" },
        { label: "Output", value: "/p/[slug]", detail: "Public portfolio route" },
      ]}
      sections={docSections}
    />
  );
}
