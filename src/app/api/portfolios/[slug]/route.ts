import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getPublicPortfolioBySlug } from "@/services/portfolio-service";

const PREVIEW_COOKIE_NAME = "devframe-preview";

type PortfolioRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

function withPortfolioCacheHeaders(response: NextResponse, request: NextRequest) {
  if (request.cookies.has(PREVIEW_COOKIE_NAME)) {
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
  } else {
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300",
    );
    response.headers.set("Vary", "Cookie");
  }

  return response;
}

export async function GET(request: NextRequest, { params }: PortfolioRouteProps) {
  const { slug } = await params;
  const portfolio = await getPublicPortfolioBySlug(slug);

  if (!portfolio) {
    return withPortfolioCacheHeaders(
      NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 },
      ),
      request,
    );
  }

  return withPortfolioCacheHeaders(
    NextResponse.json({
      portfolio,
    }),
    request,
  );
}

export function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      Allow: "GET, HEAD, OPTIONS",
    },
    status: 204,
  });
}
