import { NextResponse } from "next/server";

import { getViewerContext } from "@/lib/auth";
import {
  createPortfolioStorageSegment,
  getPortfolioImageFileExtension,
  PORTFOLIO_STORAGE_BUCKET,
  validatePortfolioImageFile,
} from "@/lib/portfolio-image-uploads";
import { createSupabaseAdminClient } from "@/lib/supabase";

type UploadKind = "profile" | "gallery";

type UploadRequestBody = {
  fileName?: unknown;
  fileSize?: unknown;
  fileType?: unknown;
  kind?: unknown;
  slug?: unknown;
};

function getUploadKind(value: unknown): UploadKind | null {
  return value === "profile" || value === "gallery" ? value : null;
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const rawContentLength = Number(request.headers.get("content-length") ?? 0);

  if (rawContentLength > 10 * 1024) {
    return jsonError("Upload request metadata is too large.", 413);
  }

  const viewer = await getViewerContext();

  if (!viewer.userId) {
    return jsonError("Sign in before uploading portfolio images.", 401);
  }

  if (viewer.demoMode) {
    return jsonError("Image uploads require configured authentication.", 503);
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return jsonError("Supabase Storage is not configured for uploads.", 503);
  }

  let body: UploadRequestBody;

  try {
    body = (await request.json()) as UploadRequestBody;
  } catch {
    return jsonError("Invalid upload request.", 400);
  }

  const kind = getUploadKind(body.kind);
  const fileName = typeof body.fileName === "string" ? body.fileName : "";
  const fileType = typeof body.fileType === "string" ? body.fileType : "";
  const fileSize = typeof body.fileSize === "number" ? body.fileSize : 0;
  const slug =
    typeof body.slug === "string" && body.slug.trim()
      ? body.slug
      : "portfolio";
  const validationError = validatePortfolioImageFile({
    name: fileName,
    size: fileSize,
    type: fileType,
  });

  if (!kind) {
    return jsonError("Choose a valid image upload target.", 400);
  }

  if (validationError) {
    return jsonError(validationError, 400);
  }

  const extension = getPortfolioImageFileExtension({
    name: fileName,
    size: fileSize,
    type: fileType,
  });
  const storagePath = [
    createPortfolioStorageSegment(viewer.userId),
    createPortfolioStorageSegment(slug),
    "direct-uploads",
    `${kind}-${Date.now()}-${crypto.randomUUID()}.${extension}`,
  ].join("/");
  const { data, error } = await supabase.storage
    .from(PORTFOLIO_STORAGE_BUCKET)
    .createSignedUploadUrl(storagePath, { upsert: true });

  if (error || !data) {
    return jsonError(error?.message ?? "Unable to prepare image upload.", 500);
  }

  const publicUrl = supabase.storage
    .from(PORTFOLIO_STORAGE_BUCKET)
    .getPublicUrl(storagePath).data.publicUrl;

  return NextResponse.json({
    bucket: PORTFOLIO_STORAGE_BUCKET,
    path: data.path,
    publicUrl,
    token: data.token,
  });
}
