"use client";

import { GitHubIcon, LinkedInIcon } from "@/components/brand-icons";
import {
  filterRenderableGalleryImages,
  isRenderableImageSrc,
} from "@/lib/portfolio-image-uploads";
import { getDisplayProjects } from "@/lib/portfolio-schema";
import { TemplateGallery } from "@/templates/base-components";
import type { TemplateComponentProps } from "@/templates/registry";
import { registerTemplate } from "@/templates/registry";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Code2,
  ExternalLink,
  MapPin,
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";

function BentoCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[var(--vertex-border)] bg-[var(--vertex-bg)] backdrop-blur-md p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-lg hover:border-[var(--vertex-accent)]/25 md:p-8 ${className}`}
      style={{ WebkitBackdropFilter: "blur(12px)" }}
    >
      {children}
    </div>
  );
}

function VertexTemplate({ portfolio }: TemplateComponentProps) {
  // ── Template-specific settings (safe defaults = existing visual) ──
  type VertexSettings = {
    defaultMode?: "dark" | "light";
    yearsOfExperience?: string;
    openSourceStars?: string;
    showVerifiedBadge?: boolean;
  };
  const ts = (portfolio.templateSettings ?? {}) as VertexSettings;

  const [mode, setMode] = useState<"dark" | "light">(ts.defaultMode ?? "dark");

  const toggleTheme = () => {
    setMode((value) => (value === "dark" ? "light" : "dark"));
  };

  const renderThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 shrink-0"
      style={{ backgroundColor: "var(--vertex-toggle-bg)" }}
      aria-label="Toggle theme"
    >
      <div
        className={`absolute left-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 ${mode === "light" ? "translate-x-0" : "translate-x-5"}`}
      >
        {mode === "light" ? (
          <Sun className="h-3 w-3 text-orange-500" />
        ) : (
          <Moon className="h-3 w-3 text-gray-600" />
        )}
      </div>
    </button>
  );

  const galleryImages = filterRenderableGalleryImages(portfolio.galleryImages);
  const projectCards = getDisplayProjects(portfolio).slice(0, 3); // Limit to 3 total (featured + max 2 recent)
  const scheduleCallHref = portfolio.scheduleCall?.href || `mailto:${portfolio.email}`;
  const scheduleCallLabel = portfolio.scheduleCall?.label || "Schedule a Call";
  const hasExperience = Boolean(portfolio.experience?.length);
  const profileImage = portfolio.profileImage;

  const themeStyles =
    mode === "dark"
      ? ({
        "--vertex-root-bg": "#090a0f", // Sleek dark obsidian
        "--vertex-bg": "rgba(22, 24, 33, 0.7)", // Beautiful glass slate
        "--vertex-border": "rgba(255, 255, 255, 0.06)", // Soft glowing white border
        "--vertex-text-main": "#f3f4f6", // Off-white clean text
        "--vertex-text-muted": "#9ca3af", // Elegant slate gray
        "--vertex-accent": "#6366f1", // Deep indigo accent
        "--vertex-toggle-bg": "#1e293b",
      } as React.CSSProperties)
      : ({
        "--vertex-root-bg": "#f8fafc", // Modern off-white slate background
        "--vertex-bg": "rgba(255, 255, 255, 0.95)", // High contrast white card
        "--vertex-border": "rgba(15, 23, 42, 0.06)", // Light border
        "--vertex-text-main": "#0f172a", // Premium dark slate text
        "--vertex-text-muted": "#64748b", // Soft dark gray
        "--vertex-accent": "#4f46e5", // Rich deep indigo accent
        "--vertex-toggle-bg": "#e2e8f0",
      } as React.CSSProperties);

  return (
    <div
      style={themeStyles}
      className="@container min-h-screen bg-[var(--vertex-root-bg)] text-[var(--vertex-text-main)] transition-colors duration-500"
    >
      <div className="mx-auto max-w-5xl px-4 @sm:px-6 py-8 @md:px-10 @md:py-12 @lg:px-12 @lg:py-14">
        <section className="@md:mb-10 @lg:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col @sm:flex-row items-center @sm:items-start gap-6 @sm:gap-4 @md:gap-6 text-center @sm:text-left">
            <div className="relative flex-shrink-0 mx-auto @sm:mx-0">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-[var(--vertex-border)] bg-[var(--vertex-bg)] @md:h-40 @md:w-40">
                {profileImage && isRenderableImageSrc(profileImage.src) ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profileImage.src}
                      alt={profileImage.alt}
                      className="h-full w-full object-cover"
                    />
                  </>
                ) : (
                  <Code2
                    className="h-12 w-12 opacity-20"
                    style={{ color: "var(--vertex-text-main)" }}
                  />
                )}
              </div>
              <div
                className="absolute -bottom-1 -right-1"
              >
                {(ts.showVerifiedBadge ?? true) && (
                  <CheckCircle2
                    className="h-6 w-6"
                    style={{
                      color: "var(--vertex-accent)",
                      fill: "color-mix(in srgb, var(--vertex-accent) 10%, transparent)",
                    }}
                  />
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1 w-full">
              <div className="flex flex-row items-center justify-between @sm:justify-start @md:justify-between gap-4">
                <div className="min-w-0 flex flex-col items-center @sm:items-start w-full @sm:w-auto">
                  <div className="flex items-center justify-center @sm:justify-start gap-3 w-full @sm:w-auto">
                    <h1 className="truncate text-2xl font-bold @md:text-3xl">
                      {portfolio.name}
                    </h1>
                  </div>
                  <p
                    className="mt-1 flex items-center justify-center @sm:justify-start gap-1 text-sm w-full"
                    style={{ color: "var(--vertex-text-muted)" }}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{portfolio.location}</span>
                  </p>
                </div>

                <div className="hidden @sm:block">
                  {renderThemeToggle()}
                </div>
              </div>

              <p
                className="mt-3 text-sm @md:text-base text-center @sm:text-left"
                style={{ color: "var(--vertex-text-muted)" }}
              >
                {portfolio.title}
              </p>

              {/* Mobile theme toggle */}
              <div className="mt-4 flex justify-center @sm:hidden">
                {renderThemeToggle()}
              </div>

              <div className="hidden mt-4 flex-col w-full @md:flex @sm:flex-row @sm:w-auto @sm:flex-wrap justify-center @sm:justify-start gap-2">
                <a
                  href={scheduleCallHref}
                  target={scheduleCallHref.startsWith("http") ? "_blank" : undefined}
                  rel={scheduleCallHref.startsWith("http") ? "noreferrer" : undefined}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-4 text-xs font-semibold transition-opacity hover:opacity-90 w-full @sm:w-auto"
                  style={{
                    backgroundColor: "var(--vertex-text-main)",
                    color: "var(--vertex-root-bg)",
                  }}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  {scheduleCallLabel}
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href={portfolio.githubUrl}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border px-4 text-xs font-semibold transition-all w-full @sm:w-auto"
                  style={{
                    backgroundColor: "var(--vertex-bg)",
                    color: "var(--vertex-text-main)",
                    borderColor: "var(--vertex-border)",
                  }}
                >
                  <GitHubIcon className="h-3.5 w-3.5" />
                  GitHub
                </a>
                <a
                  href={portfolio.linkedinUrl}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-4 text-xs font-semibold transition-opacity hover:opacity-90 w-full @sm:w-auto"
                  style={{
                    backgroundColor: "var(--vertex-text-main)",
                    color: "var(--vertex-root-bg)",
                  }}
                >
                  <LinkedInIcon className="h-3.5 w-3.5" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="flex mb-4  mt-4  flex-col w-full @md:hidden @sm:flex-row @sm:w-auto @sm:flex-wrap justify-center @sm:justify-start gap-2">
          <a
            href={scheduleCallHref}
            target={scheduleCallHref.startsWith("http") ? "_blank" : undefined}
            rel={scheduleCallHref.startsWith("http") ? "noreferrer" : undefined}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-4 text-xs font-semibold transition-opacity hover:opacity-90 w-full @sm:w-auto"
            style={{
              backgroundColor: "var(--vertex-text-main)",
              color: "var(--vertex-root-bg)",
            }}
          >
            <Calendar className="h-3.5 w-3.5" />
            {scheduleCallLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
          <a
            href={portfolio.githubUrl}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border px-4 text-xs font-semibold transition-all w-full @sm:w-auto"
            style={{
              backgroundColor: "var(--vertex-bg)",
              color: "var(--vertex-text-main)",
              borderColor: "var(--vertex-border)",
            }}
          >
            <GitHubIcon className="h-3.5 w-3.5" />
            GitHub
          </a>
          <a
            href={portfolio.linkedinUrl}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-4 text-xs font-semibold transition-opacity hover:opacity-90 w-full @sm:w-auto"
            style={{
              backgroundColor: "var(--vertex-text-main)",
              color: "var(--vertex-root-bg)",
            }}
          >
            <LinkedInIcon className="h-3.5 w-3.5" />
            LinkedIn
          </a>
        </div>

        <section className="grid grid-cols-1 gap-4 @md:grid-cols-6 @md:gap-5">
          <BentoCard className="@md:col-span-4">
            <h2 className="mb-2 text-lg font-bold">About</h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--vertex-text-muted)" }}
            >
              {portfolio.about}
            </p>
          </BentoCard>

          {hasExperience ? (
            <BentoCard className="@md:col-span-2 @md:row-span-2 flex flex-col justify-between">
              <div>
                <h2 className="mb-4 text-lg font-bold">Experience</h2>
                <div className="relative space-y-5">
                  <div
                    className="absolute left-[5px] top-2 bottom-2 w-px"
                    style={{ backgroundColor: "var(--vertex-border)" }}
                  />
                  {(portfolio.experience ?? []).map((entry, index) => (
                    <div key={index} className="relative pl-6">
                      <div
                        className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            index === 0 ? "var(--vertex-accent)" : "var(--vertex-border)",
                        }}
                      />
                      <h3
                        className="text-xs font-semibold"
                        style={{
                          color:
                            index === 0 ? "var(--vertex-accent)" : "var(--vertex-text-main)",
                        }}
                      >
                        {entry.role}
                      </h3>
                      <p
                        className="text-[10px]"
                        style={{ color: "var(--vertex-text-muted)" }}
                      >
                        {entry.company}
                      </p>
                      <p
                        className="text-[10px]"
                        style={{ color: "var(--vertex-text-muted)" }}
                      >
                        {entry.year}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </BentoCard>
          ) : null}

          <BentoCard className="@md:col-span-2">
            <h2 className="mb-3 text-sm font-bold">Professional Resume</h2>
            <p
              className="text-[10px] uppercase tracking-[0.22em]"
              style={{ color: "var(--vertex-text-muted)" }}
            >
              View full professional resume
            </p>
            <a
              href={`/p/${portfolio.slug}`}
              className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-all hover:opacity-95"
              style={{
                backgroundColor: "var(--vertex-bg)",
                color: "var(--vertex-text-main)",
                borderColor: "var(--vertex-border)",
              }}
            >
              Open public resume
              <ArrowRight className="h-3.5 w-3.5 opacity-60" />
            </a>
            <div
              className="mt-4 space-y-3 rounded-xl border p-4"
              style={{
                backgroundColor: "var(--vertex-root-bg)",
                borderColor: "var(--vertex-border)",
              }}
            >
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "var(--vertex-text-muted)" }}
                >
                  Experience
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {portfolio.experience?.length ?? 0} roles
                </p>
              </div>
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "var(--vertex-text-muted)" }}
                >
                  Focus
                </p>
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--vertex-text-muted)" }}
                >
                  {portfolio.skills.slice(0, 4).join(" • ")}
                </p>
              </div>
              {ts.yearsOfExperience && (
                <div>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                    style={{ color: "var(--vertex-text-muted)" }}
                  >
                    Years of exp.
                  </p>
                  <p className="mt-1 text-sm font-semibold">{ts.yearsOfExperience}</p>
                </div>
              )}
              {ts.openSourceStars && (
                <div>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                    style={{ color: "var(--vertex-text-muted)" }}
                  >
                    Open source ★
                  </p>
                  <p className="mt-1 text-sm font-semibold">{ts.openSourceStars}</p>
                </div>
              )}
            </div>
          </BentoCard>

          <BentoCard className="@md:col-span-2">
            <h2 className="mb-4 text-lg font-bold">Tech Stack</h2>
            <div className="flex flex-wrap gap-1.5">
              {portfolio.skills.slice(0, 8).map((skill) => (
                <span
                  key={skill}
                  className="rounded border px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    backgroundColor: "var(--vertex-root-bg)",
                    borderColor: "var(--vertex-border)",
                    color: "var(--vertex-text-muted)",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </BentoCard>

          <BentoCard className="@md:col-span-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Recent Projects</h2>
              <ExternalLink className="h-4 w-4 opacity-40" />
            </div>
            <div className="space-y-3">
              {projectCards.map((project, index) => {
                const href = project.projectUrl || undefined;

                return (
                  <div
                    key={`${project.name}-${index}`}
                    className="rounded-xl border p-3"
                    style={{
                      backgroundColor: "var(--vertex-root-bg)",
                      borderColor: "var(--vertex-border)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold" style={{ color: "var(--vertex-accent)" }}>
                        {project.name}
                      </h3>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : null}
                    </div>
                    <p
                      className="mt-1 text-xs"
                      style={{ color: "var(--vertex-text-muted)" }}
                    >
                      {project.summary}
                    </p>
                    {project.stack ? (
                      <div className="mt-2 text-[9px] font-mono uppercase tracking-widest opacity-30">
                        {project.stack}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </BentoCard>

          <BentoCard className="@md:col-span-2">
            <h2 className="mb-3 text-sm font-bold">Links</h2>
            <div className="space-y-1.5">
              {portfolio.linkedinUrl && (
                <a
                  href={portfolio.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-lg p-2 transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "var(--vertex-root-bg)" }}
                >
                  <span className="text-[10px] font-medium">LinkedIn</span>
                  <ArrowRight className="h-3 w-3 opacity-40" />
                </a>
              )}
              {portfolio.githubUrl && (
                <a
                  href={portfolio.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-lg p-2 transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "var(--vertex-root-bg)" }}
                >
                  <span className="text-[10px] font-medium">GitHub</span>
                  <ArrowRight className="h-3 w-3 opacity-40" />
                </a>
              )}
              {portfolio.websiteUrl && (
                <a
                  href={portfolio.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-lg p-2 transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "var(--vertex-root-bg)" }}
                >
                  <span className="text-[10px] font-medium">Website</span>
                  <ArrowRight className="h-3 w-3 opacity-40" />
                </a>
              )}
              <a
                href={`mailto:${portfolio.email}`}
                className="flex items-center justify-between rounded-lg p-2 transition-opacity hover:opacity-80"
                style={{ backgroundColor: "var(--vertex-root-bg)" }}
              >
                <span className="text-[10px] font-medium">Email</span>
                <ArrowRight className="h-3 w-3 opacity-40" />
              </a>
            </div>
          </BentoCard>

          {galleryImages.length > 0 ? (
            <BentoCard className="@md:col-span-6">
              <h2 className="mb-4 text-lg font-bold">Gallery</h2>
              <TemplateGallery
                images={galleryImages}
                transitionClassName="transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                navButtonClassName="border-[var(--vertex-border)] bg-[var(--vertex-bg)] text-[var(--vertex-text-main)]"
                imageClassName="p-6"
                tileClassName="bg-[var(--vertex-root-bg)] border-[var(--vertex-border)]"
              />
            </BentoCard>
          ) : null}

          {portfolio.recommendation && (
            <BentoCard className="@md:col-span-6">
              <h2 className="mb-3 text-sm font-bold">Recommendation</h2>
              <blockquote
                className="mb-3 text-xs italic leading-relaxed"
                style={{ color: "var(--vertex-text-muted)" }}
              >
                &ldquo;{portfolio.recommendation.quote}&rdquo;
              </blockquote>
              <p className="text-xs font-semibold">
                {portfolio.recommendation.author}
              </p>
              <p
                className="text-[10px]"
                style={{ color: "var(--vertex-text-muted)" }}
              >
                {portfolio.recommendation.role}
              </p>
            </BentoCard>
          )}
        </section>
      </div>
      <footer className="mt-12 @md:col-span-6 flex justify-center items-center gap-1 border-t border-[var(--vertex-border)] py-5 text-sm">
        <p className="text-xs" style={{ color: "var(--vertex-text-muted)" }}>
          © {new Date().getFullYear()} {portfolio.name}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

registerTemplate("vertex", VertexTemplate);

export default VertexTemplate;
