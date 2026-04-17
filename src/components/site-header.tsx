import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { ArrowRight, LayoutTemplate } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isClerkConfigured } from "@/lib/env";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-white/8 bg-background/82 backdrop-blur-2xl">
        <div className="container-shell flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="group flex items-center gap-3">
              <span className="relative flex size-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_18px_44px_-30px_rgba(0,0,0,0.9)]">
                <span className="absolute left-[8px] top-[8px] h-3.5 w-3.5 rounded-[5px] bg-accent" />
                <span className="absolute bottom-[8px] right-[8px] h-3 w-3 rounded-full border border-accent/45 bg-accent/18" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-foreground-soft">
                  DevFrame
                </p>
                <p className="hidden text-sm text-foreground-muted sm:block">
                  Developer portfolio platform
                </p>
              </div>
            </Link>
            {!isClerkConfigured ? <Badge variant="warning">Demo mode</Badge> : null}
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <nav className="flex flex-wrap items-center gap-1 text-sm text-foreground-muted">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">Overview</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/templates">Templates</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/builder">Builder</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </nav>

            {!isClerkConfigured ? (
              <Button asChild size="sm" variant="accent">
                <Link href="/builder">
                  Open builder
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Show when="signed-out">
                  <div className="flex items-center gap-2">
                    <Button asChild size="sm" variant="ghost">
                      <Link href="/sign-in">Sign in</Link>
                    </Button>
                    <Button asChild size="sm" variant="accent">
                      <Link href="/sign-up">
                        Start building
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </Show>
                <Show when="signed-in">
                  <div className="flex items-center gap-3">
                    <Button asChild size="sm" variant="secondary">
                      <Link href="/templates">
                        Templates
                        <LayoutTemplate className="size-4" />
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="accent">
                      <Link href="/builder">Edit portfolio</Link>
                    </Button>
                    <UserButton />
                  </div>
                </Show>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
