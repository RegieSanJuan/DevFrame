import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { createPortfolioUrl } from "@/lib/app-url";
import {
  buildPortfolioSectionsFromValues,
  buildProfileImage,
  buildResumeLink,
  buildScheduleCallLink,
  normalizeSkills,
  PORTFOLIO_SECTION_TYPES,
  type GalleryImage,
  type PortfolioFormValues,
  type PortfolioRecord,
  type PortfolioSection,
  type ProfileImage,
  type RecentProjectItem,
  type ResumeLink,
  type ScheduleCallLink,
} from "@/lib/portfolio-schema";
import {
  filterRenderableGalleryImages,
  isRenderableImageSrc,
  type PortfolioUploadFiles,
  validatePortfolioImageFile,
} from "@/lib/portfolio-image-uploads";
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
  template_settings: Record<string, unknown> | null;
  updated_at: string;
};

type PortfolioAssetRow = {
  id: string;
  kind: string;
  bucket: string;
  storage_path: string;
  public_url: string | null;
  alt_text: string | null;
  display_order: number;
  metadata: Record<string, unknown> | null;
};

type PortfolioExperienceRow = {
  display_order: number;
  year_label: string;
  role: string;
  company: string;
};

type PortfolioProjectRow = {
  display_order: number;
  name: string;
  summary: string;
  stack: string[] | null;
  project_url: string | null;
};

type PortfolioRecommendationRow = {
  display_order: number;
  quote: string;
  author: string;
  role: string;
  company: string | null;
  is_featured: boolean;
};

type PortfolioSectionRow = {
  id: string;
  section_type: string;
  display_order: number;
  is_enabled: boolean;
  data: Record<string, unknown> | null;
};

type PortfolioRelations = Pick<
  PortfolioRecord,
  | "experience"
  | "recentProjects"
  | "recommendation"
  | "galleryImages"
  | "sections"
  | "resumeLink"
  | "scheduleCall"
  | "profileImage"
>;

type SavePortfolioResult = {
  record: PortfolioRecord;
  persisted: boolean;
  error?: string;
};

const PORTFOLIO_STORAGE_BUCKET = "portfolio-assets";
const MANAGED_ASSET_KINDS = ["avatar", "gallery-image"] as const;

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
  recentProjects: [
    {
      name: "Docs Forge",
      summary:
        "An internal documentation workspace that combines AI-assisted drafting with structured review flows for engineering teams.",
      stack: "Next.js, OpenAI, Supabase",
      projectUrl: "https://docsforge.dev",
    },
    {
      name: "Latency Lens",
      summary:
        "A live observability dashboard that helps teams understand performance regressions before they hit production SLAs.",
      stack: "TypeScript, Postgres, Vercel",
      projectUrl: "https://latencylens.dev",
    },
  ],
  recommendation: {
    quote:
      "Morgan was the most talented software engineer I've mentored in a long time. A fast learner who always delivers quality output, with a genuine passion for tech. Definitely someone you want on your team.",
    author: "Chris Militante",
    role: "ICT Director at GCM",
  },
  templateSettings: {},
  sections: [
    {
      id: PORTFOLIO_SECTION_TYPES.profileImage,
      sectionType: PORTFOLIO_SECTION_TYPES.profileImage,
      displayOrder: 0,
      isEnabled: true,
      data: {
        src: "/devframe-bg-icon.svg",
        alt: "Morgan Blake profile image",
      },
    },
    {
      id: PORTFOLIO_SECTION_TYPES.resumeLink,
      sectionType: PORTFOLIO_SECTION_TYPES.resumeLink,
      displayOrder: 1,
      isEnabled: true,
      data: {
        url: "https://blakedev.io/resume.pdf",
        label: "Open resume PDF",
      },
    },
    {
      id: PORTFOLIO_SECTION_TYPES.scheduleCall,
      sectionType: PORTFOLIO_SECTION_TYPES.scheduleCall,
      displayOrder: 2,
      isEnabled: true,
      data: {
        href: "https://cal.com/morganblake",
        label: "Book intro call",
      },
    },
  ],
  galleryImages: [
    { src: "/devframe-bg-icon.svg", alt: "Brand mark detail" },
    { src: "/window.svg", alt: "Interface window preview" },
    { src: "/globe.svg", alt: "Global product illustration" },
    { src: "/vercel.svg", alt: "Deployment platform mark" },
  ],
  resumeLink: {
    url: "https://blakedev.io/resume.pdf",
    label: "Open resume PDF",
  },
  scheduleCall: {
    href: "https://cal.com/morganblake",
    label: "Book intro call",
  },
  profileImage: {
    src: "/devframe-bg-icon.svg",
    alt: "Morgan Blake profile image",
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
    templateSettings: row.template_settings ?? {},
    experience: relations.experience,
    recentProjects: relations.recentProjects,
    recommendation: relations.recommendation,
    sections: relations.sections,
    galleryImages: relations.galleryImages,
    resumeLink: relations.resumeLink,
    scheduleCall: relations.scheduleCall,
    profileImage: relations.profileImage,
  };
}

function buildPortfolioRecord(
  values: PortfolioFormValues,
  ownerId: string,
  source: PortfolioRecord["source"],
): PortfolioRecord {
  const sections = buildPortfolioSectionsFromValues(values);
  const galleryImages = filterRenderableGalleryImages(values.galleryImages).map(
    (image, index) => ({
      src: image.src.trim(),
      alt: image.alt || `Portfolio gallery image ${index + 1}`,
    }),
  );
  const profileImageUrl = isRenderableImageSrc(values.profileImageUrl)
    ? values.profileImageUrl.trim()
    : "";

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
    templateSettings: values.templateSettings ?? {},
    experience: values.experience,
    recentProjects: values.recentProjects,
    sections,
    galleryImages,
    resumeLink: buildResumeLink(values.resumeUrl, values.resumeLabel),
    scheduleCall: buildScheduleCallLink(
      values.scheduleCallHref,
      values.scheduleCallLabel,
    ),
    profileImage: buildProfileImage(
      profileImageUrl,
      values.profileImageAlt,
      values.name,
    ),
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

function mapSections(sectionRows: PortfolioSectionRow[]) {
  return sectionRows.map((row) => ({
    id: row.id,
    sectionType: row.section_type,
    displayOrder: row.display_order,
    isEnabled: row.is_enabled,
    data: row.data ?? {},
  }));
}

function getRelationSection<T extends Record<string, unknown>>(
  sections: PortfolioSection[] | undefined,
  sectionType: string,
) {
  const match = sections?.find(
    (section) => section.sectionType === sectionType && section.isEnabled,
  );

  return match?.data as T | undefined;
}

function createStorageSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "portfolio";
}

function getFileExtension(file: File) {
  const nameExtension = file.name.split(".").pop()?.toLowerCase();

  if (nameExtension && ["jpg", "jpeg", "png", "webp"].includes(nameExtension)) {
    return nameExtension;
  }

  switch (file.type) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}

function isExternalAsset(row: Pick<PortfolioAssetRow, "storage_path" | "metadata">) {
  return (
    row.storage_path.startsWith("external/") ||
    row.metadata?.source === "external-url"
  );
}

async function uploadPortfolioImage(
  supabase: SupabaseClient,
  path: string,
  file: File,
) {
  const validationError = validatePortfolioImageFile(file);

  if (validationError) {
    return {
      publicUrl: null,
      error: validationError,
    };
  }

  const { error } = await supabase.storage.from(PORTFOLIO_STORAGE_BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type,
  });

  if (error) {
    return {
      publicUrl: null,
      error: error.message,
    };
  }

  const { data } = supabase.storage
    .from(PORTFOLIO_STORAGE_BUCKET)
    .getPublicUrl(path);

  return {
    publicUrl: data.publicUrl,
    error: null,
  };
}

async function removeStorageObjects(
  supabase: SupabaseClient,
  rows: PortfolioAssetRow[],
) {
  const pathsByBucket = rows.reduce<Record<string, string[]>>((accumulator, row) => {
    if (!row.storage_path || isExternalAsset(row)) {
      return accumulator;
    }

    accumulator[row.bucket] ??= [];
    accumulator[row.bucket].push(row.storage_path);
    return accumulator;
  }, {});

  await Promise.all(
    Object.entries(pathsByBucket).map(async ([bucket, paths]) => {
      if (paths.length === 0) {
        return;
      }

      await supabase.storage.from(bucket).remove(paths);
    }),
  );
}

async function loadPortfolioRelations(
  supabase: SupabaseClient,
  portfolioId: string,
): Promise<PortfolioRelations> {
  const [
    experienceResult,
    recommendationResult,
    assetsResult,
    projectsResult,
    sectionsResult,
  ] = await Promise.all([
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
    supabase
      .from("portfolio_assets")
      .select("id, kind, bucket, storage_path, public_url, alt_text, display_order, metadata")
      .eq("portfolio_id", portfolioId)
      .in("kind", [...MANAGED_ASSET_KINDS])
      .order("display_order", { ascending: true }),
    supabase
      .from("portfolio_projects")
      .select("display_order, name, summary, stack, project_url")
      .eq("portfolio_id", portfolioId)
      .order("display_order", { ascending: true }),
    supabase
      .from("portfolio_sections")
      .select("id, section_type, display_order, is_enabled, data")
      .eq("portfolio_id", portfolioId)
      .order("display_order", { ascending: true }),
  ]);

  const experienceRows = (experienceResult.data ?? []) as PortfolioExperienceRow[];
  const recommendationRows = (recommendationResult.data ??
    []) as PortfolioRecommendationRow[];
  const assetRows = (assetsResult.data ?? []) as PortfolioAssetRow[];
  const projectRows = (projectsResult.data ?? []) as PortfolioProjectRow[];
  const sectionRows = (sectionsResult.data ?? []) as PortfolioSectionRow[];

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

  const galleryImages: GalleryImage[] = assetRows
    .filter((row) => row.kind === "gallery-image")
    .filter((row) => Boolean(row.public_url))
    .map((row, index) => ({
      src: row.public_url!,
      alt: row.alt_text ?? `Portfolio gallery image ${index + 1}`,
    }));

  const recentProjects: RecentProjectItem[] = projectRows.map((row) => ({
    name: row.name,
    summary: row.summary,
    stack: row.stack?.join(", ") ?? "",
    projectUrl: row.project_url ?? "",
  }));

  const sections = sectionRows.length > 0 ? mapSections(sectionRows) : undefined;
  const resumeLink = getRelationSection<ResumeLink>(
    sections,
    PORTFOLIO_SECTION_TYPES.resumeLink,
  );
  const scheduleCall = getRelationSection<ScheduleCallLink>(
    sections,
    PORTFOLIO_SECTION_TYPES.scheduleCall,
  );
  const avatarRow = assetRows.find(
    (row) => row.kind === "avatar" && Boolean(row.public_url),
  );
  const profileImage =
    avatarRow && avatarRow.public_url
      ? {
          src: avatarRow.public_url,
          alt: avatarRow.alt_text ?? "Portfolio profile image",
        }
      : getRelationSection<ProfileImage>(
          sections,
          PORTFOLIO_SECTION_TYPES.profileImage,
        );

  return {
    experience,
    recentProjects: recentProjects.length > 0 ? recentProjects : undefined,
    recommendation: featuredRecommendation
      ? {
          quote: featuredRecommendation.quote,
          author: featuredRecommendation.author,
          role: featuredRecommendation.company
            ? `${featuredRecommendation.role}, ${featuredRecommendation.company}`
            : featuredRecommendation.role,
        }
      : undefined,
    sections,
    galleryImages: galleryImages.length > 0 ? galleryImages : undefined,
    resumeLink,
    scheduleCall,
    profileImage,
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

async function syncPortfolioExperience(
  supabase: SupabaseClient,
  portfolioId: string,
  experience: PortfolioRecord["experience"] = [],
) {
  const deleteResult = await supabase
    .from("portfolio_experience")
    .delete()
    .eq("portfolio_id", portfolioId);

  if (deleteResult.error) {
    return deleteResult.error.message;
  }

  if (!experience.length) {
    return null;
  }

  const { error } = await supabase.from("portfolio_experience").insert(
    experience.map((entry, index) => ({
      portfolio_id: portfolioId,
      display_order: index,
      year_label: entry.year,
      role: entry.role,
      company: entry.company,
    })),
  );

  return error ? error.message : null;
}

async function syncRecentProjects(
  supabase: SupabaseClient,
  portfolioId: string,
  recentProjects: PortfolioRecord["recentProjects"] = [],
) {
  const deleteResult = await supabase
    .from("portfolio_projects")
    .delete()
    .eq("portfolio_id", portfolioId);

  if (deleteResult.error) {
    return deleteResult.error.message;
  }

  if (!recentProjects.length) {
    return null;
  }

  const { error } = await supabase.from("portfolio_projects").insert(
    recentProjects.map((project, index) => ({
      portfolio_id: portfolioId,
      display_order: index,
      name: project.name,
      summary: project.summary,
      stack: normalizeSkills(project.stack),
      project_url: project.projectUrl || null,
      is_featured: false,
    })),
  );

  return error ? error.message : null;
}

async function syncPortfolioAssets(
  supabase: SupabaseClient,
  portfolioId: string,
  ownerId: string,
  values: PortfolioFormValues,
  uploads: PortfolioUploadFiles,
) {
  const { data: existingAssetsData, error: existingAssetsError } = await supabase
    .from("portfolio_assets")
    .select("id, kind, bucket, storage_path, public_url, alt_text, display_order, metadata")
    .eq("portfolio_id", portfolioId)
    .in("kind", [...MANAGED_ASSET_KINDS])
    .order("display_order", { ascending: true });

  if (existingAssetsError) {
    return existingAssetsError.message;
  }

  const existingAssets = (existingAssetsData ?? []) as PortfolioAssetRow[];
  const reusedAssetIds = new Set<string>();
  const assetRowsToInsert: Array<Record<string, unknown>> = [];
  const storagePrefix = `${createStorageSegment(ownerId)}/${createStorageSegment(values.slug)}/${portfolioId}`;

  if (uploads.profileImageFile) {
    const extension = getFileExtension(uploads.profileImageFile);
    const uploadResult = await uploadPortfolioImage(
      supabase,
      `${storagePrefix}/avatar.${extension}`,
      uploads.profileImageFile,
    );

    if (uploadResult.error || !uploadResult.publicUrl) {
      return uploadResult.error ?? "Unable to upload the profile image.";
    }

    assetRowsToInsert.push({
      portfolio_id: portfolioId,
      kind: "avatar",
      bucket: PORTFOLIO_STORAGE_BUCKET,
      storage_path: `${storagePrefix}/avatar.${extension}`,
      public_url: uploadResult.publicUrl,
      alt_text:
        values.profileImageAlt.trim() || `${values.name || "Portfolio"} profile image`,
      display_order: 0,
      metadata: { source: "storage-upload" },
    });
  } else if (isRenderableImageSrc(values.profileImageUrl)) {
    const existingAvatar = existingAssets.find(
      (row) =>
        row.kind === "avatar" &&
        row.public_url === values.profileImageUrl &&
        !reusedAssetIds.has(row.id),
    );

    if (existingAvatar) {
      reusedAssetIds.add(existingAvatar.id);
      assetRowsToInsert.push({
        portfolio_id: portfolioId,
        kind: "avatar",
        bucket: existingAvatar.bucket,
        storage_path: existingAvatar.storage_path,
        public_url: existingAvatar.public_url,
        alt_text:
          values.profileImageAlt.trim() ||
          existingAvatar.alt_text ||
          `${values.name || "Portfolio"} profile image`,
        display_order: 0,
        metadata: existingAvatar.metadata ?? { source: "storage-upload" },
      });
    } else {
      assetRowsToInsert.push({
        portfolio_id: portfolioId,
        kind: "avatar",
        bucket: PORTFOLIO_STORAGE_BUCKET,
        storage_path: "external/avatar",
        public_url: values.profileImageUrl.trim(),
        alt_text:
          values.profileImageAlt.trim() || `${values.name || "Portfolio"} profile image`,
        display_order: 0,
        metadata: { source: "external-url" },
      });
    }
  }

  const galleryUploadsByIndex = new Map(
    uploads.galleryImageFiles.map(({ index, file }) => [index, file]),
  );
  const galleryEntries = values.galleryImages.flatMap((image, index) => {
    const uploadedFile = galleryUploadsByIndex.get(index);

    if (uploadedFile || isRenderableImageSrc(image.src)) {
      return [{ image, index, uploadedFile }];
    }

    return [];
  });

  for (const [displayOrder, entry] of galleryEntries.entries()) {
    const altText = entry.image.alt || `Portfolio gallery image ${displayOrder + 1}`;

    if (entry.uploadedFile) {
      const extension = getFileExtension(entry.uploadedFile);
      const storagePath = `${storagePrefix}/gallery-${displayOrder + 1}.${extension}`;
      const uploadResult = await uploadPortfolioImage(
        supabase,
        storagePath,
        entry.uploadedFile,
      );

      if (uploadResult.error || !uploadResult.publicUrl) {
        return uploadResult.error ?? "Unable to upload a gallery image.";
      }

      assetRowsToInsert.push({
        portfolio_id: portfolioId,
        kind: "gallery-image",
        bucket: PORTFOLIO_STORAGE_BUCKET,
        storage_path: storagePath,
        public_url: uploadResult.publicUrl,
        alt_text: altText,
        display_order: displayOrder,
        metadata: { source: "storage-upload" },
      });
      continue;
    }

    const existingGalleryAsset = existingAssets.find(
      (row) =>
        row.kind === "gallery-image" &&
        row.public_url === entry.image.src &&
        !reusedAssetIds.has(row.id),
    );

    if (existingGalleryAsset) {
      reusedAssetIds.add(existingGalleryAsset.id);
      assetRowsToInsert.push({
        portfolio_id: portfolioId,
        kind: "gallery-image",
        bucket: existingGalleryAsset.bucket,
        storage_path: existingGalleryAsset.storage_path,
        public_url: existingGalleryAsset.public_url,
        alt_text: altText,
        display_order: displayOrder,
        metadata: existingGalleryAsset.metadata ?? { source: "storage-upload" },
      });
      continue;
    }

    assetRowsToInsert.push({
      portfolio_id: portfolioId,
      kind: "gallery-image",
      bucket: PORTFOLIO_STORAGE_BUCKET,
      storage_path: `external/gallery-${displayOrder + 1}`,
      public_url: entry.image.src.trim(),
      alt_text: altText,
      display_order: displayOrder,
      metadata: { source: "external-url" },
    });
  }

  const deleteResult = await supabase
    .from("portfolio_assets")
    .delete()
    .eq("portfolio_id", portfolioId)
    .in("kind", [...MANAGED_ASSET_KINDS]);

  if (deleteResult.error) {
    return deleteResult.error.message;
  }

  if (assetRowsToInsert.length > 0) {
    const { error } = await supabase.from("portfolio_assets").insert(assetRowsToInsert);

    if (error) {
      return error.message;
    }
  }

  const retainedStoragePaths = new Set(
    assetRowsToInsert
      .map((row) => `${String(row.bucket)}::${String(row.storage_path)}`)
      .filter((storageKey) => !storageKey.endsWith("::") && !storageKey.includes("::external/")),
  );
  const staleAssets = existingAssets.filter(
    (row) =>
      !reusedAssetIds.has(row.id) &&
      !retainedStoragePaths.has(`${row.bucket}::${row.storage_path}`),
  );
  await removeStorageObjects(supabase, staleAssets);

  return null;
}

async function syncPortfolioSections(
  supabase: SupabaseClient,
  portfolioId: string,
  sections: PortfolioRecord["sections"] = [],
) {
  const managedSectionTypes = Object.values(PORTFOLIO_SECTION_TYPES);
  const deleteResult = await supabase
    .from("portfolio_sections")
    .delete()
    .eq("portfolio_id", portfolioId)
    .in("section_type", managedSectionTypes);

  if (deleteResult.error) {
    return deleteResult.error.message;
  }

  if (!sections.length) {
    return null;
  }

  const { error } = await supabase.from("portfolio_sections").insert(
    sections.map((section, index) => ({
      portfolio_id: portfolioId,
      section_type: section.sectionType,
      display_order: index,
      is_enabled: section.isEnabled,
      data: section.data,
    })),
  );

  return error ? error.message : null;
}

export async function savePortfolio(
  values: PortfolioFormValues,
  ownerId: string,
  uploads: PortfolioUploadFiles = {
    profileImageFile: null,
    galleryImageFiles: [],
  },
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
    template_settings: values.templateSettings ?? {},
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

  const relationErrors = (
    await Promise.all([
      syncPortfolioExperience(supabase, data.id, previewRecord.experience),
      syncRecentProjects(supabase, data.id, previewRecord.recentProjects),
      syncPortfolioAssets(supabase, data.id, ownerId, values, uploads),
      syncPortfolioSections(supabase, data.id, previewRecord.sections),
    ])
  ).filter(Boolean);

  if (relationErrors.length > 0) {
    return {
      record: previewRecord,
      persisted: false,
      error: relationErrors[0] || SCHEMA_NOT_READY_MESSAGE,
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
