"use client";

import { GitHubIcon, LinkedInIcon } from "@/components/brand-icons";
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
      className={`rounded-2xl border border-[var(--vertex-border)] bg-[var(--vertex-bg)] p-6 shadow-sm transition-all duration-300 hover:shadow-md md:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

function VertexTemplate({ portfolio }: TemplateComponentProps) {
  const [mode, setMode] = useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    setMode((value) => (value === "dark" ? "light" : "dark"));
  };

  const galleryImages = [
    { src: "/devframe-bg-icon.svg", alt: "Portfolio visual 1" },
    { src: "/vercel.svg", alt: "Portfolio visual 2" },
    { src: "/next.svg", alt: "Portfolio visual 3" },
    { src: "/globe.svg", alt: "Portfolio visual 4" },
  ];

  const themeStyles =
    mode === "dark"
      ? ({
          "--vertex-root-bg": "#000000",
          "--vertex-bg": "#16181c",
          "--vertex-border": "rgba(255,255,255,0.1)",
          "--vertex-text-main": "#ffffff",
          "--vertex-text-muted": "#71767b",
          "--vertex-accent": "#1d9bf0",
          "--vertex-toggle-bg": "#333639",
        } as React.CSSProperties)
      : ({
          "--vertex-root-bg": "#ffffff",
          "--vertex-bg": "#f7f9f9",
          "--vertex-border": "rgba(0,0,0,0.08)",
          "--vertex-text-main": "#0f1419",
          "--vertex-text-muted": "#536471",
          "--vertex-accent": "#1d9bf0",
          "--vertex-toggle-bg": "#eff3f4",
        } as React.CSSProperties);

  return (
    <div
      style={themeStyles}
      className="min-h-screen bg-[var(--vertex-root-bg)] text-[var(--vertex-text-main)] transition-colors duration-500"
    >
      <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-12 lg:px-12 lg:py-14">
        <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative flex-shrink-0">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-[var(--vertex-border)] bg-[var(--vertex-bg)] md:h-40 md:w-40">
                <Code2
                  className="h-12 w-12 opacity-20"
                  style={{ color: "var(--vertex-text-main)" }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1">
                <CheckCircle2 className="h-6 w-6 fill-[#1d9bf0]/10 text-[#1d9bf0]" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="truncate text-2xl font-bold md:text-3xl">
                    {portfolio.name}
                  </h1>
                  <p
                    className="mt-1 flex items-center gap-1 text-sm"
                    style={{ color: "var(--vertex-text-muted)" }}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{portfolio.location}</span>
                  </p>
                </div>

                <button
                  onClick={toggleTheme}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300"
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
              </div>

              <p
                className="mt-3 text-sm md:text-base"
                style={{ color: "var(--vertex-text-muted)" }}
              >
                {portfolio.title}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`mailto:${portfolio.email}`}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-xs font-semibold transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: "var(--vertex-text-main)",
                    color: "var(--vertex-root-bg)",
                  }}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Schedule a Call
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href={portfolio.githubUrl}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border px-4 text-xs font-semibold transition-all"
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
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-xs font-semibold transition-opacity hover:opacity-90"
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

        <section className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5">
          <BentoCard className="md:col-span-4">
            <h2 className="mb-2 text-lg font-bold">About</h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--vertex-text-muted)" }}
            >
              {portfolio.about}
            </p>
          </BentoCard>

          <BentoCard className="md:col-span-2 md:row-span-2 flex flex-col justify-between">
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
                          index === 0 ? "#1d9bf0" : "var(--vertex-border)",
                      }}
                    />
                    <h3
                      className="text-xs font-semibold"
                      style={{
                        color:
                          index === 0 ? "#1d9bf0" : "var(--vertex-text-main)",
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

          <BentoCard className="md:col-span-2">
            <h2 className="mb-3 text-sm font-bold">Professional Resume</h2>
            <p
              className="text-[10px] uppercase tracking-[0.22em]"
              style={{ color: "var(--vertex-text-muted)" }}
            >
              View full professional resume
            </p>
            <a
              href={`/p/${portfolio.slug}`}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "var(--vertex-text-main)",
                color: "var(--vertex-root-bg)",
              }}
            >
              Open public resume
              <ArrowRight className="h-3.5 w-3.5" />
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
            </div>
          </BentoCard>

          <BentoCard className="md:col-span-4">
            <h2 className="mb-4 text-lg font-bold">Tech Stack</h2>
            <div className="flex flex-wrap gap-1.5">
              {portfolio.skills.map((skill) => (
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

          <BentoCard className="md:col-span-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Recent Project</h2>
              <ExternalLink className="h-4 w-4 opacity-40" />
            </div>
            <div
              className="rounded-xl border p-3"
              style={{
                backgroundColor: "var(--vertex-root-bg)",
                borderColor: "var(--vertex-border)",
              }}
            >
              <h3 className="text-sm font-semibold text-[#1d9bf0]">
                {portfolio.featuredProjectName}
              </h3>
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--vertex-text-muted)" }}
              >
                {portfolio.featuredProjectSummary}
              </p>
              <div className="mt-2 text-[9px] font-mono uppercase tracking-widest opacity-30">
                {portfolio.featuredProjectStack}
              </div>
            </div>
          </BentoCard>

          <BentoCard className="md:col-span-2">
            <h2 className="mb-3 text-sm font-bold">Links</h2>
            <div className="space-y-1.5">
              <a
                href={portfolio.linkedinUrl}
                className="flex items-center justify-between rounded-lg p-2 transition-opacity hover:opacity-80"
                style={{ backgroundColor: "var(--vertex-root-bg)" }}
              >
                <span className="text-[10px] font-medium">LinkedIn</span>
                <ArrowRight className="h-3 w-3 opacity-40" />
              </a>
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

          <BentoCard className="md:col-span-6">
            <h2 className="mb-4 text-lg font-bold">Gallery</h2>
            <TemplateGallery
              images={galleryImages}
              transitionClassName="transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              navButtonClassName="border-[var(--vertex-border)] bg-[var(--vertex-bg)] text-[var(--vertex-text-main)]"
              imageClassName="p-6"
              tileClassName="bg-[var(--vertex-root-bg)] border-[var(--vertex-border)]"
            />
          </BentoCard>

          {portfolio.recommendation && (
            <BentoCard className="md:col-span-6">
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
      <footer className="mt-12 md:col-span-6 flex justify-center items-center gap-1 border-t border-[var(--vertex-border)] py-5 text-sm">
        <p className="text-xs" style={{ color: "var(--vertex-text-muted)" }}>
          © {new Date().getFullYear()} {portfolio.name}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

registerTemplate("vertex", VertexTemplate);

export default VertexTemplate;
