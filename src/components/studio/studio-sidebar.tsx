"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import type { BuilderFormState } from "@/app/actions";
import { TemplateSettingsFields } from "@/components/builder/template-settings-fields";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  availabilityOptions,
  type PortfolioFormValues,
} from "@/lib/portfolio-schema";
import { getTemplateFields } from "@/lib/template-field-registry";
import type { PortfolioTemplate, TemplateSlug } from "@/lib/template-catalog";

type SidebarProps = {
  clerkEnabled: boolean;
  formValues: PortfolioFormValues;
  isReady: boolean;
  templateSettings: Record<string, unknown>;
  templates: readonly PortfolioTemplate[];
  onFieldChange: <K extends keyof PortfolioFormValues>(
    key: K,
    value: PortfolioFormValues[K],
  ) => void;
  onTemplateSettingChange: (key: string, value: unknown) => void;
  onTemplateSwitch: (slug: TemplateSlug) => void;
  onSave: () => void;
  isSaving: boolean;
  saveState: BuilderFormState;
};

function Section({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between px-5 py-3.5 text-left transition hover:bg-white/[0.03]"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          {title}
        </span>
        <ChevronDown
          className={`size-4 text-white/30 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open ? <div className="space-y-4 px-5 pb-5 pt-1">{children}</div> : null}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-xs font-medium text-white/50">
        {label}
      </label>
      {children}
    </div>
  );
}

const fieldClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/20 outline-none transition focus:border-white/25 focus:bg-white/8 focus:ring-1 focus:ring-white/10";

function getPreviewPath(previewUrl: string) {
  if (typeof window === "undefined") {
    return previewUrl;
  }

  try {
    return new URL(previewUrl, window.location.origin).pathname;
  } catch {
    return previewUrl;
  }
}

export function StudioSidebar({
  clerkEnabled,
  formValues,
  isReady,
  templateSettings,
  templates,
  onFieldChange,
  onTemplateSettingChange,
  onTemplateSwitch,
  onSave,
  isSaving,
  saveState,
}: SidebarProps) {
  const templateFields = getTemplateFields(formValues.templateSlug);

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div className="border-b border-white/5 p-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30">
          Template
        </p>
        <div className="grid grid-cols-3 gap-2">
          {templates.map((template) => (
            <button
              key={template.slug}
              type="button"
              onClick={() => onTemplateSwitch(template.slug)}
              className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition ${
                formValues.templateSlug === template.slug
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-white/8 bg-white/3 text-white/40 hover:border-white/15 hover:text-white/70"
              }`}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Section title="Identity" defaultOpen>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Full name" htmlFor="sf-name">
              <Input
                id="sf-name"
                placeholder="Alex Chen"
                value={formValues.name}
                onChange={(event) => onFieldChange("name", event.target.value)}
                className={fieldClass}
              />
            </Field>
            <Field label="Slug" htmlFor="sf-slug">
              <Input
                id="sf-slug"
                placeholder="alex-chen"
                value={formValues.slug}
                onChange={(event) => onFieldChange("slug", event.target.value)}
                className={fieldClass}
              />
            </Field>
          </div>

          <Field label="Professional title" htmlFor="sf-title">
            <Input
              id="sf-title"
              placeholder="Full-Stack Engineer"
              value={formValues.title}
              onChange={(event) => onFieldChange("title", event.target.value)}
              className={fieldClass}
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Location" htmlFor="sf-location">
              <Input
                id="sf-location"
                placeholder="San Francisco, CA"
                value={formValues.location}
                onChange={(event) => onFieldChange("location", event.target.value)}
                className={fieldClass}
              />
            </Field>
            <Field label="Email" htmlFor="sf-email">
              <Input
                id="sf-email"
                type="email"
                placeholder="alex@example.dev"
                value={formValues.email}
                onChange={(event) => onFieldChange("email", event.target.value)}
                className={fieldClass}
              />
            </Field>
          </div>

          <Field label="Availability" htmlFor="sf-availability">
            <select
              id="sf-availability"
              className={fieldClass}
              value={formValues.availability}
              onChange={(event) =>
                onFieldChange(
                  "availability",
                  event.target.value as PortfolioFormValues["availability"],
                )
              }
            >
              {availabilityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        </Section>

        <Section title="Story">
          <Field label="Short intro" htmlFor="sf-bio">
            <Textarea
              id="sf-bio"
              placeholder="One or two punchy sentences about what you do."
              value={formValues.bio}
              onChange={(event) => onFieldChange("bio", event.target.value)}
              className={`${fieldClass} min-h-20`}
            />
          </Field>

          <Field label="About" htmlFor="sf-about">
            <Textarea
              id="sf-about"
              placeholder="Tell visitors how you work, what you care about, and what kind of problems you solve."
              value={formValues.about}
              onChange={(event) => onFieldChange("about", event.target.value)}
              className={`${fieldClass} min-h-32`}
            />
          </Field>

          <Field label="Skills" htmlFor="sf-skills">
            <Input
              id="sf-skills"
              placeholder="React, TypeScript, Node.js, PostgreSQL"
              value={formValues.skills}
              onChange={(event) => onFieldChange("skills", event.target.value)}
              className={fieldClass}
            />
          </Field>
        </Section>

        <Section title="Links">
          <Field label="GitHub URL" htmlFor="sf-github">
            <Input
              id="sf-github"
              placeholder="https://github.com/you"
              value={formValues.githubUrl}
              onChange={(event) => onFieldChange("githubUrl", event.target.value)}
              className={fieldClass}
            />
          </Field>

          <Field label="LinkedIn URL" htmlFor="sf-linkedin">
            <Input
              id="sf-linkedin"
              placeholder="https://linkedin.com/in/you"
              value={formValues.linkedinUrl}
              onChange={(event) => onFieldChange("linkedinUrl", event.target.value)}
              className={fieldClass}
            />
          </Field>

          <Field label="Personal site" htmlFor="sf-website">
            <Input
              id="sf-website"
              placeholder="https://yoursite.dev"
              value={formValues.websiteUrl}
              onChange={(event) => onFieldChange("websiteUrl", event.target.value)}
              className={fieldClass}
            />
          </Field>
        </Section>

        <Section title="Featured project">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Project name" htmlFor="sf-project-name">
              <Input
                id="sf-project-name"
                placeholder="Awesome App"
                value={formValues.featuredProjectName}
                onChange={(event) =>
                  onFieldChange("featuredProjectName", event.target.value)
                }
                className={fieldClass}
              />
            </Field>
            <Field label="Stack" htmlFor="sf-project-stack">
              <Input
                id="sf-project-stack"
                placeholder="Next.js, Supabase"
                value={formValues.featuredProjectStack}
                onChange={(event) =>
                  onFieldChange("featuredProjectStack", event.target.value)
                }
                className={fieldClass}
              />
            </Field>
          </div>

          <Field label="Project summary" htmlFor="sf-project-summary">
            <Textarea
              id="sf-project-summary"
              placeholder="What does it do and why does it matter?"
              value={formValues.featuredProjectSummary}
              onChange={(event) =>
                onFieldChange("featuredProjectSummary", event.target.value)
              }
              className={`${fieldClass} min-h-24`}
            />
          </Field>

          <Field label="Project URL" htmlFor="sf-project-url">
            <Input
              id="sf-project-url"
              placeholder="https://yourproject.dev"
              value={formValues.featuredProjectUrl}
              onChange={(event) =>
                onFieldChange("featuredProjectUrl", event.target.value)
              }
              className={fieldClass}
            />
          </Field>
        </Section>

        {templateFields.length > 0 ? (
          <Section title={`${formValues.templateSlug} settings`}>
            <TemplateSettingsFields
              fields={templateFields}
              values={templateSettings}
              onChange={onTemplateSettingChange}
            />
          </Section>
        ) : null}
      </div>

      <div className="space-y-3 border-t border-white/5 p-4">
        {saveState.status !== "idle" ? (
          <p
            className={`rounded-lg px-3 py-2 text-xs leading-5 ${
              saveState.status === "success"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {saveState.message}
            {saveState.previewUrl ? (
              <a href={getPreviewPath(saveState.previewUrl)} className="ml-2 underline">
                Open {"->"}
              </a>
            ) : null}
          </p>
        ) : null}

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || !isReady}
          className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-accent-foreground transition hover:bg-accent-strong disabled:opacity-50"
        >
          {!isReady
            ? "Loading draft..."
            : isSaving
              ? "Saving..."
              : clerkEnabled
                ? "Save & Publish"
                : "Save draft"}
        </button>

        <p className="text-center text-[11px] text-white/25">
          {clerkEnabled
            ? "Your draft stays local until you sign in and publish."
            : "Your draft stays local until auth is configured."}
        </p>
      </div>
    </div>
  );
}
