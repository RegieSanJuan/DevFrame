import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  clerkUserButtonAppearance,
  clerkUserProfileAppearance,
} from "@/lib/clerk-auth-appearance";
import { isClerkConfigured } from "@/lib/env";
import { DevframeLogo } from "./marketing/app-icon";

export async function SiteHeader() {
  const navLinks = [
    { label: "Templates", href: "/templates" },
    { label: "Pricing", href: "/pricing" },
    { label: "Docs", href: "/docs" },
  ];
  const userId = isClerkConfigured ? (await auth()).userId : null;

  return (
    <header className="sticky top-0 z-40 grid place-items-center w-full">
      <div className="bg-background/82 backdrop-blur-xl w-full rounded grid place-items-center border-b border-border pt-2">
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
                  <Link href="/sign-up">Start building</Link>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Button asChild size="sm" variant="accent">
                  <Link href="/builder">
                    Start building
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <UserButton
                  showName
                  userProfileMode="modal"
                  appearance={clerkUserButtonAppearance}
                  userProfileProps={{ appearance: clerkUserProfileAppearance }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
