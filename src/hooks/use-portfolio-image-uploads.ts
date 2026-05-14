"use client";

import { createClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  GALLERY_IMAGE_LIMIT,
  type GalleryImage,
  type PortfolioFormValues,
} from "@/lib/portfolio-schema";
import {
  PORTFOLIO_IMAGE_UPLOAD_ACCEPT as IMAGE_UPLOAD_ACCEPT,
  PORTFOLIO_IMAGE_UPLOAD_MAX_SIZE_LABEL as IMAGE_UPLOAD_MAX_SIZE_LABEL,
  getImageAltFromFileName as getAltFromFileName,
  PORTFOLIO_STORAGE_BUCKET,
  SKIPPED_IMAGE_UPLOAD_COUNT_KEY,
  validatePortfolioImageFile,
} from "@/lib/portfolio-image-uploads";
import { createFormData } from "@/utils/form-data";

type FieldUpdater = <K extends keyof PortfolioFormValues>(
  key: K,
  value: PortfolioFormValues[K],
) => void;

type PendingUpload = {
  file: File;
  previewUrl: string;
};

type GalleryPendingUploads = Record<number, PendingUpload>;

type UploadedAsset = {
  bucket: string;
  path: string;
  publicUrl: string;
};

type SignedUploadTarget = UploadedAsset & {
  token: string;
};

class ImageUploadUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageUploadUnavailableError";
  }
}

function revokePreviewUrl(previewUrl: string) {
  URL.revokeObjectURL(previewUrl);
}

function createPendingUpload(file: File): PendingUpload {
  return {
    file,
    previewUrl: URL.createObjectURL(file),
  };
}

function normalizeFileList(files: FileList | File[] | null | undefined) {
  return files ? Array.from(files) : [];
}

function buildGalleryImage(file: File): GalleryImage {
  return {
    src: "",
    alt: getAltFromFileName(file.name),
    storageBucket: "",
    storagePath: "",
  };
}

function createBrowserSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    return null;
  }

  return createClient(supabaseUrl, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

async function readJsonError(response: Response) {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error;
  } catch {
    return null;
  }
}

async function requestSignedUploadTarget(
  file: File,
  kind: "profile" | "gallery",
  slug: string,
): Promise<SignedUploadTarget> {
  const response = await fetch("/api/portfolio-uploads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      kind,
      slug,
    }),
  });

  if (response.status === 503) {
    throw new ImageUploadUnavailableError(
      (await readJsonError(response)) ?? "Image uploads are not configured.",
    );
  }

  if (!response.ok) {
    throw new Error(
      (await readJsonError(response)) ?? "Unable to prepare image upload.",
    );
  }

  return (await response.json()) as SignedUploadTarget;
}

export type PortfolioImageUploadControls = {
  accept: string;
  maxSizeLabel: string;
  profile: {
    error: string | null;
    hasPendingUpload: boolean;
    previewSrc: string;
    selectFiles: (files: FileList | null) => void;
    remove: () => void;
  };
  gallery: {
    error: string | null;
    hasReachedLimit: boolean;
    previewSrcFor: (index: number, fallbackSrc: string) => string;
    hasPendingUploadAt: (index: number) => boolean;
    addFiles: (files: FileList | null) => void;
    replaceFile: (index: number, files: FileList | null) => void;
    remove: (index: number) => void;
  };
  applyPreviewValues: (values: PortfolioFormValues) => PortfolioFormValues;
  createSubmitFormData: (
    values: PortfolioFormValues,
    templateSettings: Record<string, unknown>,
  ) => Promise<FormData>;
  clearPendingUploads: () => void;
};

export function usePortfolioImageUploads(
  values: PortfolioFormValues,
  onFieldChange: FieldUpdater,
): PortfolioImageUploadControls {
  const [profileUpload, setProfileUpload] = useState<PendingUpload | null>(null);
  const [galleryUploads, setGalleryUploads] = useState<GalleryPendingUploads>({});
  const [profileError, setProfileError] = useState<string | null>(null);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const profileUploadRef = useRef<PendingUpload | null>(null);
  const galleryUploadsRef = useRef<GalleryPendingUploads>({});

  useEffect(() => {
    profileUploadRef.current = profileUpload;
  }, [profileUpload]);

  useEffect(() => {
    galleryUploadsRef.current = galleryUploads;
  }, [galleryUploads]);

  useEffect(() => {
    return () => {
      if (profileUploadRef.current) {
        revokePreviewUrl(profileUploadRef.current.previewUrl);
      }

      Object.values(galleryUploadsRef.current).forEach((upload) => {
        revokePreviewUrl(upload.previewUrl);
      });
    };
  }, []);

  const clearPendingUploads = useCallback(() => {
    setProfileUpload((current) => {
      if (current) {
        revokePreviewUrl(current.previewUrl);
      }

      return null;
    });
    setGalleryUploads((current) => {
      Object.values(current).forEach((upload) => {
        revokePreviewUrl(upload.previewUrl);
      });

      return {};
    });
    setProfileError(null);
    setGalleryError(null);
  }, []);

  const selectProfileFiles = useCallback(
    (files: FileList | null) => {
      const [file] = normalizeFileList(files);

      if (!file) {
        return;
      }

      const validationError = validatePortfolioImageFile(file);

      if (validationError) {
        setProfileError(validationError);
        return;
      }

      setProfileError(null);
      setProfileUpload((current) => {
        if (current) {
          revokePreviewUrl(current.previewUrl);
        }

        return createPendingUpload(file);
      });

      if (!values.profileImageAlt.trim()) {
        onFieldChange("profileImageAlt", getAltFromFileName(file.name));
      }
    },
    [onFieldChange, values.profileImageAlt],
  );

  const removeProfile = useCallback(() => {
    setProfileError(null);
    setProfileUpload((current) => {
      if (current) {
        revokePreviewUrl(current.previewUrl);
      }

      return null;
    });
    onFieldChange("profileImageUrl", "");
  }, [onFieldChange]);

  const addGalleryFiles = useCallback(
    (files: FileList | null) => {
      const incomingFiles = normalizeFileList(files);

      if (incomingFiles.length === 0) {
        return;
      }

      const remainingSlots = GALLERY_IMAGE_LIMIT - values.galleryImages.length;

      if (remainingSlots <= 0) {
        setGalleryError(
          `Gallery limit reached. You can upload up to ${GALLERY_IMAGE_LIMIT} images.`,
        );
        return;
      }

      const nextGalleryImages = [...values.galleryImages];
      const nextUploads: GalleryPendingUploads = { ...galleryUploadsRef.current };
      let addedCount = 0;
      let nextError: string | null = null;

      incomingFiles.forEach((file) => {
        const validationError = validatePortfolioImageFile(file);

        if (validationError) {
          nextError ??= validationError;
          return;
        }

        if (addedCount >= remainingSlots) {
          nextError ??= `Gallery limit reached. You can upload up to ${GALLERY_IMAGE_LIMIT} images.`;
          return;
        }

        const index = nextGalleryImages.length;
        nextGalleryImages.push(buildGalleryImage(file));
        nextUploads[index] = createPendingUpload(file);
        addedCount += 1;
      });

      if (addedCount > 0) {
        onFieldChange("galleryImages", nextGalleryImages);
        setGalleryUploads(nextUploads);
      }

      setGalleryError(nextError);
    },
    [onFieldChange, values.galleryImages],
  );

  const replaceGalleryFile = useCallback(
    (index: number, files: FileList | null) => {
      const [file] = normalizeFileList(files);

      if (!file || !values.galleryImages[index]) {
        return;
      }

      const validationError = validatePortfolioImageFile(file);

      if (validationError) {
        setGalleryError(validationError);
        return;
      }

      setGalleryError(null);
      setGalleryUploads((current) => {
        const nextUploads = { ...current };

        if (nextUploads[index]) {
          revokePreviewUrl(nextUploads[index].previewUrl);
        }

        nextUploads[index] = createPendingUpload(file);
        return nextUploads;
      });

      if (!values.galleryImages[index]?.alt.trim()) {
        onFieldChange(
          "galleryImages",
          values.galleryImages.map((image, imageIndex) =>
            imageIndex === index
              ? { ...image, alt: getAltFromFileName(file.name) }
              : image,
          ),
        );
      }
    },
    [onFieldChange, values.galleryImages],
  );

  const removeGalleryImage = useCallback(
    (index: number) => {
      if (!values.galleryImages[index]) {
        return;
      }

      setGalleryError(null);
      onFieldChange(
        "galleryImages",
        values.galleryImages.filter((_, imageIndex) => imageIndex !== index),
      );
      setGalleryUploads((current) => {
        const nextUploads: GalleryPendingUploads = {};

        Object.entries(current).forEach(([rawIndex, upload]) => {
          const uploadIndex = Number(rawIndex);

          if (uploadIndex === index) {
            revokePreviewUrl(upload.previewUrl);
            return;
          }

          nextUploads[uploadIndex > index ? uploadIndex - 1 : uploadIndex] = upload;
        });

        return nextUploads;
      });
    },
    [onFieldChange, values.galleryImages],
  );

  const applyPreviewValues = useCallback(
    (nextValues: PortfolioFormValues) => ({
      ...nextValues,
      profileImageUrl: profileUpload?.previewUrl ?? nextValues.profileImageUrl,
      galleryImages: nextValues.galleryImages.map((image, index) => ({
        ...image,
        src: galleryUploads[index]?.previewUrl ?? image.src,
      })),
    }),
    [galleryUploads, profileUpload],
  );

  const createSubmitFormData = useCallback(
    async (
      nextValues: PortfolioFormValues,
      templateSettings: Record<string, unknown>,
    ) => {
      const pendingGalleryUploads = Object.entries(galleryUploads).map(
        ([rawIndex, upload]) => ({
          index: Number(rawIndex),
          upload,
        }),
      );
      const pendingUploadCount =
        (profileUpload ? 1 : 0) + pendingGalleryUploads.length;
      let submitValues = nextValues;
      let skippedUploadCount = 0;
      const storageClient =
        pendingUploadCount > 0 ? createBrowserSupabaseClient() : null;

      const uploadFile = async (
        file: File,
        kind: "profile" | "gallery",
      ): Promise<UploadedAsset> => {
        const validationError = validatePortfolioImageFile(file);

        if (validationError) {
          throw new Error(validationError);
        }

        const target = await requestSignedUploadTarget(
          file,
          kind,
          nextValues.slug,
        );

        if (target.bucket !== PORTFOLIO_STORAGE_BUCKET) {
          throw new Error("Unexpected image upload bucket.");
        }

        const uploadResult = await storageClient!.storage
          .from(target.bucket)
          .uploadToSignedUrl(target.path, target.token, file, {
            contentType: file.type,
            upsert: true,
          });

        if (uploadResult.error) {
          throw new Error(uploadResult.error.message);
        }

        return {
          bucket: target.bucket,
          path: target.path,
          publicUrl: target.publicUrl,
        };
      };

      if (pendingUploadCount > 0 && !storageClient) {
        skippedUploadCount = pendingUploadCount;
      } else if (pendingUploadCount > 0) {
        try {
          let uploadedProfileAsset: UploadedAsset | null = null;
          const uploadedGalleryAssets: Array<{
            index: number;
            asset: UploadedAsset;
          }> = [];

          if (profileUpload) {
            uploadedProfileAsset = await uploadFile(profileUpload.file, "profile");
          }

          for (const { index, upload } of pendingGalleryUploads) {
            uploadedGalleryAssets.push({
              index,
              asset: await uploadFile(upload.file, "gallery"),
            });
          }

          if (uploadedProfileAsset) {
            submitValues = {
              ...submitValues,
              profileImageUrl: uploadedProfileAsset.publicUrl,
              profileImageStorageBucket: uploadedProfileAsset.bucket,
              profileImageStoragePath: uploadedProfileAsset.path,
            };
            onFieldChange("profileImageUrl", uploadedProfileAsset.publicUrl);
            onFieldChange("profileImageStorageBucket", uploadedProfileAsset.bucket);
            onFieldChange("profileImageStoragePath", uploadedProfileAsset.path);
            setProfileUpload((current) => {
              if (current) {
                revokePreviewUrl(current.previewUrl);
              }

              return null;
            });
          }

          if (uploadedGalleryAssets.length > 0) {
            const uploadedGalleryByIndex = new Map(
              uploadedGalleryAssets.map(({ index, asset }) => [index, asset]),
            );
            const nextGalleryImages = submitValues.galleryImages.map(
              (image, index) => {
                const asset = uploadedGalleryByIndex.get(index);

                if (!asset) {
                  return image;
                }

                return {
                  ...image,
                  src: asset.publicUrl,
                  storageBucket: asset.bucket,
                  storagePath: asset.path,
                };
              },
            );

            submitValues = {
              ...submitValues,
              galleryImages: nextGalleryImages,
            };
            onFieldChange("galleryImages", nextGalleryImages);
            setGalleryUploads((current) => {
              const nextUploads = { ...current };

              uploadedGalleryAssets.forEach(({ index }) => {
                if (nextUploads[index]) {
                  revokePreviewUrl(nextUploads[index].previewUrl);
                  delete nextUploads[index];
                }
              });

              return nextUploads;
            });
          }
        } catch (error) {
          if (error instanceof ImageUploadUnavailableError) {
            skippedUploadCount = pendingUploadCount;
          } else {
            const message =
              error instanceof Error
                ? error.message
                : "Unable to upload portfolio images.";
            setProfileError(message);
            setGalleryError(message);
            throw error;
          }
        }
      }

      const formData = createFormData({
        ...submitValues,
        templateSettings,
      } as Record<string, unknown>);

      if (skippedUploadCount > 0) {
        formData.set(SKIPPED_IMAGE_UPLOAD_COUNT_KEY, String(skippedUploadCount));
      }

      return formData;
    },
    [galleryUploads, onFieldChange, profileUpload],
  );

  return useMemo(
    () => ({
      accept: IMAGE_UPLOAD_ACCEPT,
      maxSizeLabel: IMAGE_UPLOAD_MAX_SIZE_LABEL,
      profile: {
        error: profileError,
        hasPendingUpload: Boolean(profileUpload),
        previewSrc: profileUpload?.previewUrl ?? values.profileImageUrl,
        selectFiles: selectProfileFiles,
        remove: removeProfile,
      },
      gallery: {
        error: galleryError,
        hasReachedLimit: values.galleryImages.length >= GALLERY_IMAGE_LIMIT,
        previewSrcFor: (index: number, fallbackSrc: string) =>
          galleryUploads[index]?.previewUrl ?? fallbackSrc,
        hasPendingUploadAt: (index: number) => Boolean(galleryUploads[index]),
        addFiles: addGalleryFiles,
        replaceFile: replaceGalleryFile,
        remove: removeGalleryImage,
      },
      applyPreviewValues,
      createSubmitFormData,
      clearPendingUploads,
    }),
    [
      addGalleryFiles,
      createSubmitFormData,
      applyPreviewValues,
      clearPendingUploads,
      galleryError,
      galleryUploads,
      profileError,
      profileUpload,
      removeGalleryImage,
      removeProfile,
      replaceGalleryFile,
      selectProfileFiles,
      values.galleryImages.length,
      values.profileImageUrl,
    ],
  );
}
