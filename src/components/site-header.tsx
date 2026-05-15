import { auth, currentUser } from "@clerk/nextjs/server";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { isClerkConfigured } from "@/lib/env";
import { DevframeLogo } from "./marketing/app-icon";
import { SiteHeaderAccountMenu } from "./site-header-account-menu";
import { SiteHeaderSurface } from "./site-header-surface";

export async function SiteHeader() {
  const userId = isClerkConfigured ? (await auth()).userId : null;
  const user = userId ? await currentUser() : null;
  const navLinks = [
    { label: "Templates", href: "/templates" },
    { label: "Support", href: "/support" },
    ...(userId ? [{ label: "Dashboard", href: "/dashboard" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 grid place-items-center w-full">
      <SiteHeaderSurface>
        <div className="w-300 flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-center gap-16">
            <DevframeLogo />
            <nav className="flex flex-wrap items-center gap-1 text-sm text-foreground-muted">
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  asChild
                  variant="ghost"
                  className="border-none rounded"
                  size="sm"
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {!isClerkConfigured || !userId ? (
              <>
                <Button asChild size="xs" variant="outline">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button asChild size="xs" variant="accent">
                  <Link href="/studio">
                    Open Studio
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Button asChild size="sm" variant="accent">
                  <Link href="/studio">
                    Edit Portfolio
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <SiteHeaderAccountMenu
                  displayName={
                    user?.firstName ||
                    user?.fullName ||
                    user?.primaryEmailAddress?.emailAddress ||
                    "Account"
                  }
                  email={user?.primaryEmailAddress?.emailAddress || undefined}
                />
              </div>
            )}
          </div>
        </div>
      </SiteHeaderSurface>
    </header>
  );
}
