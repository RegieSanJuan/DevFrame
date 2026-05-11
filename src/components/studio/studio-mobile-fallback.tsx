"use client";

import React from "react";
import { Monitor, Smartphone, Layout, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function StudioMobileFallback() {
  return (
    <div className="flex flex-col items-center justify-center absolute inset-0 p-6 bg-[#0a0a0a] text-white overflow-hidden">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Visual Illustration */}
        <div className="relative h-40 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
          <div className="relative flex items-center gap-4">
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl">
              <Smartphone className="w-12 h-12 text-zinc-500" />
            </div>
            <ArrowRight className="w-6 h-6 text-zinc-700 animate-pulse" />
            <div className="p-6 bg-zinc-900 border-2 border-blue-500/50 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <Monitor className="w-16 h-16 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl uppercase italic">
            Desktop Only Experience
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            The Studio is a powerful, precision tool designed for large screens. 
            To provide the best building experience, we recommend using a desktop or laptop.
          </p>
        </div>

        {/* Action */}
        <div className="pt-4 flex flex-col gap-3">
          <Button 
            asChild
            variant="outline" 
            className="w-full py-6 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 transition-all active:scale-[0.98]"
          >
            <Link href="/">
              Return to Home
            </Link>
          </Button>
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-medium">
            DevFrame Studio v1.0
          </div>
        </div>
      </div>

      {/* Decorative Grid Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>
    </div>
  );
}
