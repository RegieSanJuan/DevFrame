import { StudioShell } from "@/components/studio/studio-shell";
import { savePortfolioAction } from "@/app/actions";
import { isClerkConfigured } from "@/lib/env";
import { isTemplateSlug, TEMPLATE_CATALOG } from "@/lib/template-catalog";

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

  return (
    <StudioShell
      clerkEnabled={isClerkConfigured}
      requestedTemplate={requestedTemplate}
      saveAction={savePortfolioAction}
      templates={templates}
    />
  );
}
