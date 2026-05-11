import { isValidHttpUrl } from "@/lib/utils";

export const PORTFOLIO_IMAGE_UPLOAD_ACCEPT = ".jpg,.jpeg,.png,.webp";
export const PORTFOLIO_IMAGE_UPLOAD_MAX_BYTES = 5 * 1024 * 1024;
export const PORTFOLIO_IMAGE_UPLOAD_MAX_SIZE_LABEL = "5MB";
export const PORTFOLIO_IMAGE_UPLOAD_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const PROFILE_IMAGE_FILE_KEY = "profileImageFile";
const GALLERY_IMAGE_FILE_KEY_PREFIX = "galleryImageFile:";

type GalleryImageLike = {
  src: string;
  alt: string;
};

export type PortfolioUploadFiles = {
  profileImageFile: File | null;
  galleryImageFiles: Array<{
    index: number;
    file: File;
  }>;
};

function isFileEntry(value: FormDataEntryValue | null): value is File {
  return typeof File !== "undefined" && value instanceof File && value.size > 0;
}

export function validatePortfolioImageFile(file: File) {
  if (!PORTFOLIO_IMAGE_UPLOAD_MIME_TYPES.includes(file.type as (typeof PORTFOLIO_IMAGE_UPLOAD_MIME_TYPES)[number])) {
    return "Upload a JPG, PNG, or WEBP image.";
  }

  if (file.size > PORTFOLIO_IMAGE_UPLOAD_MAX_BYTES) {
    return `Images must be ${PORTFOLIO_IMAGE_UPLOAD_MAX_SIZE_LABEL} or smaller.`;
  }

  return null;
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

export function appendPortfolioUploadFiles(
  formData: FormData,
  uploads: PortfolioUploadFiles,
) {
  if (uploads.profileImageFile) {
    formData.set(PROFILE_IMAGE_FILE_KEY, uploads.profileImageFile);
  }

  uploads.galleryImageFiles.forEach(({ index, file }) => {
    formData.set(`${GALLERY_IMAGE_FILE_KEY_PREFIX}${index}`, file);
  });

  return formData;
}

export function readPortfolioUploadFiles(formData: FormData): PortfolioUploadFiles {
  const profileImageEntry = formData.get(PROFILE_IMAGE_FILE_KEY);
  const galleryImageFiles: PortfolioUploadFiles["galleryImageFiles"] = [];

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith(GALLERY_IMAGE_FILE_KEY_PREFIX) || !isFileEntry(value)) {
      continue;
    }

    const index = Number(key.slice(GALLERY_IMAGE_FILE_KEY_PREFIX.length));

    if (!Number.isInteger(index) || index < 0) {
      continue;
    }

    galleryImageFiles.push({ index, file: value });
  }

  galleryImageFiles.sort((left, right) => left.index - right.index);

  return {
    profileImageFile: isFileEntry(profileImageEntry) ? profileImageEntry : null,
    galleryImageFiles,
  };
}

export function hasPortfolioUploadFiles(uploads: PortfolioUploadFiles) {
  return Boolean(uploads.profileImageFile) || uploads.galleryImageFiles.length > 0;
}
