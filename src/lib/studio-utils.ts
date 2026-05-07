import { normalizeSkills, type PortfolioFormValues } from "@/lib/portfolio-schema";
import type { PortfolioRecord } from "@/lib/portfolio-schema";

/**
 * Converts PortfolioFormValues + templateSettings into a PortfolioRecord
 * suitable for real-time preview rendering. Client-safe (no server-only deps).
 */
export function formValuesToRecord(
  values: PortfolioFormValues,
  templateSettings: Record<string, unknown> = {},
  ownerId = "guest",
): PortfolioRecord {
  return {
    ownerId,
    slug: values.slug || "preview",
    templateSlug: values.templateSlug,
    name: values.name || "Your Name",
    title: values.title || "Your Professional Title",
    location: values.location || "Your City",
    email: values.email || "you@example.dev",
    bio: values.bio || "A short intro about yourself.",
    about:
      values.about ||
      "Tell visitors how you work, what you care about, and what kind of problems you solve.",
    availability: values.availability,
    skills: normalizeSkills(values.skills),
    githubUrl: values.githubUrl || "https://github.com",
    linkedinUrl: values.linkedinUrl || "https://linkedin.com",
    websiteUrl: values.websiteUrl || "",
    featuredProjectName: values.featuredProjectName || "Your Featured Project",
    featuredProjectSummary:
      values.featuredProjectSummary || "A short summary of what this project does and why it matters.",
    featuredProjectStack: values.featuredProjectStack || "Next.js, TypeScript, Supabase",
    featuredProjectUrl: values.featuredProjectUrl || "",
    previewUrl: `/p/${values.slug || "preview"}`,
    updatedAt: new Date().toISOString(),
    source: "preview",
    templateSettings,
    galleryImages: [],
  };
}
