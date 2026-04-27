import { Badge } from "@/components/ui/badge";
import { LinkPill, SectionLabel, SkillBadge } from "@/templates/base-components";
import type { TemplateComponentProps } from "@/templates/registry";
import { registerTemplate } from "@/templates/registry";
import { BriefcaseBusiness, Code2, Mail } from "lucide-react";

function NovaTemplate({ portfolio }: TemplateComponentProps) {
  return (
    <section className="space-y-12 py-12">
      <div className="text-center space-y-4">
        <Badge variant="default" className="rounded-full border-accent/50 text-accent">
          {portfolio.availability}
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
          {portfolio.name}
        </h1>
        <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
          {portfolio.title} • {portfolio.location}
        </p>
        <div className="flex justify-center gap-4">
          <LinkPill href={portfolio.githubUrl} label="GitHub" icon={<Code2 className="w-4 h-4" />} />
          <LinkPill href={portfolio.linkedinUrl} label="LinkedIn" icon={<BriefcaseBusiness className="w-4 h-4" />} />
          <LinkPill href={`mailto:${portfolio.email}`} label="Email" icon={<Mail className="w-4 h-4" />} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <SectionLabel>The Story</SectionLabel>
            <p className="mt-4 text-lg leading-relaxed text-foreground-muted">
              {portfolio.about}
            </p>
          </div>
          <div>
            <SectionLabel>Expertise</SectionLabel>
            <div className="mt-4 flex flex-wrap gap-2">
              {portfolio.skills.map((skill) => (
                <SkillBadge key={skill}>{skill}</SkillBadge>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-surface-strong border border-border rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Code2 size={120} />
          </div>
          <SectionLabel>Featured Build</SectionLabel>
          <h2 className="mt-6 text-3xl font-bold">{portfolio.featuredProjectName}</h2>
          <p className="mt-4 text-foreground-muted leading-relaxed">
            {portfolio.featuredProjectSummary}
          </p>
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm font-mono text-accent">{portfolio.featuredProjectStack}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

registerTemplate("nova", NovaTemplate);

export default NovaTemplate;
