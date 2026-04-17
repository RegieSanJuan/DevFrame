import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { PortfolioRenderer } from "@/components/portfolio-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublicPortfolio } from "@/lib/portfolio-storage";
import { getTemplateBySlug } from "@/lib/template-catalog";

type PublicPortfolioPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PublicPortfolioPageProps): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await getPublicPortfolio(slug);

  if (!portfolio) {
    return {
      title: "Portfolio not found",
    };
  }

  return {
    title: `${portfolio.name} Portfolio`,
    description: portfolio.bio,
  };
}

export default async function PublicPortfolioPage({
  params,
}: PublicPortfolioPageProps) {
  const { slug } = await params;
  const portfolio = await getPublicPortfolio(slug);

  if (!portfolio) {
    notFound();
  }

  const template = getTemplateBySlug(portfolio.templateSlug);

  return (
    <div className="container-shell space-y-8 pt-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{template.name}</Badge>
            <Badge variant="success">{portfolio.availability}</Badge>
          </div>
          <p className="text-sm uppercase tracking-[0.24em] text-foreground-soft">
            Public portfolio route
          </p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/builder">
            <ArrowLeft className="size-4" />
            Back to builder
          </Link>
        </Button>
      </div>

      <PortfolioRenderer portfolio={portfolio} />
    </div>
  );
}
