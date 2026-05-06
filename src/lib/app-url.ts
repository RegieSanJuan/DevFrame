import "server-only";

const LOCAL_APP_URL = "http://localhost:3000";

export function createPortfolioPath(slug: string) {
  return `/p/${slug}`;
}

export function normalizeOrigin(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const candidate = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    return new URL(candidate).origin;
  } catch {
    return null;
  }
}

export function getAppUrl() {
  const explicitAppUrl = normalizeOrigin(
    process.env.NEXT_PUBLIC_APP_URL?.trim() || "",
  );

  if (explicitAppUrl) {
    return explicitAppUrl;
  }

  if (process.env.VERCEL_ENV?.trim() === "production") {
    return (
      normalizeOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || "") ??
      normalizeOrigin(process.env.VERCEL_URL?.trim() || "") ??
      LOCAL_APP_URL
    );
  }

  return (
    normalizeOrigin(process.env.VERCEL_BRANCH_URL?.trim() || "") ??
    normalizeOrigin(process.env.VERCEL_URL?.trim() || "") ??
    normalizeOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || "") ??
    LOCAL_APP_URL
  );
}

export function createPortfolioUrl(slug: string) {
  return `${getAppUrl().replace(/\/$/, "")}${createPortfolioPath(slug)}`;
}
