import { BriefcaseBusiness, Code2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LinkPill({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: typeof Code2 | typeof BriefcaseBusiness | typeof Mail;
}) {
  return (
    <Button asChild variant="secondary" size="sm" className="rounded-full">
      <a href={href} target="_blank" rel="noreferrer">
        <Icon className="size-4" />
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
