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
    <div className="container-shell grid gap-8 pt-10 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="h-fit">
        <CardHeader>
          <Badge>Start building</Badge>
          <CardTitle>Create your DevFrame account</CardTitle>
          <CardDescription>
            Sign up, choose a portfolio template, and publish a public page without building the whole site from scratch.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isClerkConfigured ? (
            <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
          ) : (
            <p className="text-sm leading-7 text-slate-600">
              Clerk keys are not added yet, so this page is waiting for your real auth setup. You can still preview the full product flow while you plug your keys in.
            </p>
          )}
        </CardContent>
      </Card>

      <SetupStatus />
    </div>
  );
}
