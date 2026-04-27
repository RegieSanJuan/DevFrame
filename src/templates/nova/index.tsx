"use client";

import {
  LinkPill,
  SectionLabel,
  SkillBadge,
  TemplateGallery,
} from "@/templates/base-components";
import type { TemplateComponentProps } from "@/templates/registry";
import { registerTemplate } from "@/templates/registry";
import {
  BriefcaseBusiness,
  Code2,
  ExternalLink,
  Mail,
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";

function NovaTemplate({ portfolio }: TemplateComponentProps) {
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const toggleTheme = () => setMode((m) => (m === "dark" ? "light" : "dark"));

  const galleryImages = [
    { src: "/devframe-bg-icon.svg", alt: "Portfolio visual 1" },
    { src: "/window.svg", alt: "Portfolio visual 2" },
    { src: "/globe.svg", alt: "Portfolio visual 3" },
    { src: "/vercel.svg", alt: "Portfolio visual 4" },
  ];

  const theme =
    mode === "dark"
      ? ({
          "--nova-bg": "#0f0f0f",
          "--nova-bg-alt": "#0a0a0a",
          "--nova-surface": "#161616",
          "--nova-surface-strong": "#1e1e1e",
          "--nova-text": "#ededed",
          "--nova-text-strong": "#ffffff",
          "--nova-muted": "#7a7a7a",
          "--nova-soft": "#4a4a4a",
          "--nova-border": "#222222",
          "--nova-border-strong": "#2e2e2e",
          "--nova-accent": "#c9a96e",
          "--nova-accent-strong": "#e2c488",
          "--nova-accent-soft": "#1e1a12",
        } as React.CSSProperties)
      : ({
          "--nova-bg": "#ffffff",
          "--nova-bg-alt": "#fafafa",
          "--nova-surface": "#f4f4f5",
          "--nova-surface-strong": "#e4e4e7",
          "--nova-text": "#18181b",
          "--nova-text-strong": "#000000",
          "--nova-muted": "#71717a",
          "--nova-soft": "#a1a1aa",
          "--nova-border": "#e4e4e7",
          "--nova-border-strong": "#d4d4d8",
          "--nova-accent": "#b48e4b",
          "--nova-accent-strong": "#8f6e33",
          "--nova-accent-soft": "#fdfaf2",
        } as React.CSSProperties);

  return (
    <div
      style={{
        ...theme,
        backgroundColor: "var(--nova-bg)",
        color: "var(--nova-text)",
      }}
      className="min-h-screen transition-colors duration-500"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 space-y-32">
        {/* ── Hero ─────────────────────────────────────── */}
        <section className="space-y-12 py-4">
          {/* Badge + theme toggle row */}
          <div className="flex items-center justify-end">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border transition-all duration-300 hover:scale-110"
              style={{
                borderColor: "var(--nova-border-strong)",
                color: "var(--nova-muted)",
                backgroundColor: "var(--nova-surface)",
              }}
            >
              {mode === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Centered name + subtitle + pills */}
          <div className="text-center space-y-4">
            <h1
              className="text-5xl md:text-7xl font-bold tracking-tighter h-23"
              style={{
                background: `linear-gradient(to bottom, var(--nova-text-strong), color-mix(in srgb, var(--nova-text) 30%, transparent))`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {portfolio.name}
            </h1>
            <p
              className="text-xl max-w-2xl mx-auto -mt-5"
              style={{ color: "var(--nova-muted)" }}
            >
              {portfolio.title}
              {portfolio.location && <> &nbsp;•&nbsp; {portfolio.location}</>}
            </p>
            <div className="flex justify-center gap-4 flex-wrap pt-2">
              <LinkPill
                href={portfolio.githubUrl}
                label="GitHub"
                icon={<Code2 className="w-4 h-4" />}
                style={{
                  borderColor: "var(--nova-border-strong)",
                  color: "var(--nova-muted)",
                  backgroundColor: "var(--nova-surface)",
                }}
              />
              <LinkPill
                href={portfolio.linkedinUrl}
                label="LinkedIn"
                icon={<BriefcaseBusiness className="w-4 h-4" />}
                style={{
                  borderColor: "var(--nova-border-strong)",
                  color: "var(--nova-muted)",
                  backgroundColor: "var(--nova-surface)",
                }}
              />
              <LinkPill
                href={`mailto:${portfolio.email}`}
                label="Email"
                icon={<Mail className="w-4 h-4" />}
                style={{
                  borderColor: "var(--nova-border-strong)",
                  color: "var(--nova-muted)",
                  backgroundColor: "var(--nova-surface)",
                }}
              />
            </div>
          </div>

          {/* Two-column: Story+Skills | Featured Card */}
          <div className="grid gap-10 md:grid-cols-2 lg:gap-12 items-start">
            {/* Left: Story + Expertise */}
            <div className="space-y-8">
              <div>
                <SectionLabel style={{ color: "var(--nova-soft)" }}>
                  The Story
                </SectionLabel>
                <p
                  className="mt-4 text-lg leading-relaxed"
                  style={{ color: "var(--nova-muted)" }}
                >
                  {portfolio.about ?? portfolio.bio}
                </p>
              </div>
              <div>
                <SectionLabel style={{ color: "var(--nova-soft)" }}>
                  Expertise
                </SectionLabel>
                <div className="mt-4 flex flex-wrap gap-2">
                  {portfolio.skills.map((skill) => (
                    <SkillBadge
                      key={skill}
                      style={{
                        borderColor: "var(--nova-border)",
                        backgroundColor: "var(--nova-surface-strong)",
                        color: "var(--nova-muted)",
                      }}
                    >
                      {skill}
                    </SkillBadge>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Featured Card */}
            <a
              href={portfolio.featuredProjectUrl}
              target="_blank"
              rel="noreferrer"
              className="group block rounded-3xl p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
              style={{
                backgroundColor: "var(--nova-surface-strong)",
                border: "1px solid var(--nova-border)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor =
                  "var(--nova-border-strong)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--nova-border)")
              }
            >
              <div
                className="absolute top-0 right-0 p-8 opacity-[0.06] group-hover:opacity-[0.14] transition-opacity duration-500 pointer-events-none"
                style={{ color: "var(--nova-accent)" }}
              >
                <Code2 size={120} />
              </div>
              <div className="relative space-y-4">
                <SectionLabel style={{ color: "var(--nova-soft)" }}>
                  Featured Build
                </SectionLabel>
                <div className="flex items-start justify-between gap-4 mt-6">
                  <h2
                    className="text-3xl font-bold tracking-tight"
                    style={{ color: "var(--nova-text)" }}
                  >
                    {portfolio.featuredProjectName}
                  </h2>
                  <ExternalLink
                    className="w-5 h-5 shrink-0 mt-1 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    style={{ color: "var(--nova-soft)" }}
                  />
                </div>
                <p
                  className="leading-relaxed"
                  style={{ color: "var(--nova-muted)" }}
                >
                  {portfolio.featuredProjectSummary}
                </p>
                <div
                  className="pt-8"
                  style={{ borderTop: "1px solid var(--nova-border)" }}
                >
                  <p
                    className="text-sm font-mono"
                    style={{ color: "var(--nova-accent)" }}
                  >
                    {portfolio.featuredProjectStack}
                  </p>
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* ── Professional Resume ────────────────────── */}
        <section className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
          <div className="md:sticky md:top-24">
            <SectionLabel style={{ color: "var(--nova-soft)" }}>
              Professional Resume
            </SectionLabel>
          </div>
          <div
            className="rounded-3xl p-8"
            style={{
              backgroundColor: "var(--nova-surface)",
              border: "1px solid var(--nova-border)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-[0.24em]"
              style={{ color: "var(--nova-soft)" }}
            >
              View full professional resume
            </p>
            <div className="mt-4 grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p
                  className="text-2xl font-semibold tracking-tight"
                  style={{ color: "var(--nova-text)" }}
                >
                  {portfolio.title}
                </p>
                <p
                  className="mt-2 max-w-xl text-sm leading-relaxed"
                  style={{ color: "var(--nova-muted)" }}
                >
                  A concise overview of role, experience, and project focus for
                  hiring and consulting conversations.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <a
                    href={`/p/${portfolio.slug}`}
                    className="rounded-full border px-4 py-2 text-sm transition-colors hover:opacity-80"
                    style={{
                      borderColor: "var(--nova-border-strong)",
                      color: "var(--nova-text)",
                    }}
                  >
                    Open public resume
                  </a>
                  <a
                    href={portfolio.websiteUrl || portfolio.featuredProjectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border px-4 py-2 text-sm transition-colors hover:opacity-80"
                    style={{
                      borderColor: "var(--nova-border-strong)",
                      color: "var(--nova-text)",
                    }}
                  >
                    View portfolio link
                  </a>
                </div>
              </div>
              <div
                className="grid gap-3 rounded-2xl border p-4"
                style={{ borderColor: "var(--nova-border)" }}
              >
                <div>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.24em]"
                    style={{ color: "var(--nova-soft)" }}
                  >
                    Experience
                  </p>
                  <p
                    className="mt-1 text-sm font-semibold"
                    style={{ color: "var(--nova-text)" }}
                  >
                    {portfolio.experience?.length ?? 0} roles listed
                  </p>
                </div>
                <div>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.24em]"
                    style={{ color: "var(--nova-soft)" }}
                  >
                    Skills
                  </p>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--nova-muted)" }}
                  >
                    {portfolio.skills.slice(0, 4).join(" · ")}
                  </p>
                </div>
                <div>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.24em]"
                    style={{ color: "var(--nova-soft)" }}
                  >
                    Location
                  </p>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--nova-muted)" }}
                  >
                    {portfolio.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Experience ───────────────────────────────── */}
        {portfolio.experience && portfolio.experience.length > 0 && (
          <section className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
            <div className="md:sticky md:top-24">
              <SectionLabel style={{ color: "var(--nova-soft)" }}>
                Experience
              </SectionLabel>
            </div>
            <ol className="relative space-y-8">
              <div
                className="absolute left-0 top-2 bottom-2 w-px"
                style={{ backgroundColor: "var(--nova-border)" }}
              />
              {portfolio.experience.map((entry, i) => (
                <li key={i} className="pl-6 relative">
                  <div
                    className="absolute left-[-3px] top-1.5 w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        i === 0
                          ? "var(--nova-accent)"
                          : "var(--nova-border-strong)",
                    }}
                  />
                  <p
                    className="text-xs font-mono mb-1"
                    style={{ color: "var(--nova-soft)" }}
                  >
                    {entry.year}
                  </p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--nova-text)" }}
                  >
                    {entry.role}
                  </p>
                  <p className="text-sm" style={{ color: "var(--nova-muted)" }}>
                    {entry.company}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* ── Recommendation ───────────────────────────── */}
        {portfolio.recommendation && (
          <section className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
            <div className="md:sticky md:top-24">
              <SectionLabel style={{ color: "var(--nova-soft)" }}>
                Recommendation
              </SectionLabel>
            </div>
            <figure
              className="rounded-3xl p-8 space-y-6"
              style={{
                backgroundColor: "var(--nova-surface)",
                border: "1px solid var(--nova-border)",
              }}
            >
              <blockquote
                className="text-base leading-relaxed italic"
                style={{ color: "var(--nova-muted)" }}
              >
                &ldquo;{portfolio.recommendation.quote}&rdquo;
              </blockquote>
              <figcaption>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--nova-text)" }}
                >
                  {portfolio.recommendation.author}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--nova-soft)" }}
                >
                  {portfolio.recommendation.role}
                </p>
              </figcaption>
            </figure>
          </section>
        )}

        {/* ── Gallery ─────────────────────────────────── */}
        <section className="space-y-8">
          <SectionLabel style={{ color: "var(--nova-soft)" }}>
            Gallery
          </SectionLabel>
          <TemplateGallery
            images={galleryImages}
            className="grid gap-4"
            galleryClassName="sm:grid-cols-3"
            tileClassName="rounded-3xl"
            imageClassName="p-8 opacity-90"
            navButtonClassName="border-[var(--nova-border-strong)] text-[var(--nova-text)] bg-[var(--nova-surface)]"
            transitionClassName="transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            imageSizes="(max-width: 640px) 100vw, 33vw"
          />
        </section>

        {/* ── Footer ───────────────────────────────────── */}
        <footer
          className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--nova-border)" }}
        >
          <p className="text-sm" style={{ color: "var(--nova-soft)" }}>
            {portfolio.name} · {portfolio.title}
          </p>
          <a
            href={`mailto:${portfolio.email}`}
            className="text-sm transition-colors hover:opacity-80"
            style={{ color: "var(--nova-accent)" }}
          >
            {portfolio.email}
          </a>
        </footer>
      </div>
    </div>
  );
}

registerTemplate("nova", NovaTemplate);
export default NovaTemplate;
