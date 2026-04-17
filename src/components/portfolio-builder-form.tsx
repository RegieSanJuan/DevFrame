"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { savePortfolioAction, type BuilderFormState } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  availabilityOptions,
  portfolioFormSchema,
  type PortfolioFormValues,
} from "@/lib/portfolio-schema";
import type { PortfolioTemplate } from "@/lib/template-catalog";
import { cn } from "@/lib/utils";

type PortfolioBuilderFormProps = {
  defaultValues: PortfolioFormValues;
  templates: readonly PortfolioTemplate[];
  demoMode: boolean;
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-danger">{message}</p>;
}

export function PortfolioBuilderForm({
  defaultValues,
  templates,
  demoMode,
}: PortfolioBuilderFormProps) {
  const [state, setState] = useState<BuilderFormState>({ status: "idle" });
  const [isPending, startTransition] = useTransition();
  const [selectedTemplate, setSelectedTemplate] = useState(
    defaultValues.templateSlug,
  );
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        formData.set(key, value);
      });

      const result = await savePortfolioAction(state, formData);
      setState(result);
    });
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <Card className="order-2 border-white/10 xl:order-1">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-accent">
              <Sparkles className="size-5" />
            </span>
            <div>
              <CardTitle>Portfolio builder</CardTitle>
              <CardDescription>
                Fill in your details, pick a template, and publish your public
                portfolio.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-8" onSubmit={onSubmit}>
            <input type="hidden" {...register("templateSlug")} />
            <section className="space-y-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                  Choose a template
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground-muted">
                  Each template is wired to a different portfolio presentation,
                  but your data structure stays the same.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {templates.map((template) => (
                  <button
                    key={template.slug}
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(template.slug);
                      setValue("templateSlug", template.slug, { shouldValidate: true });
                    }}
                    className={cn(
                      "rounded-[24px] border p-4 text-left transition duration-200",
                      selectedTemplate === template.slug
                        ? "border-accent bg-accent/10 shadow-[0_22px_50px_-34px_rgba(62,207,142,0.72)]"
                        : "border-white/10 bg-white/[0.03] hover:border-white/16 hover:bg-white/[0.05]",
                    )}
                  >
                    <div
                      className={cn(
                        "h-2 w-full rounded-full bg-gradient-to-r",
                        template.accent,
                      )}
                    />
                    <p className="mt-4 text-base font-semibold text-foreground">
                      {template.name}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-foreground-muted">
                      {template.tagline}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-foreground" htmlFor="slug">
                  Portfolio slug
                </label>
                <Input id="slug" placeholder="regie" {...register("slug")} />
                <FieldError message={errors.slug?.message} />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground" htmlFor="name">
                  Full name
                </label>
                <Input id="name" placeholder="Regie Cruz" {...register("name")} />
                <FieldError message={errors.name?.message} />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground" htmlFor="title">
                  Professional title
                </label>
                <Input
                  id="title"
                  placeholder="Frontend Developer"
                  {...register("title")}
                />
                <FieldError message={errors.title?.message} />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground" htmlFor="location">
                  Location
                </label>
                <Input
                  id="location"
                  placeholder="Cebu City, Philippines"
                  {...register("location")}
                />
                <FieldError message={errors.location?.message} />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.dev"
                  {...register("email")}
                />
                <FieldError message={errors.email?.message} />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground" htmlFor="availability">
                  Availability
                </label>
                <select
                  id="availability"
                  className="flex h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] outline-none transition focus:border-accent focus:bg-white/[0.04] focus:ring-2 focus:ring-accent/20"
                  {...register("availability")}
                >
                  {availabilityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.availability?.message} />
              </div>
            </section>

            <section className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground" htmlFor="bio">
                  Short intro
                </label>
                <Textarea
                  id="bio"
                  placeholder="I build fast, polished web products with thoughtful UX and clean front-end architecture."
                  className="min-h-28"
                  {...register("bio")}
                />
                <FieldError message={errors.bio?.message} />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground" htmlFor="about">
                  About story
                </label>
                <Textarea
                  id="about"
                  placeholder="Tell visitors how you work, what you care about, and what kind of problems you solve."
                  className="min-h-40"
                  {...register("about")}
                />
                <FieldError message={errors.about?.message} />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground" htmlFor="skills">
                  Skills
                </label>
                <Input
                  id="skills"
                  placeholder="Next.js, TypeScript, Tailwind CSS, Supabase"
                  {...register("skills")}
                />
                <FieldError message={errors.skills?.message} />
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-semibold text-foreground" htmlFor="githubUrl">
                  GitHub URL
                </label>
                <Input
                  id="githubUrl"
                  placeholder="https://github.com/you"
                  {...register("githubUrl")}
                />
                <FieldError message={errors.githubUrl?.message} />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground" htmlFor="linkedinUrl">
                  LinkedIn URL
                </label>
                <Input
                  id="linkedinUrl"
                  placeholder="https://linkedin.com/in/you"
                  {...register("linkedinUrl")}
                />
                <FieldError message={errors.linkedinUrl?.message} />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground" htmlFor="websiteUrl">
                  Personal site URL
                </label>
                <Input
                  id="websiteUrl"
                  placeholder="https://yourdomain.dev"
                  {...register("websiteUrl")}
                />
                <FieldError message={errors.websiteUrl?.message} />
              </div>
            </section>

            <section className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                Featured project
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    className="text-sm font-semibold text-foreground"
                    htmlFor="featuredProjectName"
                  >
                    Project name
                  </label>
                  <Input
                    id="featuredProjectName"
                    placeholder="DevFrame Starter"
                    {...register("featuredProjectName")}
                  />
                  <FieldError message={errors.featuredProjectName?.message} />
                </div>
                <div>
                  <label
                    className="text-sm font-semibold text-foreground"
                    htmlFor="featuredProjectStack"
                  >
                    Project stack
                  </label>
                  <Input
                    id="featuredProjectStack"
                    placeholder="Next.js, Clerk, Supabase"
                    {...register("featuredProjectStack")}
                  />
                  <FieldError message={errors.featuredProjectStack?.message} />
                </div>
              </div>
              <div>
                <label
                  className="text-sm font-semibold text-foreground"
                  htmlFor="featuredProjectSummary"
                >
                  Project summary
                </label>
                <Textarea
                  id="featuredProjectSummary"
                  className="min-h-28"
                  placeholder="Explain what the project does and why it matters."
                  {...register("featuredProjectSummary")}
                />
                <FieldError message={errors.featuredProjectSummary?.message} />
              </div>
              <div>
                <label
                  className="text-sm font-semibold text-foreground"
                  htmlFor="featuredProjectUrl"
                >
                  Project URL
                </label>
                <Input
                  id="featuredProjectUrl"
                  placeholder="https://yourproject.dev"
                  {...register("featuredProjectUrl")}
                />
                <FieldError message={errors.featuredProjectUrl?.message} />
              </div>
            </section>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button type="submit" variant="accent" size="lg" disabled={isPending}>
                {isPending ? "Saving portfolio..." : "Save portfolio"}
              </Button>
              {state.previewUrl ? (
                <Button asChild variant="secondary" size="lg">
                  <Link href={new URL(state.previewUrl).pathname}>
                    Open public preview
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              ) : null}
            </div>

            {state.status !== "idle" ? (
              <div
                className={cn(
                  "rounded-[24px] border px-5 py-4 text-sm leading-6",
                  state.status === "success"
                    ? "border-accent/30 bg-accent/10 text-accent"
                    : "border-danger/30 bg-danger/10 text-danger",
                )}
              >
                <div className="flex items-start gap-3">
                  {state.status === "success" ? (
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                  ) : (
                    <AlertCircle className="mt-0.5 size-5 shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold">{state.message}</p>
                    {state.previewUrl ? (
                      <p className="mt-1 text-xs uppercase tracking-[0.2em]">
                        Public route: {new URL(state.previewUrl).pathname}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            <p className="text-sm leading-6 text-foreground-soft">
              {demoMode
                ? "Demo mode is active right now, so protected pages stay accessible while you finish setting up Clerk."
                : "Once Clerk is connected, this builder stays protected behind your authenticated dashboard."}
            </p>
          </form>
        </CardContent>
      </Card>

      <div className="order-1 space-y-6 xl:order-2">
        <Card className="border-white/10">
          <CardHeader>
            <Badge>How it works</Badge>
            <CardTitle>One form, multiple portfolio styles</CardTitle>
            <CardDescription>
              DevFrame keeps your data structured so you can switch templates
              without rebuilding your content from scratch.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                1. Pick your look
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground-muted">
                Start with Signal, Atlas, or Pulse depending on how bold or
                editorial you want your portfolio to feel.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                2. Fill in your profile
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground-muted">
                Add your intro, about section, links, and featured project details.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                3. Publish to a clean URL
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground-muted">
                Your public portfolio lives at a route like `/p/your-name`.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-surface-strong text-foreground">
          <CardHeader>
            <Badge className="border-white/10 bg-white/[0.06] text-foreground-soft">
              MVP note
            </Badge>
            <CardTitle>Ready for Supabase and Vercel</CardTitle>
            <CardDescription>
              The UI works before your environment is fully connected, and the
              same builder upgrades to real persistence once your keys are added.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-foreground-muted">
            <p>
              Clerk handles authentication. Supabase stores the portfolio data.
              The public page reads your saved portfolio and renders the chosen
              template automatically.
            </p>
            <p>
              When Supabase is missing, DevFrame uses preview mode so you can
              keep shaping the product instead of getting blocked by setup.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
