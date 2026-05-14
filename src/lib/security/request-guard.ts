import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createRateLimitHeaders, enforceRateLimit } from "@/lib/security/rate-limit";

const PREVIEW_COOKIE_NAME = "devframe-preview";
const ONE_KB = 1024;
const ONE_MB = ONE_KB * ONE_KB;

const PUBLIC_PORTFOLIO_CACHE =
  "public, s-maxage=60, stale-while-revalidate=300";
const STATIC_API_CACHE =
  "public, s-maxage=3600, stale-while-revalidate=86400";
const PRIVATE_NO_STORE = "private, no-store, max-age=0, must-revalidate";

const BLOCKED_USER_AGENT_PATTERNS = [
  /acunetix/i,
  /adminer/i,
  /masscan/i,
  /nikto/i,
  /nmap/i,
  /sqlmap/i,
  /wpscan/i,
  /zgrab/i,
];

const BLOCKED_PATH_PATTERNS = [
  /\/\.env(?:\.|$)/i,
  /\/\.git(?:\/|$)/i,
  /\/adminer(?:\/|$)/i,
  /\/cgi-bin(?:\/|$)/i,
  /\/phpmyadmin(?:\/|$)/i,
  /\/wp-admin(?:\/|$)/i,
  /\/wp-content(?:\/|$)/i,
  /\/wp-login\.php$/i,
  /\/xmlrpc\.php$/i,
];

const SUSPICIOUS_QUERY_PATTERNS = [
  /<script/i,
  /\bunion\s+select\b/i,
  /\bselect\b.+\bfrom\b/i,
  /\.\.\//,
  /%00/i,
  /(?:^|[?&])GLOBALS=/i,
];

type RateLimitRule = {
  keyPrefix: string;
  limit: number;
  windowSeconds: number;
};

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const firstForwardedIp = forwardedFor?.split(",")[0]?.trim();

  return (
    firstForwardedIp ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-vercel-forwarded-for") ||
    "unknown"
  );
}

function getContentLength(request: NextRequest) {
  const contentLength = request.headers.get("content-length");

  if (!contentLength) {
    return 0;
  }

  const parsedLength = Number(contentLength);

  return Number.isFinite(parsedLength) ? parsedLength : 0;
}

function isPublicPortfolioPath(pathname: string) {
  return /^\/p\/[a-z0-9-]+\/?$/.test(pathname);
}

function isAuthPath(pathname: string) {
  return pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
}

function isAccountPath(pathname: string) {
  return pathname.startsWith("/account");
}

function isPrivateAppPath(pathname: string) {
  return (
    isAccountPath(pathname) ||
    pathname.startsWith("/builder") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/studio") ||
    isAuthPath(pathname)
  );
}

function isPortfolioSaveRequest(request: NextRequest) {
  if (request.method !== "POST") {
    return false;
  }

  const pathname = request.nextUrl.pathname;
  const isPortfolioEditorPath = pathname === "/builder" || pathname === "/studio";

  return isPortfolioEditorPath && Boolean(request.headers.get("next-action"));
}

function getRateLimitRule(request: NextRequest): RateLimitRule | null {
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  if (isPortfolioSaveRequest(request)) {
    return {
      keyPrefix: "portfolio-save",
      limit: 12,
      windowSeconds: 60,
    };
  }

  if (isAuthPath(pathname)) {
    return {
      keyPrefix: "auth",
      limit: method === "POST" ? 20 : 60,
      windowSeconds: 60,
    };
  }

  if (isAccountPath(pathname)) {
    return {
      keyPrefix: "account",
      limit: method === "POST" ? 20 : 60,
      windowSeconds: 60,
    };
  }

  if (pathname.startsWith("/api/portfolios/")) {
    return {
      keyPrefix: "portfolio-api",
      limit: 120,
      windowSeconds: 60,
    };
  }

  if (isPublicPortfolioPath(pathname)) {
    return {
      keyPrefix: "public-portfolio",
      limit: 180,
      windowSeconds: 60,
    };
  }

  if (pathname.startsWith("/api/")) {
    return {
      keyPrefix: "api",
      limit: method === "GET" || method === "HEAD" ? 180 : 30,
      windowSeconds: 60,
    };
  }

  return null;
}

function forbiddenJson(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function withRateLimitHeaders(response: NextResponse, headers: Record<string, string>) {
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }

  return response;
}

export function applySecurityHeaders(response: NextResponse, request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProduction = process.env.NODE_ENV === "production";
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self' https://*.clerk.accounts.dev https://*.clerk.com",
    [
      "script-src",
      "'self'",
      "'unsafe-inline'",
      isProduction ? "" : "'unsafe-eval'",
      "https://*.clerk.accounts.dev",
      "https://*.clerk.com",
      "https://challenges.cloudflare.com",
      "https://hcaptcha.com",
      "https://*.hcaptcha.com",
    ]
      .filter(Boolean)
      .join(" "),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "media-src 'self' blob: https:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.clerk.accounts.dev https://*.clerk.com https://api.clerk.com https://challenges.cloudflare.com https://hcaptcha.com https://*.hcaptcha.com",
    "frame-src https://*.clerk.accounts.dev https://*.clerk.com https://challenges.cloudflare.com https://hcaptcha.com https://*.hcaptcha.com",
    "worker-src 'self' blob:",
    isProduction ? "upgrade-insecure-requests" : "",
  ]
    .filter(Boolean)
    .join("; ");

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), clipboard-read=()",
  );

  if (isProduction) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  if (isPublicPortfolioPath(pathname) || pathname.startsWith("/api/portfolios/")) {
    if (request.cookies.has(PREVIEW_COOKIE_NAME)) {
      response.headers.set("Cache-Control", PRIVATE_NO_STORE);
    } else {
      response.headers.set("Cache-Control", PUBLIC_PORTFOLIO_CACHE);
      response.headers.set("Vary", "Cookie");
    }
  } else if (pathname === "/api/templates") {
    response.headers.set("Cache-Control", STATIC_API_CACHE);
  } else if (isPrivateAppPath(pathname) || pathname === "/api/setup-status") {
    response.headers.set("Cache-Control", PRIVATE_NO_STORE);
  }

  return response;
}

export async function guardRequest(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method.toUpperCase();
  const userAgent = request.headers.get("user-agent") || "";

  if (method === "TRACE" || method === "TRACK") {
    return forbiddenJson("Method not allowed", 405);
  }

  if (BLOCKED_USER_AGENT_PATTERNS.some((pattern) => pattern.test(userAgent))) {
    return forbiddenJson("Request blocked", 403);
  }

  if (BLOCKED_PATH_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return forbiddenJson("Not found", 404);
  }

  const search = request.nextUrl.search;

  if (SUSPICIOUS_QUERY_PATTERNS.some((pattern) => pattern.test(search))) {
    return forbiddenJson("Invalid request", 400);
  }

  if (
    pathname.startsWith("/api/") &&
    !["GET", "HEAD", "OPTIONS"].includes(method)
  ) {
    return forbiddenJson("Method not allowed", 405);
  }

  const contentLength = getContentLength(request);

  if (pathname.startsWith("/api/") && contentLength > 64 * ONE_KB) {
    return forbiddenJson("Payload too large", 413);
  }

  if (isAuthPath(pathname) && contentLength > 256 * ONE_KB) {
    return forbiddenJson("Payload too large", 413);
  }

  if (isAccountPath(pathname) && contentLength > 256 * ONE_KB) {
    return forbiddenJson("Payload too large", 413);
  }

  if (
    method === "POST" &&
    isPrivateAppPath(pathname) &&
    !isPortfolioSaveRequest(request) &&
    contentLength > 256 * ONE_KB
  ) {
    return forbiddenJson("Payload too large", 413);
  }

  if (isPortfolioSaveRequest(request) && contentLength > 40 * ONE_MB) {
    return forbiddenJson("Payload too large", 413);
  }

  const rule = getRateLimitRule(request);

  if (!rule) {
    return null;
  }

  const result = await enforceRateLimit({
    key: `${rule.keyPrefix}:${getClientIp(request)}:${pathname}`,
    limit: rule.limit,
    windowSeconds: rule.windowSeconds,
  });
  const headers = createRateLimitHeaders(result);

  if (!result.allowed) {
    return withRateLimitHeaders(forbiddenJson("Too many requests", 429), headers);
  }

  return null;
}
