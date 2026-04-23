import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing. Start free and upgrade when you're ready to unlock every template and custom domain.",
};

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to publish your first portfolio.",
    cta: "Get started",
    ctaHref: "/builder",
    ctaVariant: "secondary" as const,
    highlighted: false,
    features: [
      "1 portfolio",
      "Signal template",
      "Public /p/slug route",
      "Builder workspace",
      "Setup health check",
      null, // separator filler
      null,
    ],
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "All templates, analytics, and a domain you own.",
    cta: "Start Pro",
    ctaHref: "/sign-up",
    ctaVariant: "accent" as const,
    highlighted: true,
    badge: "Most popular",
    features: [
      "Unlimited portfolios",
      "All 3 templates",
      "Custom domain",
      "Analytics dashboard",
      "Priority support",
      "Early access to new templates",
      "Remove DevFrame branding",
    ],
  },
  {
    name: "Team",
    price: "$29",
    period: "per month",
    description: "Shared workspace for agencies and developer teams.",
    cta: "Contact us",
    ctaHref: "/contact",
    ctaVariant: "secondary" as const,
    highlighted: false,
    features: [
      "Everything in Pro",
      "Up to 10 members",
      "Shared template library",
      "Team analytics",
      "Dedicated support",
      "Custom onboarding",
      "Invoice billing",
    ],
  },
] as const;

const comparisonRows = [
  { label: "Portfolios", free: "1", pro: "Unlimited", team: "Unlimited" },
  { label: "Templates", free: "Signal only", pro: "All 3", team: "All 3" },
  { label: "Custom domain", free: false, pro: true, team: true },
  { label: "Analytics", free: false, pro: true, team: true },
  { label: "Team members", free: false, pro: false, team: "Up to 10" },
  { label: "Remove branding", free: false, pro: true, team: true },
  { label: "Priority support", free: false, pro: true, team: true },
  { label: "Custom onboarding", free: false, pro: false, team: true },
] as const;

const faqs = [
  {
    q: "Can I switch templates later?",
    a: "Yes. Your portfolio content is stored once and is template-agnostic. Switching presentation styles takes one click.",
  },
  {
    q: "What happens when my trial ends?",
    a: "Your portfolio stays live on the Free plan. You'll only lose access to Pro features like custom domains and analytics.",
  },
  {
    q: "Do you offer annual billing?",
    a: "Annual billing with a 20% discount is coming soon. Sign up and we'll notify you when it's available.",
  },
  {
    q: "Is there a student discount?",
    a: "Yes — students get 50% off Pro. Reach out with a valid .edu email and we'll apply it to your account.",
  },
  {
    q: "What counts as a portfolio?",
    a: "Each published /p/slug route is one portfolio. Drafts and previews don't count toward your limit.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Always. No lock-in, no cancellation fees. Downgrade at any time and keep your data.",
  },
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true)
    return (
      <span className="flex justify-center">
        <Check className="size-4 text-accent" />
      </span>
    );
  if (value === false)
    return (
      <span className="flex justify-center">
        <Minus className="size-3.5 text-foreground-soft" />
      </span>
    );
  return (
    <span className="block text-center text-sm font-medium text-foreground">
      {value}
    </span>
  );
}

export default function PricingPage() {
  return (
    <div className="container-shell space-y-24 pt-16 pb-10">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center space-y-5">
        <span className="section-label">Pricing</span>
        <h1 className="text-5xl font-semibold tracking-[-0.07em] text-foreground md:text-6xl">
          Simple, honest pricing.
        </h1>
        <p className="text-base leading-7 text-foreground-muted md:text-lg">
          Start free. Upgrade when you need more templates, a custom domain, or
          analytics. No hidden fees.
        </p>
      </div>

      {/* ── Plan cards ─────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-[26px] border p-8 transition-all duration-200 ${
              plan.highlighted
                ? "border-accent/40 bg-accent-soft shadow-[0_0_60px_-20px_rgba(201,169,110,0.18)]"
                : "border-border bg-surface hover:border-border-strong hover:bg-surface-strong"
            }`}
          >
            {"badge" in plan && plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-accent/40 bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {plan.badge}
              </span>
            )}

            {/* Plan name + price */}
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                {plan.name}
              </p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-semibold tracking-[-0.04em] text-foreground">
                  {plan.price}
                </span>
                <span className="mb-1.5 text-sm text-foreground-muted">
                  /{plan.period}
                </span>
              </div>
              <p className="text-sm leading-6 text-foreground-muted">
                {plan.description}
              </p>
            </div>

            <div className="my-7 h-px bg-border" />

            {/* Feature list */}
            <ul className="flex flex-col gap-3 flex-1">
              {plan.features.map((feature, i) =>
                feature ? (
                  <li key={i} className="flex items-center gap-3 text-sm text-foreground-muted">
                    <Check className="size-3.5 shrink-0 text-accent" />
                    {feature}
                  </li>
                ) : (
                  <li key={i} className="h-5" /> // breathing space
                )
              )}
            </ul>

            <div className="mt-8">
              <Button
                asChild
                variant={plan.ctaVariant}
                size="sm"
                className="w-full"
              >
                <Link href={plan.ctaHref}>
                  {plan.cta}
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Comparison table ───────────────────────────── */}
      <section className="space-y-8">
        <div className="space-y-2">
          <span className="section-label">Compare plans</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.06em] text-foreground">
            Everything side by side.
          </h2>
        </div>

        <div className="rounded-[24px] border border-border overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-4 border-b border-border bg-surface px-6 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
              Feature
            </p>
            {["Free", "Pro", "Team"].map((h) => (
              <p
                key={h}
                className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft"
              >
                {h}
              </p>
            ))}
          </div>

          {/* Rows */}
          {comparisonRows.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-4 items-center px-6 py-4 ${
                i < comparisonRows.length - 1 ? "border-b border-white/[0.05]" : ""
              }`}
            >
              <p className="text-sm text-foreground-muted">{row.label}</p>
              <Cell value={row.free} />
              <Cell value={row.pro} />
              <Cell value={row.team} />
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────── */}
      <section className="space-y-10">
        <div className="space-y-2">
          <span className="section-label">FAQ</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.06em] text-foreground">
            Common questions.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-[20px] border border-border bg-surface p-6 space-y-3"
            >
              <p className="text-sm font-semibold tracking-[-0.01em] text-foreground">
                {faq.q}
              </p>
              <p className="text-sm leading-6 text-foreground-muted">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA strip ──────────────────────────────────── */}
      <section className="pb-4">
        <div className="relative overflow-hidden rounded-[28px] border border-border bg-surface-strong">
          <div className="relative flex flex-col items-center gap-6 px-8 py-14 text-center">
            <p className="text-3xl font-semibold tracking-[-0.06em] text-foreground md:text-4xl">
              Ready to publish?
            </p>
            <p className="max-w-md text-base leading-7 text-foreground-muted">
              Start on the Free plan today — no credit card required. Upgrade
              whenever your portfolio is ready to grow.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="accent">
                <Link href="/builder">
                  Open the builder
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/templates">Browse templates</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
