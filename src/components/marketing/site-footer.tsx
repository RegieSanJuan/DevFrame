import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { DevframeLogo } from "./app-icon";
import { ThemeToggle } from "../theme-toggle";

function GithubIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function XIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.26 5.632 5.904-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const footerLinks = {
  Product: [
    { label: "Templates", href: "/templates" },
    { label: "Pricing", href: "/pricing" },
    { label: "Changelog", href: "/changelog" },
    { label: "Roadmap", href: "/roadmap" },
  ],
  Developers: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/docs/api" },
    { label: "GitHub", href: "https://github.com", external: true },
    { label: "Open Source", href: "/open-source" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border">
      {/* Massive background wordmark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 right-0 select-none translate-x-[12%]"
      >
        <span
          className="block font-bold leading-none text-white/[0.028]"
          style={{
            fontSize: "clamp(140px, 22vw, 320px)",
            letterSpacing: "-0.04em",
            fontFamily: "var(--font-manrope)",
            lineHeight: 0.88,
          }}
        >
          devframe
        </span>
      </div>

      {/* Upper section — logo + columns */}
      <div className="relative z-10 mx-auto max-w-[88rem] px-5 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-[1fr_repeat(4,_auto)] md:gap-x-12">
          {/* Brand block */}
          <div className="col-span-2 flex flex-col gap-5 md:col-span-1">
            <DevframeLogo className="opacity-90 transition hover:opacity-100" />

            <p className="max-w-xs text-sm leading-relaxed text-foreground-muted">
              Build, publish, and iterate on your developer portfolio — with a
              premium builder designed for people who care about craft.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex size-8 items-center justify-center rounded-lg border border-border text-foreground-muted transition hover:border-border-strong hover:text-foreground-strong"
              >
                <GithubIcon size={15} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="flex size-8 items-center justify-center rounded-lg border border-border text-foreground-muted transition hover:border-border-strong hover:text-foreground-strong"
              >
                <XIcon size={15} />
              </a>
              <ThemeToggle />
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group} className="flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground-soft">
                {group}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-foreground-muted transition hover:text-foreground-strong"
                      >
                        {link.label}
                        <ArrowUpRight size={11} className="opacity-50" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-foreground-muted transition hover:text-foreground-strong"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider + bottom bar */}
        <div className="relative mt-16 flex flex-col items-start justify-between gap-4 py-8 sm:flex-row sm:items-center">
          <p className="text-xs text-foreground-soft">
            © {new Date().getFullYear()} DevFrame. All rights reserved.
          </p>
          <p className="text-xs text-foreground-soft">
            Made with care —{" "}
            <span className="text-accent">Ship something beautiful.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
