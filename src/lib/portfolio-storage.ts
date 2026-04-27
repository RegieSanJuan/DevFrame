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
  {
    ownerId: "seed-vertex",
    slug: "bryl-lim",
    templateSlug: "vertex",
    name: "Bryl Lim",
    title: "AI / Software Engineer",
    location: "Metro Manila, Philippines",
    email: "bryllim@gmail.com",
    bio: "Full-stack software engineer specializing in developing solutions with Javascript, Python, and PHP.",
    about:
      "I'm a full-stack software engineer specializing in developing solutions with JavaScript, Python, and PHP. Lately, I've been diving deeper into the world of artificial intelligence, focusing on integrating AI tools and techniques into modern applications. My work now includes developing AI-powered solutions and leveraging generative AI to optimize development workflows.",
    availability: "Open to opportunities",
    skills: ["JavaScript", "TypeScript", "React", "Next.js", "Python", "Laravel", "AWS", "Docker"],
    githubUrl: "https://github.com/bryllim",
    linkedinUrl: "https://linkedin.com/in/bryllim",
    websiteUrl: "https://bryllim.com",
    featuredProjectName: "CodeCred",
    featuredProjectSummary:
      "A platform for online certifications for programmers, helping developers validate their skills with high-quality, industry-recognized credentials.",
    featuredProjectStack: "Next.js, TypeScript, Supabase, Tailwind",
    featuredProjectUrl: "https://codecred.dev",
    previewUrl: createPortfolioUrl("bryl-lim"),
    updatedAt: "2026-04-15T08:00:00.000Z",
    source: "seed",
  },
  {
    ownerId: "seed-drift",
    slug: "brittany-chiang",
    templateSlug: "drift",
    name: "Brittany Chiang",
    title: "Senior Frontend Engineer",
    location: "Boston, MA",
    email: "brittany@example.dev",
    bio: "I build accessible, pixel-perfect experiences for the web.",
    about:
      "I'm an engineer who loves building things for the web. My goal is to always build products that provide pixel-perfect, performant user experiences. I've had the privilege of working at an advertising agency, a start-up, a huge corporation, and a student-led design studio.",
    availability: "Open to opportunities",
    skills: ["React", "TypeScript", "Tailwind CSS", "Accessibility", "Astro"],
    githubUrl: "https://github.com/bchiang7",
    linkedinUrl: "https://linkedin.com/in/bchiang7",
    websiteUrl: "https://brittanychiang.com",
    featuredProjectName: "V4 Portfolio",
    featuredProjectSummary:
      "A software engineer's portfolio website designed with a focus on smooth transitions, accessibility, and high performance.",
    featuredProjectStack: "Next.js, Tailwind CSS, Framer Motion",
    featuredProjectUrl: "https://brittanychiang.com",
    previewUrl: createPortfolioUrl("brittany-chiang"),
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
