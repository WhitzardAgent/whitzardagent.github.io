export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function getLocaleFromPath(pathname: string): Locale {
  return pathname === "/zh" || pathname.startsWith("/zh/") ? "zh" : "en";
}

export function stripLocale(pathname: string): string {
  if (pathname === "/zh" || pathname === "/zh/") return "/";
  return pathname.startsWith("/zh/") ? pathname.slice(3) || "/" : pathname;
}

export function localizedPath(pathname: string, locale: Locale): string {
  const base = stripLocale(pathname);
  if (locale === "en") return base || "/";
  return base === "/" ? "/zh/" : `/zh${base}`;
}

export function ogLocale(locale: Locale): string {
  return locale === "zh" ? "zh_CN" : "en_US";
}
