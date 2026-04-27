"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Maximize2, Monitor, Smartphone } from "lucide-react";
import Link from "next/link";

interface PreviewHeaderProps {
  templateName: string;
  viewMode: "desktop" | "mobile";
  onViewModeChange: (mode: "desktop" | "mobile") => void;
  onFullscreen: () => void; // add this
}

export function PreviewHeader({ templateName, viewMode, onViewModeChange, onFullscreen }: PreviewHeaderProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{templateName} Template</h1>
      </div>

      <div className="flex items-center gap-3">
        <Button asChild variant="ghost">
          <Link href="/templates">
            <ArrowLeft className="size-4" />
            All templates
          </Link>
        </Button>
        <div className="h-6 w-px bg-border mx-2 hidden md:block" />
        {/* VIEW MODE TABS */}
        <div className="flex items-center bg-surface-strong border border-border rounded-xl gap-1 p-1 shadow-sm">
          <Button
            variant={viewMode === "desktop" ? "accent" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("desktop")}
            className="rounded-lg gap-2 h-9 px-4"
          >
            <Monitor className="size-4" />
          </Button>
          <Button
            variant={viewMode === "mobile" ? "accent" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("mobile")}
            className="rounded-lg gap-2 h-9 px-4"
          >
            <Smartphone className="size-4" />
          </Button>
          <button
            onClick={onFullscreen}
            className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground-muted hover:text-foreground hover:border-border-strong transition-all"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Fullscreen
          </button>
        </div>



      </div>
    </div>
  );
}
