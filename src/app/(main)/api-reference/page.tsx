import type { Metadata } from "next";

import { DevFrameStaticPage } from "@/components/marketing/devframe-static-page";

export const metadata: Metadata = {
  title: "API Reference",
  description:
    "Internal API and server action reference for DevFrame portfolio workflows.",
};

const apiSections = [
  {
    eyebrow: "GET",
    title: "/api/templates",
    description:
      "Returns the current template catalog used by the template gallery and editing surfaces.",
    codeItems: ["GET /api/templates"],
    items: [
      "Backed by `getTemplates()` in the template service.",
      "Catalog entries map to Nova, Vertex, and Drift metadata.",
      "The renderer still resolves templates through the registry, not through API conditionals.",
    ],
  },
  {
    eyebrow: "GET",
    title: "/api/portfolios/[slug]",
    description:
      "Fetches a public portfolio by slug for integrations or client-side previews that need JSON.",
    codeItems: ["GET /api/portfolios/regie", "Allow: GET, HEAD, OPTIONS"],
    items: [
      "Uses `getPublicPortfolioBySlug()` and only returns published Supabase rows for public reads.",
      "Preview cookies receive private no-store cache headers.",
      "Published public responses receive short shared cache headers with stale-while-revalidate.",
    ],
  },
  {
    eyebrow: "POST",
    title: "/api/portfolio-uploads",
    description:
      "Creates a signed Supabase Storage upload target for profile and gallery images.",
    codeItems: [
      "POST /api/portfolio-uploads",
      "{ fileName, fileSize, fileType, kind, slug }",
    ],
    items: [
      "Requires an authenticated non-demo viewer.",
      "Validates file type and size before creating the signed upload URL.",
      "The client uploads directly to Supabase Storage; save actions receive only URLs and storage paths.",
    ],
  },
  {
    eyebrow: "Server Action",
    title: "savePortfolioAction",
    description:
      "Persists Studio and Builder submissions through the shared portfolio service.",
    codeItems: ["savePortfolioAction(previousState, formData)"],
    items: [
      "Parses `PortfolioFormValues` with Zod before persistence.",
      "Uses rate limiting and server-side viewer checks.",
      "Writes to the existing owner portfolio record when Supabase is configured, otherwise stores a preview draft cookie.",
    ],
  },
  {
    eyebrow: "Service",
    title: "Portfolio loading",
    description:
      "Studio, Builder, Dashboard, public pages, and API routes should reuse the portfolio service instead of creating new data paths.",
    codeItems: [
      "getPortfolioByOwner(ownerId)",
      "getPublicPortfolioBySlug(slug)",
      "savePortfolioDraft(values, ownerId, options)",
    ],
    items: [
      "Owner reads use the current primary portfolio row.",
      "Public reads validate slugs and require published rows before falling back to preview or seed data.",
      "Hydration preserves template settings, sections, profile image, gallery assets, projects, and experience.",
    ],
  },
  {
    eyebrow: "Guardrails",
    title: "Request and persistence boundaries",
    description:
      "Mutation paths stay small and server-safe while public reads remain cacheable.",
    items: [
      "Large image blobs should never be posted through Server Actions.",
      "Upload routes must stay allowed by the request guard to avoid method errors.",
      "Template switches update `template_slug` and `template_settings` on the same portfolio record.",
    ],
  },
] as const;

export default function ApiReferencePage() {
  return (
    <DevFrameStaticPage
      badge="API Reference"
      title="DevFrame's API surface is small on purpose."
      description="Most product work flows through server components, services, and one save action. API routes exist where JSON or direct upload handshakes are the right boundary."
      primaryAction={{ href: "/docs", label: "Read docs" }}
      secondaryAction={{ href: "/open-source", label: "Contribute", variant: "secondary" }}
      stats={[
        { label: "Templates", value: "GET", detail: "/api/templates" },
        { label: "Public data", value: "GET", detail: "/api/portfolios/[slug]" },
        { label: "Uploads", value: "POST", detail: "/api/portfolio-uploads" },
        { label: "Publishing", value: "Action", detail: "savePortfolioAction" },
      ]}
      sections={apiSections}
    />
  );
}
