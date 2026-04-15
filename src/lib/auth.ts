import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { isClerkConfigured } from "@/lib/env";

export type ViewerContext = {
  userId: string | null;
  isAuthenticated: boolean;
  demoMode: boolean;
};

export async function getViewerContext(): Promise<ViewerContext> {
  if (!isClerkConfigured) {
    return {
      userId: "demo-user",
      isAuthenticated: true,
      demoMode: true,
    };
  }

  const { userId } = await auth();

  return {
    userId,
    isAuthenticated: Boolean(userId),
    demoMode: false,
  };
}

export async function requireViewer() {
  const viewer = await getViewerContext();

  if (!viewer.demoMode && !viewer.userId) {
    redirect("/sign-in");
  }

  return viewer;
}
