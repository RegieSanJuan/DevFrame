import { NextResponse } from "next/server";

import { getTemplates } from "@/services/template-service";

export function GET() {
  const response = NextResponse.json({
    templates: getTemplates(),
  });

  response.headers.set(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400",
  );

  return response;
}

export function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      Allow: "GET, HEAD, OPTIONS",
    },
    status: 204,
  });
}
