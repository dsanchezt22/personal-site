import { copyFile, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { build } from "esbuild";
import { art } from "./art/index.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(root, "dist");
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

// Publish only the website; source notes and preview configuration stay private.
const assets = [
  "styles.css",
  "Diego-Sanchez-Tirado-Resume.pdf",
  "favicon.svg",
  "favicon.ico",
  "dst-tab.ico",
  "dst-tab.png",
  "favicon-dark.svg",
  "favicon-32.png",
  "apple-touch-icon.png",
  "og.png",
];
for (const asset of assets) {
  await copyFile(path.join(root, asset), path.join(dist, asset));
}
// The drawings are generated; index.html only marks where each one goes.
const html = (await readFile(path.join(root, "index.html"), "utf8")).replace(
  /<!--art:([\w-]+)-->/g,
  (_, name) => {
    if (!(name in art)) throw new Error(`No drawing named ${name}`);
    return art[name];
  },
);
await writeFile(path.join(dist, "index.html"), html);
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
  `Built index.html with its drawings, ${assets.length} other files, bundled JavaScript, fonts, and headers in dist/`,
);
