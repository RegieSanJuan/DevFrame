import { NextResponse } from "next/server";

import { getPublicPortfolioBySlug } from "@/services/portfolio-service";

type PortfolioRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, { params }: PortfolioRouteProps) {
  const { slug } = await params;
  const portfolio = await getPublicPortfolioBySlug(slug);

  if (!portfolio) {
    return NextResponse.json(
      { error: "Portfolio not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    portfolio,
  });
}
