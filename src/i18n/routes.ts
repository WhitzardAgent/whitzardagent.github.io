import type { Locale } from "./config";
import { localizedPath, stripLocale } from "./config";

export const localizedRoutes = [
  "/", "/agentguard", "/solutions", "/nuwa", "/research",
  "/open-ecosystem", "/about", "/contact",
] as const;

export function hasLocalizedPeer(pathname: string): boolean {
  const base = stripLocale(pathname);
  return localizedRoutes.includes(base as (typeof localizedRoutes)[number]);
}

export function localeSwitchPath(pathname: string, target: Locale): string {
  return hasLocalizedPeer(pathname) ? localizedPath(pathname, target) : target === "zh" ? "/" : "/en/";
}
