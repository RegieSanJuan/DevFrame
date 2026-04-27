import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSeedPortfolioByTemplate } from "@/lib/portfolio-storage";
import { getTemplateBySlug, type TemplateSlug } from "@/lib/template-catalog";
import { PreviewClient } from "./preview-client";

type TemplatePreviewPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: TemplatePreviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplateBySlug(slug as TemplateSlug);

  if (!template) {
    return {
      title: "Template not found",
    };
  }

  return {
    title: `${template.name} Template Preview`,
    description: template.description,
  };
}

export default async function TemplatePreviewPage({
  params,
}: TemplatePreviewPageProps) {
  const { slug } = await params;
  const portfolio = getSeedPortfolioByTemplate(slug as TemplateSlug);

  if (!portfolio) {
    notFound();
  }

  const template = getTemplateBySlug(portfolio.templateSlug);

  return (
    <PreviewClient portfolio={portfolio} template={template} />
  );
}
