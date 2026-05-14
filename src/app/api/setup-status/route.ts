import { NextResponse } from "next/server";

import {
  getSetupStatusItems,
  isSetupDiagnosticsEnabled,
} from "@/lib/setup-status";

export function GET() {
  if (!isSetupDiagnosticsEnabled) {
    return new NextResponse(null, {
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
      },
      status: 404,
    });
  }

  const response = NextResponse.json({
    items: getSetupStatusItems(),
  });

  response.headers.set("Cache-Control", "private, no-store, max-age=0");

  return response;
}

export function OPTIONS() {
  if (!isSetupDiagnosticsEnabled) {
    return new NextResponse(null, {
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
      },
      status: 404,
    });
  }

  return new NextResponse(null, {
    headers: {
      Allow: "GET, HEAD, OPTIONS",
    },
    status: 204,
  });
}
