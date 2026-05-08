"use client";

import { Input } from "@/components/ui/input";
import type { TemplateFieldDef } from "@/lib/template-field-registry";

type Props = {
  fields: TemplateFieldDef[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
};

export function TemplateSettingsFields({ fields, values, onChange }: Props) {
  if (fields.length === 0) return null;

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground-soft">
          Template settings
        </p>
        <p className="mt-2 text-sm leading-6 text-foreground-muted">
          Customize how this template looks and feels. These settings only
          affect your chosen template.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <FieldControl
            key={field.key}
            field={field}
            value={values[field.key]}
            onChange={(v) => onChange(field.key, v)}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Individual field renderer ────────────────────────────────────────────────

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: TemplateFieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const id = `ts-${field.key}`;

  return (
    <div className={field.type === "toggle" ? "flex items-start gap-3 md:col-span-2" : ""}>
      {field.type === "toggle" ? (
        <>
          <input
            id={id}
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-border accent-accent"
            checked={value !== undefined ? Boolean(value) : (field.defaultValue ?? true)}
            onChange={(e) => onChange(e.target.checked)}
          />
          <div>
            <label className="text-sm font-semibold text-foreground" htmlFor={id}>
              {field.label}
            </label>
            {field.description && (
              <p className="mt-0.5 text-xs text-foreground-muted">{field.description}</p>
            )}
          </div>
        </>
      ) : (
        <>
          <label className="text-sm font-semibold text-foreground" htmlFor={id}>
            {field.label}
          </label>
          {field.description && (
            <p className="mb-1 text-xs text-foreground-muted">{field.description}</p>
          )}
          {field.type === "select" ? (
            <select
              id={id}
              className="flex h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] outline-none transition focus:border-accent focus:bg-surface-strong focus:ring-2 focus:ring-accent/20"
              value={String(value ?? field.defaultValue ?? "")}
              onChange={(e) => onChange(e.target.value)}
            >
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : field.type === "color" ? (
            <div className="flex items-center gap-3">
              <input
                id={id}
                type="color"
                className="h-12 w-16 cursor-pointer rounded-xl border border-border bg-surface p-1"
                value={String(value ?? field.defaultValue ?? "#000000")}
                onChange={(e) => onChange(e.target.value)}
              />
              <Input
                value={String(value ?? field.defaultValue ?? "")}
                onChange={(e) => onChange(e.target.value)}
                placeholder={field.defaultValue as string | undefined}
                className="font-mono text-sm"
              />
            </div>
          ) : (
            <Input
              id={id}
              type={field.type === "url" ? "url" : "text"}
              placeholder={"placeholder" in field ? field.placeholder : ""}
              value={String(value ?? field.defaultValue ?? "")}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        </>
      )}
    </div>
  );
}
