"use client";

import { Button } from "@/components/ui/button";
import { TEMPLATE_CATALOG } from "@/lib/template-catalog";
import {
  SiClerk,
  SiGreensock,
  SiNextdotjs,
  SiPrisma,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
} from "@icons-pack/react-simple-icons";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Blocks,
  Briefcase,
  Braces,
  Globe,
  ImagePlus,
  Layers3,
  LayoutDashboard,
  MonitorSmartphone,
  Palette,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Marquee from "react-fast-marquee";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

const platformCards = [
  {
    title: "A calmer editing flow",
    description:
      "Open Studio first, then use structured content tools and Dashboard status when you need them.",
    icon: LayoutDashboard,
    detail: "Studio-first flow",
  },
  {
    title: "One dataset, multiple looks",
    description:
      "Keep your portfolio content structured once, then switch presentation styles without rebuilding.",
    icon: Layers3,
    detail: "Template swapping",
  },
  {
    title: "Structured content tools",
    description:
      "Inputs stay readable on smaller screens instead of turning into a crowded form wall.",
    icon: Braces,
    detail: "Mobile form editor",
  },
  {
    title: "Public routes that feel real",
    description:
      "Every portfolio ships to a clean `/p/slug` URL you can share right away.",
    icon: Globe,
    detail: "Direct publish path",
  },
] as const;

const workflow = [
  {
    title: "Select a template",
    description: "Start with a visual direction that matches your tone.",
  },
  {
    title: "Open the Studio",
    description:
      "Draft with the live preview as the center of the workspace.",
  },
  {
    title: "Review setup health",
    description: "See auth and persistence status without leaving the flow.",
  },
  {
    title: "Publish the route",
    description: "Persist to Supabase, open the public portfolio, and keep iterating.",
  },
] as const;

const heroWorkflowModules = [
  {
    label: "Studio",
    value: "Live editor",
    detail: "/studio preview",
    icon: MonitorSmartphone,
  },
  {
    label: "Builder",
    value: "Mobile form",
    detail: "Structured content",
    icon: Braces,
  },
  {
    label: "Dashboard",
    value: "Control center",
    detail: "Route and publish state",
    icon: LayoutDashboard,
  },
] as const;

const heroTemplateOptions = ["Nova", "Vertex", "Drift"] as const;

const heroContentModules = [
  { label: "Experience", value: "4 entries", icon: Briefcase },
  { label: "Projects", value: "3 recent", icon: Blocks },
  { label: "Gallery", value: "6 uploads", icon: ImagePlus },
  { label: "Session", value: "Active", icon: ShieldCheck },
] as const;

const heroGalleryAssets = [
  { name: "studio-shot.webp", status: "Uploaded" },
  { name: "launch-card.png", status: "Ready" },
  { name: "case-study.jpg", status: "Ready" },
] as const;

const heroCommunityItems = [
  "Star repo",
  "Report issue",
  "Suggest template",
] as const;

const TECH_STACK_MARQUEE = [
  {
    label: "Next.js 16",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    icon: SiNextdotjs, // fallback icon
  },
  {
    label: "Clerk Auth",
    src: "https://clerk.com/favicon.ico",
    icon: SiClerk,
  },
  {
    label: "Supabase",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",
    icon: SiSupabase,
  },
  {
    label: "Tailwind v4",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    icon: SiTailwindcss,
  },
  {
    label: "GSAP",
    src: "https://cdn.worldvectorlogo.com/logos/gsap-greensock.svg",
    icon: SiGreensock,
  },
  {
    label: "TypeScript",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    icon: SiTypescript,
  },
  {
    label: "Prisma",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg",
    icon: SiPrisma,
  },
] as const;

function LogoWithFallback({
  item,
}: {
  item: (typeof TECH_STACK_MARQUEE)[number];
}) {
  const [failed, setFailed] = useState(false);
  const Icon = item.icon;

  if (failed) return <Icon className="w-4 h-4 shrink-0 opacity-60" />;

  return (
    <img
      src={item.src}
      alt={item.label}
      className="w-8 h-8 shrink-0 opacity-60"
      onError={() => setFailed(true)}
    />
  );
}

export function StackSection() {
  return (
    <section id="stack" className="relative mt-9 h-full py-4">
      <div className="[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] w-200 grayscale">
        <Marquee speed={20} pauseOnHover loop={0}>
          {TECH_STACK_MARQUEE.map((item) => (
            <span
              key={item.label}
              className="flex items-center gap-2 mx-2 rounded-full px-4 py-2 text-sm font-medium text-foreground-soft whitespace-nowrap grayscale"
            >
              <LogoWithFallback item={item} />
              {item.label}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

type HomepageExperienceProps = {
  startBuildingHref: string;
};

export function HomepageExperience({
  startBuildingHref,
}: HomepageExperienceProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from("[data-hero-item]", {
        opacity: 0,
        y: 28,
        duration: 0.75,
        stagger: 0.08,
        ease: "power3.out",
      });

      gsap.from("[data-hero-panel]", {
        opacity: 0,
        y: 44,
        scale: 0.98,
        duration: 0.9,
        stagger: 0.1,
        delay: 0.22,
        ease: "power3.out",
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 56,
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="flex flex-col items-center space-y-24 pt-10 md:space-y-28 md:pt-14"
    >
      <div className="relative space-y-12">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h1
            data-hero-item
            className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.07em] text-foreground md:text-7xl"
          >
            Launch a portfolio with a
            <span className="block text-accent">cleaner product feel</span>
          </h1>
          <p
            data-hero-item
            className="mt-6 max-w-2xl text-base leading-7 text-foreground-muted md:text-lg md:leading-8"
          >
            DevFrame gives developers a dark, focused Studio for drafting,
            previewing, and publishing a shareable portfolio route without the
            usual clutter.
          </p>
          <div
            data-hero-item
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild size="sm" variant="accent">
              <Link href={startBuildingHref}>Open Studio</Link>
            </Button>
            <Button asChild size="sm" variant="secondary">
              <Link href="/templates">Browse templates</Link>
            </Button>
          </div>
          <StackSection />
        </div>

        <div className="h-[600px] shrink-0 mask-[radial-gradient(white_30%,transparent_90%)] perspective-[4000px] perspective-origin-center">
          <div className="translate-y-8 rotate-x-8 rotate-y-12 -rotate-z-6 transform-3d scale-[0.82] origin-top">
            <Card data-hero-panel className="border-border">
              <CardContent className="p-0">
                <div className="grid gap-0 md:grid-cols-[0.86fr_1.14fr]">
                  <div className="border-b border-border p-6 md:border-b-0 md:border-r">
                    <div className="flex items-center justify-between gap-3">
                      <span className="section-label">Portfolio command</span>
                      <Badge variant="warning">Draft preview</Badge>
                    </div>
                    <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-foreground">
                      One workspace behind a real public portfolio.
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-foreground-muted">
                      Studio drafts, structured content, Dashboard state, and
                      template settings all feed the same portfolio record.
                    </p>
                    <div className="mt-6 grid gap-3">
                      <div className="rounded-2xl border border-border bg-surface p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                            Public route
                          </p>
                          <Globe className="size-4 text-accent" />
                        </div>
                        <p className="mt-2 font-mono text-lg font-semibold text-foreground">
                          /p/maya-rivera
                        </p>
                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-accent">
                          Live on DevFrame
                        </p>
                      </div>
                      <div className="rounded-2xl border border-border bg-surface p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                            Template system
                          </p>
                          <Palette className="size-4 text-accent" />
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {heroTemplateOptions.map((template) => (
                            <span
                              key={template}
                              className={
                                template === "Drift"
                                  ? "rounded-xl border border-accent/40 bg-accent-soft px-3 py-2 text-center text-xs font-semibold text-accent"
                                  : "rounded-xl border border-border bg-surface-strong px-3 py-2 text-center text-xs text-foreground-muted"
                              }
                            >
                              {template}
                            </span>
                          ))}
                        </div>
                        <p className="mt-3 text-sm leading-6 text-foreground-muted">
                          Drift template, warm accent, gallery section enabled.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-6">
                    <div className="rounded-[26px] border border-border bg-surface-soft p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                            Live portfolio preview
                          </p>
                          <p className="mt-2 text-lg font-semibold text-foreground">
                            Maya Rivera, product engineer
                          </p>
                        </div>
                        <Badge>Drift</Badge>
                      </div>
                      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                        <div className="rounded-2xl border border-border bg-background/60 p-4">
                          <div className="flex items-center gap-3">
                            <div className="size-12 rounded-2xl border border-border bg-[linear-gradient(135deg,#c9a96e,#5c6f7a_54%,#202020)]" />
                            <div>
                              <p className="font-semibold text-foreground">
                                Frontend systems for developer tools.
                              </p>
                              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-foreground-soft">
                                Available for product teams
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 grid gap-2 sm:grid-cols-2">
                            {heroContentModules.map((item) => {
                              const Icon = item.icon;

                              return (
                                <div
                                  key={item.label}
                                  className="rounded-xl border border-border bg-surface px-3 py-2.5"
                                >
                                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground-soft">
                                    <Icon className="size-3.5 text-accent" />
                                    {item.label}
                                  </div>
                                  <p className="mt-1 text-sm font-semibold text-foreground">
                                    {item.value}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-border bg-surface p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                              Gallery uploads
                            </p>
                            <UploadCloud className="size-4 text-accent" />
                          </div>
                          <div className="mt-3 space-y-2">
                            {heroGalleryAssets.map((asset, index) => (
                              <div
                                key={asset.name}
                                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-strong px-3 py-2"
                              >
                                <div className="flex items-center gap-3">
                                  <span
                                    className="size-8 rounded-lg border border-border bg-surface"
                                    style={{
                                      backgroundImage: `linear-gradient(135deg, rgba(201,169,110,${
                                        0.34 + index * 0.16
                                      }), rgba(255,255,255,0.06))`,
                                    }}
                                  />
                                  <span className="text-xs font-medium text-foreground-muted">
                                    {asset.name}
                                  </span>
                                </div>
                                <span className="text-xs font-semibold text-accent">
                                  {asset.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
                      <div className="rounded-[24px] border border-border bg-surface p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                          Product modules
                        </p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                          {heroWorkflowModules.map((item) => {
                            const Icon = item.icon;

                            return (
                              <div
                                key={item.label}
                                className="rounded-2xl border border-border bg-surface-strong px-4 py-3"
                              >
                                <Icon className="size-4 text-accent" />
                                <p className="mt-3 text-sm font-semibold text-foreground">
                                  {item.label}
                                </p>
                                <p className="mt-1 text-xs text-foreground-muted">
                                  {item.value}
                                </p>
                                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground-soft">
                                  {item.detail}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-border bg-surface p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                          Open source loop
                        </p>
                        <div className="mt-4 space-y-2">
                          {heroCommunityItems.map((item) => (
                            <div
                              key={item}
                              className="rounded-xl border border-border bg-surface-strong px-3 py-2 text-xs font-medium text-foreground-muted"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                        <p className="mt-4 text-xs leading-5 text-foreground-muted">
                          Support page links GitHub, issues, feature requests,
                          and optional GoTyme or GCash support.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ── Platform features ───────────────────────────── */}
      <section data-reveal className="space-y-14 w-full">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center space-y-5">
          <span className="section-label">Platform features</span>
          <h2 className="text-4xl font-semibold tracking-[-0.07em] text-foreground md:text-5xl">
            One dark system, every surface.
          </h2>
          <p className="text-base leading-7 text-foreground-muted">
            The same calm design language runs through Studio, the structured
            editor, auth flow, and every public portfolio route.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {platformCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group rounded-[26px] border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-strong"
              >
                <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface-strong text-accent">
                  <Icon className="size-4" />
                </span>
                <p className="mt-5 text-base font-semibold tracking-[-0.02em] text-foreground">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground-muted">
                  {item.description}
                </p>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                  {item.detail}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Workflow ─────────────────────────────────────── */}
      <section data-reveal className="w-full">
        <div className="rounded-[28px] border border-border bg-surface overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[1fr_1.2fr]">
            {/* Left — text + steps */}
            <div className="border-b border-border p-8 md:p-10 lg:border-b-0 lg:border-r space-y-6">
              <div className="space-y-4">
                <span className="section-label">Workflow</span>
                <h2 className="text-3xl font-semibold tracking-[-0.06em] text-foreground md:text-4xl">
                  From blank slate to live portfolio in four steps.
                </h2>
                <p className="text-sm leading-7 text-foreground-muted">
                  No sprawling settings page. Open Studio, refine the content,
                  check setup status, then publish.
                </p>
              </div>

              <div className="grid gap-3">
                {workflow.map((item, index) => (
                  <div
                    key={item.title}
                    className="flex gap-4 rounded-2xl border border-border bg-surface px-4 py-4"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-strong font-mono text-xs text-accent">
                      0{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-foreground-muted">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — quick stats panel */}
            <div className="grid gap-4 p-8 md:p-10 bg-surface-soft/50 content-start">
              <div className="rounded-[20px] border border-border bg-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                  What you fill in once
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    "Name & role",
                    "Stack skills",
                    "Featured project",
                    "Social links",
                    "Bio",
                    "Public slug",
                  ].map((field) => (
                    <div
                      key={field}
                      className="rounded-xl border border-border bg-surface-strong px-3 py-2.5 text-sm text-foreground-muted"
                    >
                      {field}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[20px] border border-border bg-surface p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                    Templates
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                    3
                  </p>
                  <p className="mt-1 text-sm text-foreground-muted">
                    Directions, one system
                  </p>
                </div>
                <div className="rounded-[20px] border border-border bg-surface p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                    Setup
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                    ~5<span className="text-lg text-foreground-muted">min</span>
                  </p>
                  <p className="mt-1 text-sm text-foreground-muted">
                    To live portfolio
                  </p>
                </div>
              </div>

              <div className="rounded-[20px] border border-border bg-surface px-5 py-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                    Public at
                  </p>
                  <p className="mt-2 text-base font-semibold text-foreground">
                    /p/your-username
                  </p>
                </div>
                <Globe className="size-5 text-accent shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Template system ──────────────────────────────── */}
      <section data-reveal className="space-y-14 w-full">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center space-y-5">
          <span className="section-label">Templates</span>
          <h2 className="text-4xl font-semibold tracking-[-0.07em] text-foreground md:text-5xl">
            Three directions, one design system.
          </h2>
          <p className="text-base leading-7 text-foreground-muted">
            Nova, Vertex, or Drift - each has its own personality but sits on
            the same dark foundation.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {TEMPLATE_CATALOG.map((template) => (
            <div
              key={template.slug}
              className="group rounded-[26px] border border-border bg-surface overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong"
            >
              <div
                className={`h-[3px] w-full bg-gradient-to-r ${template.accent}`}
              />
              <div className="gap-5 p-6 h-full flex flex-col">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                    {template.name}
                  </p>
                  <Blocks className="size-4 text-foreground-soft" />
                </div>
                <div>
                  <p className="text-xl font-semibold tracking-[-0.04em] text-foreground">
                    {template.tagline}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground-muted">
                    {template.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {template.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full border border-border bg-surface-strong px-3 py-1.5 text-xs text-foreground-muted"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="w-full mt-auto"
                >
                  <Link href={`/studio?template=${template.slug}`}>
                    Use in Studio
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section data-reveal className="w-full pb-10">
        <div className="rounded-[28px] border border-border bg-surface overflow-hidden relative">
          <div className="relative flex flex-col items-center text-center gap-8 p-12 md:p-16">
            <div className="max-w-2xl flex flex-col items-center gap-5">
              <span className="section-label">Get started</span>
              <h2 className="text-4xl font-semibold tracking-[-0.07em] text-foreground md:text-5xl">
                Ship a portfolio that looks production-ready.
              </h2>
              <p className="text-base leading-7 text-foreground-muted">
                Open the live Studio, shape the draft, and publish to a live
                route without config sprawl or blank-canvas paralysis.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="accent">
                <Link href={startBuildingHref}>
                  Open Studio
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/templates">Browse templates</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
