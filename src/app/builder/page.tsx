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
    <div className="container-shell space-y-10 pt-8">
      <section className="space-y-4">
        <Badge>{viewer.demoMode ? "Demo builder" : "Builder"}</Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          Shape your portfolio without rebuilding the whole site
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-slate-600">
          DevFrame uses one structured form and maps it into your chosen template so publishing feels fast and repeatable.
        </p>
      </section>

      {!existingPortfolio ? (
        <Card>
          <CardHeader>
            <CardTitle>Fresh portfolio draft</CardTitle>
            <CardDescription>
              We preselected a starter template. Fill in the form, save your draft, and open the public preview route to see your portfolio live.
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
