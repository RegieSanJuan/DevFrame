import { cookies } from "next/headers";

import {
  normalizeSkills,
  type PortfolioFormValues,
  type PortfolioRecord,
} from "@/lib/portfolio-schema";
import {
  createSupabaseAdminClient,
  createSupabasePublicClient,
} from "@/lib/supabase";
import { createPortfolioUrl } from "@/lib/utils";

const PREVIEW_COOKIE_NAME = "devframe-preview";

type PortfolioRow = {
  clerk_user_id: string;
  slug: string;
  template_slug: PortfolioRecord["templateSlug"];
  full_name: string;
  title: string;
  location: string;
  email: string;
  bio: string;
  about: string;
  availability: PortfolioRecord["availability"];
  skills: string[] | null;
  github_url: string;
  linkedin_url: string;
  website_url: string | null;
  featured_project_name: string;
  featured_project_summary: string;
  featured_project_stack: string;
  featured_project_url: string | null;
  updated_at: string;
};

type SavePortfolioResult = {
  record: PortfolioRecord;
  persisted: boolean;
  error?: string;
};

const SEED_PORTFOLIOS: PortfolioRecord[] = [
  {
    ownerId: "seed-signal",
    slug: "regie",
    templateSlug: "signal",
    name: "Regie Cruz",
    title: "Frontend Developer",
    location: "Cebu City, Philippines",
    email: "regie@example.dev",
    bio: "I build fast, polished web products with thoughtful UX and clean front-end architecture.",
    about:
      "I enjoy turning product ideas into interfaces that feel clear, fast, and alive. My sweet spot is shipping modern React experiences, building reusable systems, and making complex flows feel simple for users.",
    availability: "Open to opportunities",
    skills: ["Next.js", "TypeScript", "Tailwind CSS", "Figma", "Supabase"],
    githubUrl: "https://github.com/regie",
    linkedinUrl: "https://linkedin.com/in/regie",
    websiteUrl: "",
    featuredProjectName: "DevFrame Starter",
    featuredProjectSummary:
      "A template-driven portfolio builder that helps developers launch a personal site in minutes with guided forms and polished layouts.",
    featuredProjectStack: "Next.js, Clerk, Supabase, Tailwind CSS",
    featuredProjectUrl: "",
    previewUrl: createPortfolioUrl("regie"),
    updatedAt: "2026-04-15T08:00:00.000Z",
    source: "seed",
  },
  {
    ownerId: "seed-atlas",
    slug: "maya-tan",
    templateSlug: "atlas",
    name: "Maya Tan",
    title: "Senior Full-Stack Engineer",
    location: "Singapore",
    email: "maya@example.dev",
    bio: "I design systems that help product teams move faster without losing quality, clarity, or trust.",
    about:
      "Over the last several years I have led product launches across SaaS, fintech, and internal platforms. I care about architecture, but I care even more about whether a team can understand and extend what gets shipped after launch.",
    availability: "Currently employed, open to the right fit",
    skills: ["React", "Node.js", "PostgreSQL", "System Design", "Product Strategy"],
    githubUrl: "https://github.com/mayatan",
    linkedinUrl: "https://linkedin.com/in/mayatan",
    websiteUrl: "https://mayatan.dev",
    featuredProjectName: "Atlas Console",
    featuredProjectSummary:
      "An internal operations dashboard that cut manual review time by 47% by unifying workflows across support, fraud, and finance teams.",
    featuredProjectStack: "Next.js, Prisma, PostgreSQL, Vercel",
    featuredProjectUrl: "https://mayatan.dev/projects/atlas-console",
    previewUrl: createPortfolioUrl("maya-tan"),
    updatedAt: "2026-04-15T08:00:00.000Z",
    source: "seed",
  },
  {
    ownerId: "seed-pulse",
    slug: "jules-ortega",
    templateSlug: "pulse",
    name: "Jules Ortega",
    title: "Product Engineer",
    location: "Manila, Philippines",
    email: "jules@example.dev",
    bio: "I love fast feedback loops, experimental products, and shipping things that people can actually use.",
    about:
      "My work sits between engineering and product. I prototype quickly, test ideas with users, and then harden the best concepts into systems that teams can scale. I care about speed, but not at the cost of taste or maintainability.",
    availability: "Available for freelance work",
    skills: ["React", "Framer Motion", "Node.js", "Growth", "Rapid Prototyping"],
    githubUrl: "https://github.com/julesortega",
    linkedinUrl: "https://linkedin.com/in/julesortega",
    websiteUrl: "https://julesortega.dev",
    featuredProjectName: "Pulse Labs",
    featuredProjectSummary:
      "A launchpad for side-project experiments with reusable growth loops, lightweight analytics, and fast deployment presets.",
    featuredProjectStack: "Next.js, Neon, Tailwind CSS, Resend",
    featuredProjectUrl: "https://julesortega.dev/projects/pulse-labs",
    previewUrl: createPortfolioUrl("jules-ortega"),
    updatedAt: "2026-04-15T08:00:00.000Z",
    source: "seed",
  },
  {
    ownerId: "seed-nova",
    slug: "alex-vortex",
    templateSlug: "nova",
    name: "Alex Vortex",
    title: "Creative Technologist",
    location: "Berlin, Germany",
    email: "alex@vortex.dev",
    bio: "Exploring the intersection of code, motion, and minimalist design.",
    about:
      "I believe that software should be as beautiful as it is functional. My work focuses on creating high-impact digital experiences that leverage modern web technologies and bold typography. I don't just build features; I craft digital narratives.",
    availability: "Available for freelance work",
    skills: ["React", "Three.js", "GSAP", "Typography", "Shaders"],
    githubUrl: "https://github.com/vortex",
    linkedinUrl: "https://linkedin.com/in/vortex",
    websiteUrl: "https://vortex.dev",
    featuredProjectName: "Lumina UI",
    featuredProjectSummary:
      "A motion-first design system for spatial computing interfaces, focusing on gesture-based navigation and glassmorphic surfaces.",
    featuredProjectStack: "React, Three.js, R3F, Tailwind",
    featuredProjectUrl: "https://lumina.vortex.dev",
    previewUrl: createPortfolioUrl("alex-vortex"),
    updatedAt: "2026-04-15T08:00:00.000Z",
    source: "seed",
  },
];

function toPortfolioRecord(
  row: PortfolioRow,
  source: PortfolioRecord["source"],
): PortfolioRecord {
  return {
    ownerId: row.clerk_user_id,
    slug: row.slug,
    templateSlug: row.template_slug,
    name: row.full_name,
    title: row.title,
    location: row.location,
    email: row.email,
    bio: row.bio,
    about: row.about,
    availability: row.availability,
    skills: row.skills ?? [],
    githubUrl: row.github_url,
    linkedinUrl: row.linkedin_url,
    websiteUrl: row.website_url ?? "",
    featuredProjectName: row.featured_project_name,
    featuredProjectSummary: row.featured_project_summary,
    featuredProjectStack: row.featured_project_stack,
    featuredProjectUrl: row.featured_project_url ?? "",
    previewUrl: createPortfolioUrl(row.slug),
    updatedAt: row.updated_at,
    source,
  };
}

function buildPortfolioRecord(
  values: PortfolioFormValues,
  ownerId: string,
  source: PortfolioRecord["source"],
): PortfolioRecord {
  return {
    ownerId,
    slug: values.slug,
    templateSlug: values.templateSlug,
    name: values.name,
    title: values.title,
    location: values.location,
    email: values.email,
    bio: values.bio,
    about: values.about,
    availability: values.availability,
    skills: normalizeSkills(values.skills),
    githubUrl: values.githubUrl,
    linkedinUrl: values.linkedinUrl,
    websiteUrl: values.websiteUrl,
    featuredProjectName: values.featuredProjectName,
    featuredProjectSummary: values.featuredProjectSummary,
    featuredProjectStack: values.featuredProjectStack,
    featuredProjectUrl: values.featuredProjectUrl,
    previewUrl: createPortfolioUrl(values.slug),
    updatedAt: new Date().toISOString(),
    source,
  };
}

async function getPreviewPortfolio() {
  const cookieStore = await cookies();
  const previewValue = cookieStore.get(PREVIEW_COOKIE_NAME)?.value;

  if (!previewValue) {
    return null;
  }

  try {
    return JSON.parse(previewValue) as PortfolioRecord;
  } catch {
    return null;
  }
}

async function savePreviewPortfolio(record: PortfolioRecord) {
  const cookieStore = await cookies();

  cookieStore.set(PREVIEW_COOKIE_NAME, JSON.stringify(record), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function savePortfolio(
  values: PortfolioFormValues,
  ownerId: string,
): Promise<SavePortfolioResult> {
  const previewRecord = buildPortfolioRecord(values, ownerId, "preview");

  await savePreviewPortfolio(previewRecord);

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return {
      record: previewRecord,
      persisted: false,
    };
  }

  const { data, error } = await supabase
    .from("portfolios")
    .upsert(
      {
        clerk_user_id: ownerId,
        slug: values.slug,
        template_slug: values.templateSlug,
        full_name: values.name,
        title: values.title,
        location: values.location,
        email: values.email,
        bio: values.bio,
        about: values.about,
        availability: values.availability,
        skills: normalizeSkills(values.skills),
        github_url: values.githubUrl,
        linkedin_url: values.linkedinUrl,
        website_url: values.websiteUrl || null,
        featured_project_name: values.featuredProjectName,
        featured_project_summary: values.featuredProjectSummary,
        featured_project_stack: values.featuredProjectStack,
        featured_project_url: values.featuredProjectUrl || null,
      },
      {
        onConflict: "clerk_user_id",
      },
    )
    .select("*")
    .single<PortfolioRow>();

  if (error || !data) {
    return {
      record: previewRecord,
      persisted: false,
      error:
        error?.message ||
        "Supabase is connected, but the portfolios table is not ready yet.",
    };
  }

  const persistedRecord = toPortfolioRecord(data, "supabase");
  await savePreviewPortfolio(persistedRecord);

  return {
    record: persistedRecord,
    persisted: true,
  };
}

export async function getPortfolioForOwner(ownerId: string) {
  const supabase = createSupabaseAdminClient();

  if (supabase) {
    const { data } = await supabase
      .from("portfolios")
      .select("*")
      .eq("clerk_user_id", ownerId)
      .maybeSingle<PortfolioRow>();

    if (data) {
      return toPortfolioRecord(data, "supabase");
    }
  }

  const previewPortfolio = await getPreviewPortfolio();

  if (previewPortfolio?.ownerId === ownerId) {
    return previewPortfolio;
  }

  return null;
}

export async function getPublicPortfolio(slug: string) {
  const supabase = createSupabasePublicClient() ?? createSupabaseAdminClient();

  if (supabase) {
    const { data } = await supabase
      .from("portfolios")
      .select("*")
      .eq("slug", slug)
      .maybeSingle<PortfolioRow>();

    if (data) {
      return toPortfolioRecord(data, "supabase");
    }
  }

  const previewPortfolio = await getPreviewPortfolio();

  if (previewPortfolio?.slug === slug) {
    return previewPortfolio;
  }

  return SEED_PORTFOLIOS.find((portfolio) => portfolio.slug === slug) ?? null;
}

export function getSeedPortfolios() {
  return SEED_PORTFOLIOS;
}

export function getSeedPortfolioByTemplate(
  templateSlug: PortfolioRecord["templateSlug"],
) {
  return SEED_PORTFOLIOS.find((portfolio) => portfolio.templateSlug === templateSlug);
}
