// preview-client.tsx
"use client";

import { StudioPreview } from "@/components/studio/studio-preview";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import type { PortfolioRecord } from "@/lib/portfolio-schema";
import type { TemplateCatalogItem } from "@/lib/template-catalog";
import { ExternalLink, FileText, X } from "lucide-react";
import Link from "next/link";
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
  const isMobile = useIsMobile();

  const resumeHref =
    portfolio.resumeLink?.url ||
    portfolio.websiteUrl ||
    portfolio.featuredProjectUrl ||
    `/p/${portfolio.slug}`;
  const portfolioLinkHref = portfolio.websiteUrl || portfolio.featuredProjectUrl;

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center overflow-hidden">
        <style>{`
          #devframe-global-header, #devframe-global-footer {
            display: none !important;
          }
          main {
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        `}</style>
        {/* Floating exit button */}
        <button
          onClick={() => setFullscreen(false)}
          className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm hover:bg-black/90 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Exit fullscreen
        </button>
        <div className="w-full h-full flex items-center justify-center p-4">
          <StudioPreview portfolio={portfolio} device={viewMode} />
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[100] bg-background overflow-y-auto pb-[280px]">
        <style>{`
          #devframe-global-header, #devframe-global-footer {
            display: none !important;
          }
          main {
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        `}</style>
        {/* Floating exit button to templates list */}
        <div className="fixed top-4 right-4 z-40">
          <Button asChild variant="secondary" size="sm" className="rounded-full gap-2 bg-background/80 backdrop-blur-sm border border-border shadow-md">
            <Link href="/templates">
              <X className="size-4" />
              Exit
            </Link>
          </Button>
        </div>

        {/* Full-screen preview using same component as desktop toggle, minus the frame */}
        <StudioPreview portfolio={portfolio} device="mobile" frameless />

        {/* Elegant Bottom Dialog/Sheet */}
        <div className="fixed bottom-0 inset-x-0 z-40 bg-surface/90 backdrop-blur-xl border-t border-border rounded-t-[32px] px-6 pt-4 pb-8 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] flex flex-col gap-4">
          {/* Grab/drag indicator */}
          <div className="w-12 h-1 bg-border rounded-full mx-auto mb-2" />

          <div className="space-y-2">
            <h3 className="font-bold text-xl text-foreground">
              About {template.name}
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              {template.description}
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Button
              asChild
              variant="accent"
              size="lg"
              className="w-full rounded-2xl h-12 text-sm font-bold shadow-lg shadow-accent/20"
            >
              <Link href={`/studio?template=${template.slug}`}>Use in Studio</Link>
            </Button>

            <div className="flex gap-2 w-full">
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="flex-1 rounded-2xl h-12 text-sm text-foreground-muted hover:text-foreground"
              >
                <Link href="/templates">Browse styles</Link>
              </Button>

              <Button
                asChild
                variant="secondary"
                size="icon"
                className="rounded-2xl size-12 shrink-0 border border-border bg-surface-strong hover:bg-surface-strong/80"
                title="Resume"
              >
                <a
                  href={resumeHref}
                  target={resumeHref.startsWith("http") ? "_blank" : undefined}
                  rel={resumeHref.startsWith("http") ? "noreferrer" : undefined}
                >
                  <FileText className="size-5" />
                </a>
              </Button>

              {portfolioLinkHref ? (
                <Button
                  asChild
                  variant="secondary"
                  size="icon"
                  className="rounded-2xl size-12 shrink-0 border border-border bg-surface-strong hover:bg-surface-strong/80"
                  title="View portfolio link"
                >
                  <a
                    href={portfolioLinkHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink className="size-5" />
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
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
