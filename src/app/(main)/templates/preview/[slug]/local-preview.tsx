import { StudioPreview } from "@/components/studio/studio-preview";
import { Button } from "@/components/ui/button";
import type { PortfolioRecord } from "@/lib/portfolio-schema";
import type { TemplateCatalogItem } from "@/lib/template-catalog";
import { Check, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";

interface TemplateLocalPreviewProps {
  portfolio: PortfolioRecord;
  template: TemplateCatalogItem;
  viewMode: "desktop" | "mobile";
}

export function TemplateLocalPreview({
  portfolio,
  template,
  viewMode,
}: TemplateLocalPreviewProps) {
  const [mode] = ["dark"];

  const isMobile = viewMode === "mobile";

  const resumeHref =
    portfolio.resumeLink?.url ||
    portfolio.websiteUrl ||
    portfolio.featuredProjectUrl ||
    `/p/${portfolio.slug}`;
  const portfolioLinkHref = portfolio.websiteUrl || portfolio.featuredProjectUrl;

  return (
    <div className="space-y-8">
      {/* Dynamic Content Layout */}
      <div
        className={`grid gap-12 ${isMobile ? "lg:grid-cols-[1fr_400px]" : "grid-cols-1"}`}
      >
        {/* Preview Container */}
        <div className="relative flex justify-center w-full h-[900px]">
          <StudioPreview portfolio={portfolio} device={viewMode} />
        </div>

        {/* Info Area */}
        <div className={`${isMobile ? "order-2 space-y-6" : "order-2"}`}>
          <div
            className={`grid relative z-30 gap-8 ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}
          >
            {/* Description box */}
            <div className="rounded-[32px] border border-border bg-surface p-8 space-y-8 shadow-sm h-fit">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-bold text-2xl text-foreground">
                    About {template.name}
                  </h3>
                  <p className="text-base text-foreground-muted leading-relaxed">
                    {template.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Highlights box */}
            <div className="rounded-[32px] border border-border bg-surface p-8 space-y-8 shadow-sm flex flex-col justify-between h-fit">
              <div>
                <h3 className="font-bold text-[10px] uppercase tracking-[0.25em] text-foreground-soft mb-6">
                  Template Highlights
                </h3>
                <ul className="grid grid-cols-1 gap-5">
                  {template.highlights.map((highlight, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-foreground flex items-start gap-4 group"
                    >
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="leading-tight">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 flex flex-col gap-3">
                <Button
                  asChild
                  variant="accent"
                  size="lg"
                  className="w-full rounded-2xl h-14 text-base font-bold shadow-lg shadow-accent/20"
                >
                  <Link href={`/studio?template=${template.slug}`}>Use in Studio</Link>
                </Button>

                {/* Resume and Portfolio Link Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-2xl h-12 text-sm font-semibold border-border bg-surface-strong hover:bg-surface-strong/80"
                  >
                    <a
                      href={resumeHref}
                      target={resumeHref.startsWith("http") ? "_blank" : undefined}
                      rel={resumeHref.startsWith("http") ? "noreferrer" : undefined}
                      className="flex items-center gap-2 justify-center"
                    >
                      <FileText className="size-4" />
                      Resume
                    </a>
                  </Button>
                  {portfolioLinkHref ? (
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-2xl h-12 text-sm font-semibold border-border bg-surface-strong hover:bg-surface-strong/80"
                    >
                      <a
                        href={portfolioLinkHref}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 justify-center"
                      >
                        <ExternalLink className="size-4" />
                        View Link
                      </a>
                    </Button>
                  ) : null}
                </div>

                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="w-full rounded-2xl h-14 text-foreground-muted hover:text-foreground"
                >
                  <Link href="/templates">Browse other styles</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
