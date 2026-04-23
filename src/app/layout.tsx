import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";

import { SiteFooter } from "@/components/marketing/site-footer";
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
  icons: {
    icon: [
      { url: "/devframe-bg-icon.svg", type: "image/svg+xml" },
      { url: "/devframe.ico" }, // fallback
    ],
  },
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
          <div className="relative isolate min-h-screen ">
            <SiteHeader />
            <main className="pb-24 px-60">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
