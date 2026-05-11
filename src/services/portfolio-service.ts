import type { PortfolioFormValues } from "@/lib/portfolio-schema";
import type { PortfolioUploadFiles } from "@/lib/portfolio-image-uploads";
import {
  getPortfolioForOwner,
  getPublicPortfolio,
  savePortfolio,
} from "@/lib/portfolio-storage";

export async function getPortfolioByOwner(ownerId: string) {
  return getPortfolioForOwner(ownerId);
}

export async function getPublicPortfolioBySlug(slug: string) {
  return getPublicPortfolio(slug);
}

export async function savePortfolioDraft(
  values: PortfolioFormValues,
  ownerId: string,
  uploads?: PortfolioUploadFiles,
) {
  return savePortfolio(values, ownerId, uploads);
}
