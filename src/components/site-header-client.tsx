"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { DevframeLogo } from "./marketing/app-icon";
import { SiteHeaderAccountMenu } from "./site-header-account-menu";
import { SiteHeaderSurface } from "./site-header-surface";

type SiteHeaderClientProps = {
  userId: string | null;
  userDetails: {
    displayName: string;
    email?: string;
  } | null;
  isClerkConfigured: boolean;
};

export function SiteHeaderClient({
  userId,
  userDetails,
  isClerkConfigured,
}: SiteHeaderClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Templates", href: "/templates" },
    { label: "Support", href: "/support" },
    ...(userId ? [{ label: "Dashboard", href: "/dashboard" }] : []),
  ];

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 grid place-items-center w-full">
      <SiteHeaderSurface>
        <div className="max-w-6xl w-full px-4 sm:px-6 lg:px-8 flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between w-full md:w-auto">
            <DevframeLogo />
            
            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="p-2 -mr-2 text-foreground-muted hover:text-foreground md:hidden transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="size-6 animate-in fade-in zoom-in-50 duration-200" />
              ) : (
                <Menu className="size-6 animate-in fade-in zoom-in-50 duration-200" />
              )}
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:justify-between md:flex-1 md:ml-16">
            <nav className="flex items-center gap-1 text-sm text-foreground-muted">
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

            <div className="flex items-center gap-3">
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
                      <ArrowRight className="size-4 text-zinc-950 dark:text-zinc-50" />
                    </Link>
                  </Button>
                  <SiteHeaderAccountMenu
                    displayName={userDetails?.displayName || "Account"}
                    email={userDetails?.email}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown Menu Drawer */}
        {isOpen ? (
          <div className="fixed inset-x-0 top-[65px] z-40 w-full h-[calc(100vh-65px)] bg-background/95 backdrop-blur-xl md:hidden animate-in slide-in-from-top duration-300 ease-out flex flex-col p-6 justify-between border-t border-border">
            <nav className="flex flex-col gap-2 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-semibold py-4 border-b border-border text-foreground-muted hover:text-foreground transition-colors flex items-center justify-between"
                >
                  {link.label}
                  <ArrowRight className="size-4 opacity-45" />
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3 pb-8 w-full mt-auto">
              {!isClerkConfigured || !userId ? (
                <>
                  <Button asChild size="lg" variant="outline" className="w-full h-12 cursor-pointer" onClick={() => setIsOpen(false)}>
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                  <Button asChild size="lg" variant="accent" className="w-full h-12 cursor-pointer" onClick={() => setIsOpen(false)}>
                    <Link href="/studio" className="flex items-center justify-center gap-2">
                      Open Studio
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-border">
                    <div className="max-w-[70%]">
                      <p className="font-semibold text-foreground truncate">{userDetails?.displayName}</p>
                      {userDetails?.email && <p className="text-xs text-foreground-muted mt-0.5 truncate">{userDetails?.email}</p>}
                    </div>
                    <SiteHeaderAccountMenu
                      displayName="Menu"
                      email={userDetails?.email}
                    />
                  </div>
                  <Button asChild size="lg" variant="accent" className="w-full h-12 cursor-pointer" onClick={() => setIsOpen(false)}>
                    <Link href="/studio" className="flex items-center justify-center gap-2">
                      Edit Portfolio
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </SiteHeaderSurface>
    </header>
  );
}
