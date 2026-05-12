"use client";

type RouterLike = {
  replace: (href: string) => void;
};

type VerificationLike = {
  externalVerificationRedirectURL: URL | null;
};

const DEFAULT_AUTH_REDIRECT = "/dashboard";

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

export function getSafeAuthDestination(
  destination: string,
  fallback = DEFAULT_AUTH_REDIRECT,
) {
  const trimmedDestination = destination.trim();

  if (!trimmedDestination) {
    return fallback;
  }

  if (
    trimmedDestination.startsWith("/") &&
    !trimmedDestination.startsWith("//")
  ) {
    return trimmedDestination;
  }

  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const targetUrl = new URL(trimmedDestination, window.location.origin);

    if (targetUrl.origin === window.location.origin) {
      return `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

export function navigateToAuthDestination(
  router: RouterLike,
  destination: string,
  fallback = DEFAULT_AUTH_REDIRECT,
) {
  router.replace(getSafeAuthDestination(destination, fallback));
}

export function navigateWithDecoratedUrl(
  router: RouterLike,
  decorateUrl: (url: string) => string,
  destination: string,
) {
  navigateToAuthDestination(router, decorateUrl(destination), destination);
}

export function redirectToVerificationInSameTab(
  verification: VerificationLike,
  fallbackError: string,
) {
  const redirectUrl = verification.externalVerificationRedirectURL?.toString();

  if (!redirectUrl) {
    throw new Error(fallbackError);
  }

  const parsedUrl = new URL(redirectUrl);

  if (parsedUrl.protocol !== "https:") {
    throw new Error(fallbackError);
  }

  window.location.assign(parsedUrl.toString());
}
