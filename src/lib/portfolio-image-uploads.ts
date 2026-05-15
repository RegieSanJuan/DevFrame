import { isValidHttpUrl } from "@/lib/utils";

export const PORTFOLIO_IMAGE_UPLOAD_ACCEPT = ".jpg,.jpeg,.png,.webp";
export const PORTFOLIO_IMAGE_UPLOAD_MAX_BYTES = 5 * 1024 * 1024;
export const PORTFOLIO_IMAGE_UPLOAD_MAX_SIZE_LABEL = "5MB";
export const PORTFOLIO_STORAGE_BUCKET = "portfolio-assets";
export const PORTFOLIO_IMAGE_UPLOAD_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const SKIPPED_IMAGE_UPLOAD_COUNT_KEY = "skippedImageUploadCount";

type GalleryImageLike = {
  src: string;
  alt: string;
};

type PortfolioImageFileLike = {
  name?: string;
  size: number;
  type: string;
};

export function validatePortfolioImageFile(file: PortfolioImageFileLike) {
  if (!PORTFOLIO_IMAGE_UPLOAD_MIME_TYPES.includes(file.type as (typeof PORTFOLIO_IMAGE_UPLOAD_MIME_TYPES)[number])) {
    return "Upload a JPG, PNG, or WEBP image.";
  }

  if (file.size > PORTFOLIO_IMAGE_UPLOAD_MAX_BYTES) {
    return `Images must be ${PORTFOLIO_IMAGE_UPLOAD_MAX_SIZE_LABEL} or smaller.`;
  }

  return null;
}

export function getPortfolioImageFileExtension(file: PortfolioImageFileLike) {
  const nameExtension = file.name?.split(".").pop()?.toLowerCase();

  if (nameExtension && ["jpg", "jpeg", "png", "webp"].includes(nameExtension)) {
    return nameExtension;
  }

  switch (file.type) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}

export function createPortfolioStorageSegment(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "portfolio"
  );
}

export function getImageAltFromFileName(fileName: string) {
  const normalized = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return "";
  }

  return normalized
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function isRenderableImageSrc(value: string | null | undefined) {
  const trimmedValue = value?.trim() ?? "";

  if (!trimmedValue) {
    return false;
  }

  if (
    trimmedValue.startsWith("/") ||
    trimmedValue.startsWith("blob:") ||
    trimmedValue.startsWith("data:image/")
  ) {
    return true;
  }

  return isValidHttpUrl(trimmedValue);
}

export function filterRenderableGalleryImages<TImage extends GalleryImageLike>(
  images: TImage[] | null | undefined,
) {
  return (images ?? []).filter((image) => isRenderableImageSrc(image.src));
}
