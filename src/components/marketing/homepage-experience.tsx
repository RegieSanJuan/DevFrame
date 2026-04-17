"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Braces,
  CheckCircle2,
  Code2,
  Globe,
  LayoutTemplate,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TEMPLATE_CATALOG } from "@/lib/template-catalog";

const trustSignals = [
  "Next.js",
  "Clerk",
  "Supabase",
  "Vercel",
  "TypeScript",
  "Tailwind CSS",
];

const productSignals = [
  {
    title: "Template-first setup",
    description:
      "Start with a ready-made visual direction, then let DevFrame guide developers through the content needed to publish it.",
    icon: LayoutTemplate,
  },
  {
    title: "Authentication built in",
    description:
      "Use Clerk for sign-up, sign-in, and user management so your portfolio builder feels production-ready from the first release.",
    icon: ShieldCheck,
  },
  {
    title: "Publish to a clean route",
    description:
      "Every portfolio can ship to a shareable URL like `/p/regie`, ready for Vercel deployment and later custom domains.",
    icon: Globe,
  },
];

const experienceSteps = [
  "Choose a visual template that matches your style.",
  "Fill in your intro, links, skills, and featured project.",
  "Publish a polished portfolio route in minutes.",
];

const stackCards = [
  "Next.js App Router",
  "Tailwind CSS + shadcn-style UI",
  "Clerk authentication",
  "Supabase PostgreSQL + Storage",
  "GSAP motion system",
  "Vercel-ready deployment",
];

export function HomepageExperience() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const heroTimeline = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      heroTimeline
        .from("[data-hero-badge]", {
          opacity: 0,
          y: 20,
          duration: 0.55,
        })
        .from(
          "[data-hero-title]",
          {
            opacity: 0,
            y: 42,
            duration: 0.9,
          },
          "-=0.2",
        )
        .from(
          "[data-hero-copy]",
          {
            opacity: 0,
            y: 26,
            duration: 0.7,
          },
          "-=0.5",
        )
        .from(
          "[data-hero-actions]",
          {
            opacity: 0,
            y: 18,
            duration: 0.55,
          },
          "-=0.35",
        )
        .from(
          "[data-hero-stat]",
          {
            opacity: 0,
            y: 22,
            duration: 0.45,
            stagger: 0.1,
          },
          "-=0.25",
        )
        .from(
          "[data-stage-card]",
          {
            opacity: 0,
            y: 42,
            scale: 0.96,
            duration: 0.85,
            stagger: 0.12,
          },
          "-=0.45",
        );

      gsap.to("[data-float='soft']", {
        y: (index) => (index % 2 === 0 ? -12 : 12),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        duration: 4.8,
        stagger: 0.35,
      });

      gsap.to("[data-orb='one']", {
        x: 18,
        y: -24,
        duration: 7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to("[data-orb='two']", {
        x: -14,
        y: 16,
        duration: 8.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.from("[data-logo-item]", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.08,
        scrollTrigger: {
          trigger: "[data-proof]",
          start: "top 82%",
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((section) => {
        gsap.fromTo(
          section,
          {
            opacity: 0,
            y: 64,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
            },
          },
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="space-y-20 pt-4 md:space-y-28 md:pt-8">
      <section className="relative overflow-hidden rounded-[40px] border border-slate-900/10 bg-white/82 shadow-[0_40px_120px_-72px_rgba(15,23,42,0.5)]">
        <div
          data-orb="one"
          className="absolute left-[6%] top-[12%] size-40 rounded-full bg-sky-200/40 blur-3xl"
        />
        <div
          data-orb="two"
          className="absolute bottom-[8%] right-[10%] size-48 rounded-full bg-indigo-200/35 blur-3xl"
        />
        <div className="absolute inset-0 opacity-80 [background-image:linear-gradient(rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.05)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative grid gap-10 px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
          <div className="space-y-8">
            <div data-hero-badge>
              <Badge className="border-slate-900/10 bg-white text-slate-600">
                DevFrame for developers
              </Badge>
            </div>

            <div className="space-y-5">
              <h1
                data-hero-title
                className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-slate-950 md:text-7xl"
              >
                More than portfolio templates, complete developer presence.
              </h1>
              <p
                data-hero-copy
                className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl"
              >
                DevFrame lets developers sign in, choose a template, fill out a
                guided portfolio builder, and launch a polished public site in
                minutes with a flow that feels premium from the very first click.
              </p>
            </div>

            <div
              data-hero-actions
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button asChild size="lg" variant="accent">
                <Link href="/templates">
                  Start building
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/builder">Open the builder</Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div
                data-hero-stat
                className="rounded-[24px] border border-slate-900/10 bg-white/85 p-5"
              >
                <p className="font-mono text-sm uppercase tracking-[0.28em] text-slate-400">
                  Templates
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">3</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  polished starter directions
                </p>
              </div>
              <div
                data-hero-stat
                className="rounded-[24px] border border-slate-900/10 bg-white/85 p-5"
              >
                <p className="font-mono text-sm uppercase tracking-[0.28em] text-slate-400">
                  Publish
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">/p</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  clean public routes for every portfolio
                </p>
              </div>
              <div
                data-hero-stat
                className="rounded-[24px] border border-slate-900/10 bg-white/85 p-5"
              >
                <p className="font-mono text-sm uppercase tracking-[0.28em] text-slate-400">
                  Motion
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">
                  GSAP
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  subtle movement that makes the page feel alive
                </p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[560px]">
            <Card
              data-stage-card
              data-float="soft"
              className="absolute left-0 top-6 w-[70%] rounded-[32px] border-slate-900/10 bg-white/92"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-400">
                    TemplatePicker
                  </p>
                  <Badge>Live</Badge>
                </div>
                <div className="mt-5 space-y-3">
                  {TEMPLATE_CATALOG.map((template) => (
                    <div
                      key={template.slug}
                      className="rounded-[20px] border border-slate-900/10 bg-slate-50 p-4"
                    >
                      <div
                        className={`h-2 w-full rounded-full bg-gradient-to-r ${template.accent}`}
                      />
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-950">
                            {template.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {template.tagline}
                          </p>
                        </div>
                        <CheckCircle2 className="size-5 text-emerald-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card
              data-stage-card
              className="absolute inset-x-[10%] top-18 z-10 rounded-[36px] border-slate-900/10 bg-slate-950 text-white shadow-[0_40px_100px_-60px_rgba(15,23,42,0.85)]"
            >
              <CardContent className="space-y-6 p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/45">
                      PortfolioBuilder
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold">
                      Create your account and publish in minutes
                    </h2>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/70">
                    Ready for Clerk + Supabase
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
                    <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/45">
                      Form fields
                    </p>
                    <div className="mt-4 space-y-3">
                      {[
                        "Name",
                        "Role",
                        "Location",
                        "Skills",
                        "Featured project",
                      ].map((item) => (
                        <div
                          key={item}
                          className="rounded-full border border-white/8 bg-white/6 px-4 py-3 text-sm text-white/72"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-sky-500/22 via-indigo-500/18 to-cyan-400/16 p-5">
                    <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/45">
                      Portfolio output
                    </p>
                    <div className="mt-4 rounded-[24px] border border-white/10 bg-slate-950/55 p-5">
                      <p className="text-sm text-white/52">Public route</p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        devframe.com/p/regie
                      </p>
                      <div className="mt-5 grid gap-3">
                        <div className="rounded-[18px] border border-white/8 bg-white/5 px-4 py-3 text-sm text-white/70">
                          Signal template selected
                        </div>
                        <div className="rounded-[18px] border border-white/8 bg-white/5 px-4 py-3 text-sm text-white/70">
                          Portfolio ready to share
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              data-stage-card
              data-float="soft"
              className="absolute bottom-0 right-0 w-[58%] rounded-[30px] border-slate-900/10 bg-white/94"
            >
              <CardContent className="space-y-5 p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-400">
                    PublishedPortfolio
                  </p>
                  <ArrowUpRight className="size-4 text-slate-400" />
                </div>
                <div className="rounded-[24px] border border-slate-900/10 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Frontend Developer</p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                    Regie Cruz
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    I build fast, polished web products with thoughtful UX and
                    clean front-end architecture.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Next.js", "TypeScript", "Supabase"].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-900/10 bg-white px-3 py-2 text-sm text-slate-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        data-proof
        className="rounded-[34px] border border-slate-900/10 bg-white/78 px-6 py-7 shadow-[0_32px_90px_-72px_rgba(15,23,42,0.5)]"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-400">
              Built with the tools modern developers already trust
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The DevFrame marketing experience stays aligned with the exact stack
              powering the actual app.
            </p>
          </div>
          <div className="grid flex-1 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {trustSignals.map((item) => (
              <div
                key={item}
                data-logo-item
                className="rounded-full border border-slate-900/10 bg-slate-50 px-4 py-3 text-center text-sm font-semibold text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        data-reveal
        className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center"
      >
        <div className="space-y-6">
          <Badge>Portfolio components</Badge>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] text-slate-950 md:text-5xl">
            Pixel-sharp building blocks, arranged like a premium product.
          </h2>
          <p className="max-w-xl text-lg leading-8 text-slate-600">
            Clerk’s homepage makes product UI feel tangible. DevFrame should do
            the same, so the landing page now shows the builder, template system,
            and publish flow as real product surfaces instead of generic cards.
          </p>
          <div className="space-y-4">
            {productSignals.map((signal) => {
              const Icon = signal.icon;

              return (
                <div
                  key={signal.title}
                  className="flex gap-4 rounded-[24px] border border-slate-900/10 bg-white/80 p-5"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-lg font-semibold text-slate-950">
                      {signal.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {signal.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Card className="overflow-hidden rounded-[36px] border-slate-900/10">
          <CardContent className="p-0">
            <div className="grid gap-0 md:grid-cols-[0.72fr_1.28fr]">
              <div className="border-b border-slate-900/10 bg-slate-950 p-7 text-white md:border-b-0 md:border-r">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/45">
                  Components
                </p>
                <h3 className="mt-4 text-3xl font-semibold">
                  UI that explains the product before users sign in.
                </h3>
                <div className="mt-6 space-y-3">
                  {[
                    "<TemplatePicker />",
                    "<PortfolioBuilder />",
                    "<PortfolioPreview />",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-full border border-white/10 bg-white/7 px-4 py-3 font-mono text-sm text-white/78"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 bg-white p-7">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[28px] border border-slate-900/10 bg-slate-50 p-5">
                    <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-400">
                      Template styles
                    </p>
                    <div className="mt-4 space-y-3">
                      {TEMPLATE_CATALOG.map((template) => (
                        <div
                          key={template.slug}
                          className="rounded-[18px] border border-slate-900/10 bg-white p-4"
                        >
                          <div
                            className={`h-2 w-full rounded-full bg-gradient-to-r ${template.accent}`}
                          />
                          <p className="mt-3 text-sm font-semibold text-slate-950">
                            {template.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-slate-900/10 bg-slate-50 p-5">
                    <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-400">
                      Publish checklist
                    </p>
                    <div className="mt-4 space-y-3">
                      {experienceSteps.map((step) => (
                        <div
                          key={step}
                          className="flex gap-3 rounded-[18px] border border-slate-900/10 bg-white p-4"
                        >
                          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" />
                          <p className="text-sm leading-6 text-slate-600">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-900/10 bg-slate-950 p-5 text-white">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/45">
                        Public result
                      </p>
                      <p className="mt-2 text-2xl font-semibold">
                        Launch a developer portfolio that feels custom, even when
                        it started from a template.
                      </p>
                    </div>
                    <Button asChild variant="accent" size="sm">
                      <Link href="/templates">
                        Explore templates
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section data-reveal className="space-y-8">
        <div className="max-w-2xl">
          <Badge>DevFrame flow</Badge>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950 md:text-5xl">
            From account creation to public portfolio, without a dead step.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            The front page should preview the same sequence users will actually
            follow inside the product: authenticate, choose a design, complete a
            structured form, and publish a page worth sharing.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {productSignals.map((signal) => {
            const Icon = signal.icon;

            return (
              <Card key={signal.title} className="rounded-[32px]">
                <CardContent className="space-y-4 p-6">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-2xl font-semibold text-slate-950">
                      {signal.title}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {signal.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section
        data-reveal
        className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-stretch"
      >
        <Card className="rounded-[36px] border-slate-900/10 bg-slate-950 text-white">
          <CardContent className="flex h-full flex-col justify-between gap-8 p-8">
            <div>
              <Badge className="border-white/10 bg-white/8 text-white/70">
                Chosen stack
              </Badge>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em]">
                Designed for the exact stack you already picked.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-white/72">
                DevFrame’s marketing layer now reflects the same technical
                confidence as the app itself: Next.js, shadcn-style UI,
                Clerk, Supabase, and now GSAP for motion.
              </p>
            </div>

            <div className="grid gap-3">
              {stackCards.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/6 px-4 py-4"
                >
                  <Code2 className="size-5 text-sky-300" />
                  <span className="text-sm text-white/78">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[36px] overflow-hidden border-slate-900/10">
          <CardContent className="space-y-6 p-8">
            <div>
              <Badge>What visitors should feel</Badge>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-slate-950">
                Intentional, polished, and unmistakably product-led.
              </h2>
            </div>

            <div className="grid gap-4">
              {[
                {
                  title: "Clear visual hierarchy",
                  body: "A big centered hero, strong navigation, and product UI previews like Clerk’s homepage make the value obvious quickly.",
                  icon: Braces,
                },
                {
                  title: "Meaningful motion",
                  body: "GSAP entrance and reveal animations create atmosphere without turning the page into noise.",
                  icon: Sparkles,
                },
                {
                  title: "Real product storytelling",
                  body: "The homepage now sells the actual DevFrame flow instead of acting like a generic template marketplace.",
                  icon: CheckCircle2,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[24px] border border-slate-900/10 bg-slate-50 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-950">
                        <Icon className="size-5" />
                      </span>
                      <div>
                        <p className="text-lg font-semibold text-slate-950">
                          {item.title}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      <section data-reveal>
        <Card className="overflow-hidden rounded-[40px] border-slate-900/10 bg-white/88">
          <CardContent className="relative p-8 md:p-10">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <Badge>Launch faster</Badge>
                <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-slate-950 md:text-5xl">
                  Build the marketing feel now, then keep shipping the product.
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                  The homepage is now much closer to the kind of high-trust
                  experience you pointed at on Clerk: cleaner framing, better
                  product previews, and richer motion while still staying true to
                  DevFrame’s own brand and product flow.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button asChild size="lg" variant="accent">
                  <Link href="/templates">
                    Preview template gallery
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/dashboard">
                    Open dashboard
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
