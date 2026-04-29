import { NextResponse } from "next/server";

import { getSetupStatusItems } from "@/lib/setup-status";

export function GET() {
  return NextResponse.json({
    items: getSetupStatusItems(),
  });
}
