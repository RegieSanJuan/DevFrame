import type { Metadata } from "next";

import { DevFrameStaticPage } from "@/components/marketing/devframe-static-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "General terms of service template for DevFrame.",
};

const termsSections = [
  {
    eyebrow: "Template notice",
    title: "Review before production use",
    description:
      "These terms are general placeholder copy for DevFrame and should be reviewed before production or legal use.",
    items: [
      "They are not legal advice.",
      "Update them for your organization, deployment model, support expectations, and applicable laws.",
    ],
  },
  {
    eyebrow: "Use",
    title: "Using DevFrame",
    description:
      "DevFrame is an open-source developer portfolio builder for creating, editing, and publishing portfolio pages.",
    items: [
      "Users are responsible for the content they add to their portfolio.",
      "Published portfolios may be available at public routes like `/p/[slug]`.",
      "Do not use DevFrame to publish unlawful, harmful, or misleading content.",
    ],
  },
  {
    eyebrow: "Accounts",
    title: "Authentication and ownership",
    description:
      "When Clerk is configured, account sessions identify the owner of a portfolio record.",
    items: [
      "Owner-only editing controls must remain server-checked.",
      "Users should keep their account credentials secure.",
      "Demo mode is provided for previews and unconfigured local setups, not as durable account storage.",
    ],
  },
  {
    eyebrow: "Publishing",
    title: "Portfolio publishing",
    description:
      "DevFrame stores a single primary portfolio record per owner and renders it through the selected template.",
    items: [
      "Template changes update the existing portfolio rather than creating duplicate records.",
      "Supabase persistence is required for durable publishing.",
      "Preview-cookie fallback is intended for local drafts and unconfigured environments.",
    ],
  },
  {
    eyebrow: "Open source",
    title: "Project contributions",
    description:
      "Contributions should follow the repository's contribution guide and keep changes scoped.",
    items: [
      "Do not add paid-tier or payment API logic to the core project without an intentional product decision.",
      "Do not add per-template database tables.",
      "Run lint and build before submitting changes.",
    ],
  },
  {
    eyebrow: "Availability",
    title: "No production warranty in this template",
    description:
      "This placeholder copy does not make service-level, uptime, legal compliance, or support guarantees.",
    items: [
      "Production deployments should define their own support and availability terms.",
      "Third-party services such as Clerk, Supabase, Vercel, Redis, or KV have their own terms.",
      "Review all legal text before presenting it to users.",
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <DevFrameStaticPage
      badge="Legal template"
      title="Terms of Service"
      description="A simple terms template for DevFrame deployments, grounded in the current portfolio editing, publishing, authentication, and open-source workflow."
      primaryAction={{ href: "/privacy", label: "Privacy Policy", variant: "secondary" }}
      secondaryAction={{ href: "/cookies", label: "Cookie Policy", variant: "outline" }}
      sections={termsSections}
      footerNote="This page is general placeholder legal copy. Review and adapt it before using DevFrame in production or presenting it as your final legal terms."
    />
  );
}
