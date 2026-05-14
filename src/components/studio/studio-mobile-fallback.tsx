"use client";

import { ArrowRight, Monitor, SlidersHorizontal, Smartphone } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function StudioMobileFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#0a0a0a] p-6 text-white">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#101010] p-6 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
              DevFrame Studio
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
              Studio is desktop-first.
            </h1>
          </div>
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-accent">
            <Monitor className="size-5" />
          </span>
        </div>

        <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
            <Smartphone className="mx-auto size-6 text-white/45" />
            <p className="mt-3 text-xs font-semibold text-white/60">Mobile</p>
          </div>
          <ArrowRight className="size-4 text-white/30" />
          <div className="rounded-2xl border border-accent/30 bg-accent/10 p-4 text-center">
            <SlidersHorizontal className="mx-auto size-6 text-accent" />
            <p className="mt-3 text-xs font-semibold text-accent">
              Form Editor
            </p>
          </div>
        </div>

        <p className="mt-6 text-sm leading-6 text-white/55">
          Use the mobile form editor to manage structured content on this
          device, then open Studio on a larger screen for the live split preview.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Button asChild variant="accent" size="lg" className="w-full">
            <Link href="/builder">
              Use Mobile Form Editor
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="w-full text-white/55">
            <Link href="/templates">Browse Templates</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
