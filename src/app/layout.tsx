import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { IBM_Plex_Mono, Sora } from "next/font/google";

import { SiteHeader } from "@/components/site-header";
import { appEnv, isClerkConfigured } from "@/lib/env";

import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
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
          colorPrimary: "#0f172a",
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
      className={`${sora.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>
          <div className="relative isolate min-h-screen overflow-x-hidden">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),transparent_28%),radial-gradient(circle_at_18%_16%,_rgba(249,115,22,0.18),transparent_22%),linear-gradient(180deg,#fffdf8_0%,#f5efe4_100%)]" />
            <div className="absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:52px_52px]" />
            <SiteHeader />
            <main className="pb-24">{children}</main>
            <footer className="container-shell pb-10 text-sm text-slate-500">
              <div className="rounded-[28px] border border-slate-900/10 bg-white/72 px-6 py-5 backdrop-blur-xl">
                DevFrame helps developers choose a template, add their details, and publish a portfolio without building everything from zero.
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
