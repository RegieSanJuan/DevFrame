import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PencilLine } from "lucide-react";

import { PortfolioRenderer } from "@/components/portfolio-renderer";
import { Button } from "@/components/ui/button";
import { getViewerContext } from "@/lib/auth";
import { createStudioEditPath } from "@/lib/portfolio-navigation";
import { getPublicPortfolioBySlug } from "@/services/portfolio-service";

type PublicPortfolioPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PublicPortfolioPageProps): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await getPublicPortfolioBySlug(slug);

  if (!portfolio) {
    return {
      title: {
        absolute: "Portfolio not found",
      },
    };
  }

  return {
    title: {
      absolute: portfolio.name,
    },
    description: portfolio.bio,
    alternates: {
      canonical: `/p/${slug}`,
    },
  };
}

export default async function PublicPortfolioPage({
  params,
}: PublicPortfolioPageProps) {
  const { slug } = await params;
  const portfolio = await getPublicPortfolioBySlug(slug);
  const viewer = await getViewerContext();

  if (!portfolio) {
    notFound();
  }

  const isOwner = Boolean(viewer.userId && viewer.userId === portfolio.ownerId);

  return (
    <section className="min-h-screen w-full">
      {isOwner ? (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-end p-4 sm:p-5">
          <Button
            asChild
            size="sm"
            variant="accent"
            className="pointer-events-auto shadow-[0_18px_40px_-28px_rgba(0,0,0,0.9)]"
          >
            <Link href={createStudioEditPath(portfolio)}>
              <PencilLine className="size-4" />
              Edit Portfolio
            </Link>
          </Button>
        </div>
      ) : null}
      <PortfolioRenderer portfolio={portfolio} />
    </section>
  );
}
