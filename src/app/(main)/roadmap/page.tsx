import type { Metadata } from "next";

import { DevFrameStaticPage } from "@/components/marketing/devframe-static-page";
import {
  GITHUB_DISCUSSIONS_URL,
  GITHUB_ISSUES_URL,
} from "@/lib/project-links";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "Planned product and open-source improvements for DevFrame.",
};

const roadmapSections = [
  {
    eyebrow: "Templates",
    title: "More portfolio templates",
    description:
      "Expand beyond Nova, Vertex, and Drift while keeping every template on the same shared schema and registry.",
    items: [
      "New templates should register through `src/templates/registry.ts` and `src/lib/template-catalog.ts`.",
      "Template-specific settings belong in `template_settings`, not separate tables.",
      "Community templates should ship with realistic seed data and preview coverage.",
    ],
  },
  {
    eyebrow: "Studio",
    title: "Better live editing experience",
    description:
      "Polish Studio into a faster desktop-first editor with clearer section navigation, safer save states, and stronger preview controls.",
    items: [
      "Improve section focus, preview scaling, and template setting controls.",
      "Keep Builder as the structured/mobile editor instead of overloading Studio with dense forms.",
      "Prevent local draft state from overwriting published Supabase records.",
    ],
  },
  {
    eyebrow: "Import",
    title: "GitHub and project import support",
    description:
      "Help developers turn GitHub profile data, repositories, and project metadata into editable portfolio content.",
    items: [
      "Import candidate projects into the existing recent projects array.",
      "Let users review summaries before publishing.",
      "Avoid hard dependencies so demo mode and local setup still work.",
    ],
  },
  {
    eyebrow: "Publishing",
    title: "Custom domains and analytics",
    description:
      "Add production publishing tools around the existing `/p/[slug]` route.",
    items: [
      "Custom domain mapping with ownership verification.",
      "Portfolio view analytics that respect privacy and avoid noisy tracking.",
      "Dashboard status cards for routes, updates, templates, and asset counts.",
    ],
  },
  {
    eyebrow: "Community",
    title: "Template marketplace or community templates",
    description:
      "Create a contribution path for polished community layouts without fragmenting the renderer or database schema.",
    items: [
      "Template review checklist for accessibility, responsive behavior, and data coverage.",
      "Catalog metadata for ideal use cases, highlights, and preview thumbnails.",
      "No per-template database tables or renderer special cases.",
    ],
  },
  {
    eyebrow: "Open source",
    title: "Improved contribution workflow",
    description:
      "Make it easier to report bugs, reproduce issues, and submit focused pull requests.",
    items: [
      "Issue templates for Studio, Builder, templates, auth, Supabase, and uploads.",
      "Contributor docs for local demo mode and full Clerk/Supabase setup.",
      "More examples for adding templates and validating public routes.",
    ],
  },
] as const;

export default function RoadmapPage() {
  return (
    <DevFrameStaticPage
      badge="Roadmap"
      title="The next DevFrame work is about making publishing feel production-grade."
      description="The roadmap keeps the existing architecture intact: Next.js App Router, custom Clerk auth, Supabase persistence, Studio, Builder, Dashboard, and the template registry all stay focused on one portfolio record."
      primaryAction={{
        href: GITHUB_DISCUSSIONS_URL,
        label: "Suggest a feature",
        external: true,
      }}
      secondaryAction={{
        href: GITHUB_ISSUES_URL,
        label: "Report an issue",
        external: true,
        variant: "secondary",
      }}
      stats={[
        { label: "Planned", value: "Templates", detail: "More layouts and community paths" },
        { label: "Planned", value: "Imports", detail: "GitHub and project data" },
        { label: "Planned", value: "Domains", detail: "Custom public portfolio routes" },
        { label: "Planned", value: "Analytics", detail: "Portfolio view insights" },
      ]}
      sections={roadmapSections}
    />
  );
}
