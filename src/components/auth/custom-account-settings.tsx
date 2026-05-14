"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
  Trash2,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { getClerkErrorMessage } from "./utils";

type PendingEmailAddress = {
  id: string;
  emailAddress: string;
  prepareVerification: (params: {
    strategy: "email_code";
  }) => Promise<PendingEmailAddress>;
  attemptVerification: (params: { code: string }) => Promise<PendingEmailAddress>;
  destroy: () => Promise<void>;
};

function StatusMessage({
  message,
  tone = "success",
}: {
  message: string;
  tone?: "success" | "error";
}) {
  if (!message) {
    return null;
  }

  const Icon = tone === "success" ? CheckCircle2 : AlertTriangle;

  return (
    <div
      className={
        tone === "success"
          ? "flex items-start gap-2 rounded-xl border border-accent/20 bg-accent/10 p-3 text-sm text-foreground"
          : "flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
      }
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function CustomAccountSettings() {
  const { signOut } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();
  const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordPending, setPasswordPending] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState<PendingEmailAddress | null>(
    null,
  );
  const [emailPending, setEmailPending] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");

  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deletePending, setDeletePending] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  if (!isClerkConfigured) {
    return (
      <Card className="mx-auto max-w-xl border-dashed">
        <CardHeader>
          <div className="flex size-11 items-center justify-center rounded-full border border-border bg-surface-strong">
            <UserCog className="size-5 text-foreground-muted" />
          </div>
          <CardTitle>Account settings unavailable</CardTitle>
          <CardDescription>
            Clerk is not configured in this preview, so account changes are
            disabled while demo mode stays available.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardContent className="flex items-center gap-3 p-8 text-sm text-foreground-muted">
          <Loader2 className="size-4 animate-spin text-accent" />
          Loading account settings...
        </CardContent>
      </Card>
    );
  }

  if (!isSignedIn || !user) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Sign in required</CardTitle>
          <CardDescription>
            Sign in to manage your DevFrame account security.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="accent">
            <Link href="/sign-in">Go to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const primaryEmail = user.primaryEmailAddress?.emailAddress ?? "";
  const displayName = user.fullName || primaryEmail || "DevFrame account";
  const canDeleteAccount = user.deleteSelfEnabled;

  const handlePasswordUpdate = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      setPasswordSuccess("");
      return;
    }

    setPasswordPending(true);
    setPasswordError("");
    setPasswordSuccess("");

    try {
      await user.updatePassword({
        currentPassword: currentPassword || undefined,
        newPassword,
        signOutOfOtherSessions: true,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess("Password updated. Other sessions were signed out.");
    } catch (caughtError) {
      setPasswordError(
        getClerkErrorMessage(
          caughtError,
          "We could not update your password.",
        ),
      );
    } finally {
      setPasswordPending(false);
    }
  };

  const handleStartEmailChange = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setEmailPending(true);
    setEmailError("");
    setEmailSuccess("");

    try {
      const createdEmail = await user.createEmailAddress({
        email: newEmail.trim(),
      });
      const preparedEmail = await createdEmail.prepareVerification({
        strategy: "email_code",
      });

      setPendingEmail(preparedEmail);
      setEmailCode("");
      setEmailSuccess("Verification code sent to the new email address.");
    } catch (caughtError) {
      setEmailError(
        getClerkErrorMessage(caughtError, "We could not start email change."),
      );
    } finally {
      setEmailPending(false);
    }
  };

  const handleVerifyEmailChange = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!pendingEmail) {
      return;
    }

    setEmailPending(true);
    setEmailError("");
    setEmailSuccess("");

    try {
      const verifiedEmail = await pendingEmail.attemptVerification({
        code: emailCode.trim(),
      });

      await user.update({ primaryEmailAddressId: verifiedEmail.id });
      await user.reload();
      setPendingEmail(null);
      setNewEmail("");
      setEmailCode("");
      setEmailSuccess("Primary email updated.");
    } catch (caughtError) {
      setEmailError(
        getClerkErrorMessage(caughtError, "We could not verify that email."),
      );
    } finally {
      setEmailPending(false);
    }
  };

  const handleCancelEmailChange = async () => {
    setEmailPending(true);
    setEmailError("");

    try {
      if (pendingEmail) {
        await pendingEmail.destroy();
      }
      setPendingEmail(null);
      setNewEmail("");
      setEmailCode("");
      setEmailSuccess("");
    } catch (caughtError) {
      setEmailError(
        getClerkErrorMessage(caughtError, "We could not cancel that email."),
      );
    } finally {
      setEmailPending(false);
    }
  };

  const handleDeleteAccount = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (deleteConfirmation !== "DELETE") {
      setDeleteError("Type DELETE to confirm account deletion.");
      return;
    }

    setDeletePending(true);
    setDeleteError("");

    try {
      await user.delete();
      await signOut({ redirectUrl: "/" });
    } catch (caughtError) {
      setDeleteError(
        getClerkErrorMessage(caughtError, "We could not delete this account."),
      );
      setDeletePending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-start">
          <div>
            <p className="section-label">Account security</p>
            <CardTitle className="mt-4">Manage your sign-in details</CardTitle>
            <CardDescription>
              Keep your custom DevFrame account secure without leaving the
              product shell.
            </CardDescription>
          </div>
          <div className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm">
            <p className="font-semibold text-foreground">{displayName}</p>
            {primaryEmail ? (
              <p className="mt-1 text-foreground-muted">{primaryEmail}</p>
            ) : null}
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex size-11 items-center justify-center rounded-full border border-border bg-surface-strong">
              <KeyRound className="size-5 text-accent" />
            </div>
            <CardTitle>Change password</CardTitle>
            <CardDescription>
              Update the password used for email/password sign in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <StatusMessage message={passwordSuccess} />
              <StatusMessage message={passwordError} tone="error" />

              <div className="space-y-2">
                <label
                  htmlFor="current-password"
                  className="text-sm font-medium text-foreground"
                >
                  Current password
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
                  <Input
                    id="current-password"
                    type="password"
                    placeholder={
                      user.passwordEnabled ? "Current password" : "Optional"
                    }
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    className="h-11 bg-background pl-10"
                    disabled={passwordPending}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="account-new-password"
                  className="text-sm font-medium text-foreground"
                >
                  New password
                </label>
                <Input
                  id="account-new-password"
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  required
                  className="h-11 bg-background"
                  disabled={passwordPending}
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="account-confirm-password"
                  className="text-sm font-medium text-foreground"
                >
                  Confirm password
                </label>
                <Input
                  id="account-confirm-password"
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  className="h-11 bg-background"
                  disabled={passwordPending}
                  autoComplete="new-password"
                />
              </div>

              <Button
                type="submit"
                variant="accent"
                className="w-full"
                disabled={passwordPending}
              >
                {passwordPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    Update password
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex size-11 items-center justify-center rounded-full border border-border bg-surface-strong">
              <Mail className="size-5 text-accent" />
            </div>
            <CardTitle>Change email</CardTitle>
            <CardDescription>
              Add and verify a new primary email for sign in and recovery.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingEmail ? (
              <form onSubmit={handleVerifyEmailChange} className="space-y-4">
                <StatusMessage message={emailSuccess} />
                <StatusMessage message={emailError} tone="error" />

                <div className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground-muted">
                  Verifying{" "}
                  <span className="font-semibold text-foreground">
                    {pendingEmail.emailAddress}
                  </span>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email-code"
                    className="text-sm font-medium text-foreground"
                  >
                    Verification code
                  </label>
                  <Input
                    id="email-code"
                    type="text"
                    placeholder="123456"
                    value={emailCode}
                    onChange={(event) => setEmailCode(event.target.value)}
                    required
                    className="h-11 bg-background"
                    disabled={emailPending}
                    autoComplete="one-time-code"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    type="submit"
                    variant="accent"
                    disabled={emailPending}
                  >
                    {emailPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Verify email"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={emailPending}
                    onClick={handleCancelEmailChange}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleStartEmailChange} className="space-y-4">
                <StatusMessage message={emailSuccess} />
                <StatusMessage message={emailError} tone="error" />

                <div className="space-y-2">
                  <label
                    htmlFor="new-email"
                    className="text-sm font-medium text-foreground"
                  >
                    New email address
                  </label>
                  <Input
                    id="new-email"
                    type="email"
                    placeholder="you@example.com"
                    value={newEmail}
                    onChange={(event) => setNewEmail(event.target.value)}
                    required
                    className="h-11 bg-background"
                    disabled={emailPending}
                    autoComplete="email"
                  />
                </div>

                <Button
                  type="submit"
                  variant="accent"
                  className="w-full"
                  disabled={emailPending}
                >
                  {emailPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      Send verification
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-destructive/20">
        <CardHeader>
          <div className="flex size-11 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10">
            <Trash2 className="size-5 text-destructive" />
          </div>
          <CardTitle>Delete account</CardTitle>
          <CardDescription>
            Permanently remove your Clerk account. Your published portfolio data
            should be backed up before doing this.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDeleteAccount} className="space-y-4">
            <StatusMessage message={deleteError} tone="error" />

            {!canDeleteAccount ? (
              <div className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground-muted">
                Account deletion is disabled for this Clerk application.
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label
                    htmlFor="delete-confirmation"
                    className="text-sm font-medium text-foreground"
                  >
                    Type DELETE to confirm
                  </label>
                  <Input
                    id="delete-confirmation"
                    type="text"
                    placeholder="DELETE"
                    value={deleteConfirmation}
                    onChange={(event) =>
                      setDeleteConfirmation(event.target.value)
                    }
                    className="h-11 bg-background"
                    disabled={deletePending}
                  />
                </div>

                <Button
                  type="submit"
                  variant="outline"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  disabled={deletePending}
                >
                  {deletePending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Delete account"
                  )}
                </Button>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
