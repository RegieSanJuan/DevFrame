"use server";

import { requireViewer } from "@/lib/auth";
import {
  parsePortfolioFormData,
  portfolioFormSchema,
} from "@/lib/portfolio-schema";
import { savePortfolioDraft } from "@/services/portfolio-service";

export type BuilderFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  previewUrl?: string;
};

export async function savePortfolioAction(
  _previousState: BuilderFormState,
  formData: FormData,
): Promise<BuilderFormState> {
  const viewer = await requireViewer();
  const candidate = parsePortfolioFormData(formData);
  const parsed = portfolioFormSchema.safeParse(candidate);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the form errors and try again.",
    };
  }

  const result = await savePortfolioDraft(parsed.data, viewer.userId!);

  if (!result.persisted) {
    return {
      status: "success",
      message: result.error
        ? `Saved in preview mode. ${result.error}`
        : "Saved in preview mode. Add Supabase keys to make the portfolio public for everyone.",
      previewUrl: result.record.previewUrl,
    };
  }

  return {
    status: "success",
    message: "Portfolio saved to Supabase and ready at your public URL.",
    previewUrl: result.record.previewUrl,
  };
}
