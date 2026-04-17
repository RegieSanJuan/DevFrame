import { PortfolioBuilderForm } from "@/components/portfolio-builder-form";
import { SetupStatus } from "@/components/setup-status";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { requireViewer } from "@/lib/auth";
import { getEmptyPortfolioForm, toFormValues } from "@/lib/portfolio-schema";
import { getPortfolioForOwner } from "@/lib/portfolio-storage";
import { isTemplateSlug, TEMPLATE_CATALOG } from "@/lib/template-catalog";

type BuilderPageProps = {
  searchParams: Promise<{
    template?: string;
  }>;
};

export default async function BuilderPage({ searchParams }: BuilderPageProps) {
  const viewer = await requireViewer();
  const { template } = await searchParams;
  const selectedTemplate = isTemplateSlug(template) ? template : "signal";
  const existingPortfolio = await getPortfolioForOwner(viewer.userId!);
  const defaultValues = existingPortfolio
    ? {
        ...toFormValues(existingPortfolio),
        templateSlug: isTemplateSlug(template)
          ? template
          : existingPortfolio.templateSlug,
      }
    : getEmptyPortfolioForm(selectedTemplate);

  return (
    <div className="container-shell space-y-10 pt-10">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="space-y-4">
        <Badge>{viewer.demoMode ? "Demo builder" : "Builder"}</Badge>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-foreground md:text-5xl">
            Shape your portfolio without rebuilding the whole site.
          </h1>
          <p className="max-w-3xl text-base leading-7 text-foreground-muted md:text-lg md:leading-8">
            One structured builder feeds the selected template, the public route,
            and your setup checks so publishing feels quick, calm, and repeatable.
          </p>
        </div>

        <Card className="border-white/10 bg-surface-strong">
          <CardHeader>
            <CardTitle className="text-2xl tracking-[-0.04em]">
              {existingPortfolio ? "Current portfolio state" : "New draft ready"}
            </CardTitle>
            <CardDescription>
              {existingPortfolio
                ? "Your saved draft is loaded below, including the current public route and template choice."
                : "A starter template is already selected so you can move straight into the form."}
            </CardDescription>
          </CardHeader>
          <CardHeader className="grid gap-4 pt-0 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                Template
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {defaultValues.templateSlug}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                Route
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                /p/{defaultValues.slug || "your-slug"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                Access
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {viewer.demoMode ? "Preview mode" : "Protected"}
              </p>
            </div>
          </CardHeader>
        </Card>
      </section>

      {!existingPortfolio ? (
        <Card className="border-white/10 bg-white/[0.02]">
          <CardHeader>
            <CardTitle>Fresh portfolio draft</CardTitle>
            <CardDescription>
              We preselected a starter template. Fill in the form, save the
              draft, and open the public preview route to see the portfolio live.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <PortfolioBuilderForm
        defaultValues={defaultValues}
        templates={TEMPLATE_CATALOG}
        demoMode={viewer.demoMode}
      />

      <SetupStatus />
    </div>
  );
}
