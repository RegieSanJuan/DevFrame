"use client";

import { useAuth } from "@clerk/nextjs";
import { useSignIn } from "@clerk/nextjs/legacy";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Key,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  getAuthDestinationFromLocation,
  getClerkErrorMessage,
  navigateWithDecoratedUrl,
  redirectToVerificationInSameTab,
} from "./utils";

type SignInMode = "sign-in" | "forgot-password" | "reset-password";

export function CustomSignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { userId, isLoaded: authLoaded } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<SignInMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const authDestination = getAuthDestinationFromLocation();

  useEffect(() => {
    if (authLoaded && userId) {
      router.replace(authDestination);
    }
  }, [authDestination, authLoaded, router, userId]);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded) {
      return;
    }

    setIsPending(true);
    clearMessages();

    try {
      const ssoCallbackUrl = `/sign-in/sso-callback?redirect_url=${encodeURIComponent(authDestination)}`;
      const signInAttempt = await signIn.create({
        strategy: "oauth_google",
        redirectUrl: ssoCallbackUrl,
        actionCompleteRedirectUrl: authDestination,
      });

      redirectToVerificationInSameTab(
        signInAttempt.firstFactorVerification,
        "Google sign in could not be started. Please try again.",
      );
    } catch (caughtError) {
      setError(
        getClerkErrorMessage(
          caughtError,
          "Failed to initialize Google sign in.",
        ),
      );
      setIsPending(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoaded) {
      return;
    }

    setIsPending(true);
    clearMessages();

    try {
      const signInAttempt = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (
        signInAttempt.status === "complete" &&
        signInAttempt.createdSessionId
      ) {
        await setActive({
          session: signInAttempt.createdSessionId,
          navigate: async ({ decorateUrl }) => {
            navigateWithDecoratedUrl(router, decorateUrl, authDestination);
          },
        });
        return;
      }

      setError(
        signInAttempt.status === "needs_second_factor"
          ? "Additional verification is required for this account."
          : "Unable to sign in with the provided credentials.",
      );
    } catch (caughtError) {
      setError(
        getClerkErrorMessage(
          caughtError,
          "An unexpected error occurred. Please try again.",
        ),
      );
    } finally {
      setIsPending(false);
    }
  };

  const handleForgotPassword = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!isLoaded) {
      return;
    }

    setIsPending(true);
    clearMessages();

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email.trim(),
      });

      setMode("reset-password");
      setSuccess("We sent a reset code to your email.");
    } catch (caughtError) {
      setError(
        getClerkErrorMessage(
          caughtError,
          "We could not start password reset for that email.",
        ),
      );
    } finally {
      setIsPending(false);
    }
  };

  const handleResetPassword = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!isLoaded) {
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setSuccess("");
      return;
    }

    setIsPending(true);
    clearMessages();

    try {
      let resetAttempt = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: resetCode.trim(),
        password: newPassword,
      });

      if (resetAttempt.status === "needs_new_password") {
        resetAttempt = await signIn.resetPassword({
          password: newPassword,
          signOutOfOtherSessions: true,
        });
      }

      if (resetAttempt.status === "complete" && resetAttempt.createdSessionId) {
        await setActive({
          session: resetAttempt.createdSessionId,
          navigate: async ({ decorateUrl }) => {
            navigateWithDecoratedUrl(router, decorateUrl, authDestination);
          },
        });
        return;
      }

      setError("Password reset is not complete. Check the code and try again.");
    } catch (caughtError) {
      setError(
        getClerkErrorMessage(
          caughtError,
          "We could not reset your password. Please try again.",
        ),
      );
    } finally {
      setIsPending(false);
    }
  };

  const goToSignIn = () => {
    setMode("sign-in");
    setPassword("");
    setResetCode("");
    setNewPassword("");
    setConfirmPassword("");
    clearMessages();
  };

  if (!isClerkConfigured) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-[24px] border border-dashed border-border bg-surface p-10 text-center">
        <div className="flex size-12 items-center justify-center rounded-full border border-border bg-surface-strong">
          <Key className="size-5 text-foreground-muted" />
        </div>
        <div>
          <p className="text-base font-medium text-foreground">
            Authentication unavailable
          </p>
          <p className="mx-auto mt-2 max-w-[280px] text-sm leading-relaxed text-foreground-muted">
            Sign-in is not available in this preview. You can still explore the
            public pages and templates.
          </p>
        </div>
      </div>
    );
  }

  if (!authLoaded || userId) {
    return null;
  }

  const showGoogleAuth = mode === "sign-in";

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
          {mode === "sign-in" ? "Welcome back" : "Password recovery"}
        </p>
        <p className="text-sm leading-relaxed text-foreground-muted">
          {mode === "sign-in"
            ? "Enter your email and password to sign in to DevFrame."
            : mode === "forgot-password"
              ? "Enter the email on your account and we will send a reset code."
              : "Enter the reset code and choose a new password."}
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="flex items-start gap-2 rounded-xl border border-accent/20 bg-accent/10 p-3 text-sm text-foreground">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
          <span>{success}</span>
        </div>
      ) : null}

      {showGoogleAuth ? (
        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full bg-background"
            onClick={handleGoogleSignIn}
            disabled={isPending}
          >
            <svg viewBox="0 0 24 24" className="mr-2 size-5">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.67-.35-1.38-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface-strong px-2 font-medium tracking-widest text-foreground-soft">
                Or
              </span>
            </div>
          </div>
        </div>
      ) : null}

      {mode === "forgot-password" ? (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="reset-email"
              className="text-sm font-medium text-foreground"
            >
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
              <Input
                id="reset-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="h-11 bg-background pl-10"
                disabled={isPending}
                autoComplete="email"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="accent"
            className="h-11 w-full"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                Send reset code
                <ArrowRight className="ml-1 size-4" />
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full text-foreground-muted hover:text-foreground"
            onClick={goToSignIn}
            disabled={isPending}
          >
            <ArrowLeft className="size-4" />
            Back to sign in
          </Button>
        </form>
      ) : mode === "reset-password" ? (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="reset-code"
              className="text-sm font-medium text-foreground"
            >
              Reset code
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
              <Input
                id="reset-code"
                type="text"
                placeholder="123456"
                value={resetCode}
                onChange={(event) => setResetCode(event.target.value)}
                required
                className="h-11 bg-background pl-10"
                disabled={isPending}
                autoComplete="one-time-code"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="new-password"
              className="text-sm font-medium text-foreground"
            >
              New password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
              <Input
                id="new-password"
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                className="h-11 bg-background pl-10"
                disabled={isPending}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirm-password"
              className="text-sm font-medium text-foreground"
            >
              Confirm password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                className="h-11 bg-background pl-10"
                disabled={isPending}
                autoComplete="new-password"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="accent"
            className="h-11 w-full"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                Reset password
                <ArrowRight className="ml-1 size-4" />
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full text-foreground-muted hover:text-foreground"
            onClick={() => setMode("forgot-password")}
            disabled={isPending}
          >
            <ArrowLeft className="size-4" />
            Request a new code
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="h-11 bg-background pl-10"
                disabled={isPending}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <button
                type="button"
                className="text-xs font-semibold text-foreground-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
                onClick={() => {
                  setMode("forgot-password");
                  clearMessages();
                }}
                disabled={isPending}
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="h-11 bg-background pl-10"
                disabled={isPending}
                autoComplete="current-password"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="accent"
            className="h-11 w-full"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                Sign in
                <ArrowRight className="ml-1 size-4" />
              </>
            )}
          </Button>

          <p className="text-center text-sm text-foreground-muted">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-foreground underline underline-offset-4 transition-colors hover:text-accent"
            >
              Sign up
            </Link>
          </p>
        </form>
      )}

      <div
        id="clerk-captcha"
        className="flex justify-center [&:empty]:hidden"
      />
    </div>
  );
}
