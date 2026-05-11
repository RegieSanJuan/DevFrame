import Link from "next/link";

import { DevframeIcon } from "@/components/marketing/app-icon";

export default function PublicPortfolioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative min-h-screen w-full">
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-end p-4 sm:p-5">
        <Link
          href="/"
          aria-label="Open DevFrame home"
          title="Built with DevFrame"
          className="pointer-events-auto inline-flex size-11 items-center justify-center rounded-full border border-border/80 bg-background/82 text-foreground-muted shadow-[0_18px_40px_-28px_rgba(0,0,0,0.9)] backdrop-blur-md transition-colors duration-200 hover:border-border-strong hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
        >
          <DevframeIcon className="size-5 rounded-none" />
          <span className="sr-only">Built with DevFrame</span>
        </Link>
      </div>

      {children}
    </main>
  );
}
