import Link from "next/link";
import { ArrowRight, Globe, LayoutTemplate, ShieldCheck } from "lucide-react";

import { SetupStatus } from "@/components/setup-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSeedPortfolios } from "@/lib/portfolio-storage";
import { TEMPLATE_CATALOG } from "@/lib/template-catalog";

const features = [
  {
    title: "Template-first onboarding",
    description:
      "Developers choose a portfolio style first, then DevFrame guides them through the exact content needed to publish it.",
    icon: LayoutTemplate,
  },
  {
    title: "Auth + dashboard flow",
    description:
      "Clerk powers sign-in and account flows so the product feels real from day one without a week of auth work.",
    icon: ShieldCheck,
  },
  {
    title: "Public portfolio routes",
    description:
      "Each user gets a clean page at `/p/[slug]`, ready for Vercel deployment and future custom domains.",
    icon: Globe,
  },
];

export default function Home() {
  const showcases = getSeedPortfolios();

  return (
    <div className="container-shell space-y-16 pt-8 md:space-y-24 md:pt-12">
      <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="space-y-8">
          <Badge>Developer portfolio SaaS</Badge>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 md:text-7xl">
              Create your developer portfolio in minutes using ready-made templates tailored to your style.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
              DevFrame lets developers sign in, choose a design, fill in a guided form, and instantly launch a personal portfolio with a clean public URL.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="accent">
              <Link href="/templates">
                Browse templates
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/dashboard">Open dashboard</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-slate-900/10 bg-white/80 p-5 backdrop-blur-xl">
              <p className="text-3xl font-semibold text-slate-950">3</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                starter templates already wired into the app
              </p>
            </div>
            <div className="rounded-[24px] border border-slate-900/10 bg-white/80 p-5 backdrop-blur-xl">
              <p className="text-3xl font-semibold text-slate-950">1</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                guided builder form for structured portfolio data
              </p>
            </div>
            <div className="rounded-[24px] border border-slate-900/10 bg-white/80 p-5 backdrop-blur-xl">
              <p className="text-3xl font-semibold text-slate-950">/p</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                dynamic public routes ready for deployment
              </p>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <Badge>Product preview</Badge>
            <CardTitle>From starter idea to public portfolio</CardTitle>
            <CardDescription>
              The first version of DevFrame already supports the core experience you described.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[24px] bg-slate-950 p-6 text-white">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/45">
                Flow
              </p>
              <p className="mt-4 text-2xl font-semibold">
                Home → Sign in → Pick template → Fill form → Publish at `/p/slug`
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {showcases.slice(0, 2).map((portfolio) => (
                <Link
                  key={portfolio.slug}
                  href={`/p/${portfolio.slug}`}
                  className="rounded-[24px] border border-slate-900/10 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-slate-900/20"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                    /p/{portfolio.slug}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-slate-950">
                    {portfolio.name}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {portfolio.title}
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <SetupStatus />

      <section className="grid gap-5 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <Card key={feature.title}>
              <CardHeader>
                <span className="flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Icon className="size-5" />
                </span>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge>Template gallery</Badge>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
              Ready-made portfolio directions
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
              Start with a style that matches the kind of developer you want to present yourself as, then let DevFrame handle the structure.
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/templates">See all templates</Link>
          </Button>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {TEMPLATE_CATALOG.map((template, index) => (
            <Card key={template.slug} className="overflow-hidden">
              <div className={`h-2 w-full bg-gradient-to-r ${template.accent}`} />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge>{template.name}</Badge>
                  <span className="font-mono text-sm text-slate-400">
                    0{index + 1}
                  </span>
                </div>
                <CardTitle>{template.tagline}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Best for
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {template.idealFor}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {template.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full border border-slate-900/10 bg-slate-50 px-4 py-2 text-sm text-slate-600"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button asChild variant="accent" className="flex-1">
                    <Link href={`/builder?template=${template.slug}`}>Choose template</Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href={`/p/${showcases[index]?.slug ?? "regie"}`}>Preview</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
