"use client";

import type { PortfolioRecord } from "@/lib/portfolio-schema";
import type { TemplateCatalogItem } from "@/lib/template-catalog";
import { useState } from "react";
import { TemplateLocalPreview } from "./local-preview";
import { PreviewHeader } from "./preview-header";

interface PreviewClientProps {
  portfolio: PortfolioRecord;
  template: TemplateCatalogItem;
}

export function PreviewClient({ portfolio, template }: PreviewClientProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="container-shell space-y-8 pt-10">
      <PreviewHeader
        templateName={template.name}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="w-full">
        <TemplateLocalPreview
          portfolio={portfolio}
          template={template}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
}
