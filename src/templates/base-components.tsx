"use client";

import { Button } from "@/components/ui/button";

interface LinkPillProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

export function LinkPill({ href, label, icon }: LinkPillProps) {
  return (
    <Button asChild variant="secondary" size="sm" className="rounded-full">
      <a href={href} target="_blank" rel="noreferrer">
        {icon && <span className="w-4 h-4">{icon}</span>}
        {label}
      </a>
    </Button>
  );
}

export function SkillBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-surface-strong px-4 py-2 text-sm text-foreground-muted">
      {children}
    </span>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-foreground-soft">
      {children}
    </p>
  );
}
