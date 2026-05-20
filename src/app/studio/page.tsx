import { StudioShell } from "@/components/studio/studio-shell";
import { savePortfolioAction } from "@/app/actions";
import { getViewerContext } from "@/lib/auth";
import { isClerkConfigured } from "@/lib/env";
import { toFormValues } from "@/lib/portfolio-schema";
import { isTemplateSlug, TEMPLATE_CATALOG } from "@/lib/template-catalog";
import { getTemplateSettingsDefaults } from "@/lib/template-field-registry";
import { getPortfolioByOwner } from "@/services/portfolio-service";

export const metadata = {
  title: "Studio",
  description: "Build your portfolio live without creating an account first.",
};

type StudioPageProps = {
  searchParams: Promise<{
    template?: string;
  }>;
};

export default async function StudioPage({ searchParams }: StudioPageProps) {
  const templates = TEMPLATE_CATALOG;
  const { template } = await searchParams;
  const requestedTemplate = isTemplateSlug(template) ? template : null;
  const viewer = await getViewerContext();
  const existingPortfolio = viewer.userId
    ? await getPortfolioByOwner(viewer.userId)
    : null;
  const selectedTemplate =
    requestedTemplate ?? existingPortfolio?.templateSlug ?? "nova";
  const isTemplateSwitching =
    Boolean(requestedTemplate && existingPortfolio) &&
    requestedTemplate !== existingPortfolio?.templateSlug;
  const initialValues = existingPortfolio
    ? {
        ...toFormValues(existingPortfolio),
        templateSlug: selectedTemplate,
        ...(isTemplateSwitching
          ? { templateSettings: getTemplateSettingsDefaults(selectedTemplate) }
          : {}),
      }
    : null;

  return (
    <StudioShell
      clerkEnabled={isClerkConfigured}
      initialValues={initialValues}
      requestedTemplate={requestedTemplate}
      saveAction={savePortfolioAction}
      templates={templates}
    />
  );
}
