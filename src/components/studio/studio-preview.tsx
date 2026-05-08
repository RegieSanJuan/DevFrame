"use client";

import { Monitor, Smartphone } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { PortfolioRenderer } from "@/components/portfolio-renderer";
import type { PortfolioRecord } from "@/lib/portfolio-schema";

type DeviceSize = "desktop" | "mobile";

type DeviceConfig = {
  width: number;
  viewportHeight: number;
  label: string;
};

const DEVICE_CONFIG: Record<DeviceSize, DeviceConfig> = {
  desktop: {
    width: 1180,
    viewportHeight: 860,
    label: "Desktop viewport",
  },
  mobile: {
    width: 430,
    viewportHeight: 900,
    label: "Mobile viewport",
  },
};

type StudioPreviewProps = {
  portfolio: PortfolioRecord;
};

export function StudioPreview({ portfolio }: StudioPreviewProps) {
  const [device, setDevice] = useState<DeviceSize>("desktop");
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [contentHeight, setContentHeight] = useState(0);

  const config = DEVICE_CONFIG[device];

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setContainerSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!contentRef.current) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setContentHeight(entry.contentRect.height);
    });

    observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, [portfolio, device]);

  const scale = useMemo(() => {
    if (!containerSize.width) {
      return device === "desktop" ? 0.72 : 0.82;
    }

    const horizontalPadding = device === "desktop" ? 88 : 52;
    const availableWidth = Math.max(containerSize.width - horizontalPadding, 280);
    const nextScale = availableWidth / config.width;

    return Math.min(Math.max(nextScale, 0.42), 1);
  }, [config.width, containerSize.width, device]);

  const scaledWidth = config.width * scale;
  const measuredContentHeight =
    contentHeight > 0 ? contentHeight : config.viewportHeight;
  const scaledContentHeight = measuredContentHeight * scale;
  const frameHeight = Math.max(
    320,
    Math.min(containerSize.height - 88, config.viewportHeight * scale),
  );

  return (
    <div className="flex h-full flex-col bg-[#101010]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 bg-[#0f0f0f] px-4 py-3">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30">
            Live Preview
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-white">{config.label}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-white/45">
              {portfolio.templateSlug}
            </span>
            <span className="text-xs text-white/35">
              Scroll inside the frame to inspect the full page
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/45 sm:inline-flex">
            {Math.round(scale * 100)}% zoom
          </span>

          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1">
            <button
              type="button"
              onClick={() => setDevice("desktop")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                device === "desktop"
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              <Monitor className="size-3.5" />
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setDevice("mobile")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                device === "mobile"
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              <Smartphone className="size-3.5" />
              Mobile
            </button>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative min-h-0 flex-1 overflow-hidden bg-[#111111] p-4 sm:p-6"
        style={{
          backgroundImage:
            "radial-gradient(circle at top, rgba(255,255,255,0.05), transparent 30%), radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 24px 24px",
        }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/20 to-transparent" />

        <div className="relative flex h-full items-start justify-center">
          <div
            className="flex max-w-full flex-col rounded-[28px] border border-white/10 bg-[#0c0c0c]/95 p-3 shadow-[0_35px_90px_-30px_rgba(0,0,0,0.85)] backdrop-blur-xl"
            style={{
              width: scaledWidth + 24,
            }}
          >
            <div className="mb-3 flex items-center justify-between gap-3 rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#ff5f57]" />
                <span className="size-2 rounded-full bg-[#ffbd2f]" />
                <span className="size-2 rounded-full bg-[#28c840]" />
              </div>

              <div className="min-w-0 rounded-full border border-white/8 bg-black/20 px-3 py-1 text-[11px] text-white/45">
                /p/{portfolio.slug || "preview"}
              </div>
            </div>

            <div
              className="overflow-auto rounded-[22px] border border-white/8 bg-black/30"
              style={{
                width: scaledWidth,
                height: frameHeight,
              }}
            >
              <div
                className="relative"
                style={{
                  width: scaledWidth,
                  height: scaledContentHeight,
                }}
              >
                <div
                  ref={contentRef}
                  className="pointer-events-none absolute left-0 top-0 overflow-hidden"
                  style={{
                    width: config.width,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                  }}
                >
                  <PortfolioRenderer portfolio={portfolio} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
