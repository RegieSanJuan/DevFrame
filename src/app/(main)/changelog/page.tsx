import type { Metadata } from "next";

import { DevFrameStaticPage } from "@/components/marketing/devframe-static-page";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Release history for DevFrame, the open-source developer portfolio builder.",
};

const releases = [
  {
    eyebrow: "v0.5.0",
    title: "Upload fixes, asset lifecycle cleanup, and single-record persistence",
    description:
      "Moved image uploads away from large Server Action bodies, tightened Supabase Storage asset handling, and reinforced the single portfolio record rule.",
    items: [
      "Profile and gallery images upload directly to Supabase Storage before save actions receive URL/path metadata.",
      "Template-agnostic assets are preserved across Nova, Vertex, and Drift switches.",
      "Saving updates the owner's current portfolio instead of creating duplicate portfolio rows.",
    ],
  },
  {
    eyebrow: "v0.4.0",
    title: "Studio live editing and public portfolio publishing",
    description:
      "Introduced the desktop-first Studio surface with a central live preview and a public `/p/[slug]` output route.",
    items: [
      "Studio became the flagship live editing workspace.",
      "Builder stayed available as the structured form editor and mobile fallback.",
      "Published portfolios render through the shared template registry and portfolio renderer.",
    ],
  },
  {
    eyebrow: "v0.3.0",
    title: "Template registry with Nova, Vertex, and Drift",
    description:
      "Standardized template discovery, preview data, and dynamic settings so templates stay decoupled from the renderer.",
    items: [
      "Nova focuses on minimal editorial presentation.",
      "Vertex uses a high-density bento layout with profile and gallery assets.",
      "Drift provides a split, leadership-oriented portfolio layout.",
    ],
  },
  {
    eyebrow: "v0.2.0",
    title: "Custom Clerk auth and onboarding flow",
    description:
      "Replaced stock auth overlays with custom DevFrame-styled sign-in, sign-up, OAuth, and callback surfaces.",
    items: [
      "Clerk remains the session infrastructure while the UI stays custom.",
      "Authenticated users can publish to Supabase when persistence is configured.",
      "Demo mode keeps the app usable when auth credentials are absent.",
    ],
  },
  {
    eyebrow: "v0.1.0",
    title: "Initial DevFrame foundation",
    description:
      "Laid down the Next.js App Router shell, dark-first design system, portfolio schema, and public rendering path.",
    items: [
      "Marketing pages, shared UI primitives, and App Router route groups.",
      "Supabase schema for portfolios, projects, experience, sections, and assets.",
      "Cookie-backed preview fallback for local and unconfigured environments.",
    ],
  },
] as const;

export default function ChangelogPage() {
  return (
    <DevFrameStaticPage
      badge="Release history"
      title="Every release moves the editor closer to a real publishing workflow."
      description="DevFrame evolves around a practical loop: edit in Studio, manage structured content in Builder, publish to `/p/[slug]`, and keep template changes from damaging the underlying portfolio record."
      primaryAction={{ href: "/studio", label: "Open Studio" }}
      secondaryAction={{ href: "/roadmap", label: "View roadmap", variant: "secondary" }}
      stats={[
        { label: "Current focus", value: "v0.5.x", detail: "Persistence and asset safety" },
        { label: "Templates", value: "3", detail: "Nova, Vertex, Drift" },
        { label: "Publishing", value: "/p/[slug]", detail: "Public portfolio output" },
        { label: "Fallback", value: "Preview cookie", detail: "Usable without Supabase" },
      ]}
      sections={releases}
    />
  );
}
