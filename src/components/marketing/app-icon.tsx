"use client";

import { useTheme } from "next-themes";
import Link from "next/link";

type DevframeIconProps = {
  className?: string;
};

export function DevframeIcon({ className }: DevframeIconProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <span
      className={`relative flex size-8 items-center justify-center overflow-hidden rounded-2xl ${className}`}
    >
      <svg
        width="58"
        height="72"
        viewBox="0 0 58 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="fadeGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={isDark ? "white" : "#222831"} stopOpacity="0" />
            <stop offset="100%" stopColor={isDark ? "white" : "#222831"} stopOpacity="1" />
          </linearGradient>

          <mask id="fadeMask">
            <rect width="100%" height="100%" fill="url(#fadeGradient)" />
          </mask>
        </defs>

        <g mask="url(#fadeMask)">
          <path
            d="M14.233 53.325L28.583 38.625H5.48878L5.48877 33.375H28.583L14.233 18.675L17.8846 15L38.3846 36L17.8846 57L14.233 53.325Z"
            fill={isDark ? "white" : "#000000ff"}
          />
          <path
            d="M14.9721 65.7L40.1721 40.5H0.115385L0 31.5H40.1721L14.9721 6.3L21.3846 0L57.3846 36L21.3846 72L14.9721 65.7Z"
            fill={isDark ? "white" : "#000000ff"}
          />
        </g>
      </svg>
    </span>
  );
}

type DevframeLogoProps = {
  href?: string;
  className?: string;
};

export function DevframeLogo({ href = "/", className }: DevframeLogoProps) {
  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      <DevframeIcon />

      <p className="text-lg font-bold tracking-tight">devframe</p>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
