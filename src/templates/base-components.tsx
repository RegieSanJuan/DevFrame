"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { filterRenderableGalleryImages } from "@/lib/portfolio-image-uploads";

export type GalleryImage = {
  src: string;
  alt: string;
};

interface TemplateGalleryProps {
  images: GalleryImage[];
  className?: string;
  galleryClassName?: string;
  tileClassName?: string;
  imageClassName?: string;
  navButtonClassName?: string;
  transitionClassName?: string;
  visibleCount?: number;
  imageSizes?: string;
}

interface LinkPillProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function LinkPill({
  href,
  label,
  icon,
  className = "",
  style,
}: LinkPillProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-opacity hover:opacity-70 ${className}`}
      style={style}
    >
      {icon}
      {label}
    </a>
  );
}

export function SkillBadge({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={`rounded-full border px-4 py-1.5 text-sm ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}

export function SectionLabel({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-[0.24em] ${className}`}
      style={style}
    >
      {children}
    </p>
  );
}

export function TemplateGallery({
  images,
  className = "",
  galleryClassName = "",
  tileClassName = "",
  imageClassName = "",
  navButtonClassName = "",
  transitionClassName = "transition-all duration-500 ease-in-out",
  visibleCount = 3,
}: TemplateGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [useTransition, setUseTransition] = useState(true);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const [containerWidth, setContainerWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const safeImages = filterRenderableGalleryImages(images);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const effectiveVisibleCount = containerWidth > 0 && containerWidth < 448 ? 1 : visibleCount;

  const carouselEnabled = safeImages.length > effectiveVisibleCount;
  
  const paddedImages = carouselEnabled
    ? [
        ...safeImages.slice(-effectiveVisibleCount),
        ...safeImages,
        ...safeImages.slice(0, effectiveVisibleCount),
      ]
    : safeImages;

  useEffect(() => {
    if (!carouselEnabled) return;

    if (activeIndex >= safeImages.length) {
      const timeout = setTimeout(() => {
        setUseTransition(false);
        setActiveIndex(0);
      }, 500);
      return () => clearTimeout(timeout);
    }
    if (activeIndex <= -1) {
      const timeout = setTimeout(() => {
        setUseTransition(false);
        setActiveIndex(safeImages.length - 1);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [activeIndex, safeImages.length, carouselEnabled]);

  useEffect(() => {
    if (!useTransition) {
      const timeout = setTimeout(() => {
        setUseTransition(true);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [useTransition]);

  useEffect(() => {
    if (!isTransitioning) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsTransitioning(false);
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [isTransitioning]);

  if (!safeImages.length) {
    return null;
  }

  const moveToPrevious = () => {
    if (isTransitioning || !useTransition) return;
    setSlideDirection("left");
    setIsTransitioning(true);
    setActiveIndex((value) => value - 1);
  };

  const moveToNext = () => {
    if (isTransitioning || !useTransition) return;
    setSlideDirection("right");
    setIsTransitioning(true);
    setActiveIndex((value) => value + 1);
  };

  const tileAnimationClassName = isTransitioning
    ? `opacity-0 ${slideDirection === "right" ? "translate-x-10" : "-translate-x-10"} scale-[0.985]`
    : "opacity-100 translate-x-0 scale-100";

  if (!carouselEnabled) {
    const gridColumnsClassName =
      safeImages.length === 1
        ? "grid-cols-1"
        : safeImages.length === 2
          ? "grid-cols-2"
          : "grid-cols-1 @md:grid-cols-3";

    return (
      <div ref={ref} className={`grid gap-4 ${gridColumnsClassName} ${className}`}>
        {safeImages.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className={`relative aspect-square overflow-hidden rounded-2xl  ${transitionClassName} ${tileClassName} ${tileAnimationClassName}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt}
              className={`absolute inset-0 h-full w-full object-contain p-6 ${imageClassName}`}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`grid items-center gap-4 grid-cols-[auto_1fr_auto] ${className}`}
    >
      <button
        type="button"
        onClick={moveToPrevious}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40 ${navButtonClassName}`}
        aria-label="Previous gallery images"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div className={`overflow-hidden w-full ${galleryClassName}`}>
        <div
          className={`flex ${useTransition ? "transition-transform duration-500 ease-in-out" : ""}`}
          style={{ transform: `translateX(-${(activeIndex + effectiveVisibleCount) * (100 / effectiveVisibleCount)}%)` }}
        >
          {paddedImages.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              className={`flex-shrink-0 ${effectiveVisibleCount === 1 ? "w-full" : "w-1/3"} px-2`}
            >
              <div className={`relative aspect-square overflow-hidden rounded-2xl ${tileClassName}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt}
                  className={`absolute inset-0 h-full w-full object-contain p-6 ${imageClassName}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={moveToNext}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40 ${navButtonClassName}`}
        aria-label="Next gallery images"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
