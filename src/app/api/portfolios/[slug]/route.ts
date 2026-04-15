import { NextResponse } from "next/server";

import { getPublicPortfolio } from "@/lib/portfolio-storage";

type PortfolioRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, { params }: PortfolioRouteProps) {
  const { slug } = await params;
  const portfolio = await getPublicPortfolio(slug);

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
