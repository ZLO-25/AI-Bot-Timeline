/**
 * GitHub Pages has no rewrite rules. The SPA shell must be index.html, and
 * 404.html is the fallback for any path under the project site.
 */
import { copyFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const clientDir = join(process.cwd(), "dist-pages", "client");
const indexPath = join(clientDir, "index.html");
const shellPath = join(clientDir, "_shell.html");

if (!existsSync(indexPath)) {
  if (!existsSync(shellPath)) {
    console.error("[pages] no index.html or _shell.html in", clientDir);
    process.exit(1);
  }
  copyFileSync(shellPath, indexPath);
}

copyFileSync(indexPath, join(clientDir, "404.html"));
writeFileSync(join(clientDir, ".nojekyll"), "");
console.log("[pages] wrote", clientDir);
