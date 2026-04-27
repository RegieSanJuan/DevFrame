import type { PortfolioRecord } from "@/lib/portfolio-schema";
import type { TemplateSlug } from "@/lib/template-catalog";
import React from "react";

export type TemplateComponentProps = {
  portfolio: PortfolioRecord;
};

export const TEMPLATE_REGISTRY: Record<
  TemplateSlug,
  React.ComponentType<TemplateComponentProps>
> = {} as any;

export function registerTemplate(
  slug: TemplateSlug,
  component: React.ComponentType<TemplateComponentProps>,
) {
  TEMPLATE_REGISTRY[slug] = component;
}
