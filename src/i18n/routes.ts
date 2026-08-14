import type { Locale } from "./config";
import { localizedPath, stripLocale } from "./config";

export const localizedRoutes = [
  "/", "/agentguard", "/solutions", "/nuwa", "/research",
  "/open-ecosystem", "/news", "/about", "/contact",
] as const;

function normalizeRoute(pathname: string): string {
  const base = stripLocale(pathname);
  if (base === "/") return base;
  return base.replace(/\/+$/, "") || "/";
}

export function hasLocalizedPeer(pathname: string): boolean {
  const base = normalizeRoute(pathname);
  if (base.startsWith("/news/")) return true;
  return localizedRoutes.includes(base as (typeof localizedRoutes)[number]);
}

export function localeSwitchPath(pathname: string, target: Locale): string {
  const base = normalizeRoute(pathname);
  return hasLocalizedPeer(base) ? localizedPath(base, target) : target === "zh" ? "/" : "/en/";
}
