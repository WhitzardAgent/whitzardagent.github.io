import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://whitzard.tech",
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        const raw = new URL(page).pathname.replace(/\/+$/, "") || "/";
        // Strip /en prefix for redirect matching
        const base = raw.startsWith("/en/") ? raw.slice(3) : raw;
        if (raw.startsWith("/zh")) return false;
        if (base === "/blog") return false;
        const redirectOnly = [
          "/NVWA-Project",
          "/open-source",
          "/publications",
          "/research",
          "/developers",
        ];
        return !redirectOnly.includes(base);
      },
    }),
    react(),
  ],
  i18n: {
    defaultLocale: "zh",
    locales: ["zh", "en"],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  build: {
    assets: "assets",
  },
});
