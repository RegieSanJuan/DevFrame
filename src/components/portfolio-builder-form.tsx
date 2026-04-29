"use client";

import Link from "next/link";
import { AlertCircle, ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";

import { BuilderStepCard } from "@/components/builder/builder-step-card";
import { TemplateOptionCard } from "@/components/builder/template-option-card";
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
import { usePortfolioBuilderForm } from "@/hooks/use-portfolio-builder-form";
import {
  availabilityOptions,
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
  const {
    form: {
      register,
      formState: { errors },
    },
    isPending,
    selectTemplate,
    selectedTemplate,
    submissionState,
    submit,
  } = usePortfolioBuilderForm({
    defaultValues,
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <Card className="order-2 border-border xl:order-1">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-2xl border border-border bg-surface-strong text-accent">
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
          <form className="space-y-8" onSubmit={submit}>
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
                  <TemplateOptionCard
                    key={template.slug}
                    template={template}
                    isSelected={selectedTemplate === template.slug}
                    onSelect={selectTemplate}
                  />
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
                  className="flex h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] outline-none transition focus:border-accent focus:bg-surface-strong focus:ring-2 focus:ring-accent/20"
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
              {submissionState.previewUrl ? (
                <Button asChild variant="secondary" size="lg">
                  <Link href={new URL(submissionState.previewUrl).pathname}>
                    Open public preview
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              ) : null}
            </div>

            {submissionState.status !== "idle" ? (
              <div
                className={cn(
                  "rounded-[24px] border px-5 py-4 text-sm leading-6",
                  submissionState.status === "success"
                    ? "border-accent/30 bg-accent/10 text-accent"
                    : "border-danger/30 bg-danger/10 text-danger",
                )}
              >
                <div className="flex items-start gap-3">
                  {submissionState.status === "success" ? (
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                  ) : (
                    <AlertCircle className="mt-0.5 size-5 shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold">{submissionState.message}</p>
                    {submissionState.previewUrl ? (
                      <p className="mt-1 text-xs uppercase tracking-[0.2em]">
                        Public route: {new URL(submissionState.previewUrl).pathname}
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
        <Card className="border-border">
          <CardHeader>
            <Badge>How it works</Badge>
            <CardTitle>One form, multiple portfolio styles</CardTitle>
            <CardDescription>
              DevFrame keeps your data structured so you can switch templates
              without rebuilding your content from scratch.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <BuilderStepCard
              step="1. Pick your look"
              description="Start with Nova, Vertex, or Drift depending on how bold, structured, or editorial you want your portfolio to feel."
            />
            <BuilderStepCard
              step="2. Fill in your profile"
              description="Add your intro, about section, links, and featured project details."
            />
            <BuilderStepCard
              step="3. Publish to a clean URL"
              description="Your public portfolio lives at a route like `/p/your-name`."
            />
          </CardContent>
        </Card>

        <Card className="border-border bg-surface-strong text-foreground">
          <CardHeader>
            <Badge className="border-border bg-surface-strong text-foreground-soft">
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
