import { HomepageExperience } from "@/components/marketing/homepage-experience";
import { getViewerContext } from "@/lib/auth";

export default async function Home() {
  const viewer = await getViewerContext();
  const startBuildingHref =
    viewer.demoMode || viewer.isAuthenticated ? "/builder" : "/sign-up";

  return <HomepageExperience startBuildingHref={startBuildingHref} />;
}
