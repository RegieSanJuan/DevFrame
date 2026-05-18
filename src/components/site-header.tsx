import { auth, currentUser } from "@clerk/nextjs/server";
import { isClerkConfigured } from "@/lib/env";
import { SiteHeaderClient } from "./site-header-client";

export async function SiteHeader() {
  const userId = isClerkConfigured ? (await auth()).userId : null;
  const user = userId ? await currentUser() : null;
  const userDetails = user
    ? {
        displayName:
          user.firstName ||
          user.fullName ||
          user.primaryEmailAddress?.emailAddress ||
          "Account",
        email: user.primaryEmailAddress?.emailAddress || undefined,
      }
    : null;

  return (
    <SiteHeaderClient
      userId={userId}
      userDetails={userDetails}
      isClerkConfigured={isClerkConfigured}
    />
  );
}
