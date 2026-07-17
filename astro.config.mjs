// @ts-check

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import vue from "@astrojs/vue";

/** @typedef {{ type: string, depth?: number, children?: MarkdownNode[] }} MarkdownNode */

function remarkDemoteHeadings() {
  /** @param {MarkdownNode} node */
  const visit = (node) => {
    if (node.type === "heading" && node.depth) {
      node.depth = Math.min(node.depth + 1, 6);
    }
    node.children?.forEach(visit);
  };

  /** @param {MarkdownNode} tree */
  return (tree) => visit(tree);
}

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL ?? "https://www.zh314.xyz",
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    vue(),
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        return !pathname.startsWith("/img/") && pathname !== "/robots.txt";
      },
    }),
  ],
  markdown: {
    rehypePlugins: [rehypeKatex],
    remarkPlugins: [remarkMath, remarkDemoteHeadings],
    shikiConfig: {
      themes: {
        light: "material-theme-lighter",
        dark: "material-theme-darker",
      },
    },
  },
});
