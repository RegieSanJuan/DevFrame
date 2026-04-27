import dynamic from "next/dynamic";
import type { PortfolioRecord } from "@/lib/portfolio-schema";
import type { TemplateSlug } from "@/lib/template-catalog";
import React from "react";

export type TemplateComponentProps = {
  portfolio: PortfolioRecord;
};

// Use dynamic imports to keep bundles small but explicitly map them
// Explicitly resolve the default export to avoid TS mismatch errors
export const TEMPLATE_REGISTRY: Record<
  TemplateSlug,
  React.ComponentType<TemplateComponentProps>
> = {
  pulse: dynamic(() => import("./pulse").then((m) => m.default)),
  nova: dynamic(() => import("./nova").then((m) => m.default)),
  vertex: dynamic(() => import("./vertex").then((m) => m.default)),
  drift: dynamic(() => import("./drift").then((m) => m.default)),
};

// For templates that use self-registration
export function registerTemplate(
  slug: TemplateSlug,
  component: React.ComponentType<TemplateComponentProps>,
) {
  TEMPLATE_REGISTRY[slug] = component;
}
