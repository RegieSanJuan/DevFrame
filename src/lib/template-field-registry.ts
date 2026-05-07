import type { TemplateSlug } from "@/lib/template-catalog";

// ─── Field type definitions ──────────────────────────────────────────────────

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

export type TemplateFieldDef = TextField | SelectField | ToggleField | ColorField;

// ─── Shared field definitions ─────────────────────────────────────────────────

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

// ─── Per-template field schemas ───────────────────────────────────────────────

export const TEMPLATE_FIELD_REGISTRY: Record<TemplateSlug, TemplateFieldDef[]> = {
  nova: [
    THEME_MODE_FIELD,
    {
      key: "heroTagline",
      label: "Hero tagline",
      type: "text",
      placeholder: "Building the future, one commit at a time.",
      description:
        "Short punchy line displayed beneath your name in the hero section. Leave blank to hide.",
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
        "Shown as a stat in the resume card (e.g. '5+', '8 years'). Leave blank to hide.",
      defaultValue: "",
    },
    {
      key: "openSourceStars",
      label: "Open source stars",
      type: "text",
      placeholder: "1.2k",
      description: "GitHub stars to show as a stat. Leave blank to hide.",
      defaultValue: "",
    },
    {
      key: "showVerifiedBadge",
      label: "Show verified badge",
      type: "toggle",
      description: "Displays the blue verified badge next to your avatar.",
      defaultValue: true,
    },
  ],

  drift: [
    THEME_MODE_FIELD,
    {
      key: "sidebarTagline",
      label: "Sidebar tagline",
      type: "text",
      placeholder: "Crafting pixel-perfect, accessible interfaces for the modern web.",
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getTemplateFields(slug: TemplateSlug): TemplateFieldDef[] {
  return TEMPLATE_FIELD_REGISTRY[slug] ?? [];
}

export function getTemplateSettingsDefaults(
  slug: TemplateSlug,
): Record<string, unknown> {
  return Object.fromEntries(
    getTemplateFields(slug)
      .filter((f) => f.defaultValue !== undefined)
      .map((f) => [f.key, f.defaultValue]),
  );
}
