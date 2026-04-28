"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

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
  imageSizes = "(max-width: 640px) 100vw, 33vw",
}: TemplateGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const carouselEnabled = images.length > visibleCount;
  const maxIndex = Math.max(images.length - visibleCount, 0);
  const currentIndex = Math.min(activeIndex, maxIndex);
  const visibleImages = carouselEnabled
    ? images.slice(currentIndex, currentIndex + visibleCount)
    : images;

  useEffect(() => {
    if (!isTransitioning) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsTransitioning(false);
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [isTransitioning]);

  if (!images.length) {
    return null;
  }

  const moveToPrevious = () => {
    if (currentIndex === 0) {
      return;
    }

    setIsTransitioning(true);
    setActiveIndex((value) => Math.max(value - 1, 0));
  };

  const moveToNext = () => {
    if (currentIndex === maxIndex) {
      return;
    }

    setIsTransitioning(true);
    setActiveIndex((value) => Math.min(value + 1, maxIndex));
  };

  const tileAnimationClassName = isTransitioning
    ? "opacity-0 translate-y-2 scale-[0.985]"
    : "opacity-100 translate-y-0 scale-100";

  if (!carouselEnabled) {
    const gridColumnsClassName =
      images.length === 1
        ? "sm:grid-cols-1"
        : images.length === 2
          ? "sm:grid-cols-2"
          : "sm:grid-cols-3";

    return (
      <div className={`grid gap-4 ${gridColumnsClassName} ${className}`}>
        {visibleImages.map((image) => (
          <div
            key={image.src}
            className={`relative aspect-square overflow-hidden rounded-2xl  ${transitionClassName} ${tileClassName} ${tileAnimationClassName}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className={`object-contain p-6 ${imageClassName}`}
              sizes={imageSizes}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`grid items-center gap-4 lg:grid-cols-[auto_1fr_auto] ${className}`}
    >
      <button
        type="button"
        onClick={moveToPrevious}
        disabled={currentIndex === 0}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40 ${navButtonClassName}`}
        aria-label="Previous gallery images"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div className={`grid gap-4 sm:grid-cols-3 ${galleryClassName}`}>
        {visibleImages.map((image) => (
          <div
            key={image.src}
            className={`relative aspect-square overflow-hidden rounded-2xl  ${transitionClassName} ${tileClassName} ${tileAnimationClassName}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className={`object-contain p-6 ${imageClassName}`}
              sizes={imageSizes}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={moveToNext}
        disabled={currentIndex === maxIndex}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40 ${navButtonClassName}`}
        aria-label="Next gallery images"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
