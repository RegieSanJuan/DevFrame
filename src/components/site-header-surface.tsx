"use client";

import { useEffect, useState, type ReactNode } from "react";

type SiteHeaderSurfaceProps = Readonly<{
  children: ReactNode;
}>;

export function SiteHeaderSurface({ children }: SiteHeaderSurfaceProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`bg-background/82 backdrop-blur-xl w-full rounded grid place-items-center pt-2 ${
        scrolled ? "border-b border-border" : ""
      }`}
    >
      {children}
    </div>
  );
}
