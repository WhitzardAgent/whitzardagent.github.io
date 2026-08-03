export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "zh";

export function getLocaleFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "zh";
}

export function stripLocale(pathname: string): string {
  if (pathname === "/en" || pathname === "/en/" || pathname === "/zh" || pathname === "/zh/") return "/";
  if (pathname.startsWith("/en/") || pathname.startsWith("/zh/")) return pathname.slice(3) || "/";
  return pathname;
}

export function localizedPath(pathname: string, locale: Locale): string {
  const base = stripLocale(pathname);
  if (locale === "zh") return base || "/";
  return base === "/" ? "/en/" : `/en${base}`;
}

export function ogLocale(locale: Locale): string {
  return locale === "zh" ? "zh_CN" : "en_US";
}
