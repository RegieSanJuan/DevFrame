import type { PortfolioRecord } from "@/lib/portfolio-schema";
import { getTemplateBySlug } from "@/lib/template-catalog";
import "@/templates";
import { TEMPLATE_REGISTRY } from "@/templates";

type PortfolioRendererProps = {
  portfolio: PortfolioRecord;
};

export function PortfolioRenderer({ portfolio }: PortfolioRendererProps) {
  const template = getTemplateBySlug(portfolio.templateSlug);
  const TemplateComponent = TEMPLATE_REGISTRY[template.slug];

  if (!TemplateComponent) {
    return (
      <div className="p-8 text-center border-2 border-dashed border-border rounded-xl">
        <p className="text-foreground-muted">Template &quot;{template.slug}&quot; not found in registry.</p>
      </div>
    );
  }

  return <TemplateComponent portfolio={portfolio} />;
}
