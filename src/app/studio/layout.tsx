"use client";

import { useEffect } from "react";

import { useIsMobile } from "@/hooks/use-mobile";
import { StudioMobileFallback } from "@/components/studio/studio-mobile-fallback";

/**
 * Studio layout — fixed full-screen overlay covering the site header/footer.
 * The studio is a standalone app-like experience; it doesn't inherit the
 * marketing nav/footer from the root layout.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();

  // Lock scroll when studio or mobile fallback is active
  useEffect(() => {
    if (isMobile === true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-[#0a0a0a]">
      {isMobile === undefined ? null : isMobile ? (
        <StudioMobileFallback />
      ) : (
        children
      )}
    </div>
  );
}
