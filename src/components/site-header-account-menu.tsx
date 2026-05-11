"use client";

import { useClerk } from "@clerk/nextjs";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

type SiteHeaderAccountMenuProps = {
  displayName: string;
  email?: string;
};

export function SiteHeaderAccountMenu({
  displayName,
  email,
}: SiteHeaderAccountMenuProps) {
  const { signOut } = useClerk();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut({ redirectUrl: "/" });
  };

  return (
    <div ref={containerRef} className="relative">
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="max-w-[15rem] border-zinc-700 bg-zinc-950 text-white hover:border-zinc-500 hover:bg-zinc-900"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className="truncate">{displayName}</span>
        <ChevronDown
          className={`size-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-64 rounded-[20px] border border-zinc-800 bg-zinc-950 p-2 shadow-2xl">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-white">
              {displayName}
            </p>
            {email ? (
              <p className="mt-1 truncate text-xs text-zinc-400">{email}</p>
            ) : null}
          </div>

          <div className="my-1 h-px bg-zinc-800" />

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="w-full justify-start border-none text-zinc-300 hover:bg-zinc-900 hover:text-white"
          >
            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full justify-start border-none text-zinc-300 hover:bg-zinc-900 hover:text-white"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      ) : null}
    </div>
  );
}
