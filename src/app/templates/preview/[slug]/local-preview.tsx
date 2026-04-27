import { PortfolioRenderer } from "@/components/portfolio-renderer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PortfolioRecord } from "@/lib/portfolio-schema";
import type { TemplateCatalogItem } from "@/lib/template-catalog";
import { Check } from "lucide-react";
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

  return (
    <div className="space-y-8">
      {/* Dynamic Content Layout */}
      <div
        className={`grid gap-12 ${isMobile ? "lg:grid-cols-[1fr_400px]" : "grid-cols-1"}`}
      >
        {/* Preview Container */}
        <div
          className={`relative flex justify-center w-full h-[800px] max-h-[85vh] overflow-hidden rounded-[40px] p-4 border border-border/50 order-1 bg-surface-strong/20`}
        >
          <div
            className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-b from-transparent via-surface-strong/25 to-surface"
            aria-hidden="true"
          />
          <ScrollArea
            className={`
              relative z-10
              ${mode}
              w-full h-full
              transition-all duration-500 ease-in-out
              rounded-[32px]
              border border-border shadow-2xl bg-background
            `}
          >
            <PortfolioRenderer portfolio={portfolio} />
          </ScrollArea>
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
                  <Link href="/sign-in">Use this template</Link>
                </Button>
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
