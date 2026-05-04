import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { isClerkConfigured } from "@/lib/env";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/builder(.*)",
]);

const proxy = isClerkConfigured
  ? clerkMiddleware(
    async (auth, request) => {
      if (isProtectedRoute(request)) {
        await auth.protect();
      }
    },
    {
      clockSkewInMs: 60000,
    }
  )
  : function proxyFallback() {
    return NextResponse.next();
  };
export default proxy;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
