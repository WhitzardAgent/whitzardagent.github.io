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
        const pathname = new URL(page).pathname;
        const redirectOnly = ["/NVWA-Project/", "/open-source/", "/publications/"];
        return !pathname.startsWith("/zh") && pathname !== "/blog/" && pathname !== "/news/" && !pathname.startsWith("/news/") && !redirectOnly.includes(pathname);
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
