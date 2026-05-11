"use client";

import { ImagePlus, Plus, RefreshCcw, Trash2, Upload } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioImageUploadControls } from "@/hooks/use-portfolio-image-uploads";
import {
  GALLERY_IMAGE_LIMIT,
  type ExperienceItem,
  type PortfolioFormValues,
  type RecentProjectItem,
} from "@/lib/portfolio-schema";
import {
  isRenderableImageSrc,
} from "@/lib/portfolio-image-uploads";
import {
  getTemplateContentSections,
  type TemplateContentSectionDef,
} from "@/lib/template-field-registry";
import type { TemplateSlug } from "@/lib/template-catalog";
import { cn } from "@/lib/utils";

type PortfolioContentFieldsProps = {
  templateSlug: TemplateSlug;
  values: PortfolioFormValues;
  onFieldChange: <K extends keyof PortfolioFormValues>(
    key: K,
    value: PortfolioFormValues[K],
  ) => void;
  imageUploads: PortfolioImageUploadControls;
  variant?: "builder" | "studio";
  showIntro?: boolean;
};

const EMPTY_EXPERIENCE: ExperienceItem = {
  year: "",
  role: "",
  company: "",
};

const EMPTY_RECENT_PROJECT: RecentProjectItem = {
  name: "",
  summary: "",
  stack: "",
  projectUrl: "",
};

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-semibold text-foreground">
      {children}
    </label>
  );
}

function SectionShell({
  definition,
  variant,
  count,
  children,
}: {
  definition: TemplateContentSectionDef;
  variant: "builder" | "studio";
  count?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "space-y-4 rounded-2xl border p-4",
        variant === "studio"
          ? "border-white/8 bg-white/[0.02]"
          : "border-border bg-surface-soft",
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-foreground">{definition.label}</p>
          {count ? (
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground-soft">
              {count}
            </span>
          ) : null}
        </div>
        <p className="text-xs leading-5 text-foreground-muted">
          {definition.description}
        </p>
      </div>
      {children}
    </div>
  );
}

function ItemShell({
  title,
  variant,
  onRemove,
  children,
}: {
  title: string;
  variant: "builder" | "studio";
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "space-y-4 rounded-2xl border p-4",
        variant === "studio"
          ? "border-white/8 bg-black/20"
          : "border-border bg-background",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={onRemove}
          className="text-foreground-muted"
        >
          <Trash2 className="size-3.5" />
          Remove
        </Button>
      </div>
      {children}
    </div>
  );
}

function getInputClassName(variant: "builder" | "studio") {
  return variant === "studio" ? "bg-surface-inset focus:bg-surface" : "";
}

function getDropzoneClassName(variant: "builder" | "studio", disabled?: boolean) {
  return cn(
    "group rounded-2xl border border-dashed p-4 transition",
    disabled
      ? "cursor-not-allowed opacity-60"
      : "cursor-pointer hover:border-accent/40 hover:bg-accent/5",
    variant === "studio"
      ? "border-white/10 bg-black/20"
      : "border-border bg-background/80",
  );
}

function updateArrayItem<TItem>(
  items: TItem[],
  index: number,
  updater: (item: TItem) => TItem,
) {
  return items.map((item, itemIndex) =>
    itemIndex === index ? updater(item) : item,
  );
}

function PreviewImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  if (!isRenderableImageSrc(src)) {
    return null;
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={className} />
    </>
  );
}

function UploadPicker({
  accept,
  multiple = false,
  onFilesSelected,
  children,
  className,
}: {
  accept: string;
  multiple?: boolean;
  onFilesSelected: (files: FileList | null) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(event) => {
          onFilesSelected(event.target.files);
          event.currentTarget.value = "";
        }}
      />
      <Button
        type="button"
        variant="secondary"
        size="xs"
        className={className}
        onClick={() => inputRef.current?.click()}
      >
        {children}
      </Button>
    </>
  );
}

function UploadDropzone({
  variant,
  accept,
  multiple = false,
  disabled = false,
  onFilesSelected,
  children,
}: {
  variant: "builder" | "studio";
  accept: string;
  multiple?: boolean;
  disabled?: boolean;
  onFilesSelected: (files: FileList | null) => void;
  children: React.ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(event) => {
          onFilesSelected(event.target.files);
          event.currentTarget.value = "";
        }}
      />
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        className={getDropzoneClassName(variant, disabled)}
        onClick={() => {
          if (!disabled) {
            inputRef.current?.click();
          }
        }}
        onKeyDown={(event) => {
          if (disabled) {
            return;
          }

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          if (!disabled) {
            event.preventDefault();
          }
        }}
        onDrop={(event) => {
          if (disabled) {
            return;
          }

          event.preventDefault();
          onFilesSelected(event.dataTransfer.files);
        }}
      >
        {children}
      </div>
    </>
  );
}

export function PortfolioContentFields({
  templateSlug,
  values,
  onFieldChange,
  imageUploads,
  variant = "builder",
  showIntro = true,
}: PortfolioContentFieldsProps) {
  const sections = getTemplateContentSections(templateSlug);
  const inputClassName = getInputClassName(variant);

  if (sections.length === 0) {
    return null;
  }

  const renderSection = (definition: TemplateContentSectionDef) => {
    switch (definition.key) {
      case "resume-link":
        return (
          <SectionShell key={definition.key} definition={definition} variant={variant}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <FieldLabel htmlFor={`${templateSlug}-resume-url`}>
                  Public resume URL
                </FieldLabel>
                <Input
                  id={`${templateSlug}-resume-url`}
                  type="url"
                  placeholder="resume.yoursite.dev or drive.google.com/..."
                  value={values.resumeUrl}
                  onChange={(event) =>
                    onFieldChange("resumeUrl", event.target.value)
                  }
                  className={inputClassName}
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor={`${templateSlug}-resume-label`}>
                  Button label
                </FieldLabel>
                <Input
                  id={`${templateSlug}-resume-label`}
                  placeholder="Open resume"
                  value={values.resumeLabel}
                  onChange={(event) =>
                    onFieldChange("resumeLabel", event.target.value)
                  }
                  className={inputClassName}
                />
              </div>
            </div>
          </SectionShell>
        );

      case "profile-image":
        return (
          <SectionShell key={definition.key} definition={definition} variant={variant}>
            <div className="grid gap-4 md:grid-cols-[minmax(0,220px)_1fr]">
              <div className="space-y-3">
                <UploadDropzone
                  variant={variant}
                  accept={imageUploads.accept}
                  onFilesSelected={imageUploads.profile.selectFiles}
                >
                  <div className="space-y-3">
                    <div className="overflow-hidden rounded-xl border border-border/60 bg-surface-inset">
                      {isRenderableImageSrc(imageUploads.profile.previewSrc) ? (
                        <PreviewImage
                          src={imageUploads.profile.previewSrc}
                          alt={values.profileImageAlt || `${values.name || "Portfolio"} profile image`}
                          className="aspect-square h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex aspect-square items-center justify-center text-foreground-soft">
                          <ImagePlus className="size-8" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        {isRenderableImageSrc(imageUploads.profile.previewSrc)
                          ? "Profile image ready"
                          : "Upload a profile image"}
                      </p>
                      <p className="text-xs leading-5 text-foreground-muted">
                        JPG, PNG, or WEBP up to {imageUploads.maxSizeLabel}.
                      </p>
                    </div>
                  </div>
                </UploadDropzone>
                <div className="flex flex-wrap gap-2">
                  <UploadPicker
                    accept={imageUploads.accept}
                    onFilesSelected={imageUploads.profile.selectFiles}
                  >
                    <Upload className="size-3.5" />
                    {isRenderableImageSrc(imageUploads.profile.previewSrc)
                      ? "Replace image"
                      : "Choose image"}
                  </UploadPicker>
                  {isRenderableImageSrc(imageUploads.profile.previewSrc) ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={imageUploads.profile.remove}
                      className="text-foreground-muted"
                    >
                      <Trash2 className="size-3.5" />
                      Remove
                    </Button>
                  ) : null}
                </div>
                {imageUploads.profile.error ? (
                  <p className="text-xs text-danger">{imageUploads.profile.error}</p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor={`${templateSlug}-profile-alt`}>
                  Image alt text
                </FieldLabel>
                <Input
                  id={`${templateSlug}-profile-alt`}
                  placeholder="Portrait of Alex Chen"
                  value={values.profileImageAlt}
                  onChange={(event) =>
                    onFieldChange("profileImageAlt", event.target.value)
                  }
                  className={inputClassName}
                />
                <p className="text-xs leading-5 text-foreground-muted">
                  This description helps screen readers and gives templates a clean
                  fallback when the image fails to load.
                </p>
              </div>
            </div>
          </SectionShell>
        );

      case "schedule-call":
        return (
          <SectionShell key={definition.key} definition={definition} variant={variant}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <FieldLabel htmlFor={`${templateSlug}-call-link`}>
                  Call link or number
                </FieldLabel>
                <Input
                  id={`${templateSlug}-call-link`}
                  type="text"
                  placeholder="cal.com/you or +1 555 123 4567"
                  value={values.scheduleCallHref}
                  onChange={(event) =>
                    onFieldChange("scheduleCallHref", event.target.value)
                  }
                  className={inputClassName}
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor={`${templateSlug}-call-label`}>
                  Button label
                </FieldLabel>
                <Input
                  id={`${templateSlug}-call-label`}
                  placeholder="Schedule a call"
                  value={values.scheduleCallLabel}
                  onChange={(event) =>
                    onFieldChange("scheduleCallLabel", event.target.value)
                  }
                  className={inputClassName}
                />
              </div>
            </div>
          </SectionShell>
        );

      case "experience":
        return (
          <SectionShell
            key={definition.key}
            definition={definition}
            variant={variant}
            count={`${values.experience.length} entries`}
          >
            <div className="space-y-3">
              {values.experience.map((entry, index) => (
                <ItemShell
                  key={`experience-${index}`}
                  title={`Experience ${index + 1}`}
                  variant={variant}
                  onRemove={() =>
                    onFieldChange(
                      "experience",
                      values.experience.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                >
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1.5">
                      <FieldLabel htmlFor={`experience-year-${index}`}>
                        Year or range
                      </FieldLabel>
                      <Input
                        id={`experience-year-${index}`}
                        placeholder="2024 - Present"
                        value={entry.year}
                        onChange={(event) =>
                          onFieldChange(
                            "experience",
                            updateArrayItem(values.experience, index, (item) => ({
                              ...item,
                              year: event.target.value,
                            })),
                          )
                        }
                        className={inputClassName}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel htmlFor={`experience-role-${index}`}>Role</FieldLabel>
                      <Input
                        id={`experience-role-${index}`}
                        placeholder="Senior Frontend Engineer"
                        value={entry.role}
                        onChange={(event) =>
                          onFieldChange(
                            "experience",
                            updateArrayItem(values.experience, index, (item) => ({
                              ...item,
                              role: event.target.value,
                            })),
                          )
                        }
                        className={inputClassName}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel htmlFor={`experience-company-${index}`}>
                        Company
                      </FieldLabel>
                      <Input
                        id={`experience-company-${index}`}
                        placeholder="DevFrame"
                        value={entry.company}
                        onChange={(event) =>
                          onFieldChange(
                            "experience",
                            updateArrayItem(values.experience, index, (item) => ({
                              ...item,
                              company: event.target.value,
                            })),
                          )
                        }
                        className={inputClassName}
                      />
                    </div>
                  </div>
                </ItemShell>
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              size="xs"
              onClick={() =>
                onFieldChange("experience", [...values.experience, EMPTY_EXPERIENCE])
              }
            >
              <Plus className="size-3.5" />
              Add experience entry
            </Button>
          </SectionShell>
        );

      case "recent-projects":
        return (
          <SectionShell
            key={definition.key}
            definition={definition}
            variant={variant}
            count={`${values.recentProjects.length} added`}
          >
            <div className="space-y-3">
              {values.recentProjects.map((project, index) => (
                <ItemShell
                  key={`recent-project-${index}`}
                  title={`Recent project ${index + 1}`}
                  variant={variant}
                  onRemove={() =>
                    onFieldChange(
                      "recentProjects",
                      values.recentProjects.filter(
                        (_, itemIndex) => itemIndex !== index,
                      ),
                    )
                  }
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <FieldLabel htmlFor={`recent-project-name-${index}`}>
                        Project name
                      </FieldLabel>
                      <Input
                        id={`recent-project-name-${index}`}
                        placeholder="Systems Atlas"
                        value={project.name}
                        onChange={(event) =>
                          onFieldChange(
                            "recentProjects",
                            updateArrayItem(values.recentProjects, index, (item) => ({
                              ...item,
                              name: event.target.value,
                            })),
                          )
                        }
                        className={inputClassName}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel htmlFor={`recent-project-stack-${index}`}>
                        Stack
                      </FieldLabel>
                      <Input
                        id={`recent-project-stack-${index}`}
                        placeholder="Next.js, Supabase, Tailwind CSS"
                        value={project.stack}
                        onChange={(event) =>
                          onFieldChange(
                            "recentProjects",
                            updateArrayItem(values.recentProjects, index, (item) => ({
                              ...item,
                              stack: event.target.value,
                            })),
                          )
                        }
                        className={inputClassName}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <FieldLabel htmlFor={`recent-project-summary-${index}`}>
                      Summary
                    </FieldLabel>
                    <Textarea
                      id={`recent-project-summary-${index}`}
                      placeholder="What does it do and why should it be part of your portfolio story?"
                      value={project.summary}
                      onChange={(event) =>
                        onFieldChange(
                          "recentProjects",
                          updateArrayItem(values.recentProjects, index, (item) => ({
                            ...item,
                            summary: event.target.value,
                          })),
                        )
                      }
                      className={cn("min-h-24", inputClassName)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <FieldLabel htmlFor={`recent-project-url-${index}`}>
                      Project URL
                    </FieldLabel>
                    <Input
                      id={`recent-project-url-${index}`}
                      type="url"
                      placeholder="project.example.com"
                      value={project.projectUrl}
                      onChange={(event) =>
                        onFieldChange(
                          "recentProjects",
                          updateArrayItem(values.recentProjects, index, (item) => ({
                            ...item,
                            projectUrl: event.target.value,
                          })),
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                </ItemShell>
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              size="xs"
              onClick={() =>
                onFieldChange("recentProjects", [
                  ...values.recentProjects,
                  EMPTY_RECENT_PROJECT,
                ])
              }
            >
              <Plus className="size-3.5" />
              Add recent project
            </Button>
          </SectionShell>
        );

      case "gallery": {
        const hasReachedLimit = values.galleryImages.length >= GALLERY_IMAGE_LIMIT;

        return (
          <SectionShell
            key={definition.key}
            definition={definition}
            variant={variant}
            count={`${values.galleryImages.length}/${GALLERY_IMAGE_LIMIT} images`}
          >
            <div className="space-y-3">
              {values.galleryImages.map((image, index) => {
                const previewSrc = imageUploads.gallery.previewSrcFor(index, image.src);

                return (
                  <ItemShell
                    key={`gallery-image-${index}`}
                    title={`Gallery image ${index + 1}`}
                    variant={variant}
                    onRemove={() => imageUploads.gallery.remove(index)}
                  >
                    <div className="grid gap-4 md:grid-cols-[minmax(0,180px)_1fr]">
                      <div className="space-y-3">
                        <div className="overflow-hidden rounded-xl border border-border/60 bg-surface-inset">
                          {isRenderableImageSrc(previewSrc) ? (
                            <PreviewImage
                              src={previewSrc}
                              alt={image.alt || `Gallery image ${index + 1}`}
                              className="aspect-square h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex aspect-square items-center justify-center text-foreground-soft">
                              <ImagePlus className="size-8" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <UploadPicker
                            accept={imageUploads.accept}
                            onFilesSelected={(files) =>
                              imageUploads.gallery.replaceFile(index, files)
                            }
                          >
                            <RefreshCcw className="size-3.5" />
                            Replace image
                          </UploadPicker>
                          <Button
                            type="button"
                            variant="ghost"
                            size="xs"
                            onClick={() => imageUploads.gallery.remove(index)}
                            className="text-foreground-muted"
                          >
                            <Trash2 className="size-3.5" />
                            Remove
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <FieldLabel htmlFor={`gallery-alt-${index}`}>
                          Image alt text
                        </FieldLabel>
                        <Input
                          id={`gallery-alt-${index}`}
                          placeholder="Dashboard view of the analytics workspace"
                          value={image.alt}
                          onChange={(event) =>
                            onFieldChange(
                              "galleryImages",
                              updateArrayItem(values.galleryImages, index, (item) => ({
                                ...item,
                                alt: event.target.value,
                              })),
                            )
                          }
                          className={inputClassName}
                        />
                        <p className="text-xs leading-5 text-foreground-muted">
                          {imageUploads.gallery.hasPendingUploadAt(index)
                            ? "This image will upload on save."
                            : "Use a short description so the gallery still reads well for screen readers."}
                        </p>
                      </div>
                    </div>
                  </ItemShell>
                );
              })}
            </div>
            <div className="space-y-3">
              <UploadDropzone
                variant={variant}
                accept={imageUploads.accept}
                multiple
                disabled={hasReachedLimit}
                onFilesSelected={imageUploads.gallery.addFiles}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      Upload gallery images
                    </p>
                    <p className="text-xs leading-5 text-foreground-muted">
                      Drag images here or click to choose files. JPG, PNG, or WEBP
                      up to {imageUploads.maxSizeLabel}.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1.5 text-xs font-semibold text-foreground-soft">
                    <Upload className="size-3.5" />
                    Add images
                  </div>
                </div>
              </UploadDropzone>
              {imageUploads.gallery.error ? (
                <p className="text-xs text-danger">{imageUploads.gallery.error}</p>
              ) : null}
              <p
                className={cn(
                  "text-xs",
                  hasReachedLimit ? "text-warning" : "text-foreground-muted",
                )}
              >
                {hasReachedLimit
                  ? "Gallery limit reached. Remove an image before adding another."
                  : `Add up to ${GALLERY_IMAGE_LIMIT} images per portfolio.`}
              </p>
            </div>
          </SectionShell>
        );
      }

      default:
        return null;
    }
  };

  return (
    <section className="space-y-4">
      {showIntro ? (
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground-soft">
            Template content
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground-muted">
            Add the extra content blocks this template knows how to present.
          </p>
        </div>
      ) : null}
      <div className="space-y-4">{sections.map(renderSection)}</div>
    </section>
  );
}
