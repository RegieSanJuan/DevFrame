"use client";

import { useClerk } from "@clerk/nextjs";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getClerkErrorMessage } from "./utils";

export function AuthSsoCallback() {
  const clerk = useClerk();
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    void clerk
      .handleRedirectCallback({}, async (to) => {
        if (!isMounted) {
          return;
        }

        if (to.startsWith("https://")) {
          window.location.href = to;
          return;
        }

        router.replace(to);
      })
      .catch((caughtError) => {
        if (!isMounted) {
          return;
        }

        setError(
          getClerkErrorMessage(
            caughtError,
            "We couldn't finish the sign-in redirect. Please try again.",
          ),
        );
      });

    return () => {
      isMounted = false;
    };
  }, [clerk, router]);

  if (error) {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-[24px] border border-border bg-surface p-10 text-center">
        <p className="text-base font-medium text-foreground">
          Sign-in redirect failed
        </p>
        <p className="text-sm leading-relaxed text-foreground-muted">{error}</p>
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-4" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-[24px] border border-border bg-surface p-10 text-center">
      <Loader2 className="size-5 animate-spin text-accent" />
      <div>
        <p className="text-base font-medium text-foreground">
          Finishing sign-in
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
          We&apos;re completing your authentication and redirecting you now.
        </p>
      </div>
    </div>
  );
}
