import { copyFile, cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { build } from "esbuild";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(root, "dist");
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

// Publish only the website; source notes and preview configuration stay private.
const assets = [
  "index.html",
  "styles.css",
  "Diego-Sanchez-Tirado-Resume.pdf",
  "favicon.svg",
  "favicon-dark.svg",
  "favicon-32.png",
  "apple-touch-icon.png",
  "og.png",
];
for (const asset of assets) {
  await copyFile(path.join(root, asset), path.join(dist, asset));
}
await cp(path.join(root, "fonts"), path.join(dist, "fonts"), {
  recursive: true,
});
await build({
  entryPoints: [path.join(root, "main.js")],
  bundle: true,
  splitting: true,
  format: "esm",
  target: "es2022",
  minify: true,
  outdir: dist,
  legalComments: "linked",
});
await copyFile(path.join(root, "deploy/_headers"), path.join(dist, "_headers"));
console.log(
  `Built ${assets.length} website files plus bundled JavaScript, fonts, and headers in dist/`,
);
