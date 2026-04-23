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
  Braces,
  Globe,
  Layers3,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Marquee from "react-fast-marquee";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

const platformCards = [
  {
    title: "A calmer control surface",
    description:
      "Move between templates, builder fields, and publishing status inside one dark workspace.",
    icon: LayoutDashboard,
    detail: "Dashboard-first flow",
  },
  {
    title: "One dataset, multiple looks",
    description:
      "Keep your portfolio content structured once, then switch presentation styles without rebuilding.",
    icon: Layers3,
    detail: "Template swapping",
  },
  {
    title: "Short, focused builder steps",
    description:
      "Inputs stay readable, spaced, and publish-ready instead of turning into a crowded form wall.",
    icon: Braces,
    detail: "Fewer noisy fields",
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
    title: "Complete the builder",
    description:
      "Add your intro, links, skills, and featured work in one pass.",
  },
  {
    title: "Review setup health",
    description: "See auth and persistence status without leaving the flow.",
  },
  {
    title: "Publish the route",
    description: "Open the public portfolio immediately and keep iterating.",
  },
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

export function HomepageExperience() {
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

      gsap.to("[data-glow='one']", {
        x: 20,
        y: -18,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to("[data-glow='two']", {
        x: -16,
        y: 22,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
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
            DevFrame gives developers a dark, focused workspace for publishing a
            shareable portfolio route without the usual clutter.
          </p>
          <div
            data-hero-item
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild size="sm" variant="accent">
              <Link href="/builder">Open the builder</Link>
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
                <div className="grid gap-0 md:grid-cols-[0.84fr_1.16fr]">
                  <div className="border-b border-border p-6 md:border-b-0 md:border-r">
                    <div className="flex items-center justify-between gap-3">
                      <span className="section-label">Control center</span>
                      <Badge variant="success">Live draft</Badge>
                    </div>
                    <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-foreground">
                      Publish without losing the builder context.
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-foreground-muted">
                      The editing flow stays centered around cards, short
                      labels, and readable route details instead of a busy admin
                      panel.
                    </p>
                    <div className="mt-6 grid gap-3">
                      <div className="rounded-2xl border border-border bg-surface px-4 py-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                          Public route
                        </p>
                        <p className="mt-2 text-lg font-semibold text-foreground">
                          /p/your-username
                        </p>
                      </div>
                      <div className="rounded-2xl border border-border bg-surface px-4 py-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                          Current template
                        </p>
                        <p className="mt-2 text-lg font-semibold text-foreground">
                          Signal
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-6">
                    <div className="rounded-[26px] border border-border bg-surface-soft p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                            Builder fields
                          </p>
                          <p className="mt-2 text-lg font-semibold text-foreground">
                            Tight, readable form sections
                          </p>
                        </div>
                        <Braces className="size-5 text-accent" />
                      </div>
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {["Name", "Role", "Skills", "Featured project"].map(
                          (item) => (
                            <div
                              key={item}
                              className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground-muted"
                            >
                              {item}
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[24px] border border-border bg-surface p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                          Setup
                        </p>
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center justify-between text-sm text-foreground-muted">
                            <span>Clerk auth</span>
                            <span className="text-accent">Ready</span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-foreground-muted">
                            <span>Supabase read</span>
                            <span className="text-accent">Ready</span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-foreground-muted">
                            <span>Supabase write</span>
                            <span className="text-foreground-soft">
                              Optional
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-border bg-surface p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                          Output
                        </p>
                        <div className="mt-4 space-y-3">
                          {["Hero", "About", "Skills", "Project"].map(
                            (item) => (
                              <div
                                key={item}
                                className="rounded-2xl border border-border bg-surface-strong px-4 py-3 text-sm text-foreground-muted"
                              >
                                {item}
                              </div>
                            ),
                          )}
                        </div>
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
            The same calm design language runs through the builder, templates,
            auth flow, and every public portfolio route.
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
      <section
        data-reveal
        className="w-full"
      >
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
                  No sprawling settings page. Pick a template, fill the fields,
                  check setup status, then publish — done.
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
                  {["Name & role", "Stack skills", "Featured project", "Social links", "Bio", "Public slug"].map((field) => (
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
            Signal, Atlas, or Pulse — each has its own personality but sits
            on the same dark foundation.
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
              <div className="space-y-5 p-6">
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
                <Button asChild variant="secondary" size="sm" className="w-full">
                  <Link href={`/builder?template=${template.slug}`}>
                    Use {template.name}
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
        <div className="rounded-[28px] border border-border bg-surface-strong overflow-hidden relative">
          <div className="relative flex flex-col items-center text-center gap-8 p-12 md:p-16">
            <div className="max-w-2xl flex flex-col items-center gap-5">
              <span className="section-label">Get started</span>
              <h2 className="text-4xl font-semibold tracking-[-0.07em] text-foreground md:text-5xl">
                Ship a portfolio that looks production-ready.
              </h2>
              <p className="text-base leading-7 text-foreground-muted">
                Pick a template, fill your details, and publish to a live route
                — no config sprawl, no blank-canvas paralysis.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="accent">
                <Link href="/builder">
                  Open the builder
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
