import type { PortfolioTemplate } from "@/lib/template-catalog";
import { cn } from "@/lib/utils";

type TemplateOptionCardProps = {
  template: PortfolioTemplate;
  isSelected: boolean;
  onSelect: (slug: PortfolioTemplate["slug"]) => void;
};

export function TemplateOptionCard({
  template,
  isSelected,
  onSelect,
}: TemplateOptionCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(template.slug)}
      className={cn(
        "rounded-[24px] border p-4 text-left transition duration-200",
        isSelected
          ? "border-accent bg-accent/10 shadow-[0_22px_50px_-34px_rgba(62,207,142,0.72)]"
          : "border-border bg-surface hover:border-white/16 hover:bg-surface-strong",
      )}
    >
      <div
        className={cn("h-2 w-full rounded-full bg-gradient-to-r", template.accent)}
      />
      <p className="mt-4 text-base font-semibold text-foreground">
        {template.name}
      </p>
      <p className="mt-2 text-sm leading-6 text-foreground-muted">
        {template.tagline}
      </p>
    </button>
  );
}
