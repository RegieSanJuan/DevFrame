import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PageAction = {
  href: string;
  label: string;
  external?: boolean;
  variant?: "accent" | "secondary" | "outline";
};

type PageStat = {
  label: string;
  value: string;
  detail: string;
};

export type DevFrameInfoSection = {
  eyebrow?: string;
  title: string;
  description: string;
  items?: readonly string[];
  codeItems?: readonly string[];
};

type DevFrameStaticPageProps = {
  badge: string;
  title: string;
  description: string;
  primaryAction?: PageAction;
  secondaryAction?: PageAction;
  stats?: readonly PageStat[];
  sections: readonly DevFrameInfoSection[];
  footerNote?: string;
};

function ActionButton({ action }: { action: PageAction }) {
  const variant = action.variant ?? "accent";

  if (action.external) {
    return (
      <Button asChild size="lg" variant={variant}>
        <a href={action.href} rel="noopener noreferrer" target="_blank">
          {action.label}
          <ArrowUpRight className="size-4" />
        </a>
      </Button>
    );
  }

  return (
    <Button asChild size="lg" variant={variant}>
      <Link href={action.href}>
        {action.label}
        <ArrowUpRight className="size-4" />
      </Link>
    </Button>
  );
}

export function DevFrameStaticPage({
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  stats = [],
  sections,
  footerNote,
}: DevFrameStaticPageProps) {
  return (
    <div className="container-shell space-y-16 pb-12 pt-16">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="space-y-6">
          <Badge>{badge}</Badge>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.07em] text-foreground md:text-6xl">
              {title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-foreground-muted md:text-lg md:leading-8">
              {description}
            </p>
          </div>
          {primaryAction || secondaryAction ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              {primaryAction ? <ActionButton action={primaryAction} /> : null}
              {secondaryAction ? <ActionButton action={secondaryAction} /> : null}
            </div>
          ) : null}
        </div>

        <Card className="border-border bg-surface">
          <CardHeader>
            <CardTitle className="text-2xl tracking-[-0.04em]">
              DevFrame system map
            </CardTitle>
            <CardDescription>
              The same App Router shell powers marketing, Studio, Builder,
              Dashboard, and public portfolio routes.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {(stats.length > 0
              ? stats
              : [
                  {
                    label: "Runtime",
                    value: "Next.js App Router",
                    detail: "Server components first",
                  },
                  {
                    label: "Output",
                    value: "/p/[slug]",
                    detail: "Shareable portfolio routes",
                  },
                  {
                    label: "Data",
                    value: "Single record",
                    detail: "Template swaps preserve content",
                  },
                  {
                    label: "Fallback",
                    value: "Demo mode",
                    detail: "Works without full setup",
                  },
                ]).map((stat) => (
              <div
                key={`${stat.label}-${stat.value}`}
                className="rounded-2xl border border-border bg-background-alt p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                  {stat.label}
                </p>
                <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm leading-6 text-foreground-muted">
                  {stat.detail}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title} className="border-border bg-surface">
            <CardHeader>
              {section.eyebrow ? (
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                  {section.eyebrow}
                </p>
              ) : null}
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            {section.items?.length || section.codeItems?.length ? (
              <CardContent className="space-y-3">
                {section.items?.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-border bg-background-alt px-4 py-3 text-sm leading-6 text-foreground-muted"
                  >
                    {item}
                  </div>
                ))}
                {section.codeItems?.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-border bg-background-alt px-4 py-3 font-mono text-xs leading-5 text-accent"
                  >
                    {item}
                  </div>
                ))}
              </CardContent>
            ) : null}
          </Card>
        ))}
      </section>

      {footerNote ? (
        <section className="rounded-[28px] border border-border bg-surface p-8 md:p-10">
          <p className="max-w-4xl text-sm leading-7 text-foreground-muted">
            {footerNote}
          </p>
        </section>
      ) : null}
    </div>
  );
}
