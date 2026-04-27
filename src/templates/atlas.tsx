import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { registerTemplate } from "@/templates/registry";
import { LinkPill, SkillBadge, SectionLabel } from "@/templates/base-components";
import { BriefcaseBusiness, Code2, Mail, MapPin, ArrowUpRight } from "lucide-react";
import type { TemplateComponentProps } from "../registry";

function AtlasTemplate({ portfolio }: TemplateComponentProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.16fr_0.84fr]">
      <Card className="overflow-hidden border-border bg-[radial-gradient(circle_at_top,rgba(62,207,142,0.08),transparent_48%)]">
        <CardContent className="p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Atlas</Badge>
            <Badge variant="success">{portfolio.availability}</Badge>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6">
              <div>
                <SectionLabel>{portfolio.title}</SectionLabel>
                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground md:text-5xl">
                  {portfolio.name}
                </h1>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface-strong px-4 py-2 text-sm text-foreground-muted">
                  <MapPin className="size-4" />
                  {portfolio.location}
                </div>
              </div>
              <p className="text-base leading-8 text-foreground-muted md:text-lg">
                {portfolio.bio}
              </p>
              <div className="flex flex-wrap gap-2">
                <LinkPill href={portfolio.githubUrl} label="GitHub" icon={Code2} />
                <LinkPill href={portfolio.linkedinUrl} label="LinkedIn" icon={BriefcaseBusiness} />
                <LinkPill href={`mailto:${portfolio.email}`} label="Email" icon={Mail} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] border border-border bg-surface p-6">
                <SectionLabel>About</SectionLabel>
                <p className="mt-4 text-base leading-8 text-foreground-muted">
                  {portfolio.about}
                </p>
              </div>
              <div className="rounded-[28px] border border-border bg-surface p-6">
                <SectionLabel>Core skills</SectionLabel>
                <div className="mt-4 flex flex-wrap gap-2">
                  {portfolio.skills.map((skill) => (
                    <SkillBadge key={skill}>{skill}</SkillBadge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-surface-strong">
        <CardContent className="flex h-full flex-col justify-between gap-8 p-8">
          <div>
            <SectionLabel>Featured project</SectionLabel>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground">
              {portfolio.featuredProjectName}
            </h2>
            <p className="mt-4 text-base leading-8 text-foreground-muted">
              {portfolio.featuredProjectSummary}
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-[24px] border border-border bg-surface-strong p-5">
              <SectionLabel>Stack</SectionLabel>
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

registerTemplate("atlas", AtlasTemplate);
