import type { Metadata } from "next";

import { DevFrameStaticPage } from "@/components/marketing/devframe-static-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "General privacy policy template for DevFrame.",
};

const privacySections = [
  {
    eyebrow: "Template notice",
    title: "Review before production use",
    description:
      "This privacy policy is a general template for the DevFrame project and should be reviewed by a qualified professional before production or legal use.",
    items: [
      "It is not legal advice.",
      "Update it for your deployment, jurisdiction, analytics choices, and data processors.",
    ],
  },
  {
    eyebrow: "Account data",
    title: "Authentication information",
    description:
      "When Clerk is configured, DevFrame uses Clerk for sign-in, sign-up, OAuth, session handling, and account identity.",
    items: [
      "DevFrame reads the authenticated user id to associate one portfolio record with its owner.",
      "Custom auth screens are part of DevFrame, but session infrastructure is handled by Clerk.",
      "If Clerk is not configured, demo mode uses a synthetic local viewer for preview workflows.",
    ],
  },
  {
    eyebrow: "Portfolio data",
    title: "Published portfolio content",
    description:
      "When Supabase is configured, portfolio content is stored so it can render on public routes like `/p/[slug]`.",
    items: [
      "Portfolio fields can include name, title, location, email, bio, skills, links, projects, experience, sections, template settings, and assets.",
      "Published public portfolio pages are intended to be visible to anyone with the route.",
      "Preview fallback data may be stored in a secure cookie when Supabase persistence is not available.",
    ],
  },
  {
    eyebrow: "Uploads",
    title: "Image and asset handling",
    description:
      "Profile and gallery images may be uploaded to Supabase Storage when uploads are configured.",
    items: [
      "DevFrame validates allowed image types and file size limits before upload.",
      "Server actions save URLs and storage paths rather than raw image blobs.",
      "Template switches preserve profile and gallery assets under the single-record persistence model.",
    ],
  },
  {
    eyebrow: "Diagnostics",
    title: "Operational data",
    description:
      "DevFrame may process basic request context to protect save actions and diagnose setup readiness.",
    items: [
      "Rate limiting can use in-memory development fallback, Upstash Redis, or Vercel KV-compatible variables.",
      "Setup diagnostics should only be exposed when explicitly enabled.",
      "This template does not claim that analytics or tracking are enabled by default.",
    ],
  },
  {
    eyebrow: "Choices",
    title: "Managing data",
    description:
      "Production deployments should provide clear account, portfolio, and deletion workflows based on their actual configuration.",
    items: [
      "Users can edit portfolio data through Studio or Builder.",
      "Account management depends on the configured Clerk project.",
      "Portfolio storage and retention should be documented for the specific deployment.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <DevFrameStaticPage
      badge="Legal template"
      title="Privacy Policy"
      description="A simple privacy template for DevFrame deployments, written around the current Clerk, Supabase, preview-cookie, upload, and public portfolio architecture."
      primaryAction={{ href: "/terms", label: "Terms", variant: "secondary" }}
      secondaryAction={{ href: "/cookies", label: "Cookie Policy", variant: "outline" }}
      sections={privacySections}
      footerNote="This page is general placeholder legal copy. Review and adapt it before using DevFrame in production or presenting it as your final legal policy."
    />
  );
}
