import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { registerTemplate } from "@/templates/registry";
import { LinkPill, SkillBadge, SectionLabel } from "@/templates/base-components";
import { BriefcaseBusiness, Code2, Mail, ArrowUpRight } from "lucide-react";
import type { TemplateComponentProps } from "../registry";

function PulseTemplate({ portfolio }: TemplateComponentProps) {
  return (
    <section className="space-y-8">
      <Card className="overflow-hidden border-border bg-surface-strong">
        <CardContent className="grid gap-8 p-8 md:p-10 lg:grid-cols-[1.16fr_0.84fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>Pulse</Badge>
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
                <SkillBadge key={skill}>{skill}</SkillBadge>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="border-border bg-surface shadow-none">
              <CardContent className="p-6">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-foreground-soft">
                  Intro
                </p>
                <p className="mt-4 text-base leading-7 text-foreground-muted">
                  {portfolio.bio}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-[linear-gradient(180deg,rgba(62,207,142,0.14),rgba(62,207,142,0.03))] shadow-none">
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

registerTemplate("pulse", PulseTemplate);
