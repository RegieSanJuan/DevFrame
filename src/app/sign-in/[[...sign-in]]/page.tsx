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
    <div className="container-shell grid gap-8 pt-10 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="h-fit">
        <CardHeader>
          <Badge>Sign in</Badge>
          <CardTitle>Access your DevFrame dashboard</CardTitle>
          <CardDescription>
            Use Clerk to manage sign-in, sessions, and user identity for your portfolio builder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isClerkConfigured ? (
            <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
          ) : (
            <p className="text-sm leading-7 text-slate-600">
              Clerk keys are not added yet, so this screen stays in setup mode. The rest of the app still works in preview mode while you finish the environment setup.
            </p>
          )}
        </CardContent>
      </Card>

      <SetupStatus />
    </div>
  );
}
