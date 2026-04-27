export const TEMPLATE_SLUGS = ["pulse", "nova", "vertex", "drift"] as const;

export const TEMPLATE_CATALOG = [
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
  {
    slug: "nova",
    name: "Nova",
    tagline: "Minimalist and high-impact.",
    description:
      "A bold, center-aligned template that focuses on typography and high-impact storytelling for elite builders.",
    accent: "from-[#ff6b6b] via-[#f06595] to-[#cc5de8]",
    idealFor: "Creative developers, designers-who-code, and minimalists",
    highlights: ["Bold typography", "Center-aligned hero", "Gradient accents"],
  },
  {
    slug: "vertex",
    name: "Vertex",
    tagline: "High-density bento grid for multi-faceted builders.",
    description:
      "A sophisticated, block-based layout inspired by modern developer portfolios. Perfect for showcasing projects, skills, and testimonials in a structured grid.",
    accent: "from-[#3b82f6] via-[#2563eb] to-[#1d4ed8]",
    idealFor: "Senior engineers, consultants, and community leaders",
    highlights: ["Bento grid layout", "Rich information density", "Social-proof focused"],
  },
  {
    slug: "drift",
    name: "Drift",
    tagline: "A bold, high-contrast template for modern developers.",
    description:
      "A dynamic portfolio template featuring a central-aligned layout, strong typography, and smooth micro-interactions.",
    accent: "from-[#3b82f6] via-[#6366f1] to-[#8b5cf6]",
    idealFor: "Frontend developers, designers-who-code, and tech enthusiasts",
    highlights: ["Clean serif typography", "Floating card design", "Built-in theme toggle"],
  },
] as const;

export type TemplateSlug = (typeof TEMPLATE_SLUGS)[number];
export type PortfolioTemplate = (typeof TEMPLATE_CATALOG)[number];
export type TemplateCatalogItem = PortfolioTemplate;

export function isTemplateSlug(value: string | undefined): value is TemplateSlug {
  return TEMPLATE_SLUGS.includes(value as TemplateSlug);
}

export function getTemplateBySlug(slug: TemplateSlug) {
  return TEMPLATE_CATALOG.find((template) => template.slug === slug)!;
}
