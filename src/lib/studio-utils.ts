import {
  buildPortfolioSectionsFromValues,
  buildProfileImage,
  buildResumeLink,
  buildScheduleCallLink,
  normalizeSkills,
  type PortfolioFormValues,
  type PortfolioRecord,
} from "@/lib/portfolio-schema";
import {
  filterRenderableGalleryImages,
  isRenderableImageSrc,
} from "@/lib/portfolio-image-uploads";
import { normalizeUrl } from "@/lib/utils";

/**
 * Converts PortfolioFormValues + templateSettings into a PortfolioRecord
 * suitable for real-time preview rendering. Client-safe (no server-only deps).
 */
export function formValuesToRecord(
  values: PortfolioFormValues,
  templateSettings: Record<string, unknown> = {},
  ownerId = "guest",
): PortfolioRecord {
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
    githubUrl: values.githubUrl
      ? normalizeUrl(values.githubUrl)
      : "https://github.com",
    linkedinUrl: values.linkedinUrl
      ? normalizeUrl(values.linkedinUrl)
      : "https://linkedin.com",
    websiteUrl: values.websiteUrl ? normalizeUrl(values.websiteUrl) : "",
    featuredProjectName: values.featuredProjectName || "Your Featured Project",
    featuredProjectSummary:
      values.featuredProjectSummary || "A short summary of what this project does and why it matters.",
    featuredProjectStack: values.featuredProjectStack || "Next.js, TypeScript, Supabase",
    featuredProjectUrl: values.featuredProjectUrl
      ? normalizeUrl(values.featuredProjectUrl)
      : "",
    previewUrl: `/p/${values.slug || "preview"}`,
    updatedAt: new Date().toISOString(),
    source: "preview",
    templateSettings,
    experience: values.experience,
    recentProjects: values.recentProjects.map((project) => ({
      ...project,
      projectUrl: project.projectUrl ? normalizeUrl(project.projectUrl) : "",
    })),
    sections: buildPortfolioSectionsFromValues(values),
    galleryImages,
    resumeLink: buildResumeLink(values.resumeUrl, values.resumeLabel),
    profileImage: buildProfileImage(
      profileImageUrl,
      values.profileImageAlt,
      values.name,
    ),
    scheduleCall: buildScheduleCallLink(
      values.scheduleCallHref,
      values.scheduleCallLabel,
    ),
  };
}
