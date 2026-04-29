type BuilderStepCardProps = {
  step: string;
  description: string;
};

export function BuilderStepCard({
  step,
  description,
}: BuilderStepCardProps) {
  return (
    <div className="rounded-[24px] border border-border bg-surface p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground-soft">
        {step}
      </p>
      <p className="mt-2 text-sm leading-6 text-foreground-muted">
        {description}
      </p>
    </div>
  );
}
