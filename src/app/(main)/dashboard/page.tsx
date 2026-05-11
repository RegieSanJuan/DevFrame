import Link from "next/link";
import { ArrowRight, ExternalLink, LayoutTemplate, Sparkles } from "lucide-react";

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
import { requireViewer } from "@/lib/auth";
import { getTemplateBySlug } from "@/lib/template-catalog";
import { getPortfolioByOwner } from "@/services/portfolio-service";

export default async function DashboardPage() {
  const viewer = await requireViewer();
  const portfolio = await getPortfolioByOwner(viewer.userId!);
  const templateName = portfolio
    ? getTemplateBySlug(portfolio.templateSlug).name
    : "No template selected";

  return (
    <div className="container-shell space-y-10 pt-10">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="space-y-4">
        <Badge>{viewer.demoMode ? "Demo dashboard" : "Dashboard"}</Badge>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-foreground md:text-5xl">
            Build and publish your DevFrame portfolio.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-foreground-muted md:text-lg md:leading-8">
            Manage your template, route, and publish state inside a cleaner dark
            workspace designed to feel closer to a developer platform than a
            generic admin page.
          </p>
        </div>

        <Card className="border-border bg-surface-strong">
          <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                Template
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {templateName}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                Route
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {portfolio ? `/p/${portfolio.slug}` : "/p/your-slug"}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                Access
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {viewer.demoMode ? "Preview mode" : "Protected"}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {portfolio ? (
        <Card className="border-border">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="success">Portfolio found</Badge>
              <Badge>{templateName}</Badge>
            </div>
            <CardTitle className="text-3xl tracking-[-0.04em]">
              {portfolio.name}
            </CardTitle>
            <CardDescription>
              Your latest draft is already connected to the selected template,
              and the public route is ready to review or share.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-border bg-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                  Public route
                </p>
                <p className="mt-3 text-lg font-semibold text-foreground">
                  /p/{portfolio.slug}
                </p>
              </div>
              <div className="rounded-[24px] border border-border bg-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                  Availability
                </p>
                <p className="mt-3 text-lg font-semibold text-foreground">
                  {portfolio.availability}
                </p>
              </div>
              <div className="rounded-[24px] border border-border bg-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                  Featured project
                </p>
                <p className="mt-3 text-lg font-semibold text-foreground">
                  {portfolio.featuredProjectName}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="accent">
                <Link href="/builder">
                  Continue editing
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href={`/p/${portfolio.slug}`}>
                  View public portfolio
                  <ExternalLink className="size-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border bg-surface-strong">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl border border-border bg-surface-strong text-accent">
                <Sparkles className="size-5" />
              </span>
              <Badge>No portfolio yet</Badge>
            </div>
            <CardTitle>No portfolio yet</CardTitle>
            <CardDescription>
              Start by choosing a template that fits your style, then jump into
              the builder with that direction already selected.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="accent">
              <Link href="/templates">
                Choose your template
                <LayoutTemplate className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <SetupStatus />
    </div>
  );
}
