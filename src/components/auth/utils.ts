"use client";

type RouterLike = {
  replace: (href: string) => void;
};

export function getClerkErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (typeof error === "object" && error !== null) {
    const clerkError = error as {
      errors?: Array<{
        longMessage?: string;
        message?: string;
      }>;
      message?: string;
    };

    const firstError = clerkError.errors?.[0];

    if (firstError?.longMessage) {
      return firstError.longMessage;
    }

    if (firstError?.message) {
      return firstError.message;
    }

    if (typeof clerkError.message === "string" && clerkError.message.length > 0) {
      return clerkError.message;
    }
  }

  return fallback;
}

export function navigateWithDecoratedUrl(
  router: RouterLike,
  decorateUrl: (url: string) => string,
  destination: string,
) {
  const url = decorateUrl(destination);

  if (url.startsWith("https://")) {
    window.location.href = url;
    return;
  }

  router.replace(url);
}
