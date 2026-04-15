import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isClerkConfigured } from "@/lib/env";

export function SiteHeader() {
  return (
    <header className="container-shell sticky top-0 z-40 py-6">
      <div className="rounded-full border border-slate-900/10 bg-white/80 px-4 py-3 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.55)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                DF
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                  DevFrame
                </p>
                <p className="text-sm text-slate-600">
                  Developer portfolio builder
                </p>
              </div>
            </Link>
            {!isClerkConfigured ? <Badge variant="warning">Demo mode</Badge> : null}
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <nav className="flex items-center gap-2 text-sm text-slate-600">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">Home</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/templates">Templates</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </nav>

            {!isClerkConfigured ? (
              <Button asChild size="sm" variant="accent">
                <Link href="/builder">Explore the builder</Link>
              </Button>
            ) : (
              <>
                <Show when="signed-out">
                  <div className="flex items-center gap-2">
                    <Button asChild size="sm" variant="ghost">
                      <Link href="/sign-in">Sign in</Link>
                    </Button>
                    <Button asChild size="sm" variant="accent">
                      <Link href="/sign-up">Start building</Link>
                    </Button>
                  </div>
                </Show>
                <Show when="signed-in">
                  <div className="flex items-center gap-3">
                    <Button asChild size="sm" variant="secondary">
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
