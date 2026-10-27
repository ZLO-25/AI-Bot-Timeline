import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// @ts-expect-error JS plugin alongside the TS vite config
import { grokPwaPlugin } from "./scripts/grok-pwa-plugin.mjs";

/** Project site: https://zlo-25.github.io/AI-Bot-Timeline/ */
const pagesBase = process.env.PAGES_BASE ?? "/AI-Bot-Timeline/";

/**
 * Static shell for GitHub Pages. The live preview and Vercel build stay on
 * vite.config.ts (Nitro). This config only runs from `npm run build:pages`.
 */
export default defineConfig({
  base: pagesBase.endsWith("/") ? pagesBase : `${pagesBase}/`,
  build: {
    outDir: "dist-pages",
    emptyOutDir: true,
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    grokPwaPlugin(),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: false,
        autoSubfolderIndex: true,
      },
      pages: [{ path: "/" }],
    }),
    viteReact(),
  ],
});
