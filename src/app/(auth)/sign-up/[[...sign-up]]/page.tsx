"use client";

import { useAuth, useSignUp } from "@clerk/nextjs";
import { ArrowRight, Key, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function SignUpPage() {
  const { signUp } = useSignUp();
  const { userId, isLoaded: authLoaded } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [isPending, setIsPending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  useEffect(() => {
    if (authLoaded && userId) {
      router.push("/dashboard");
    }
  }, [authLoaded, userId, router]);

  const handleGoogleSignUp = async () => {
    setIsPending(true);
    setError("");

    try {
      await (signUp as any).authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sign-up/sso-callback",
        redirectUrlComplete: "/builder",
      });
    } catch (err: any) {
      console.error("Google sign up error:", err);
      setError("Failed to initialize Google sign up.");
      setIsPending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;

    setIsPending(true);
    setError("");

    try {
      const { error: signUpError } = await signUp.create({
        emailAddress: email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message || "Something went wrong.");
        return;
      }

      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        setError(sendError.message);
        return;
      }

      setVerifying(true);
    } catch (err: any) {
      console.error("Sign up error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;

    setIsPending(true);
    setError("");

    try {
      const { error: verifyError } = await signUp.verifications.verifyEmailCode({ code });

      if (verifyError) {
        setError(verifyError.message || "Invalid verification code.");
        return;
      }

      if (signUp.status === "complete") {
        const { error: finalizeError } = await signUp.finalize();
        if (finalizeError) {
          setError(finalizeError.message);
          return;
        }
        router.push("/dashboard");
      } else {
        setError("Verification incomplete. Check your information.");
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      setError("An unexpected error occurred during verification.");
    } finally {
      setIsPending(false);
    }
  };

  if (!isClerkConfigured) {
    return (
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
    );
  }

  // Prevent flash of content while checking auth
  if (!authLoaded || userId) {
    return null;
  }

  if (verifying) {
    return (
      <div className="space-y-6 w-full max-w-md mx-auto">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
            Verification required
          </p>
          <p className="text-sm leading-relaxed text-foreground-muted">
            We sent a verification code to <span className="font-semibold text-foreground">{email}</span>. Please enter it below.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium text-foreground">
              Verification Code
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
              <Input
                id="code"
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="pl-10 h-11 bg-background"
                disabled={isPending}
              />
            </div>
          </div>

          <Button type="submit" variant="accent" className="w-full h-11" disabled={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                Verify email
                <ArrowRight className="size-4 ml-1" />
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full text-foreground-muted hover:text-foreground"
            onClick={() => setVerifying(false)}
            disabled={isPending}
          >
            Go back
          </Button>
        </form>
      </div>
    );
  }



  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-soft">
          Account Details
        </p>
        <p className="text-sm leading-relaxed text-foreground-muted">
          Enter an email and password to create your account and save your progress.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 bg-background"
          onClick={handleGoogleSignUp}
          disabled={isPending}
        >
          <svg viewBox="0 0 24 24" className="size-5 mr-2">
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
            <span className="bg-surface-strong px-2 text-foreground-soft font-medium tracking-widest">
              Or
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 h-11 bg-background"
              disabled={isPending}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 h-11 bg-background"
              disabled={isPending}
            />
          </div>
        </div>

        <Button type="submit" variant="accent" className="w-full h-11" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              Continue
              <ArrowRight className="size-4 ml-1" />
            </>
          )}
        </Button>

        <p className="text-center text-sm text-foreground-muted">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-foreground hover:text-accent transition-colors underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

