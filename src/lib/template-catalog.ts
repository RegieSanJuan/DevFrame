export const TEMPLATE_SLUGS = ["signal", "atlas", "pulse"] as const;

export const TEMPLATE_CATALOG = [
  {
    slug: "signal",
    name: "Signal",
    tagline: "Sharp, modern, and recruiter-friendly.",
    description:
      "A clean SaaS-inspired portfolio with a confident hero, quick credibility signals, and a strong project spotlight.",
    accent:
      "from-[#7c5c2e] via-[#c9a96e] to-[#e2c488]",
    idealFor: "Frontend, full-stack, and product-focused developers",
    highlights: ["Fast scan layout", "Strong intro section", "Great for job applications"],
  },
  {
    slug: "atlas",
    name: "Atlas",
    tagline: "Editorial and story-driven.",
    description:
      "A more narrative template for developers who want to explain their process, craft, and impact with more depth.",
    accent:
      "from-[#1a1a2e] via-[#4a4e69] to-[#9a8c98]",
    idealFor: "Senior engineers, indie makers, and technical writers",
    highlights: ["Long-form about section", "Case-study feel", "Calm visual hierarchy"],
  },
  {
    slug: "pulse",
    name: "Pulse",
    tagline: "Bold and high-energy for builders shipping fast.",
    description:
      "A visually expressive template with layered panels, ideal for showcasing experiments, launches, and fast-moving side projects.",
    accent:
      "from-[#1c1c1c] via-[#3d3d3d] to-[#6b6b6b]",
    idealFor: "Startup-minded devs, hackers, and product engineers",
    highlights: ["Launch-focused layout", "Stronger visual personality", "Built for momentum"],
  },
] as const;

export type TemplateSlug = (typeof TEMPLATE_SLUGS)[number];
export type PortfolioTemplate = (typeof TEMPLATE_CATALOG)[number];

export function isTemplateSlug(value: string | undefined): value is TemplateSlug {
  return TEMPLATE_SLUGS.includes(value as TemplateSlug);
}

export function getTemplateBySlug(slug: TemplateSlug) {
  return TEMPLATE_CATALOG.find((template) => template.slug === slug)!;
}
