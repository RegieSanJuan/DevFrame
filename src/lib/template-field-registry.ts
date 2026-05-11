import type { TemplateSlug } from "@/lib/template-catalog";
import { GALLERY_IMAGE_LIMIT } from "@/lib/portfolio-schema";

type FieldBase = {
  key: string;
  label: string;
  description?: string;
};

export type TextField = FieldBase & {
  type: "text" | "url";
  placeholder?: string;
  defaultValue?: string;
};

export type SelectField = FieldBase & {
  type: "select";
  options: { value: string; label: string }[];
  defaultValue?: string;
};

export type ToggleField = FieldBase & {
  type: "toggle";
  defaultValue?: boolean;
};

export type ColorField = FieldBase & {
  type: "color";
  defaultValue?: string;
};

export type TemplateFieldDef =
  | TextField
  | SelectField
  | ToggleField
  | ColorField;

export type TemplateContentSectionKey =
  | "profile-image"
  | "schedule-call"
  | "resume-link"
  | "experience"
  | "recent-projects"
  | "gallery";

export type TemplateContentSectionDef = {
  key: TemplateContentSectionKey;
  label: string;
  description: string;
  maxItems?: number;
};

const THEME_MODE_FIELD: SelectField = {
  key: "defaultMode",
  label: "Default theme mode",
  type: "select",
  options: [
    { value: "dark", label: "Dark" },
    { value: "light", label: "Light" },
  ],
  defaultValue: "dark",
};

export const TEMPLATE_FIELD_REGISTRY: Record<TemplateSlug, TemplateFieldDef[]> = {
  nova: [
    THEME_MODE_FIELD,
    {
      key: "heroTagline",
      label: "Hero tagline",
      type: "text",
      placeholder: "Building the future, one commit at a time.",
      description:
        "Short line displayed beneath your name in the hero section. Leave blank to hide it.",
      defaultValue: "",
    },
    {
      key: "accentColor",
      label: "Accent color",
      type: "color",
      description: "Overrides the gold accent used for highlights and links.",
      defaultValue: "#c9a96e",
    },
  ],
  vertex: [
    THEME_MODE_FIELD,
    {
      key: "yearsOfExperience",
      label: "Years of experience",
      type: "text",
      placeholder: "5+",
      description:
        "Shown as a stat in the resume card. Leave blank to hide it.",
      defaultValue: "",
    },
    {
      key: "openSourceStars",
      label: "Open source stars",
      type: "text",
      placeholder: "1.2k",
      description: "GitHub stars to show as a stat. Leave blank to hide it.",
      defaultValue: "",
    },
    {
      key: "showVerifiedBadge",
      label: "Show verified badge",
      type: "toggle",
      description: "Displays the blue verified badge next to the avatar.",
      defaultValue: true,
    },
  ],
  drift: [
    THEME_MODE_FIELD,
    {
      key: "sidebarTagline",
      label: "Sidebar tagline",
      type: "text",
      placeholder:
        "Crafting pixel-perfect, accessible interfaces for the modern web.",
      description:
        "Extra line shown in the sticky sidebar below your bio. Leave blank to use your short intro.",
      defaultValue: "",
    },
    {
      key: "accentColor",
      label: "Accent color",
      type: "color",
      description: "Overrides the teal accent used for highlights and links.",
      defaultValue: "#5eead4",
    },
  ],
};

export const TEMPLATE_CONTENT_REGISTRY: Record<
  TemplateSlug,
  TemplateContentSectionDef[]
> = {
  nova: [
    {
      key: "resume-link",
      label: "Resume link",
      description:
        "Point Nova's resume panel to a public PDF, Drive link, or hosted resume page.",
    },
    {
      key: "experience",
      label: "Experience entries",
      description:
        "These entries populate Nova's timeline section in order.",
    },
    {
      key: "gallery",
      label: "Gallery",
      description:
        "Add the images shown in Nova's gallery section.",
      maxItems: GALLERY_IMAGE_LIMIT,
    },
  ],
  vertex: [
    {
      key: "profile-image",
      label: "Profile image",
      description:
        "Used in the hero avatar. Leave blank to keep the default icon fallback.",
    },
    {
      key: "schedule-call",
      label: "Schedule a call",
      description:
        "Accepts a scheduling URL or a phone number for the primary CTA.",
    },
    {
      key: "experience",
      label: "Experience entries",
      description:
        "These entries populate the experience bento card.",
    },
    {
      key: "recent-projects",
      label: "Recent projects",
      description:
        "Add extra project cards that appear alongside your featured project.",
    },
    {
      key: "gallery",
      label: "Gallery",
      description:
        "Add the images shown in Vertex's gallery section.",
      maxItems: GALLERY_IMAGE_LIMIT,
    },
  ],
  drift: [
    {
      key: "experience",
      label: "Experience entries",
      description:
        "These entries power Drift's experience timeline.",
    },
    {
      key: "resume-link",
      label: "Resume link",
      description:
        "Point Drift's resume section to a public PDF, Drive link, or hosted resume page.",
    },
    {
      key: "recent-projects",
      label: "Recent projects",
      description:
        "Add extra project cards that appear after your featured project.",
    },
    {
      key: "gallery",
      label: "Gallery",
      description:
        "Add the images shown in Drift's gallery section.",
      maxItems: GALLERY_IMAGE_LIMIT,
    },
  ],
};

export function getTemplateFields(slug: TemplateSlug): TemplateFieldDef[] {
  return TEMPLATE_FIELD_REGISTRY[slug] ?? [];
}

export function getTemplateContentSections(
  slug: TemplateSlug,
): TemplateContentSectionDef[] {
  return TEMPLATE_CONTENT_REGISTRY[slug] ?? [];
}

export function getTemplateSettingsDefaults(
  slug: TemplateSlug,
): Record<string, unknown> {
  return Object.fromEntries(
    getTemplateFields(slug)
      .filter((field) => field.defaultValue !== undefined)
      .map((field) => [field.key, field.defaultValue]),
  );
}
