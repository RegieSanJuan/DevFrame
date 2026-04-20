"use client";

import { Show, UserButton } from "@clerk/nextjs";
import { ArrowRight, LayoutTemplate } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { isClerkConfigured } from "@/lib/env";
import { useEffect, useState } from "react";
import { DevframeLogo } from "./marketing/app-icon";

export function SiteHeader() {
  const navLinks = [
    { label: "Templates", href: "/templates" },
    { label: "Pricing", href: "/pricing" },
    { label: "Docs", href: "/docs" },
  ];

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 grid place-items-center">
      <div
        className={`bg-background/82 backdrop-blur-xl w-full rounded grid place-items-center pt-2 ${
          scrolled ? "border-b border-white/10" : ""
        }`}
      >
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
            {!isClerkConfigured ? (
              <>
                <Button asChild size="xs" variant="outline">
                  <Link href="/builder">Sign up</Link>
                </Button>
                <Button asChild size="xs" variant="accent">
                  <Link href="/builder">Start building</Link>
                </Button>
              </>
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
