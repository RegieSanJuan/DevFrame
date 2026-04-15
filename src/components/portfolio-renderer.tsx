import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Mail,
  MapPin,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PortfolioRecord } from "@/lib/portfolio-schema";
import { getTemplateBySlug } from "@/lib/template-catalog";

type PortfolioRendererProps = {
  portfolio: PortfolioRecord;
};

function LinkPill({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: typeof Code2;
}) {
  return (
    <Button asChild variant="secondary" size="sm">
      <a href={href} target="_blank" rel="noreferrer">
        <Icon className="size-4" />
        {label}
      </a>
    </Button>
  );
}

export function PortfolioRenderer({ portfolio }: PortfolioRendererProps) {
  const template = getTemplateBySlug(portfolio.templateSlug);

  if (template.slug === "atlas") {
    return (
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden">
          <CardContent className="p-8 md:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{template.name}</Badge>
              <Badge variant="success">{portfolio.availability}</Badge>
            </div>
            <div className="mt-8 grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                    {portfolio.title}
                  </p>
                  <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                    {portfolio.name}
                  </h1>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                    <MapPin className="size-4" />
                    {portfolio.location}
                  </div>
                </div>
                <p className="text-lg leading-8 text-slate-600">{portfolio.bio}</p>
                <div className="flex flex-wrap gap-2">
                  <LinkPill href={portfolio.githubUrl} label="GitHub" icon={Code2} />
                  <LinkPill
                    href={portfolio.linkedinUrl}
                    label="LinkedIn"
                    icon={BriefcaseBusiness}
                  />
                  <LinkPill href={`mailto:${portfolio.email}`} label="Email" icon={Mail} />
                </div>
              </div>
              <div className="space-y-8">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                    About
                  </p>
                  <p className="mt-4 text-base leading-8 text-slate-700">
                    {portfolio.about}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Core skills
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {portfolio.skills.map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-950 text-white">
          <CardContent className="flex h-full flex-col justify-between gap-8 p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/50">
                Featured project
              </p>
              <h2 className="mt-4 text-3xl font-semibold">
                {portfolio.featuredProjectName}
              </h2>
              <p className="mt-4 text-base leading-8 text-white/75">
                {portfolio.featuredProjectSummary}
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                  Stack
                </p>
                <p className="mt-3 text-lg text-white">{portfolio.featuredProjectStack}</p>
              </div>
              {portfolio.featuredProjectUrl ? (
                <Button asChild variant="accent" className="w-full">
                  <a href={portfolio.featuredProjectUrl} target="_blank" rel="noreferrer">
                    View project
                    <ArrowUpRight className="size-4" />
                  </a>
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (template.slug === "pulse") {
    return (
      <section className="space-y-8">
        <Card className="overflow-hidden bg-slate-950 text-white">
          <CardContent className="grid gap-8 p-8 md:p-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="border-white/10 bg-white/8 text-white/70">
                  {template.name}
                </Badge>
                <Badge className="border-orange-300/20 bg-orange-400/10 text-orange-200">
                  {portfolio.availability}
                </Badge>
              </div>
              <div>
                <p className="font-mono text-sm uppercase tracking-[0.3em] text-white/45">
                  {portfolio.location}
                </p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
                  {portfolio.name}
                </h1>
                <p className="mt-3 text-xl text-white/70">{portfolio.title}</p>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-white/78">{portfolio.about}</p>
              <div className="flex flex-wrap gap-2">
                {portfolio.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/75"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-4">
              <Card className="border-white/10 bg-white/6 text-white shadow-none">
                <CardContent className="p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
                    Intro
                  </p>
                  <p className="mt-4 text-base leading-7 text-white/78">{portfolio.bio}</p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-gradient-to-br from-orange-400/20 to-sky-400/18 text-white shadow-none">
                <CardContent className="p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/45">
                    Featured ship
                  </p>
                  <h2 className="mt-4 text-2xl font-semibold">
                    {portfolio.featuredProjectName}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-white/75">
                    {portfolio.featuredProjectSummary}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-orange-100">
                    {portfolio.featuredProjectStack}
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-3">
          <LinkPill href={portfolio.githubUrl} label="GitHub" icon={Code2} />
          <LinkPill
            href={portfolio.linkedinUrl}
            label="LinkedIn"
            icon={BriefcaseBusiness}
          />
          <LinkPill href={`mailto:${portfolio.email}`} label="Email" icon={Mail} />
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <Card className="overflow-hidden">
        <CardContent className="p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge>{template.name}</Badge>
                <Badge variant="success">{portfolio.availability}</Badge>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-slate-400">
                  {portfolio.title}
                </p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                  {portfolio.name}
                </h1>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">{portfolio.bio}</p>
              <div className="flex flex-wrap gap-3">
                <LinkPill href={portfolio.githubUrl} label="GitHub" icon={Code2} />
                <LinkPill
                  href={portfolio.linkedinUrl}
                  label="LinkedIn"
                  icon={BriefcaseBusiness}
                />
                <LinkPill href={`mailto:${portfolio.email}`} label="Email" icon={Mail} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[24px] border border-slate-900/10 bg-slate-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Location
                  </p>
                  <p className="mt-3 text-lg font-medium text-slate-900">
                    {portfolio.location}
                  </p>
                </div>
                <div className="rounded-[24px] border border-slate-900/10 bg-slate-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Public URL
                  </p>
                  <p className="mt-3 text-lg font-medium text-slate-900">
                    /p/{portfolio.slug}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[32px] border border-slate-900/10 bg-slate-950 p-6 text-white shadow-[0_30px_80px_-48px_rgba(15,23,42,0.55)]">
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70">
                Featured build
              </div>
              <h2 className="mt-6 text-3xl font-semibold">
                {portfolio.featuredProjectName}
              </h2>
              <p className="mt-4 text-base leading-8 text-white/72">
                {portfolio.featuredProjectSummary}
              </p>
              <div className="mt-6 rounded-[24px] border border-white/10 bg-white/6 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                  Stack
                </p>
                <p className="mt-3 text-lg text-white">{portfolio.featuredProjectStack}</p>
              </div>
              {portfolio.featuredProjectUrl ? (
                <Button asChild variant="accent" className="mt-6 w-full">
                  <a href={portfolio.featuredProjectUrl} target="_blank" rel="noreferrer">
                    View project
                    <ArrowUpRight className="size-4" />
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-8 p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              About
            </p>
            <p className="mt-4 text-base leading-8 text-slate-700">{portfolio.about}</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Core skills
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {portfolio.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-slate-900/10 bg-slate-50 px-4 py-2 text-sm text-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
