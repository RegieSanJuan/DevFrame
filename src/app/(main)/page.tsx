import { HomepageExperience } from "@/components/marketing/homepage-experience";
import { getViewerContext } from "@/lib/auth";
import { getPortfolioPrimaryAction } from "@/lib/portfolio-navigation";
import { getPortfolioByOwner } from "@/services/portfolio-service";

export default async function Home() {
  const viewer = await getViewerContext();
  const portfolio = viewer.userId
    ? await getPortfolioByOwner(viewer.userId)
    : null;
  const primaryAction = getPortfolioPrimaryAction(portfolio);

  return (
    <HomepageExperience
      primaryCtaHref={primaryAction.href}
      primaryCtaLabel={primaryAction.label}
    />
  );
}
