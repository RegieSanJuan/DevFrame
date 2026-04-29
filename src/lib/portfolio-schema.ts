import { z } from "zod";

import { TEMPLATE_SLUGS, type TemplateSlug } from "@/lib/template-catalog";
import { splitCsv } from "@/lib/utils";

export const availabilityOptions = [
  "Open to opportunities",
  "Available for freelance work",
  "Currently employed, open to the right fit",
] as const;

const optionalUrl = z.union([
  z.literal(""),
  z.url({ error: "Enter a valid URL including https://" }),
]);

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
  githubUrl: z.url({ error: "Enter a valid GitHub URL" }),
  linkedinUrl: z.url({ error: "Enter a valid LinkedIn URL" }),
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
});

export type PortfolioFormValues = z.infer<typeof portfolioFormSchema>;

export type ExperienceItem = {
  year: string;
  role: string;
  company: string;
};

export type RecommendationItem = {
  quote: string;
  author: string;
  role: string;
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
  experience?: ExperienceItem[];
  recommendation?: RecommendationItem;
};

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
    githubUrl: String(formData.get("githubUrl") ?? "").trim(),
    linkedinUrl: String(formData.get("linkedinUrl") ?? "").trim(),
    websiteUrl: String(formData.get("websiteUrl") ?? "").trim(),
    featuredProjectName: String(
      formData.get("featuredProjectName") ?? "",
    ).trim(),
    featuredProjectSummary: String(
      formData.get("featuredProjectSummary") ?? "",
    ).trim(),
    featuredProjectStack: String(
      formData.get("featuredProjectStack") ?? "",
    ).trim(),
    featuredProjectUrl: String(formData.get("featuredProjectUrl") ?? "").trim(),
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
  };
}

export function toFormValues(record: PortfolioRecord): PortfolioFormValues {
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
  };
}

export function normalizeSkills(value: string) {
  return splitCsv(value);
}
