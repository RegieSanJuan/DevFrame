import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { registerTemplate } from "@/templates/registry";
import { LinkPill, SkillBadge, SectionLabel } from "@/templates/base-components";
import { BriefcaseBusiness, Code2, Mail, ArrowUpRight } from "lucide-react";
import type { TemplateComponentProps } from "../registry";

function SignalTemplate({ portfolio }: TemplateComponentProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr]">
      <Card className="overflow-hidden border-border">
        <CardContent className="p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.04fr_0.96fr]">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge>Signal</Badge>
                <Badge variant="success">{portfolio.availability}</Badge>
              </div>
              <div>
                <SectionLabel>{portfolio.title}</SectionLabel>
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
                <div className="rounded-[24px] border border-border bg-surface p-5">
                  <SectionLabel>Location</SectionLabel>
                  <p className="mt-3 text-lg font-medium text-foreground">
                    {portfolio.location}
                  </p>
                </div>
                <div className="rounded-[24px] border border-border bg-surface p-5">
                  <SectionLabel>Public URL</SectionLabel>
                  <p className="mt-3 text-lg font-medium text-foreground">
                    /p/{portfolio.slug}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-accent/20 bg-surface-strong p-6 shadow-[0_30px_80px_-48px_rgba(0,0,0,0.78)]">
              <div className="rounded-full border border-border bg-surface-strong px-4 py-2 text-sm font-medium text-foreground-muted">
                Featured build
              </div>
              <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-foreground">
                {portfolio.featuredProjectName}
              </h2>
              <p className="mt-4 text-base leading-8 text-foreground-muted">
                {portfolio.featuredProjectSummary}
              </p>
              <div className="mt-6 rounded-[24px] border border-border bg-surface-strong p-5">
                <SectionLabel>Stack</SectionLabel>
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

      <Card className="border-border bg-surface">
        <CardContent className="space-y-8 p-8">
          <div>
            <SectionLabel>About</SectionLabel>
            <p className="mt-4 text-base leading-8 text-foreground-muted">
              {portfolio.about}
            </p>
          </div>
          <div>
            <SectionLabel>Core skills</SectionLabel>
            <div className="mt-4 flex flex-wrap gap-2">
              {portfolio.skills.map((skill) => (
                <SkillBadge key={skill}>{skill}</SkillBadge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

registerTemplate("signal", SignalTemplate);
