import type { PortfolioRecord } from "@/lib/portfolio-schema";
import { isValidPortfolioSlug } from "@/lib/portfolio-schema";

type PortfolioRouteState = Pick<
  PortfolioRecord,
  "isPublished" | "slug" | "source" | "templateSlug"
>;

export function createStudioEditPath(portfolio: Pick<PortfolioRecord, "templateSlug"> | null) {
  return portfolio ? `/studio?template=${portfolio.templateSlug}` : "/studio";
}

export function hasPublishedPublicRoute(
  portfolio: PortfolioRouteState | null | undefined,
) {
  return Boolean(
    portfolio?.source === "supabase" &&
      portfolio.isPublished &&
      isValidPortfolioSlug(portfolio.slug),
  );
}

export function getPortfolioPrimaryAction(
  portfolio: PortfolioRouteState | null | undefined,
) {
  if (portfolio && hasPublishedPublicRoute(portfolio)) {
    return {
      href: `/p/${portfolio.slug}`,
      label: "View Portfolio",
    };
  }

  if (portfolio) {
    return {
      href: createStudioEditPath(portfolio),
      label: "Edit Portfolio",
    };
  }

  return {
    href: "/studio",
    label: "Open Studio",
  };
}
