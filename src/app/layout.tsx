import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";

import { SiteHeader } from "@/components/site-header";
import { appEnv, isClerkConfigured } from "@/lib/env";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(appEnv.appUrl),
  title: {
    default: "DevFrame",
    template: "%s | DevFrame",
  },
  description:
    "Create your developer portfolio in minutes using ready-made templates tailored to your style.",
};

function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!isClerkConfigured) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      appearance={{
        cssLayerName: "clerk",
        variables: {
          colorPrimary: "#3ecf8e",
          colorBackground: "#111614",
          colorInputBackground: "#0e1211",
          colorInputText: "#f3f5f4",
          colorText: "#f3f5f4",
          colorTextSecondary: "#a3ada8",
          colorNeutral: "#1a211f",
          colorDanger: "#ff7b72",
          borderRadius: "1rem",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <Providers>
          <div className="relative isolate min-h-screen overflow-x-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-70 subtle-grid [mask-image:linear-gradient(to_bottom,white,transparent_88%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(circle_at_top,rgba(62,207,142,0.22),transparent_58%)] blur-3xl" />
            <SiteHeader />
            <main className="pb-24">{children}</main>
            <footer className="container-shell pb-10 text-sm text-foreground-muted">
              <div className="surface-panel flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    DevFrame
                  </p>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-foreground-muted">
                    A polished developer portfolio platform with structured
                    publishing, reusable templates, and a calmer, more premium
                    builder experience.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.22em] text-foreground-soft">
                  <span>Dark platform UI</span>
                  <span>Reusable system</span>
                  <span>Responsive by default</span>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
