import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const URL_PROTOCOL_PATTERN = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//;
const PHONE_NUMBER_PATTERN = /^[+\d()\s.-]{7,}$/;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeUrl(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  if (URL_PROTOCOL_PATTERN.test(trimmedValue)) {
    return trimmedValue;
  }

  if (trimmedValue.startsWith("//")) {
    return `https:${trimmedValue}`;
  }

  return `https://${trimmedValue}`;
}

export function isValidHttpUrl(value: string) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      Boolean(url.hostname)
    );
  } catch {
    return false;
  }
}

function normalizePhoneNumber(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  const prefix = trimmedValue.startsWith("+") ? "+" : "";
  const digits = trimmedValue.replace(/\D/g, "");

  return digits ? `${prefix}${digits}` : "";
}

export function normalizeContactLink(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  if (trimmedValue.startsWith("tel:")) {
    const normalizedPhoneNumber = normalizePhoneNumber(trimmedValue.slice(4));
    return normalizedPhoneNumber ? `tel:${normalizedPhoneNumber}` : "";
  }

  if (PHONE_NUMBER_PATTERN.test(trimmedValue) && !/[a-zA-Z]/.test(trimmedValue)) {
    const normalizedPhoneNumber = normalizePhoneNumber(trimmedValue);
    return normalizedPhoneNumber ? `tel:${normalizedPhoneNumber}` : "";
  }

  return normalizeUrl(trimmedValue);
}

export function isValidContactLink(value: string) {
  if (!value) {
    return false;
  }

  if (value.startsWith("tel:")) {
    return normalizePhoneNumber(value.slice(4)).replace(/\D/g, "").length >= 7;
  }

  return isValidHttpUrl(value);
}
