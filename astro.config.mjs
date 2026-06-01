import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.whitzard.tech",
  integrations: [mdx(), sitemap()],
  build: {
    assets: "assets",
  },
});
