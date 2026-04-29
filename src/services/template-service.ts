import { getSeedPortfolioByTemplate } from "@/lib/portfolio-storage";
import { TEMPLATE_CATALOG, type TemplateSlug } from "@/lib/template-catalog";

export function getTemplates() {
  return TEMPLATE_CATALOG;
}

export function getTemplatePreviewPortfolio(templateSlug: TemplateSlug) {
  return getSeedPortfolioByTemplate(templateSlug);
}
