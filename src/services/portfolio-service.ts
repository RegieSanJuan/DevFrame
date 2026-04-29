import type { PortfolioFormValues } from "@/lib/portfolio-schema";
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
) {
  return savePortfolio(values, ownerId);
}
