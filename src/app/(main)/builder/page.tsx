import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PortfolioBuilderForm } from "@/components/portfolio-builder-form";
import { SetupStatus } from "@/components/setup-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { requireViewer } from "@/lib/auth";
import { getEmptyPortfolioForm, toFormValues } from "@/lib/portfolio-schema";
import { isTemplateSlug } from "@/lib/template-catalog";
import { getTemplateSettingsDefaults } from "@/lib/template-field-registry";
import { getPortfolioByOwner } from "@/services/portfolio-service";
import { getTemplates } from "@/services/template-service";

type BuilderPageProps = {
  searchParams: Promise<{
    template?: string;
  }>;
};

export default async function BuilderPage({ searchParams }: BuilderPageProps) {
  const viewer = await requireViewer();
  const { template } = await searchParams;
  const selectedTemplate = isTemplateSlug(template) ? template : "drift";
  const existingPortfolio = await getPortfolioByOwner(viewer.userId!);
  const templates = getTemplates();
  const isTemplateSwitching =
    isTemplateSlug(template) && existingPortfolio
      ? template !== existingPortfolio.templateSlug
      : false;
  const defaultValues = existingPortfolio
    ? {
        ...toFormValues(existingPortfolio),
        templateSlug: isTemplateSlug(template)
          ? template
          : existingPortfolio.templateSlug,
        // When the URL requests a different template, reset template-specific
        // settings to the new template's defaults so stale keys from the
        // previous template don't leak into the new one.
        ...(isTemplateSwitching
          ? { templateSettings: getTemplateSettingsDefaults(selectedTemplate) }
          : {}),
      }
    : getEmptyPortfolioForm(selectedTemplate);

  return (
    <div className="container-shell space-y-10 pt-10">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="space-y-4">
          <Badge>Mobile Form Editor</Badge>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-foreground md:text-5xl">
            Manage portfolio content in a structured editor.
          </h1>
          <p className="max-w-3xl text-base leading-7 text-foreground-muted md:text-lg md:leading-8">
            Use this form-first workspace for structured editing, content
            management, and smaller screens. Studio stays the live editing
            surface when you want the full split preview.
          </p>
        </div>

        <Card className="border-border bg-surface-strong">
          <CardHeader>
            <CardTitle className="text-2xl tracking-[-0.04em]">
              {existingPortfolio ? "Structured content state" : "Mobile draft ready"}
            </CardTitle>
            <CardDescription>
              {existingPortfolio
                ? "Your latest portfolio content is loaded below, including the public route and template choice."
                : "A starter template is selected so you can move straight into the form editor."}
            </CardDescription>
          </CardHeader>
          <CardHeader className="grid gap-4 pt-0 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                Template
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {defaultValues.templateSlug}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                Route
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                /p/{defaultValues.slug || "your-slug"}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                Access
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {viewer.demoMode ? "Draft workspace" : "Private workspace"}
              </p>
            </div>
          </CardHeader>
          <CardHeader className="pt-0">
            <Button asChild variant="accent" className="w-full justify-center">
              <Link href={`/studio?template=${defaultValues.templateSlug}`}>
                Open Live Studio
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
        </Card>
      </section>

      {!existingPortfolio ? (
        <Card className="border-border bg-surface">
          <CardHeader>
            <CardTitle>Structured draft ready</CardTitle>
            <CardDescription>
              We preselected a starter template. Fill in the form, save the
              preview draft, and open Studio when you want the live editing view.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <PortfolioBuilderForm
        defaultValues={defaultValues}
        templates={templates}
        demoMode={viewer.demoMode}
      />

      <SetupStatus />
    </div>
  );
}
