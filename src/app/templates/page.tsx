import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireViewer } from "@/lib/auth";
import { getSeedPortfolioByTemplate } from "@/lib/portfolio-storage";
import { TEMPLATE_CATALOG } from "@/lib/template-catalog";

export default async function TemplatesPage() {
  await requireViewer();

  return (
    <div className="container-shell space-y-10 pt-10">
      <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-end">
        <div className="space-y-4">
        <Badge>Templates</Badge>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-foreground md:text-5xl">
            Pick the portfolio direction that fits your style.
          </h1>
          <p className="max-w-3xl text-base leading-7 text-foreground-muted md:text-lg md:leading-8">
            Each starter layout connects to the same structured portfolio data,
            so you can change presentation without rebuilding the underlying
            content model.
          </p>
        </div>

        <Card className="border-border bg-surface-strong">
          <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                Shared data
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                One builder
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                Available styles
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {TEMPLATE_CATALOG.length} templates
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                Output
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                Public `/p` route
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {TEMPLATE_CATALOG.map((template) => {
          const sample = getSeedPortfolioByTemplate(template.slug);

          return (
            <Card
              key={template.slug}
              className="group overflow-hidden border-border transition-transform duration-200 hover:-translate-y-1 hover:border-accent/28"
            >
              <div className={`h-2 w-full bg-gradient-to-r ${template.accent}`} />
              <CardHeader>
                <Badge>{template.name}</Badge>
                <CardTitle className="text-2xl tracking-[-0.04em]">
                  {template.tagline}
                </CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                    Ideal for
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground-muted">
                    {template.idealFor}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {template.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full border border-border bg-surface-strong px-4 py-2 text-sm text-foreground-muted"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button asChild variant="accent" className="flex-1">
                    <Link href={`/builder?template=${template.slug}`}>
                      Use template
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  {sample ? (
                    <Button asChild variant="secondary">
                      <Link href={`/p/${sample.slug}`}>Preview</Link>
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
