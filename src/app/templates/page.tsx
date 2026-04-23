import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getSeedPortfolioByTemplate } from "@/lib/portfolio-storage";
import { TEMPLATE_CATALOG } from "@/lib/template-catalog";

export default async function TemplatesPage() {

  return (
    <div className="container-shell space-y-24 pt-16 pb-10">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center space-y-5">
        <span className="section-label">Templates</span>
        <h1 className="text-5xl font-semibold tracking-[-0.07em] text-foreground md:text-6xl">
          Pick the direction that fits your style.
        </h1>
        <p className="text-base leading-7 text-foreground-muted md:text-lg">
          Each starter layout connects to the same structured portfolio data,
          so you can change presentation without rebuilding the underlying
          content model.
        </p>
      </div>

      {/* ── Template Catalog ───────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {TEMPLATE_CATALOG.map((template) => {
          const sample = getSeedPortfolioByTemplate(template.slug);

          return (
            <div
              key={template.slug}
              className="group flex flex-col overflow-hidden rounded-[26px] border border-border bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong"
            >
              <div
                className={`h-[3px] w-full bg-gradient-to-r ${template.accent}`}
              />
              <div className="flex flex-grow flex-col p-8">
                <div>
                  <span className="section-label">{template.name}</span>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-foreground">
                    {template.tagline}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-foreground-muted">
                    {template.description}
                  </p>
                </div>

                <div className="mt-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                    Ideal for
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground-muted">
                    {template.idealFor}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {template.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full border border-border bg-surface-strong px-3 py-1.5 text-xs text-foreground-muted"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-10">
                  <div className="flex gap-3 border-t border-border pt-6">
                    <Button asChild variant="accent" className="flex-1">
                      <Link href={`/sign-in`}>
                        Use template
                      </Link>
                    </Button>
                    {sample ? (
                      <Button asChild variant="secondary">
                        <Link href={`/p/${sample.slug}`}>Preview</Link>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Architecture Highlights ──────────────────────── */}
      <section className="mx-auto w-full max-w-5xl">
        <div className="rounded-[28px] border border-border bg-surface p-8 text-center md:p-12">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-foreground md:text-3xl">
            Write once, deploy anywhere.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-foreground-muted">
            Our single-dataset approach means your portfolio data is entirely
            decoupled from its presentation. Swap templates anytime with zero data
            loss.
          </p>
          <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                Data Layer
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                One builder
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                Presentation
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {TEMPLATE_CATALOG.length} templates
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                Deployment
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                Public `/p` route
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
