import type { Metadata } from "next";

import { DevFrameStaticPage } from "@/components/marketing/devframe-static-page";
import {
  GITHUB_CONTRIBUTING_URL,
  GITHUB_DISCUSSIONS_URL,
  GITHUB_ISSUES_URL,
  GITHUB_REPO_URL,
} from "@/lib/project-links";

export const metadata: Metadata = {
  title: "Open Source",
  description:
    "How to contribute to DevFrame as an open-source developer portfolio builder.",
};

const openSourceSections = [
  {
    eyebrow: "Local setup",
    title: "Run DevFrame locally",
    description:
      "The project is designed to be useful even before you wire production services.",
    codeItems: ["npm install", "cp .env.example .env.local", "npm run lint", "npm run build"],
    items: [
      "Leave Clerk and Supabase empty when you only need demo-mode UI work.",
      "Add Clerk and Supabase keys when validating auth, uploads, and persisted portfolio records.",
      "Use the existing shadcn-style primitives, dark-first surfaces, and route groups.",
    ],
  },
  {
    eyebrow: "Issues",
    title: "Report focused problems",
    description:
      "Good issues include enough context for another contributor to reproduce the behavior.",
    items: [
      "Include the route, template, browser, expected behavior, actual behavior, and screenshots if the issue is visual.",
      "For persistence bugs, state whether you are in demo mode, preview cookie fallback, or Supabase mode.",
      "For upload bugs, include file type, size, and whether the issue happens before or after signed upload creation.",
    ],
  },
  {
    eyebrow: "Pull requests",
    title: "Keep contributions small",
    description:
      "DevFrame favors focused patches that preserve the shared architecture.",
    items: [
      "Do not add per-template database tables.",
      "Do not special-case templates in `PortfolioRenderer`.",
      "Run lint and build before opening a pull request.",
      "Avoid paid-tier or payment API logic in the core app.",
    ],
  },
  {
    eyebrow: "Templates",
    title: "Contribute portfolio templates",
    description:
      "Templates should feel distinct while consuming the same portfolio record shape.",
    items: [
      "Add catalog metadata in `src/lib/template-catalog.ts`.",
      "Register rendering through `src/templates/registry.ts`.",
      "Add template settings through `src/lib/template-field-registry.ts` when needed.",
      "Preserve profile images, gallery assets, projects, experience, and custom sections across swaps.",
    ],
  },
  {
    eyebrow: "Roadmap",
    title: "Help with planned work",
    description:
      "Useful contributions can land across docs, templates, Studio, Builder, Dashboard, and deployment workflow.",
    items: [
      "More portfolio templates and preview examples.",
      "GitHub/project import experiments.",
      "Custom domain and analytics design explorations.",
      "Better issue templates and contribution docs.",
    ],
  },
  {
    eyebrow: "Community",
    title: "Support the project",
    description:
      "DevFrame grows through real usage, clear feedback, and practical code or documentation improvements.",
    items: [
      "Star the repository if the project is useful.",
      "Use discussions for feature requests and template ideas.",
      "Use issues for reproducible bugs.",
      "Optional donation QR codes live on the Support page.",
    ],
  },
] as const;

export default function OpenSourcePage() {
  return (
    <DevFrameStaticPage
      badge="Open source"
      title="DevFrame is open for focused, practical contributions."
      description="The best contributions improve the developer portfolio workflow without fragmenting the architecture: one portfolio record, one renderer path, reusable templates, and a calm dark-first product system."
      primaryAction={{
        href: GITHUB_REPO_URL,
        label: "Open GitHub",
        external: true,
      }}
      secondaryAction={{
        href: GITHUB_CONTRIBUTING_URL,
        label: "Contribution guide",
        external: true,
        variant: "secondary",
      }}
      stats={[
        { label: "Repo", value: "DevFrame", detail: "Free and open-source" },
        { label: "Issues", value: "GitHub", detail: "Bug reports and tasks" },
        { label: "Ideas", value: "Discussions", detail: "Roadmap and templates" },
        { label: "Validation", value: "Lint + build", detail: "Expected before PRs" },
      ]}
      sections={openSourceSections}
      footerNote={`Start with ${GITHUB_ISSUES_URL} for bugs or ${GITHUB_DISCUSSIONS_URL} for ideas. Keep patches narrow, describe the route or template affected, and preserve demo mode whenever possible.`}
    />
  );
}
