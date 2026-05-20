"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { PortfolioRenderer } from "@/components/portfolio-renderer";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  device: DeviceSize;
  onScaleChange?: (scale: number) => void;
  frameless?: boolean;
};

export function StudioPreview({
  portfolio,
  device,
  onScaleChange,
  frameless = false,
}: StudioPreviewProps) {
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

  useEffect(() => {
    onScaleChange?.(scale);
  }, [scale, onScaleChange]);

  const scaledWidth = config.width * scale;
  const measuredContentHeight =
    contentHeight > 0 ? contentHeight : config.viewportHeight;
  const scaledContentHeight = measuredContentHeight * scale;
  const frameHeight = Math.max(
    320,
    Math.min(containerSize.height - 88, config.viewportHeight * scale),
  );

  const mobileFrame = device === "mobile" && !frameless;
  const mobileFullscreen = device === "mobile" && frameless;

  return (
    <ScrollArea
      className={`dark w-full @container ${mobileFrame ? "max-w-[430px] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden h-[80%]" : mobileFullscreen ? "h-full overflow-y-auto" : "h-full"}  transition-all duration-500 ease-in-out`}
    >
      <PortfolioRenderer portfolio={portfolio} />
    </ScrollArea>
  );
}
