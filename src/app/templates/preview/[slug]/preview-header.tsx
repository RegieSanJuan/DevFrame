"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Monitor, Smartphone } from "lucide-react";
import Link from "next/link";

interface PreviewHeaderProps {
  templateName: string;
  viewMode: "desktop" | "mobile";
  onViewModeChange: (mode: "desktop" | "mobile") => void;
}

export function PreviewHeader({ templateName, viewMode, onViewModeChange }: PreviewHeaderProps) {
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
        <div className="flex items-center bg-surface-strong border border-border rounded-xl p-1 shadow-sm">
          <Button
            variant={viewMode === "desktop" ? "accent" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("desktop")}
            className="rounded-lg gap-2 h-9 px-4"
          >
            <Monitor className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Landscape</span>
          </Button>
          <Button
            variant={viewMode === "mobile" ? "accent" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("mobile")}
            className="rounded-lg gap-2 h-9 px-4"
          >
            <Smartphone className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Portrait</span>
          </Button>
        </div>



      </div>
    </div>
  );
}
