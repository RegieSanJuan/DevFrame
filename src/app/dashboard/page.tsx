import Link from "next/link";
import { ArrowRight, ExternalLink, LayoutTemplate } from "lucide-react";

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
import { getPortfolioForOwner } from "@/lib/portfolio-storage";
import { getTemplateBySlug } from "@/lib/template-catalog";

export default async function DashboardPage() {
  const viewer = await requireViewer();
  const portfolio = await getPortfolioForOwner(viewer.userId!);

  return (
    <div className="container-shell space-y-10 pt-8">
      <section className="space-y-4">
        <Badge>{viewer.demoMode ? "Demo dashboard" : "Dashboard"}</Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          Build and publish your DevFrame portfolio
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-600">
          Choose a template, add your story, and launch a portfolio that lives at a clean URL you can share anywhere.
        </p>
      </section>

      {portfolio ? (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="success">Portfolio found</Badge>
              <Badge>{getTemplateBySlug(portfolio.templateSlug).name}</Badge>
            </div>
            <CardTitle>{portfolio.name}</CardTitle>
            <CardDescription>
              Your current public route is `/p/{portfolio.slug}` and the latest draft is already wired into the selected template.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row">
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
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No portfolio yet</CardTitle>
            <CardDescription>
              Start by choosing a template that matches your style, then we will send you into the builder with that template preselected.
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
