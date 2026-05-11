import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortfolioRenderer } from "@/components/portfolio-renderer";
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

  if (!portfolio) {
    notFound();
  }

  return (
    <section className="min-h-screen w-full">
      <PortfolioRenderer portfolio={portfolio} />
    </section>
  );
}
