// preview-client.tsx
"use client";

import { PortfolioRenderer } from "@/components/portfolio-renderer";
import type { PortfolioRecord } from "@/lib/portfolio-schema";
import type { TemplateCatalogItem } from "@/lib/template-catalog";
import { X } from "lucide-react";
import { useState } from "react";
import { TemplateLocalPreview } from "./local-preview";
import { PreviewHeader } from "./preview-header";

interface PreviewClientProps {
  portfolio: PortfolioRecord;
  template: TemplateCatalogItem;
}

export function PreviewClient({ portfolio, template }: PreviewClientProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [fullscreen, setFullscreen] = useState(false);

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background overflow-auto">
        {/* Floating exit button */}
        <button
          onClick={() => setFullscreen(false)}
          className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm hover:bg-black/90 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Exit fullscreen
        </button>
        <PortfolioRenderer portfolio={portfolio} />
      </div>
    );
  }

  return (
    <div className="container-shell space-y-8 pt-10">
      <PreviewHeader
        templateName={template.name}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onFullscreen={() => setFullscreen(true)}
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