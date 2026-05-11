// src/app/templates/preview/[slug]/raw/page.tsx
import { PortfolioRenderer } from "@/components/portfolio-renderer";
import { getSeedPortfolioByTemplate } from "@/lib/portfolio-storage";
import type { TemplateSlug } from "@/lib/template-catalog";
import { notFound } from "next/navigation";

export default async function RawPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const portfolio = getSeedPortfolioByTemplate(slug as TemplateSlug);

  if (!portfolio) notFound();

  return <PortfolioRenderer portfolio={portfolio} />;
}