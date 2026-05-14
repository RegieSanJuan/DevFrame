import { z } from "zod";

import { TEMPLATE_SLUGS, type TemplateSlug } from "@/lib/template-catalog";
import {
  filterRenderableGalleryImages,
  isRenderableImageSrc,
} from "@/lib/portfolio-image-uploads";
import {
  isValidContactLink,
  isValidHttpUrl,
  normalizeContactLink,
  normalizeUrl,
  splitCsv,
} from "@/lib/utils";

export const availabilityOptions = [
  "Open to opportunities",
  "Available for freelance work",
  "Currently employed, open to the right fit",
] as const;

export const EXPERIENCE_ENTRY_LIMIT = 8;
export const RECENT_PROJECT_LIMIT = 6;
export const GALLERY_IMAGE_LIMIT = 6;

export const PORTFOLIO_SECTION_TYPES = {
  profileImage: "profile_image",
  resumeLink: "resume_link",
  scheduleCall: "schedule_call",
} as const;

const optionalUrl = z
  .string()
  .trim()
  .transform((value) => (value ? normalizeUrl(value) : ""))
  .refine((value) => !value || isValidHttpUrl(value), {
    message: "Enter a valid URL",
  });

const optionalContactLink = z
  .string()
  .trim()
  .transform((value) => (value ? normalizeContactLink(value) : ""))
  .refine((value) => !value || isValidContactLink(value), {
    message: "Enter a valid call link or phone number",
  });

function createRequiredUrlSchema(label: string) {
  return z
    .string()
    .trim()
    .min(1, `Enter a valid ${label} URL`)
    .transform((value) => normalizeUrl(value))
    .refine((value) => isValidHttpUrl(value), {
      message: `Enter a valid ${label} URL`,
    });
}

const experienceItemSchema = z.object({
  year: z
    .string()
    .trim()
    .min(1, "Add a year or date range")
    .max(48, "Keep the year label under 48 characters"),
  role: z
    .string()
    .trim()
    .min(2, "Add a role title")
    .max(80, "Keep the role title under 80 characters"),
  company: z
    .string()
    .trim()
    .min(2, "Add a company or client name")
    .max(80, "Keep the company name under 80 characters"),
});

const recentProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Add a recent project name")
    .max(80, "Keep the project name under 80 characters"),
  summary: z
    .string()
    .trim()
    .min(20, "Add at least 20 characters for the project summary")
    .max(240, "Keep the project summary under 240 characters"),
  stack: z
    .string()
    .trim()
    .max(160, "Keep the project stack under 160 characters"),
  projectUrl: optionalUrl,
});

const galleryImageSchema = z.object({
  src: z.string().trim().max(2048, "Keep the image path under 2048 characters"),
  alt: z
    .string()
    .trim()
    .max(120, "Keep the image description under 120 characters"),
  storageBucket: z.string().trim().max(120).optional(),
  storagePath: z.string().trim().max(1024).optional(),
});

export const portfolioFormSchema = z.object({
  templateSlug: z.enum(TEMPLATE_SLUGS),
  slug: z
    .string()
    .trim()
    .min(3, "Use at least 3 characters")
    .max(32, "Keep the slug under 32 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Use lowercase letters, numbers, and hyphens only",
    ),
  name: z.string().trim().min(2, "Enter your full name"),
  title: z.string().trim().min(2, "Enter your professional title"),
  location: z.string().trim().min(2, "Enter your location"),
  email: z.email({ error: "Enter a valid email address" }),
  bio: z
    .string()
    .trim()
    .min(40, "Write a short intro with at least 40 characters")
    .max(180, "Keep the short intro under 180 characters"),
  about: z
    .string()
    .trim()
    .min(80, "Write a stronger story with at least 80 characters")
    .max(600, "Keep the about section under 600 characters"),
  availability: z.enum(availabilityOptions),
  skills: z
    .string()
    .trim()
    .min(3, "Add at least a few skills separated by commas"),
  githubUrl: createRequiredUrlSchema("GitHub"),
  linkedinUrl: createRequiredUrlSchema("LinkedIn"),
  websiteUrl: optionalUrl,
  featuredProjectName: z
    .string()
    .trim()
    .min(2, "Name your featured project"),
  featuredProjectSummary: z
    .string()
    .trim()
    .min(30, "Summarize the project in at least 30 characters")
    .max(240, "Keep the project summary under 240 characters"),
  featuredProjectStack: z
    .string()
    .trim()
    .min(3, "Share the stack used for the project"),
  featuredProjectUrl: optionalUrl,
  experience: z
    .array(experienceItemSchema)
    .max(
      EXPERIENCE_ENTRY_LIMIT,
      `Add up to ${EXPERIENCE_ENTRY_LIMIT} experience entries`,
    )
    .default([]),
  recentProjects: z
    .array(recentProjectSchema)
    .max(
      RECENT_PROJECT_LIMIT,
      `Add up to ${RECENT_PROJECT_LIMIT} recent projects`,
    )
    .default([]),
  galleryImages: z
    .array(galleryImageSchema)
    .max(
      GALLERY_IMAGE_LIMIT,
      `Add up to ${GALLERY_IMAGE_LIMIT} gallery images`,
    )
    .default([]),
  resumeUrl: optionalUrl,
  resumeLabel: z
    .string()
    .trim()
    .max(60, "Keep the resume label under 60 characters")
    .default(""),
  profileImageUrl: z
    .string()
    .trim()
    .max(2048, "Keep the image path under 2048 characters")
    .default(""),
  profileImageAlt: z
    .string()
    .trim()
    .max(120, "Keep the profile image alt text under 120 characters")
    .default(""),
  profileImageStorageBucket: z.string().trim().max(120).default(""),
  profileImageStoragePath: z.string().trim().max(1024).default(""),
  scheduleCallHref: optionalContactLink,
  scheduleCallLabel: z
    .string()
    .trim()
    .max(60, "Keep the call button label under 60 characters")
    .default(""),
  /**
   * Template-specific settings stored in the template_settings JSONB column.
   * Each template declares its own appearance field schema in
   * template-field-registry.ts.
   */
  templateSettings: z.record(z.string(), z.unknown()).default({}),
});

export type PortfolioFormValues = z.infer<typeof portfolioFormSchema>;

export type ExperienceItem = {
  year: string;
  role: string;
  company: string;
};

export type RecentProjectItem = {
  name: string;
  summary: string;
  stack: string;
  projectUrl: string;
};

export type RecommendationItem = {
  quote: string;
  author: string;
  role: string;
};

export type ResumeLink = {
  url: string;
  label: string;
};

export type ScheduleCallLink = {
  href: string;
  label: string;
};

export type ProfileImage = {
  src: string;
  alt: string;
};

/**
 * Loosely typed JSONB bag for template-specific UI/presentation preferences
 * (e.g. defaultMode, accentOverride, heroLayout). Never put user-authored
 * portfolio content here.
 */
export type TemplateSettings = Record<string, unknown>;

/**
 * Optional structured content sections that only some templates surface.
 * Templates query only the section_type values they support and ignore the
 * rest.
 */
export type PortfolioSection = {
  id: string;
  sectionType: string;
  displayOrder: number;
  isEnabled: boolean;
  data: Record<string, unknown>;
};

export type GalleryImage = {
  src: string;
  alt: string;
  storageBucket?: string;
  storagePath?: string;
};

export type PortfolioRecord = {
  ownerId: string;
  slug: string;
  templateSlug: TemplateSlug;
  name: string;
  title: string;
  location: string;
  email: string;
  bio: string;
  about: string;
  availability: (typeof availabilityOptions)[number];
  skills: string[];
  githubUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
  featuredProjectName: string;
  featuredProjectSummary: string;
  featuredProjectStack: string;
  featuredProjectUrl: string;
  previewUrl: string;
  updatedAt: string;
  source: "seed" | "preview" | "supabase";
  templateSettings: TemplateSettings;
  experience?: ExperienceItem[];
  recentProjects?: RecentProjectItem[];
  recommendation?: RecommendationItem;
  sections?: PortfolioSection[];
  galleryImages?: GalleryImage[];
  resumeLink?: ResumeLink;
  scheduleCall?: ScheduleCallLink;
  profileImage?: ProfileImage;
};

function parseJsonField<T>(formData: FormData, key: string, fallback: T): T {
  const raw = formData.get(key);

  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(String(raw)) as T;
  } catch {
    return fallback;
  }
}

export function getPortfolioSectionData<T extends Record<string, unknown>>(
  sections: PortfolioSection[] | undefined,
  sectionType: string,
) {
  const matchingSection = sections?.find(
    (section) => section.sectionType === sectionType && section.isEnabled,
  );

  return matchingSection?.data as T | undefined;
}

export function buildResumeLink(
  resumeUrl: string,
  resumeLabel?: string,
): ResumeLink | undefined {
  if (!resumeUrl) {
    return undefined;
  }

  return {
    url: resumeUrl,
    label: resumeLabel?.trim() || "Open resume",
  };
}

export function buildProfileImage(
  profileImageUrl: string,
  profileImageAlt?: string,
  name?: string,
): ProfileImage | undefined {
  if (!isRenderableImageSrc(profileImageUrl)) {
    return undefined;
  }

  return {
    src: profileImageUrl.trim(),
    alt: profileImageAlt?.trim() || `${name || "Portfolio"} profile image`,
  };
}

export function buildScheduleCallLink(
  scheduleCallHref: string,
  scheduleCallLabel?: string,
): ScheduleCallLink | undefined {
  if (!scheduleCallHref) {
    return undefined;
  }

  return {
    href: scheduleCallHref,
    label: scheduleCallLabel?.trim() || "Schedule a call",
  };
}

export function buildPortfolioSectionsFromValues(
  values: Pick<
    PortfolioFormValues,
    | "resumeUrl"
    | "resumeLabel"
    | "scheduleCallHref"
    | "scheduleCallLabel"
  >,
): PortfolioSection[] {
  const sections: PortfolioSection[] = [];
  const resumeLink = buildResumeLink(values.resumeUrl, values.resumeLabel);
  const scheduleCall = buildScheduleCallLink(
    values.scheduleCallHref,
    values.scheduleCallLabel,
  );

  if (resumeLink) {
    sections.push({
      id: PORTFOLIO_SECTION_TYPES.resumeLink,
      sectionType: PORTFOLIO_SECTION_TYPES.resumeLink,
      displayOrder: sections.length,
      isEnabled: true,
      data: resumeLink,
    });
  }

  if (scheduleCall) {
    sections.push({
      id: PORTFOLIO_SECTION_TYPES.scheduleCall,
      sectionType: PORTFOLIO_SECTION_TYPES.scheduleCall,
      displayOrder: sections.length,
      isEnabled: true,
      data: scheduleCall,
    });
  }

  return sections;
}

export function getFeaturedProject(
  record: Pick<
    PortfolioRecord,
    | "featuredProjectName"
    | "featuredProjectSummary"
    | "featuredProjectStack"
    | "featuredProjectUrl"
  >,
): RecentProjectItem {
  return {
    name: record.featuredProjectName,
    summary: record.featuredProjectSummary,
    stack: record.featuredProjectStack,
    projectUrl: record.featuredProjectUrl,
  };
}

export function getDisplayProjects(
  record: Pick<
    PortfolioRecord,
    | "featuredProjectName"
    | "featuredProjectSummary"
    | "featuredProjectStack"
    | "featuredProjectUrl"
    | "recentProjects"
  >,
) {
  const featuredProject = getFeaturedProject(record);
  const recentProjects = record.recentProjects ?? [];

  return recentProjects.length > 0
    ? [featuredProject, ...recentProjects]
    : [featuredProject];
}

export function parsePortfolioFormData(
  formData: FormData,
): PortfolioFormValues {
  return {
    templateSlug: String(formData.get("templateSlug") ?? "drift") as TemplateSlug,
    slug: String(formData.get("slug") ?? "")
      .trim()
      .toLowerCase(),
    name: String(formData.get("name") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    bio: String(formData.get("bio") ?? "").trim(),
    about: String(formData.get("about") ?? "").trim(),
    availability: String(
      formData.get("availability") ?? availabilityOptions[0],
    ) as (typeof availabilityOptions)[number],
    skills: String(formData.get("skills") ?? "").trim(),
    githubUrl: normalizeUrl(String(formData.get("githubUrl") ?? "").trim()),
    linkedinUrl: normalizeUrl(String(formData.get("linkedinUrl") ?? "").trim()),
    websiteUrl: String(formData.get("websiteUrl") ?? "").trim()
      ? normalizeUrl(String(formData.get("websiteUrl") ?? "").trim())
      : "",
    featuredProjectName: String(
      formData.get("featuredProjectName") ?? "",
    ).trim(),
    featuredProjectSummary: String(
      formData.get("featuredProjectSummary") ?? "",
    ).trim(),
    featuredProjectStack: String(
      formData.get("featuredProjectStack") ?? "",
    ).trim(),
    featuredProjectUrl: String(formData.get("featuredProjectUrl") ?? "").trim()
      ? normalizeUrl(String(formData.get("featuredProjectUrl") ?? "").trim())
      : "",
    experience: parseJsonField(formData, "experience", [] as ExperienceItem[]),
    recentProjects: parseJsonField(
      formData,
      "recentProjects",
      [] as RecentProjectItem[],
    ),
    galleryImages: parseJsonField(formData, "galleryImages", [] as GalleryImage[]),
    resumeUrl: String(formData.get("resumeUrl") ?? "").trim()
      ? normalizeUrl(String(formData.get("resumeUrl") ?? "").trim())
      : "",
    resumeLabel: String(formData.get("resumeLabel") ?? "").trim(),
    profileImageUrl: String(formData.get("profileImageUrl") ?? "").trim(),
    profileImageAlt: String(formData.get("profileImageAlt") ?? "").trim(),
    profileImageStorageBucket: String(
      formData.get("profileImageStorageBucket") ?? "",
    ).trim(),
    profileImageStoragePath: String(
      formData.get("profileImageStoragePath") ?? "",
    ).trim(),
    scheduleCallHref: String(formData.get("scheduleCallHref") ?? "").trim()
      ? normalizeContactLink(String(formData.get("scheduleCallHref") ?? "").trim())
      : "",
    scheduleCallLabel: String(formData.get("scheduleCallLabel") ?? "").trim(),
    templateSettings: parseJsonField(
      formData,
      "templateSettings",
      {} as Record<string, unknown>,
    ),
  };
}

export function getEmptyPortfolioForm(
  templateSlug: TemplateSlug = "drift",
): PortfolioFormValues {
  return {
    templateSlug,
    slug: "",
    name: "",
    title: "",
    location: "",
    email: "",
    bio: "",
    about: "",
    availability: availabilityOptions[0],
    skills: "",
    githubUrl: "",
    linkedinUrl: "",
    websiteUrl: "",
    featuredProjectName: "",
    featuredProjectSummary: "",
    featuredProjectStack: "",
    featuredProjectUrl: "",
    experience: [],
    recentProjects: [],
    galleryImages: [],
    resumeUrl: "",
    resumeLabel: "",
    profileImageUrl: "",
    profileImageAlt: "",
    profileImageStorageBucket: "",
    profileImageStoragePath: "",
    scheduleCallHref: "",
    scheduleCallLabel: "",
    templateSettings: {},
  };
}

export function toFormValues(record: PortfolioRecord): PortfolioFormValues {
  const resumeLink =
    record.resumeLink ??
    getPortfolioSectionData<ResumeLink>(
      record.sections,
      PORTFOLIO_SECTION_TYPES.resumeLink,
    );
  const profileImage =
    record.profileImage ??
    getPortfolioSectionData<ProfileImage>(
      record.sections,
      PORTFOLIO_SECTION_TYPES.profileImage,
    );
  const scheduleCall =
    record.scheduleCall ??
    getPortfolioSectionData<ScheduleCallLink>(
      record.sections,
      PORTFOLIO_SECTION_TYPES.scheduleCall,
    );

  return {
    templateSlug: record.templateSlug,
    slug: record.slug,
    name: record.name,
    title: record.title,
    location: record.location,
    email: record.email,
    bio: record.bio,
    about: record.about,
    availability: record.availability,
    skills: record.skills.join(", "),
    githubUrl: record.githubUrl,
    linkedinUrl: record.linkedinUrl,
    websiteUrl: record.websiteUrl,
    featuredProjectName: record.featuredProjectName,
    featuredProjectSummary: record.featuredProjectSummary,
    featuredProjectStack: record.featuredProjectStack,
    featuredProjectUrl: record.featuredProjectUrl,
    experience: record.experience ?? [],
    recentProjects: record.recentProjects ?? [],
    galleryImages: filterRenderableGalleryImages(record.galleryImages ?? []),
    resumeUrl: resumeLink?.url ?? "",
    resumeLabel: resumeLink?.label ?? "",
    profileImageUrl: profileImage?.src ?? "",
    profileImageAlt: profileImage?.alt ?? "",
    profileImageStorageBucket: "",
    profileImageStoragePath: "",
    scheduleCallHref: scheduleCall?.href ?? "",
    scheduleCallLabel: scheduleCall?.label ?? "",
    templateSettings: record.templateSettings ?? {},
  };
}

export function normalizeSkills(value: string) {
  return splitCsv(value);
}
