import { auth } from "@clerk/nextjs/server";
import { SignUp } from "@clerk/nextjs";
import { Key } from "lucide-react";
import { redirect } from "next/navigation";

import { SetupStatus } from "@/components/setup-status";
import { clerkAuthAppearance } from "@/lib/clerk-auth-appearance";
import { isClerkConfigured } from "@/lib/env";

export default async function SignUpPage() {
  if (isClerkConfigured && (await auth()).userId) {
    redirect("/dashboard");
  }

  return (
    <div className="container-shell grid gap-8 pt-10 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="flex h-fit flex-col gap-6 rounded-[28px] border border-border bg-surface-strong p-8 md:p-10">
        <div>
          <span className="section-label">Start building</span>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-foreground">
            Create your DevFrame account.
          </h2>
          <p className="mt-3 text-base leading-7 text-foreground-muted">
            Sign up, choose a portfolio template, and publish a public page
            without building the whole site from scratch.
          </p>
        </div>

        <div>
          {isClerkConfigured ? (
            <div className="flex justify-center rounded-[24px] border border-border bg-surface p-3">
              <SignUp
                path="/sign-up"
                routing="path"
                signInUrl="/sign-in"
                appearance={clerkAuthAppearance}
              />
            </div>
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
      </div>

      <div className="space-y-6">
        <div className="rounded-[28px] border border-border bg-surface p-8 md:p-10">
          <span className="section-label">Onboarding</span>
          <h2 className="mt-5 text-xl font-semibold text-foreground">
            Account creation should feel like part of the product
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
            The sign-up shell now uses the same spacing, muted text, and dark
            cards as the rest of the DevFrame experience.
          </p>
        </div>
        <SetupStatus />
      </div>
    </div>
  );
}
