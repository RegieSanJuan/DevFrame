import { auth } from "@clerk/nextjs/server";
import { Key } from "lucide-react";
import { redirect } from "next/navigation";

import { CustomSignIn } from "@/components/auth/custom-sign-in";
import { isClerkConfigured } from "@/lib/env";

export default async function SignInPage() {
  if (isClerkConfigured && (await auth()).userId) {
    redirect("/dashboard");
  }

  return (

    <div>
      {isClerkConfigured ? (
        <CustomSignIn />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-[24px] border border-dashed border-border bg-surface p-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-full border border-border bg-surface-strong">
            <Key className="size-5 text-foreground-muted" />
          </div>
          <div>
            <p className="text-base font-medium text-foreground">Waiting for auth keys</p>
            <p className="mx-auto mt-2 max-w-[280px] text-sm leading-relaxed text-foreground-muted">
              Clerk keys are missing from your environment variables.
              The application remains in preview mode.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
