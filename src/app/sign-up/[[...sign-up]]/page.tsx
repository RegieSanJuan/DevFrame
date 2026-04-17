import { SignUp } from "@clerk/nextjs";

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

export default function SignUpPage() {
  return (
    <div className="container-shell grid gap-8 pt-10 lg:grid-cols-[0.92fr_1.08fr]">
      <Card className="h-fit border-white/10 bg-surface-strong">
        <CardHeader>
          <Badge>Start building</Badge>
          <CardTitle className="text-3xl tracking-[-0.04em]">
            Create your DevFrame account.
          </CardTitle>
          <CardDescription>
            Sign up, choose a portfolio template, and publish a public page
            without building the whole site from scratch.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isClerkConfigured ? (
            <div className="rounded-[28px] border border-white/10 bg-surface-soft p-3">
              <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
            </div>
          ) : (
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-foreground-muted">
              Clerk keys are not added yet, so this page is waiting for your
              real auth setup. You can still preview the full product flow while
              you plug your keys in.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-white/10">
          <CardHeader>
            <Badge>Onboarding</Badge>
            <CardTitle>Account creation should feel like part of the product</CardTitle>
            <CardDescription>
              The sign-up shell now uses the same spacing, muted text, and dark
              cards as the rest of the DevFrame experience.
            </CardDescription>
          </CardHeader>
        </Card>
        <SetupStatus />
      </div>
    </div>
  );
}
