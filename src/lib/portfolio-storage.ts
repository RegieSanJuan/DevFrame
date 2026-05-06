import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { createPortfolioUrl } from "@/lib/app-url";
import {
  normalizeSkills,
  type PortfolioFormValues,
  type PortfolioRecord,
} from "@/lib/portfolio-schema";
import {
  createSupabaseAdminClient,
  createSupabasePublicClient,
} from "@/lib/supabase";

const PREVIEW_COOKIE_NAME = "devframe-preview";
const SCHEMA_NOT_READY_MESSAGE =
  "Supabase is connected, but the latest portfolio schema is not ready yet. Run the newest migration in supabase/migrations.";

type PortfolioRow = {
  id: string;
  owner_clerk_user_id: string;
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

type PortfolioExperienceRow = {
  display_order: number;
  year_label: string;
  role: string;
  company: string;
};

type PortfolioRecommendationRow = {
  display_order: number;
  quote: string;
  author: string;
  role: string;
  company: string | null;
  is_featured: boolean;
};

type PortfolioRelations = Pick<PortfolioRecord, "experience" | "recommendation">;

type SavePortfolioResult = {
  record: PortfolioRecord;
  persisted: boolean;
  error?: string;
};

const BASE_PORTFOLIO: Omit<
  PortfolioRecord,
  "ownerId" | "slug" | "templateSlug" | "previewUrl"
> = {
  name: "Morgan Blake",
  title: "AI / Software Engineer / Content Creator",
  location: "San Francisco, CA",
  email: "morgan@blakedev.io",
  bio: "Full-stack engineer building AI-powered solutions and a community of 200k+ developers.",
  about:
    "I'm a full-stack software engineer specializing in JavaScript, Python, and PHP. I work on modern web applications, mobile apps, SEO, digital marketing, and code tutorials. I've helped startups and SMEs grow through software solutions and built a community of over 200,000 developers sharing knowledge and mentorship. Lately I've been diving deep into AI - building intelligent applications, integrating LLMs into production systems, and using generative AI to improve development workflows.",
  availability: "Open to opportunities",
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Vue.js",
    "Tailwind CSS",
    "Node.js",
    "Python",
    "PHP",
    "Laravel",
    "PostgreSQL",
    "MongoDB",
    "AWS",
    "Docker",
    "Kubernetes",
    "GitHub Actions",
  ],
  githubUrl: "https://github.com/morganblake",
  linkedinUrl: "https://linkedin.com/in/morganblake",
  websiteUrl: "https://blakedev.io",
  featuredProjectName: "Stackmap",
  featuredProjectSummary:
    "An interactive tool for visualizing and documenting engineering architecture decisions, helping teams align on tech stack choices and trade-offs.",
  featuredProjectStack: "Next.js, TypeScript, Supabase, Tailwind CSS",
  featuredProjectUrl: "https://stackmap.dev",
  updatedAt: "2026-04-15T08:00:00.000Z",
  source: "seed",
  experience: [
    { year: "2025 - Present", role: "AI Engineer", company: "Standard Chartered" },
    {
      year: "2025",
      role: "AI Ops Engineer",
      company: "Centre of Excellence for GenAI, Cambridge",
    },
    {
      year: "2024",
      role: "Senior Full-Stack Developer",
      company: "Core Technology, Cambridge",
    },
    { year: "2022", role: "Software Engineering Lead", company: "PocketDevs" },
    { year: "2021", role: "Lead Application Developer", company: "Bluewind Asia" },
    { year: "2020", role: "Software Engineer", company: "GCM" },
  ],
  recommendation: {
    quote:
      "Morgan was the most talented software engineer I've mentored in a long time. A fast learner who always delivers quality output, with a genuine passion for tech. Definitely someone you want on your team.",
    author: "Chris Militante",
    role: "ICT Director at GCM",
  },
};

const SEED_PORTFOLIOS: PortfolioRecord[] = [
  {
    ...BASE_PORTFOLIO,
    ownerId: "seed-morgan-nova",
    slug: "morgan-nova",
    templateSlug: "nova",
    previewUrl: createPortfolioUrl("morgan-nova"),
  },
  {
    ...BASE_PORTFOLIO,
    ownerId: "seed-morgan-vertex",
    slug: "morgan-vertex",
    templateSlug: "vertex",
    previewUrl: createPortfolioUrl("morgan-vertex"),
  },
  {
    ...BASE_PORTFOLIO,
    ownerId: "seed-morgan-drift",
    slug: "morgan-drift",
    templateSlug: "drift",
    previewUrl: createPortfolioUrl("morgan-drift"),
  },
];

function toPortfolioRecord(
  row: PortfolioRow,
  source: PortfolioRecord["source"],
  relations: PortfolioRelations = {},
): PortfolioRecord {
  return {
    ownerId: row.owner_clerk_user_id,
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
    experience: relations.experience,
    recommendation: relations.recommendation,
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

async function ensureProfile(
  supabase: SupabaseClient,
  clerkUserId: string,
): Promise<string | null> {
  const { error } = await supabase.from("profiles").upsert(
    {
      clerk_user_id: clerkUserId,
    },
    {
      onConflict: "clerk_user_id",
    },
  );

  return error ? error.message : null;
}

async function getCurrentPortfolioRowForOwner(
  supabase: SupabaseClient,
  ownerId: string,
) {
  return supabase
    .from("portfolios")
    .select("*")
    .eq("owner_clerk_user_id", ownerId)
    .order("is_primary", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle<PortfolioRow>();
}

async function loadPortfolioRelations(
  supabase: SupabaseClient,
  portfolioId: string,
): Promise<PortfolioRelations> {
  const [experienceResult, recommendationResult] = await Promise.all([
    supabase
      .from("portfolio_experience")
      .select("display_order, year_label, role, company")
      .eq("portfolio_id", portfolioId)
      .order("display_order", { ascending: true }),
    supabase
      .from("portfolio_recommendations")
      .select("display_order, quote, author, role, company, is_featured")
      .eq("portfolio_id", portfolioId)
      .order("is_featured", { ascending: false })
      .order("display_order", { ascending: true }),
  ]);

  const experienceRows = (experienceResult.data ?? []) as PortfolioExperienceRow[];
  const recommendationRows = (recommendationResult.data ??
    []) as PortfolioRecommendationRow[];

  const experience =
    experienceRows.length > 0
      ? experienceRows.map((row) => ({
          year: row.year_label,
          role: row.role,
          company: row.company,
        }))
      : undefined;

  const featuredRecommendation =
    recommendationRows.find((row) => row.is_featured) ?? recommendationRows[0];

  return {
    experience,
    recommendation: featuredRecommendation
      ? {
          quote: featuredRecommendation.quote,
          author: featuredRecommendation.author,
          role: featuredRecommendation.company
            ? `${featuredRecommendation.role}, ${featuredRecommendation.company}`
            : featuredRecommendation.role,
        }
      : undefined,
  };
}

async function hydratePortfolioRecord(
  supabase: SupabaseClient,
  row: PortfolioRow,
  source: PortfolioRecord["source"],
) {
  const relations = await loadPortfolioRelations(supabase, row.id);
  return toPortfolioRecord(row, source, relations);
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

  const profileError = await ensureProfile(supabase, ownerId);

  if (profileError) {
    return {
      record: previewRecord,
      persisted: false,
      error: profileError || SCHEMA_NOT_READY_MESSAGE,
    };
  }

  const { data: existingPortfolio, error: existingPortfolioError } =
    await getCurrentPortfolioRowForOwner(supabase, ownerId);

  if (existingPortfolioError) {
    return {
      record: previewRecord,
      persisted: false,
      error: existingPortfolioError.message || SCHEMA_NOT_READY_MESSAGE,
    };
  }

  const payload = {
    owner_clerk_user_id: ownerId,
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
    is_primary: true,
  };

  const operation = existingPortfolio
    ? supabase
        .from("portfolios")
        .update(payload)
        .eq("id", existingPortfolio.id)
        .select("*")
        .single<PortfolioRow>()
    : supabase
        .from("portfolios")
        .insert(payload)
        .select("*")
        .single<PortfolioRow>();

  const { data, error } = await operation;

  if (error || !data) {
    return {
      record: previewRecord,
      persisted: false,
      error: error?.message || SCHEMA_NOT_READY_MESSAGE,
    };
  }

  const persistedRecord = await hydratePortfolioRecord(supabase, data, "supabase");
  await savePreviewPortfolio(persistedRecord);

  return {
    record: persistedRecord,
    persisted: true,
  };
}

export async function getPortfolioForOwner(ownerId: string) {
  const supabase = createSupabaseAdminClient();

  if (supabase) {
    const { data } = await getCurrentPortfolioRowForOwner(supabase, ownerId);

    if (data) {
      return hydratePortfolioRecord(supabase, data, "supabase");
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
      .eq("is_published", true)
      .limit(1)
      .maybeSingle<PortfolioRow>();

    if (data) {
      return hydratePortfolioRecord(supabase, data, "supabase");
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
  return SEED_PORTFOLIOS.find(
    (portfolio) => portfolio.templateSlug === templateSlug,
  );
}
