"use client";

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
  Sun
} from "lucide-react";
import { useState } from "react";
import { GitHubIcon, LinkedInIcon } from "@/components/brand-icons";


/**
 * Isolated Bento Card component specifically for the Vertex template.
 * Now supports dynamic theme classes.
 */
function BentoCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`
      bg-[var(--vertex-bg)] border border-[var(--vertex-border)] rounded-2xl p-6 md:p-8
      shadow-sm hover:shadow-md transition-all duration-300 group
      ${className}
    `}>
      {children}
    </div>
  );
}

function VertexTemplate({ portfolio }: TemplateComponentProps) {
  const [mode, setMode] = useState<"dark" | "light">("dark");

  const toggleTheme = () => setMode(m => m === "dark" ? "light" : "dark");

  // Local theme variable mapping
  const themeStyles = mode === "dark"
    ? {
      "--vertex-root-bg": "#000000",
      "--vertex-bg": "#16181c",
      "--vertex-border": "rgba(255,255,255,0.1)",
      "--vertex-text-main": "#ffffff",
      "--vertex-text-muted": "#71767b",
      "--vertex-accent": "#1d9bf0",
      "--vertex-toggle-bg": "#333639",
    } as React.CSSProperties
    : {
      "--vertex-root-bg": "#ffffff",
      "--vertex-bg": "#f7f9f9",
      "--vertex-border": "rgba(0,0,0,0.08)",
      "--vertex-text-main": "#0f1419",
      "--vertex-text-muted": "#536471",
      "--vertex-accent": "#1d9bf0",
      "--vertex-toggle-bg": "#eff3f4",
    } as React.CSSProperties;

  return (
    <div
      style={themeStyles}
      className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-1000 transition-colors duration-500"
    >
      <div className="bg-[var(--vertex-root-bg)] text-[var(--vertex-text-main)] rounded-[32px] p-6 md:p-12 min-h-screen transition-colors duration-500">
        {/* --- Profile Section --- */}
        <section className="mb-8 animate-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-4 md:gap-6">
            {/* Avatar Area */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl bg-[var(--vertex-bg)] border border-[var(--vertex-border)] overflow-hidden flex items-center justify-center">
                <Code2 className="w-12 h-12 opacity-20" style={{ color: "var(--vertex-text-main)" }} />
              </div>
              <div className="absolute -bottom-1 -right-1">
                <CheckCircle2 className="w-6 h-6 text-[#1d9bf0] fill-[#1d9bf0]/10" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold truncate" style={{ color: "var(--vertex-text-main)" }}>
                    {portfolio.name}
                  </h1>
                  <CheckCircle2 className="h-4 w-4 text-[#1d9bf0] hidden md:block" />
                </div>

                {/* THEME TOGGLE BUTTON */}
                <button
                  onClick={toggleTheme}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none"
                  style={{ backgroundColor: "var(--vertex-toggle-bg)" }}
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

              <p className="text-xs md:text-sm mt-0.5 flex items-center gap-1" style={{ color: "var(--vertex-text-muted)" }}>
                <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span className="truncate">{portfolio.location}</span>
              </p>

              <div className="mt-2 text-[10px] md:text-base font-medium" style={{ color: "var(--vertex-text-main)" }}>
                {portfolio.title} <span className="opacity-20 px-1">\</span> Developer <span className="opacity-20 px-1">\</span> Creator
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <a
                  href={`mailto:${portfolio.email}`}
                  className="inline-flex h-8 items-center rounded-lg px-4 text-xs font-semibold hover:opacity-90 transition-all gap-1.5"
                  style={{ backgroundColor: "var(--vertex-text-main)", color: "var(--vertex-root-bg)" }}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Schedule a Call
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href={portfolio.githubUrl}
                  className="inline-flex h-8 items-center rounded-lg px-4 text-xs font-semibold transition-all gap-1.5 border"
                  style={{ backgroundColor: "var(--vertex-bg)", color: "var(--vertex-text-main)", borderColor: "var(--vertex-border)" }}
                >
                  <GitHubIcon className="w-3.5 h-3.5" />
                  GitHub
                </a>
                <a
                  href={portfolio.linkedinUrl}
                  className="inline-flex h-8 items-center rounded-lg px-4 text-xs font-semibold hover:opacity-90 transition-all gap-1.5"
                  style={{ backgroundColor: "var(--vertex-text-main)", color: "var(--vertex-root-bg)" }}
                >
                  <LinkedInIcon className="w-3.5 h-3.5" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* --- Bento Grid --- */}
        <section className="grid grid-cols-1 md:grid-cols-6 gap-2">

          {/* About Box */}
          <BentoCard className="md:col-span-4">
            <h2 className="text-lg font-bold mb-2" style={{ color: "var(--vertex-text-main)" }}>About</h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--vertex-text-muted)" }}>
              {portfolio.about}
            </p>
          </BentoCard>

          {/* Experience Box */}
          <BentoCard className="md:col-span-2 md:row-span-2 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold mb-4" style={{ color: "var(--vertex-text-main)" }}>Experience</h2>
              <div className="space-y-6 relative">
                <div className="absolute left-[5px] top-2 bottom-2 w-px" style={{ backgroundColor: "var(--vertex-border)" }} />

                <div className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-[#1d9bf0]" />
                  <h3 className="text-xs font-semibold text-[#1d9bf0]">AI Engineer</h3>
                  <p className="text-[10px]" style={{ color: "var(--vertex-text-muted)" }}>Current Role</p>
                </div>

                <div className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full transition-colors bg-[var(--vertex-border)] group-hover:bg-[#1d9bf0]" />
                  <h3 className="text-xs font-semibold" style={{ color: "var(--vertex-text-main)" }}>Senior Full-Stack</h3>
                  <p className="text-[10px]" style={{ color: "var(--vertex-text-muted)" }}>2024</p>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Tech Stack Box */}
          <BentoCard className="md:col-span-4">
            <h2 className="text-lg font-bold mb-4" style={{ color: "var(--vertex-text-main)" }}>Tech Stack</h2>
            <div className="flex flex-wrap gap-1.5">
              {portfolio.skills.map(skill => (
                <span
                  key={skill}
                  className="px-2 py-0.5 text-[10px] rounded border font-medium transition-colors"
                  style={{ backgroundColor: "var(--vertex-root-bg)", borderColor: "var(--vertex-border)", color: "var(--vertex-text-muted)" }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </BentoCard>

          {/* Projects / Featured Box */}
          <BentoCard className="md:col-span-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: "var(--vertex-text-main)" }}>Recent Project</h2>
              <ExternalLink className="w-4 h-4 opacity-40" style={{ color: "var(--vertex-text-main)" }} />
            </div>
            <div className="p-3 rounded-xl border transition-colors" style={{ backgroundColor: "var(--vertex-root-bg)", borderColor: "var(--vertex-border)" }}>
              <h3 className="text-sm font-semibold text-[#1d9bf0]">{portfolio.featuredProjectName}</h3>
              <p className="text-xs mt-1" style={{ color: "var(--vertex-text-muted)" }}>{portfolio.featuredProjectSummary}</p>
              <div className="mt-2 text-[9px] font-mono opacity-30 tracking-widest uppercase" style={{ color: "var(--vertex-text-main)" }}>
                {portfolio.featuredProjectStack}
              </div>
            </div>
          </BentoCard>

          {/* Social / Contact Box */}
          <BentoCard className="md:col-span-2">
            <h2 className="text-sm font-bold mb-3" style={{ color: "var(--vertex-text-main)" }}>Links</h2>
            <div className="space-y-1.5">
              <a href={portfolio.linkedinUrl} className="flex items-center justify-between p-2 rounded-lg transition-all hover:opacity-80" style={{ backgroundColor: "var(--vertex-root-bg)" }}>
                <span className="text-[10px] font-medium" style={{ color: "var(--vertex-text-main)" }}>LinkedIn</span>
                <ArrowRight className="w-3 h-3 opacity-40" style={{ color: "var(--vertex-text-main)" }} />
              </a>
              <a href={`mailto:${portfolio.email}`} className="flex items-center justify-between p-2 rounded-lg transition-all hover:opacity-80" style={{ backgroundColor: "var(--vertex-root-bg)" }}>
                <span className="text-[10px] font-medium" style={{ color: "var(--vertex-text-main)" }}>Email</span>
                <ArrowRight className="w-3 h-3 opacity-40" style={{ color: "var(--vertex-text-main)" }} />
              </a>
            </div>
          </BentoCard>
        </section>
      </div>
    </div>
  );
}

registerTemplate("vertex", VertexTemplate);

export default VertexTemplate;
