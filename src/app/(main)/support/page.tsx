import {
  ArrowUpRight,
  BookOpen,
  Bug,
  Code2,
  HeartHandshake,
  Lightbulb,
  Star,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GITHUB_CONTRIBUTING_URL,
  GITHUB_DISCUSSIONS_URL,
  GITHUB_ISSUES_URL,
  GITHUB_REPO_URL,
} from "@/lib/project-links";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Support DevFrame, a free and open-source portfolio builder for developers.",
};

const communityActions = [
  {
    title: "Star the GitHub repository",
    description:
      "A star helps more developers discover DevFrame and signals that the project is worth keeping alive.",
    href: GITHUB_REPO_URL,
    cta: "Star DevFrame",
    icon: Star,
  },
  {
    title: "Report bugs",
    description:
      "Open a focused issue with steps to reproduce, screenshots, browser details, and the template or route affected.",
    href: GITHUB_ISSUES_URL,
    cta: "Open issues",
    icon: Bug,
  },
  {
    title: "Suggest features",
    description:
      "Share ideas for Builder, Studio, templates, public portfolios, or deployment workflows.",
    href: GITHUB_DISCUSSIONS_URL,
    cta: "Start a discussion",
    icon: Lightbulb,
  },
  {
    title: "Contribute code/docs/templates",
    description:
      "Send focused pull requests for bug fixes, documentation, template improvements, and small product upgrades.",
    href: GITHUB_CONTRIBUTING_URL,
    cta: "Read the guide",
    icon: Code2,
  },
] as const;

const supportQrCodes = [
  {
    name: "GoTyme InstaPay",
    image: "/support/gotyme-instapay-qr.png",
    alt: "GoTyme InstaPay QR code for supporting DevFrame",
    width: 594,
    height: 867,
    frameClassName: "max-w-[14.75rem]",
  },
  {
    name: "GCash",
    image: "/support/gcash-qr.jpg",
    alt: "GCash QR code for supporting DevFrame",
    width: 720,
    height: 1280,
    frameClassName: "max-w-[12.5rem]",
  },
] as const;

export default function SupportPage() {
  return (
    <div className="container-shell space-y-20 pb-12 pt-16">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="space-y-6">
          <Badge>Free and open-source</Badge>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.07em] text-foreground md:text-6xl">
              Support DevFrame as an open-source project.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-foreground-muted md:text-lg md:leading-8">
              DevFrame is a free, open-source portfolio builder. The best way
              to help is to use it, share feedback, contribute improvements,
              and star the repository.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="accent">
              <a href={GITHUB_REPO_URL} rel="noopener noreferrer" target="_blank">
                <Star className="size-4" />
                Star on GitHub
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/studio">Open Studio</Link>
            </Button>
          </div>
        </div>

        <Card className="border-border bg-surface">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl tracking-[-0.04em]">
              <HeartHandshake className="size-5 text-accent" />
              Project support
            </CardTitle>
            <CardDescription>
              No payment platform or account linking. Just practical ways to
              help the project keep moving.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {[
              "GitHub stars",
              "Useful issues",
              "Template ideas",
              "Docs and code PRs",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-border bg-background-alt px-4 py-3 text-sm font-medium text-foreground-muted"
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {communityActions.map((action) => {
          const Icon = action.icon;

          return (
            <Card key={action.title} className="flex flex-col border-border bg-surface">
              <CardHeader>
                <span className="flex size-11 items-center justify-center rounded-2xl border border-border bg-surface-strong text-accent">
                  <Icon className="size-5" />
                </span>
                <CardTitle>{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button asChild size="sm" variant="outline" className="w-full">
                  <a href={action.href} rel="noopener noreferrer" target="_blank">
                    {action.cta}
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="space-y-5">
          <Badge variant="success">Optional support</Badge>
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-[-0.06em] text-foreground md:text-4xl">
              Support development.
            </h2>
            <p className="text-base leading-7 text-foreground-muted">
              Support DevFrame through GoTyme InstaPay or GCash.
            </p>
            <p className="text-sm leading-6 text-foreground-soft">
              Donations help cover hosting, tools, and continued development.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {supportQrCodes.map((qrCode) => (
            <Card
              key={qrCode.name}
              className="overflow-hidden border-border bg-surface"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{qrCode.name}</CardTitle>
                <CardDescription>Scan with your banking app.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-[24px] border border-white/5 bg-background-alt p-4">
                  <div className="rounded-[22px] bg-[#f6f5f2] p-3">
                    <div className={`mx-auto ${qrCode.frameClassName}`}>
                      <Image
                        src={qrCode.image}
                        alt={qrCode.alt}
                        width={qrCode.width}
                        height={qrCode.height}
                        className="h-auto w-full rounded-[18px] object-contain shadow-[0_20px_40px_-30px_rgba(0,0,0,0.58)]"
                        priority={false}
                      />
                    </div>
                  </div>
                </div>
                <p className="text-xs uppercase tracking-[0.18em] text-foreground-soft">
                  Optional support only
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Keep issues actionable",
            copy: "Include expected behavior, current behavior, screenshots, and the route or template involved.",
            icon: Bug,
          },
          {
            title: "Shape the roadmap",
            copy: "Use discussions for template requests, Studio improvements, deployment ideas, and workflow feedback.",
            icon: Lightbulb,
          },
          {
            title: "Improve the docs",
            copy: "Small fixes matter: setup notes, screenshots, examples, and clearer contribution steps all help.",
            icon: BookOpen,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[24px] border border-border bg-surface p-6"
            >
              <Icon className="size-5 text-accent" />
              <h3 className="mt-5 text-lg font-semibold tracking-[-0.03em] text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-foreground-muted">
                {item.copy}
              </p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
