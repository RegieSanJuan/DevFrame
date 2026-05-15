import Link from "next/link";
import { ArrowRight, ExternalLink, FileText, ImageIcon, Sparkles } from "lucide-react";

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
import type { PortfolioRecord } from "@/lib/portfolio-schema";
import { getTemplateBySlug } from "@/lib/template-catalog";
import { getPortfolioByOwner } from "@/services/portfolio-service";

function formatUpdatedAt(updatedAt?: string) {
  if (!updatedAt) {
    return "Not started";
  }

  const date = new Date(updatedAt);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getStudioHref(portfolio: PortfolioRecord | null) {
  return portfolio ? `/studio?template=${portfolio.templateSlug}` : "/studio";
}

function getPublishState(portfolio: PortfolioRecord | null) {
  if (!portfolio) {
    return {
      description:
        "Open Studio to create a draft before publishing to a public route.",
      label: "Not started",
      variant: "warning" as const,
    };
  }

  if (portfolio.source === "supabase") {
    return {
      description:
        "This portfolio is persisted in Supabase and available at the public route.",
      label: "Published",
      variant: "success" as const,
    };
  }

  return {
    description:
      "This portfolio is available as a preview draft. Publish from Studio to persist it in Supabase.",
    label: "Draft",
    variant: "warning" as const,
  };
}

export default async function DashboardPage() {
  const viewer = await requireViewer();
  const portfolio = await getPortfolioByOwner(viewer.userId!);
  const templateName = portfolio
    ? getTemplateBySlug(portfolio.templateSlug).name
    : "No template selected";
  const publishState = getPublishState(portfolio);
  const publicRoute = portfolio ? `/p/${portfolio.slug}` : "/p/your-slug";
  const galleryCount = portfolio?.galleryImages?.length ?? 0;

  return (
    <div className="container-shell space-y-10 pt-10">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="space-y-4">
          <Badge>Dashboard</Badge>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-foreground md:text-5xl">
            Control center for your DevFrame portfolio.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-foreground-muted md:text-lg md:leading-8">
            Track the public route, publish status, template, last update, and
            asset count before jumping into the right editing surface.
          </p>
        </div>

        <Card className="border-border bg-surface-strong">
          <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                Public route
              </p>
              <p className="mt-3 font-mono text-lg font-semibold text-foreground">
                {publicRoute}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                Publish status
              </p>
              <div className="mt-3">
                <Badge variant={publishState.variant}>{publishState.label}</Badge>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                Last updated
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {formatUpdatedAt(portfolio?.updatedAt)}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                Template
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {templateName}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-4 sm:col-span-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                  Gallery assets
                </p>
                <ImageIcon className="size-4 text-accent" />
              </div>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {galleryCount} {galleryCount === 1 ? "asset" : "assets"}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {portfolio ? (
        <Card className="border-border">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={publishState.variant}>{publishState.label}</Badge>
              <Badge>{templateName}</Badge>
            </div>
            <CardTitle className="text-3xl tracking-[-0.04em]">
              {portfolio.name}
            </CardTitle>
            <CardDescription>{publishState.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Button asChild variant="accent" size="lg">
                <Link href={getStudioHref(portfolio)}>
                  Edit in Studio
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/builder">
                  Manage Content
                  <FileText className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={publicRoute}>
                  View Portfolio
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
              <Badge variant="warning">No portfolio yet</Badge>
            </div>
            <CardTitle>No portfolio yet</CardTitle>
            <CardDescription>
              Start in Studio for the full live editor, or use the structured
              content manager when you are on a smaller screen.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="accent">
              <Link href="/studio">
                Edit in Studio
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/builder">
                Manage Content
                <FileText className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
