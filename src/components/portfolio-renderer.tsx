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
      <section className="grid gap-8 lg:grid-cols-[1.16fr_0.84fr]">
        <Card className="overflow-hidden border-white/10 bg-[radial-gradient(circle_at_top,rgba(62,207,142,0.08),transparent_48%)]">
          <CardContent className="p-8 md:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{template.name}</Badge>
              <Badge variant="success">{portfolio.availability}</Badge>
            </div>
            <div className="mt-8 grid gap-8 md:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                    {portfolio.title}
                  </p>
                  <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground md:text-5xl">
                    {portfolio.name}
                  </h1>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-foreground-muted">
                    <MapPin className="size-4" />
                    {portfolio.location}
                  </div>
                </div>
                <p className="text-base leading-8 text-foreground-muted md:text-lg">
                  {portfolio.bio}
                </p>
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

              <div className="space-y-6">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                    About
                  </p>
                  <p className="mt-4 text-base leading-8 text-foreground-muted">
                    {portfolio.about}
                  </p>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                    Core skills
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {portfolio.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-foreground-muted"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-surface-strong">
          <CardContent className="flex h-full flex-col justify-between gap-8 p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                Featured project
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground">
                {portfolio.featuredProjectName}
              </h2>
              <p className="mt-4 text-base leading-8 text-foreground-muted">
                {portfolio.featuredProjectSummary}
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                  Stack
                </p>
                <p className="mt-3 text-lg text-foreground">
                  {portfolio.featuredProjectStack}
                </p>
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
        <Card className="overflow-hidden border-white/10 bg-surface-strong">
          <CardContent className="grid gap-8 p-8 md:p-10 lg:grid-cols-[1.16fr_0.84fr]">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge>{template.name}</Badge>
                <Badge variant="success">{portfolio.availability}</Badge>
              </div>
              <div>
                <p className="font-mono text-sm uppercase tracking-[0.3em] text-foreground-soft">
                  {portfolio.location}
                </p>
                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-foreground md:text-6xl">
                  {portfolio.name}
                </h1>
                <p className="mt-3 text-xl text-foreground-muted">
                  {portfolio.title}
                </p>
              </div>
              <p className="max-w-2xl text-base leading-8 text-foreground-muted md:text-lg">
                {portfolio.about}
              </p>
              <div className="flex flex-wrap gap-2">
                {portfolio.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-foreground-muted"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <Card className="border-white/10 bg-white/[0.03] shadow-none">
                <CardContent className="p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-foreground-soft">
                    Intro
                  </p>
                  <p className="mt-4 text-base leading-7 text-foreground-muted">
                    {portfolio.bio}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-[linear-gradient(180deg,rgba(62,207,142,0.14),rgba(62,207,142,0.03))] shadow-none">
                <CardContent className="p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-foreground-soft">
                    Featured ship
                  </p>
                  <h2 className="mt-4 text-2xl font-semibold text-foreground">
                    {portfolio.featuredProjectName}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-foreground-muted">
                    {portfolio.featuredProjectSummary}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-accent">
                    {portfolio.featuredProjectStack}
                  </p>
                  {portfolio.featuredProjectUrl ? (
                    <Button asChild variant="accent" className="mt-5 w-full">
                      <a
                        href={portfolio.featuredProjectUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View project
                        <ArrowUpRight className="size-4" />
                      </a>
                    </Button>
                  ) : null}
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
    <section className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr]">
      <Card className="overflow-hidden border-white/10">
        <CardContent className="p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.04fr_0.96fr]">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge>{template.name}</Badge>
                <Badge variant="success">{portfolio.availability}</Badge>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-foreground-soft">
                  {portfolio.title}
                </p>
                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-foreground md:text-6xl">
                  {portfolio.name}
                </h1>
              </div>
              <p className="max-w-2xl text-base leading-8 text-foreground-muted md:text-lg">
                {portfolio.bio}
              </p>
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
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                    Location
                  </p>
                  <p className="mt-3 text-lg font-medium text-foreground">
                    {portfolio.location}
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                    Public URL
                  </p>
                  <p className="mt-3 text-lg font-medium text-foreground">
                    /p/{portfolio.slug}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-accent/20 bg-surface-strong p-6 shadow-[0_30px_80px_-48px_rgba(0,0,0,0.78)]">
              <div className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-foreground-muted">
                Featured build
              </div>
              <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-foreground">
                {portfolio.featuredProjectName}
              </h2>
              <p className="mt-4 text-base leading-8 text-foreground-muted">
                {portfolio.featuredProjectSummary}
              </p>
              <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                  Stack
                </p>
                <p className="mt-3 text-lg text-foreground">
                  {portfolio.featuredProjectStack}
                </p>
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

      <Card className="border-white/10 bg-white/[0.02]">
        <CardContent className="space-y-8 p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-foreground-soft">
              About
            </p>
            <p className="mt-4 text-base leading-8 text-foreground-muted">
              {portfolio.about}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-foreground-soft">
              Core skills
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {portfolio.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-foreground-muted"
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
