import { SignIn } from "@clerk/nextjs";

import { SetupStatus } from "@/components/setup-status";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isClerkConfigured } from "@/lib/env";

export default function SignInPage() {
  return (
    <div className="container-shell grid gap-8 pt-10 lg:grid-cols-[0.92fr_1.08fr]">
      <Card className="h-fit border-border bg-surface-strong">
        <CardHeader>
          <Badge>Sign in</Badge>
          <CardTitle className="text-3xl tracking-[-0.04em]">
            Access your DevFrame dashboard.
          </CardTitle>
          <CardDescription>
            Use Clerk to manage sign-in, sessions, and user identity for your
            portfolio builder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isClerkConfigured ? (
            <div className="rounded-[28px] border border-border bg-surface-soft p-3">
              <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
            </div>
          ) : (
            <div className="rounded-[24px] border border-border bg-surface p-5 text-sm leading-7 text-foreground-muted">
              Clerk keys are not added yet, so this screen stays in setup mode.
              The rest of the app still works in preview mode while you finish
              the environment setup.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-border">
          <CardHeader>
            <Badge>Auth flow</Badge>
            <CardTitle>Small, readable access surface</CardTitle>
            <CardDescription>
              The sign-in and setup area now matches the same dark platform
              system used across the builder and dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
        <SetupStatus />
      </div>
    </div>
  );
}
