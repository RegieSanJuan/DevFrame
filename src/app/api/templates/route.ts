import { NextResponse } from "next/server";

import { TEMPLATE_CATALOG } from "@/lib/template-catalog";

export function GET() {
  return NextResponse.json({
    templates: TEMPLATE_CATALOG,
  });
}
