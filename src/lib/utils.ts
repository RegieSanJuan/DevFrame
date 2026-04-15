import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function createPortfolioPath(slug: string) {
  return `/p/${slug}`;
}

export function createPortfolioUrl(slug: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";

  return `${baseUrl.replace(/\/$/, "")}${createPortfolioPath(slug)}`;
}
