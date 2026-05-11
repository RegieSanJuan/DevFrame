"use server";

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
import { savePortfolioDraft } from "@/services/portfolio-service";

export type BuilderFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  previewUrl?: string;
  persisted?: boolean;
  savedValues?: ReturnType<typeof toFormValues>;
};

export async function savePortfolioAction(
  _previousState: BuilderFormState,
  formData: FormData,
): Promise<BuilderFormState> {
  const viewer = await requireViewer();
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

  const result = await savePortfolioDraft(parsed.data, viewer.userId!, uploads);

  if (!result.persisted) {
    const imageUploadNotice = hasPortfolioUploadFiles(uploads)
      ? " Image uploads stay local until Supabase Storage is configured."
      : "";

    return {
      status: "success",
      message: result.error
        ? `Saved in preview mode. ${result.error}${imageUploadNotice}`
        : `Saved in preview mode. Add Supabase keys to make the portfolio public for everyone.${imageUploadNotice}`,
      previewUrl: result.record.previewUrl,
      persisted: false,
    };
  }

  return {
    status: "success",
    message: "Portfolio saved to Supabase and ready at your public URL.",
    previewUrl: result.record.previewUrl,
    persisted: true,
    savedValues: toFormValues(result.record),
  };
}
