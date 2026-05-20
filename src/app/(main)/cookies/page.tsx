import type { Metadata } from "next";

import { DevFrameStaticPage } from "@/components/marketing/devframe-static-page";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "General cookie policy template for DevFrame.",
};

const cookieSections = [
  {
    eyebrow: "Template notice",
    title: "Review before production use",
    description:
      "This cookie policy is general placeholder copy for DevFrame and should be reviewed before production or legal use.",
    items: [
      "It is not legal advice.",
      "Update it for the cookies, analytics tools, domains, and third-party services in your deployment.",
    ],
  },
  {
    eyebrow: "Essential",
    title: "Authentication cookies",
    description:
      "When Clerk is configured, session-related cookies may be used to keep users signed in and protect owner workflows.",
    items: [
      "Authentication cookies are controlled by the configured Clerk project.",
      "Owner-only editing flows depend on reliable server-side session checks.",
      "If Clerk is not configured, demo mode does not provide durable account sessions.",
    ],
  },
  {
    eyebrow: "Preview",
    title: "Draft preview cookie",
    description:
      "When Supabase write access is unavailable, DevFrame can store a preview portfolio draft in a secure cookie.",
    items: [
      "`devframe-preview` keeps local or unconfigured environments usable.",
      "Preview cookies are not a replacement for durable Supabase persistence.",
      "Public API responses adjust cache headers when preview cookies are present.",
    ],
  },
  {
    eyebrow: "Preferences",
    title: "Interface preferences",
    description:
      "DevFrame may use small local preferences for UI behavior, such as theme or editor draft state.",
    items: [
      "Studio uses local browser storage for guest draft continuity.",
      "Theme behavior depends on the existing theme provider setup.",
      "Saved Supabase records should take priority over stale local Studio draft state.",
    ],
  },
  {
    eyebrow: "Analytics",
    title: "Analytics and tracking",
    description:
      "This template does not claim that analytics are enabled by default.",
    items: [
      "If you add analytics for portfolio views, document the provider and retention behavior.",
      "Future roadmap work may add privacy-conscious portfolio analytics.",
      "Update this policy before enabling additional tracking technologies.",
    ],
  },
  {
    eyebrow: "Control",
    title: "Managing cookies",
    description:
      "Users can control cookies through their browser settings, but disabling essential cookies can break auth and preview workflows.",
    items: [
      "Clearing browser data may remove preview drafts and local Studio state.",
      "Production deployments should describe any consent mechanism they actually provide.",
      "Third-party providers may set their own cookies under their own policies.",
    ],
  },
] as const;

export default function CookiesPage() {
  return (
    <DevFrameStaticPage
      badge="Legal template"
      title="Cookie Policy"
      description="A simple cookie template for DevFrame deployments, focused on Clerk sessions, preview-cookie fallback, local editor state, and future analytics disclosure."
      primaryAction={{ href: "/privacy", label: "Privacy Policy", variant: "secondary" }}
      secondaryAction={{ href: "/terms", label: "Terms", variant: "outline" }}
      sections={cookieSections}
      footerNote="This page is general placeholder legal copy. Review and adapt it before using DevFrame in production or presenting it as your final cookie policy."
    />
  );
}
