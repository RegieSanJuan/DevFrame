"use client";

import { GitHubIcon, LinkedInIcon } from "@/components/brand-icons";
import { getDisplayProjects } from "@/lib/portfolio-schema";
import { filterRenderableGalleryImages } from "@/lib/portfolio-image-uploads";
import { TemplateGallery } from "@/templates/base-components";
import type { TemplateComponentProps } from "@/templates/registry";
import { registerTemplate } from "@/templates/registry";
import { ExternalLink, Mail, Moon, Sun } from "lucide-react";
import { useState } from "react";

function DriftTemplate({ portfolio }: TemplateComponentProps) {
  type DriftSettings = {
    defaultMode?: "dark" | "light";
    sidebarTagline?: string;
    accentColor?: string;
  };

  const ts = (portfolio.templateSettings ?? {}) as DriftSettings;
  const [mode, setMode] = useState<"dark" | "light">(ts.defaultMode ?? "dark");
  const toggleTheme = () => setMode((value) => (value === "dark" ? "light" : "dark"));

  const galleryImages = filterRenderableGalleryImages(portfolio.galleryImages);
  const projectCards = getDisplayProjects(portfolio);
  const hasExperience = Boolean(portfolio.experience?.length);
  const hasGallery = galleryImages.length > 0;
  const resumeHref =
    portfolio.resumeLink?.url ||
    portfolio.websiteUrl ||
    portfolio.featuredProjectUrl ||
    `/p/${portfolio.slug}`;
  const resumeLabel = portfolio.resumeLink?.label || "Open resume";

  const themeStyles =
    mode === "dark"
      ? ({
          "--drift-bg": "#0f172a",
          "--drift-text": "#94a3b8",
          "--drift-heading": "#e2e8f0",
          "--drift-accent": ts.accentColor ?? "#5eead4",
          "--drift-nav": "#e2e8f0",
          "--drift-badge-bg": "rgba(45, 212, 191, 0.1)",
          "--drift-badge-text": ts.accentColor ?? "#5eead4",
          "--drift-hover": "rgba(30, 41, 59, 0.5)",
        } as React.CSSProperties)
      : ({
          "--drift-bg": "#f8fafc",
          "--drift-text": "#475569",
          "--drift-heading": "#0f172a",
          "--drift-accent": ts.accentColor ?? "#0d9488",
          "--drift-nav": "#0f1419",
          "--drift-badge-bg": "rgba(13, 148, 136, 0.1)",
          "--drift-badge-text": ts.accentColor ?? "#0d9488",
          "--drift-hover": "rgba(241, 245, 249, 0.8)",
        } as React.CSSProperties);

  return (
    <div
      style={themeStyles}
      className="min-h-screen bg-[var(--drift-bg)] text-[var(--drift-text)] transition-colors duration-500 selection:bg-[var(--drift-accent)] selection:text-teal-900"
    >
      <div className="mx-auto max-w-screen-xl px-6 py-12 md:px-12 md:py-16 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-4">
          <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[48%] lg:flex-col lg:justify-between lg:py-24">
            <div>
              <div className="flex items-center justify-between lg:block">
                <h1 className="text-4xl font-bold tracking-tight text-[var(--drift-heading)] sm:text-5xl">
                  {portfolio.name}
                </h1>

                <button
                  onClick={toggleTheme}
                  className="rounded-full border border-[var(--drift-text)]/10 p-2 transition-all hover:bg-[var(--drift-hover)] lg:mt-4 lg:inline-flex"
                  title="Toggle theme"
                >
                  {mode === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </button>
              </div>

              <h2 className="mt-3 text-lg font-medium tracking-tight text-[var(--drift-heading)] sm:text-xl">
                {portfolio.title}
              </h2>
              <p className="mt-4 max-w-xs leading-normal">
                {ts.sidebarTagline ||
                  portfolio.bio ||
                  "Crafting pixel-perfect, accessible user interfaces for the modern web."}
              </p>

              <nav className="nav hidden lg:block" aria-label="In-page jump links">
                <ul className="mt-16 w-max space-y-4">
                  <li>
                    <a className="group flex items-center py-3 active" href="#about">
                      <span className="nav-indicator mr-4 h-px w-8 bg-[var(--drift-text)] transition-all group-hover:w-16 group-hover:bg-[var(--drift-heading)] group-focus-visible:w-16" />
                      <span className="nav-text text-xs font-bold uppercase tracking-widest text-[var(--drift-text)] group-hover:text-[var(--drift-heading)]">
                        About
                      </span>
                    </a>
                  </li>
                  {hasExperience ? (
                    <li>
                      <a className="group flex items-center py-3" href="#experience">
                        <span className="nav-indicator mr-4 h-px w-8 bg-[var(--drift-text)] transition-all group-hover:w-16 group-hover:bg-[var(--drift-heading)] group-focus-visible:w-16" />
                        <span className="nav-text text-xs font-bold uppercase tracking-widest text-[var(--drift-text)] group-hover:text-[var(--drift-heading)]">
                          Experience
                        </span>
                      </a>
                    </li>
                  ) : null}
                  <li>
                    <a className="group flex items-center py-3" href="#resume">
                      <span className="nav-indicator mr-4 h-px w-8 bg-[var(--drift-text)] transition-all group-hover:w-16 group-hover:bg-[var(--drift-heading)] group-focus-visible:w-16" />
                      <span className="nav-text text-xs font-bold uppercase tracking-widest text-[var(--drift-text)] group-hover:text-[var(--drift-heading)]">
                        Professional Resume
                      </span>
                    </a>
                  </li>
                  <li>
                    <a className="group flex items-center py-3" href="#projects">
                      <span className="nav-indicator mr-4 h-px w-8 bg-[var(--drift-text)] transition-all group-hover:w-16 group-hover:bg-[var(--drift-heading)] group-focus-visible:w-16" />
                      <span className="nav-text text-xs font-bold uppercase tracking-widest text-[var(--drift-text)] group-hover:text-[var(--drift-heading)]">
                        Projects
                      </span>
                    </a>
                  </li>
                  {hasGallery ? (
                    <li>
                      <a className="group flex items-center py-3" href="#gallery">
                        <span className="nav-indicator mr-4 h-px w-8 bg-[var(--drift-text)] transition-all group-hover:w-16 group-hover:bg-[var(--drift-heading)] group-focus-visible:w-16" />
                        <span className="nav-text text-xs font-bold uppercase tracking-widest text-[var(--drift-text)] group-hover:text-[var(--drift-heading)]">
                          Gallery
                        </span>
                      </a>
                    </li>
                  ) : null}
                </ul>
              </nav>
            </div>

            <ul className="ml-1 mt-8 flex items-center gap-5" aria-label="Social media">
              <li>
                <a
                  className="transition-colors hover:text-[var(--drift-heading)]"
                  href={portfolio.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <GitHubIcon className="h-6 w-6" />
                </a>
              </li>
              <li>
                <a
                  className="transition-colors hover:text-[var(--drift-heading)]"
                  href={portfolio.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <LinkedInIcon className="h-6 w-6" />
                </a>
              </li>
              <li>
                <a
                  className="transition-colors hover:text-[var(--drift-heading)]"
                  href={`mailto:${portfolio.email}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Mail className="h-6 w-6" />
                </a>
              </li>
            </ul>
          </header>

          <main className="space-y-24 pt-24 lg:w-[52%] lg:py-24">
            <section
              id="about"
              className="scroll-mt-16 lg:scroll-mt-24"
              aria-label="About me"
            >
              <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-[var(--drift-heading)] lg:sr-only">
                About
              </h2>
              <div className="space-y-4">
                <p>{portfolio.about}</p>
              </div>
            </section>

            {hasExperience ? (
              <section
                id="experience"
                className="scroll-mt-16 lg:scroll-mt-24"
                aria-label="Work experience"
              >
                <h2 className="mb-8 text-sm font-bold uppercase tracking-widest text-[var(--drift-heading)]">
                  Experience
                </h2>
                <ol className="group/list space-y-12">
                  {(portfolio.experience ?? []).map((entry, index) => (
                    <li
                      key={index}
                      className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 lg:hover:!opacity-100 lg:group-hover/list:opacity-50"
                    >
                      <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition lg:-inset-x-6 lg:block lg:group-hover:bg-[var(--drift-hover)]" />
                      <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide sm:col-span-2">
                        {entry.year}
                      </header>
                      <div className="z-10 sm:col-span-6">
                        <h3 className="text-base font-medium leading-snug text-[var(--drift-heading)]">
                          {entry.role} · {entry.company}
                        </h3>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            {portfolio.recommendation ? (
              <section className="scroll-mt-16 lg:scroll-mt-24">
                <h2 className="mb-8 text-sm font-bold uppercase tracking-widest text-[var(--drift-heading)]">
                  Recommendations
                </h2>
                <figure
                  className="relative pl-6"
                  style={{ borderLeft: "2px solid var(--drift-accent)" }}
                >
                  <blockquote className="mb-4 text-sm italic leading-relaxed">
                    &ldquo;{portfolio.recommendation.quote}&rdquo;
                  </blockquote>
                  <figcaption className="text-xs">
                    <span className="font-semibold text-[var(--drift-heading)]">
                      {portfolio.recommendation.author}
                    </span>
                    <span className="ml-2 opacity-60">
                      {portfolio.recommendation.role}
                    </span>
                  </figcaption>
                </figure>
              </section>
            ) : null}

            <section
              id="resume"
              className="scroll-mt-16 lg:scroll-mt-24"
              aria-label="Professional resume"
            >
              <h2 className="mb-8 text-sm font-bold uppercase tracking-widest text-[var(--drift-heading)]">
                Professional Resume
              </h2>
              <div className="rounded-2xl border border-[var(--drift-text)]/10 bg-[var(--drift-hover)] p-6 sm:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--drift-heading)]">
                  View full professional resume
                </p>
                <a
                  className="mt-3 inline-flex items-center gap-1.5 text-lg font-semibold text-[var(--drift-heading)] transition-colors hover:opacity-80 sm:text-xl"
                  href={resumeHref}
                  target={resumeHref.startsWith("http") ? "_blank" : undefined}
                  rel={resumeHref.startsWith("http") ? "noreferrer" : undefined}
                >
                  {resumeLabel}
                  <ExternalLink className="h-4 w-4" />
                </a>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--drift-heading)]">
                      Experience
                    </p>
                    <p className="mt-1 text-sm">
                      {portfolio.experience?.length ?? 0} roles
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--drift-heading)]">
                      Skills
                    </p>
                    <p className="mt-1 text-sm">
                      {portfolio.skills.slice(0, 4).join(" · ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--drift-heading)]">
                      Location
                    </p>
                    <p className="mt-1 text-sm">{portfolio.location}</p>
                  </div>
                </div>
              </div>
            </section>

            <section
              id="projects"
              className="scroll-mt-16 lg:scroll-mt-24"
              aria-label="Projects"
            >
              <h2 className="mb-8 text-sm font-bold uppercase tracking-widest text-[var(--drift-heading)]">
                Projects
              </h2>
              <div className="space-y-8">
                {projectCards.map((project, index) => {
                  const href = project.projectUrl || undefined;

                  return (
                    <div
                      key={`${project.name}-${index}`}
                      className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 lg:hover:!opacity-100 lg:group-hover/list:opacity-50"
                    >
                      <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-[var(--drift-hover)]" />
                      <div className="z-10 sm:order-2 sm:col-span-6">
                        <h3>
                          {href ? (
                            <a
                              className="inline-flex items-baseline text-base font-medium leading-tight text-[var(--drift-heading)] group/link"
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <span>
                                {project.name}{" "}
                                <ExternalLink className="ml-1 inline-block h-4 w-4 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1" />
                              </span>
                            </a>
                          ) : (
                            <span className="text-base font-medium leading-tight text-[var(--drift-heading)]">
                              {project.name}
                            </span>
                          )}
                        </h3>
                        <p className="mt-2 text-sm leading-normal">{project.summary}</p>
                        {project.stack ? (
                          <div className="mt-2 text-[10px] font-mono uppercase tracking-widest opacity-50">
                            {project.stack}
                          </div>
                        ) : null}
                      </div>
                      <div className="z-10 sm:order-1 sm:col-span-2 sm:translate-y-1">
                        <div className="flex aspect-video items-center justify-center overflow-hidden rounded border-2 border-[var(--drift-heading)]/10 bg-[var(--drift-hover)]">
                          <ExternalLink className="h-8 w-8 opacity-10" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {hasGallery ? (
              <section
                id="gallery"
                className="scroll-mt-16 lg:scroll-mt-24"
                aria-label="Gallery"
              >
                <h2 className="mb-8 text-sm font-bold uppercase tracking-widest text-[var(--drift-heading)]">
                  Gallery
                </h2>
                <TemplateGallery
                  images={galleryImages}
                  className="grid gap-4"
                  galleryClassName="sm:grid-cols-3"
                  tileClassName="rounded-2xl border border-[var(--drift-text)]/10 bg-[var(--drift-hover)]"
                  imageClassName="p-6"
                  navButtonClassName="border-[var(--drift-text)]/10 bg-[var(--drift-hover)]"
                  transitionClassName="transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  imageSizes="(max-width: 640px) 100vw, 33vw"
                />
              </section>
            ) : null}

            <footer className="max-w-md pb-16 text-xs opacity-50 sm:pb-0">
              <p>
                Designed and coded with passion. Built with Next.js and Tailwind
                CSS, deployed with Vercel.
              </p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}

registerTemplate("drift", DriftTemplate);

export default DriftTemplate;
