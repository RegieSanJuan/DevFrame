"use server";

import { headers } from "next/headers";

import { requireViewer } from "@/lib/auth";
import {
  parsePortfolioFormData,
  portfolioFormSchema,
  toFormValues,
} from "@/lib/portfolio-schema";
import {
  hasPortfolioUploadFiles,
  readPortfolioUploadFiles,
} from "@/lib/portfolio-image-uploads";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import { isSetupDiagnosticsEnabled } from "@/lib/setup-status";
import { savePortfolioDraft } from "@/services/portfolio-service";

export type BuilderFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  previewUrl?: string;
  persisted?: boolean;
  savedValues?: ReturnType<typeof toFormValues>;
};

function getClientIpFromHeaders(requestHeaders: Headers) {
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const firstForwardedIp = forwardedFor?.split(",")[0]?.trim();

  return (
    firstForwardedIp ||
    requestHeaders.get("x-real-ip") ||
    requestHeaders.get("cf-connecting-ip") ||
    requestHeaders.get("x-vercel-forwarded-for") ||
    "unknown"
  );
}

export async function savePortfolioAction(
  _previousState: BuilderFormState,
  formData: FormData,
): Promise<BuilderFormState> {
  const viewer = await requireViewer();
  const requestHeaders = await headers();
  const rateLimit = await enforceRateLimit({
    key: `portfolio-save-action:${viewer.userId}:${getClientIpFromHeaders(requestHeaders)}`,
    limit: 8,
    windowSeconds: 60,
  });

  if (!rateLimit.allowed) {
    return {
      status: "error",
      message: `Too many save attempts. Try again in ${rateLimit.retryAfterSeconds} seconds.`,
      persisted: false,
    };
  }

  const candidate = parsePortfolioFormData(formData);
  const parsed = portfolioFormSchema.safeParse(candidate);
  const uploads = readPortfolioUploadFiles(formData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the form errors and try again.",
      persisted: false,
    };
  }

  const result = await savePortfolioDraft(parsed.data, viewer.userId!, uploads, {
    allowDatabasePersistence: !viewer.demoMode,
  });

  if (!result.persisted) {
    const imageUploadNotice = hasPortfolioUploadFiles(uploads)
      ? " Uploaded images will appear after the draft is fully published."
      : "";
    const diagnosticsNotice =
      isSetupDiagnosticsEnabled && result.error ? ` ${result.error}` : "";

    return {
      status: "success",
      message: `Saved as a preview draft.${imageUploadNotice}${diagnosticsNotice}`,
      previewUrl: result.record.previewUrl,
      persisted: false,
    };
  }

  return {
    status: "success",
    message: "Portfolio saved and ready at your public URL.",
    previewUrl: result.record.previewUrl,
    persisted: true,
    savedValues: toFormValues(result.record),
  };
}
