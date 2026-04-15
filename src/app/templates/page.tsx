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
    <div className="container-shell space-y-10 pt-8">
      <section className="space-y-4">
        <Badge>Templates</Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          Pick the portfolio direction that fits your style
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-slate-600">
          These starter layouts are already connected to the same structured portfolio data, so you can experiment with presentation without rebuilding your content.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {TEMPLATE_CATALOG.map((template) => {
          const sample = getSeedPortfolioByTemplate(template.slug);

          return (
            <Card key={template.slug} className="overflow-hidden">
              <div className={`h-2 w-full bg-gradient-to-r ${template.accent}`} />
              <CardHeader>
                <Badge>{template.name}</Badge>
                <CardTitle>{template.tagline}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Ideal for
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
