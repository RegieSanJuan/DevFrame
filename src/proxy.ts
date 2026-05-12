import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { appEnv, isClerkConfigured } from "@/lib/env";
import { applySecurityHeaders, guardRequest } from "@/lib/security/request-guard";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/builder(.*)",
]);

const proxy = isClerkConfigured
  ? clerkMiddleware(
    async (auth, request) => {
      const blockedResponse = await guardRequest(request);

      if (blockedResponse) {
        return applySecurityHeaders(blockedResponse, request);
      }

      if (isProtectedRoute(request)) {
        await auth.protect();
      }

      return applySecurityHeaders(NextResponse.next(), request);
    },
    {
      authorizedParties: appEnv.clerkAuthorizedParties,
    },
  )
  : async function proxyFallback(request: NextRequest) {
    const blockedResponse = await guardRequest(request);

    if (blockedResponse) {
      return applySecurityHeaders(blockedResponse, request);
    }

    return applySecurityHeaders(NextResponse.next(), request);
  };
export default proxy;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
