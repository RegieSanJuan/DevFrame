"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Activity,
  ArrowRight,
  Blocks,
  Braces,
  CheckCheck,
  Globe,
  Layers3,
  LayoutDashboard,
  LayoutTemplate,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Marquee from "react-fast-marquee";

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
      <div className="[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] w-200 ">
        <Marquee speed={20} pauseOnHover loop={0}>
          {TECH_STACK_MARQUEE.map((item) => (
            <span
              key={item.label}
              className="flex items-center gap-2 mx-2 rounded-full px-4 py-2 text-sm font-medium text-foreground-soft whitespace-nowrap"
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
      className="flex flex-col items-center space-y-24 pt-10 md:space-y-28 md:pt-14 px-60"
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
            DevFrame gives developers a dark, focused workspace for choosing a
            template, editing content, checking setup health, and publishing a
            shareable portfolio route without the usual clutter.
          </p>
          <div
            data-hero-item
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
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
          <StackSection />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <Card data-hero-panel className="overflow-hidden border-white/10">
            <CardContent className="p-0">
              <div className="grid gap-0 md:grid-cols-[0.84fr_1.16fr]">
                <div className="border-b border-white/8 p-6 md:border-b-0 md:border-r">
                  <div className="flex items-center justify-between gap-3">
                    <span className="section-label">Control center</span>
                    <Badge variant="success">Live draft</Badge>
                  </div>
                  <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-foreground">
                    Publish without losing the builder context.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-foreground-muted">
                    The editing flow stays centered around cards, short labels,
                    and readable route details instead of a busy admin panel.
                  </p>
                  <div className="mt-6 grid gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                        Public route
                      </p>
                      <p className="mt-2 text-lg font-semibold text-foreground">
                        /p/regie-codes
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
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
                  <div className="rounded-[26px] border border-white/10 bg-surface-soft p-5">
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
                            className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-foreground-muted"
                          >
                            {item}
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
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
                          <span className="text-foreground-soft">Optional</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                        Output
                      </p>
                      <div className="mt-4 space-y-3">
                        {["Hero", "About", "Skills", "Project"].map((item) => (
                          <div
                            key={item}
                            className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-foreground-muted"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-5">
            <Card data-hero-panel className="border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="section-label">Template state</span>
                  <LayoutTemplate className="size-5 text-accent" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  Swap direction, keep the same content model.
                </h3>
                <div className="mt-5 space-y-3">
                  {TEMPLATE_CATALOG.map((template) => (
                    <div
                      key={template.slug}
                      className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div
                        className={`h-2 w-full rounded-full bg-gradient-to-r ${template.accent}`}
                      />
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {template.name}
                          </p>
                          <p className="text-sm text-foreground-muted">
                            {template.tagline}
                          </p>
                        </div>
                        <CheckCheck className="size-4 text-accent" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card data-hero-panel className="border-white/10 bg-surface-strong">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="section-label">Why this works</span>
                  <ShieldCheck className="size-5 text-accent" />
                </div>
                <div className="mt-5 space-y-4">
                  {[
                    "Shorter labels make the shell feel lighter.",
                    "Dark surfaces keep cards and forms visually grouped.",
                    "Green accents only show up where action matters.",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-foreground-muted"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <section className="relative overflow-hidden rounded-[40px] border border-white/8 bg-background-alt/82 px-6 py-10 md:px-10 md:py-14 lg:px-14">
        <div
          data-glow="one"
          className="pointer-events-none absolute left-[7%] top-0 size-44 rounded-full bg-accent/14 blur-3xl"
        />
        <div
          data-glow="two"
          className="pointer-events-none absolute bottom-0 right-[9%] size-52 rounded-full bg-accent/10 blur-3xl"
        />
        <div className="pointer-events-none absolute inset-0 subtle-grid opacity-30 [mask-image:linear-gradient(to_bottom,white,transparent_82%)]" />
      </section>

      <section data-reveal className="space-y-6">
        <div className="max-w-2xl space-y-4">
          <span className="section-label">Platform features</span>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] text-foreground md:text-5xl">
            Dark, breathable UI across the whole portfolio workflow.
          </h2>
          <p className="text-base leading-7 text-foreground-muted md:text-lg md:leading-8">
            The redesign is not just a new hero. It sets the same dark system
            underneath the navbar, builder, cards, auth, and public portfolio
            pages so the product feels like one platform.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {platformCards.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="group border-white/10 transition-transform duration-200 hover:-translate-y-1 hover:border-accent/28"
              >
                <CardContent className="space-y-5 p-6">
                  <span className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-accent">
                    <Icon className="size-5" />
                  </span>
                  <div className="space-y-3">
                    <p className="text-xl font-semibold tracking-[-0.03em] text-foreground">
                      {item.title}
                    </p>
                    <p className="text-sm leading-7 text-foreground-muted">
                      {item.description}
                    </p>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                    {item.detail}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section
        data-reveal
        className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start"
      >
        <div className="space-y-5">
          <span className="section-label">Workflow</span>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] text-foreground md:text-5xl">
            Cleaner steps from setup to published route.
          </h2>
          <p className="text-base leading-7 text-foreground-muted md:text-lg md:leading-8">
            The interface now centers around fewer, stronger panels so
            developers can understand where they are, what is ready, and what
            gets published next.
          </p>

          <div className="grid gap-4">
            {workflow.map((item, index) => (
              <Card
                key={item.title}
                className="border-white/10 bg-white/[0.02] shadow-none"
              >
                <CardContent className="flex gap-4 p-5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] font-mono text-sm text-accent">
                    0{index + 1}
                  </span>
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-foreground-muted">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden border-white/10">
          <CardContent className="p-0">
            <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
              <div className="border-b border-white/8 p-6 md:border-b-0 md:border-r">
                <span className="section-label">Builder preview</span>
                <h3 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-foreground">
                  A builder that looks closer to the final product.
                </h3>
                <p className="mt-4 text-sm leading-7 text-foreground-muted">
                  Cards, route details, and setup feedback are treated like
                  product surfaces, not placeholders.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row md:flex-col">
                  <Button asChild variant="accent">
                    <Link href="/dashboard">
                      Open dashboard
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href="/builder">Edit portfolio</Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 bg-surface-soft p-6">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                    Summary
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/8 bg-black/15 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-foreground-soft">
                        Status
                      </p>
                      <p className="mt-2 text-sm font-semibold text-accent">
                        Ready to publish
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-black/15 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-foreground-soft">
                        Template
                      </p>
                      <p className="mt-2 text-sm font-semibold text-foreground">
                        Atlas
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                      Core skills
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["Next.js", "TypeScript", "Supabase", "UI systems"].map(
                        (item) => (
                          <span
                            key={item}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-foreground-muted"
                          >
                            {item}
                          </span>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                      Featured project
                    </p>
                    <p className="mt-4 text-sm font-semibold text-foreground">
                      DevFrame system refresh
                    </p>
                    <p className="mt-2 text-sm leading-6 text-foreground-muted">
                      Dark platform UI, reusable surfaces, builder consistency.
                    </p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-surface-strong p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                        Publish target
                      </p>
                      <p className="mt-2 text-lg font-semibold text-foreground">
                        devframe.app/p/regie-codes
                      </p>
                    </div>
                    <Activity className="size-5 text-accent" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section data-reveal className="space-y-6">
        <div className="max-w-2xl space-y-4">
          <span className="section-label">Template system</span>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] text-foreground md:text-5xl">
            Three portfolio directions, one dark design language.
          </h2>
          <p className="text-base leading-7 text-foreground-muted md:text-lg md:leading-8">
            Each template keeps its own personality, but the surrounding system
            now stays consistent with the same dark surfaces, spacing, and green
            action states.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {TEMPLATE_CATALOG.map((template) => (
            <Card
              key={template.slug}
              className="overflow-hidden border-white/10 transition-transform duration-200 hover:-translate-y-1 hover:border-accent/28"
            >
              <div
                className={`h-2 w-full bg-gradient-to-r ${template.accent}`}
              />
              <CardContent className="space-y-5 p-6">
                <div className="flex items-center justify-between gap-3">
                  <Badge>{template.name}</Badge>
                  <Blocks className="size-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                    {template.tagline}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-foreground-muted">
                    {template.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {template.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground-muted"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
                <Button asChild variant="secondary" className="w-full">
                  <Link href={`/builder?template=${template.slug}`}>
                    Use {template.name}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section data-reveal>
        <Card className="overflow-hidden border-white/10 bg-[radial-gradient(circle_at_top,rgba(62,207,142,0.14),transparent_42%)] bg-surface-strong">
          <CardContent className="flex flex-col gap-8 p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <div className="max-w-2xl">
              <span className="section-label">Start building</span>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-foreground md:text-5xl">
                Publish faster with a UI that already feels production-ready.
              </h2>
              <p className="mt-4 text-base leading-7 text-foreground-muted md:text-lg md:leading-8">
                DevFrame now looks and feels closer to the kind of developer
                platform teams trust: dark, spacious, technical, and consistent
                from marketing page to builder workflow.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Button asChild size="lg" variant="accent">
                <Link href="/builder">
                  Open builder
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/templates">View template catalog</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
