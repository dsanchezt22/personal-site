// Tab and home-screen icons: a small processor with "dst" on the die, in the site's
// ink-and-wash style. Run `npm run icons` after changing it; the results are checked in.
// ponytail: rasterised with the copy of sharp that wrangler installs, not a dependency of
// its own. If wrangler ever drops it, add sharp as a devDependency.
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { reseed, f, rect, hatch } from "./art/kit.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const light = { ink: "#141414", paper: "#fdfcf8", body: "#d7cbe9", side: "#b3a6cf", pin: "#fbfaf7", hair: "#6d6480", leg: "#848484" };
const dark = { ink: "#fdfcf8", paper: "#141414", body: "#4b416b", side: "#342c4d", pin: "#2a2a2a", hair: "#9a8fbb", leg: "#a9a7a2" };

// "dst" as pen strokes. x is the x-height, (ox, oy) the left end of the baseline.
const dst = (ox, oy, x) => {
  const p = (u, v) => `${f(ox + u * x)} ${f(oy + v * x)}`;
  return (
    `M${p(1, -1.55)}V${f(oy)}M${p(1, -0.5)}a${f(x / 2)} ${f(x / 2)} 0 1 1 ${f(-x)} 0a${f(x / 2)} ${f(x / 2)} 0 1 1 ${f(x)} 0` +
    `M${p(2.13, -0.8)}C${p(2, -1.06)} ${p(1.36, -1.08)} ${p(1.36, -0.74)}C${p(1.36, -0.44)} ${p(2.16, -0.56)} ${p(2.16, -0.26)}C${p(2.16, 0.08)} ${p(1.5, 0.06)} ${p(1.34, -0.2)}` +
    `M${p(2.74, -1.42)}V${f(oy - 0.3 * x)}Q${p(2.74, 0)} ${p(3.06, 0)}M${p(2.44, -1)}H${f(ox + 3.1 * x)}`
  );
};
const textWidth = 3.1;

// One icon. `size` is the pixel grid it is drawn on, `pins` per side, `long` their length,
// `line` the outline weight. Small sizes are plain and pixel-snapped; `sketch` adds the
// hand wobble, pencil shading and a side face, which only read at 48px and up.
function chip({ size, pins, long, wide, line, sketch = false, tone = light, tile = 0 }) {
  reseed(29);
  const edge = tile + long; // the body's outer edge
  const side = size - 2 * edge;
  const step = side / pins;
  let legs = "";
  for (let i = 0; i < pins; i++) {
    const at = edge + step * (i + 0.5) - wide / 2;
    legs += rect(at, tile, wide, long + line) + rect(at, size - tile - long - line, wide, long + line);
    legs += rect(tile, at, long + line, wide) + rect(size - tile - long - line, at, long + line, wide);
  }
  const inner = side - 2 * line;
  const x = (inner * 0.88) / (textWidth + 0.3); // the x-height at which "dst" spans the die
  const letters = dst(size / 2 - (textWidth * x) / 2, size / 2 + 0.78 * x, x);
  const pen = (colour = tone.ink) => `fill="none" stroke="${colour}" stroke-linecap="round" stroke-linejoin="round"`;
  const b = edge + line / 2;
  const s = side - line;
  const d = sketch ? size * 0.045 : 0;
  const face = sketch
    ? `<path fill="${tone.side}" stroke="${tone.ink}" stroke-width="${f(line * 0.6)}" stroke-linejoin="round" d="M${f(b)} ${f(b + s)}l${f(d)} ${f(d)}h${f(s)}v${f(-s)}l${f(-d)} ${f(-d)}Z"/>`
    : "";
  const shade = sketch
    ? `<path ${pen(tone.hair)} stroke-width="${f(size * 0.011)}" d="${hatch([[b + s - line, b + s * 0.42], [b + s - line, b + s - line], [b + s * 0.42, b + s - line]], -58, size * 0.045, 0.4)}"/>` +
      `<circle cx="${f(b + line * 2.3)}" cy="${f(b + line * 2.3)}" r="${f(line * 0.7)}" fill="${tone.paper}" stroke="${tone.ink}" stroke-width="${f(line * 0.4)}"/>`
    : "";
  const wobble = sketch
    ? `<filter id="w" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="${f(2.6 / size)}" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="${f(size * 0.028)}" xChannelSelector="R" yChannelSelector="G"/></filter>`
    : "";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${wobble}` +
    (tile ? `<rect width="${size}" height="${size}" fill="${tone.paper}"/>` : "") +
    `<g${sketch ? ' filter="url(#w)"' : ""}>` +
    `<path fill="${tone.pin}" stroke="${tone.ink}" stroke-width="${f(line * (sketch ? 0.6 : 1))}" stroke-linejoin="round" d="${legs}"/>` +
    face +
    `<rect x="${f(b)}" y="${f(b)}" width="${f(s)}" height="${f(s)}" rx="${f(sketch ? line : line / 2)}" fill="${tone.body}" stroke="${tone.ink}" stroke-width="${line}"/>` +
    shade +
    `<path ${pen()} stroke-width="${f(x * 0.3)}" d="${letters}"/>` +
    `</g></svg>`
  );
}

// In a browser tab there is no room for letters between four rows of pins, so the two
// smallest icons keep pins above and below only. The 16px one is set by hand on the
// pixel grid, with "dst" one pixel thick; the 32px one is the same layout with pen letters.
function small(k, tone = light) {
  const d = ["...#", "...#", ".###", "#..#", "#..#", "#..#", ".###"];
  const s = ["...", "...", ".##", "#..", ".#.", "..#", "##."];
  const t = [".#.", ".#.", "###", ".#.", ".#.", ".#.", "..#"];
  let dots = "";
  d.forEach((row, y) => [...`${row}.${s[y]}.${t[y]}`].forEach((c, x) => c === "#" && (dots += `M${x + 2} ${y + 4}h1v1h-1z`)));
  const legs = [2, 5, 9, 12].map((x) => `M${x * k} 0h${2 * k}v${3 * k}h${-2 * k}zM${x * k} ${13 * k}h${2 * k}v${3 * k}h${-2 * k}z`).join("");
  const letters =
    k === 1
      ? `<path fill="${tone.ink}" d="${dots}"/>`
      : `<path fill="none" stroke="${tone.ink}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="${dst(5.2, 21.5, 7)}"/>`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${16 * k} ${16 * k}" width="${16 * k}" height="${16 * k}">` +
    `<path shape-rendering="crispEdges" fill="${tone.leg}" d="${legs}"/><path shape-rendering="crispEdges" fill="${tone.ink}" d="M0 ${2 * k}h${16 * k}v${12 * k}h${-16 * k}z"/>` +
    `<path shape-rendering="crispEdges" fill="${tone.body}" d="M${k} ${3 * k}h${14 * k}v${10 * k}h${-14 * k}z"/>${letters}</svg>`
  );
}

const sizes = {
  48: { size: 48, pins: 4, long: 5, wide: 5, line: 3 },
  64: { size: 64, pins: 4, long: 7, wide: 6, line: 3, sketch: true },
};
const png = (svg) => sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
const out = (name, data) => writeFile(root + name, data);

const tab = { 16: await png(small(1)), 32: await png(small(2)) };
for (const [n, o] of Object.entries(sizes)) tab[n] = await png(chip(o));

// .ico: a directory of PNGs, smallest first.
const entries = Object.entries(tab);
const head = Buffer.alloc(6 + 16 * entries.length);
head.writeUInt16LE(1, 2);
head.writeUInt16LE(entries.length, 4);
let offset = head.length;
entries.forEach(([n, data], i) => {
  const at = 6 + 16 * i;
  head.writeUInt8(+n, at);
  head.writeUInt8(+n, at + 1);
  head.writeUInt16LE(1, at + 4);
  head.writeUInt16LE(32, at + 6);
  head.writeUInt32LE(data.length, at + 8);
  head.writeUInt32LE(offset, at + 12);
  offset += data.length;
});
const ico = Buffer.concat([head, ...entries.map(([, data]) => data)]);

await out("dst-tab.ico", ico);
await out("favicon.ico", ico);
await out("dst-tab.png", tab[64]);
await out("favicon-32.png", tab[32]);
await out("favicon.svg", chip(sizes[64]) + "\n");
await out("favicon-dark.svg", chip({ ...sizes[64], tone: dark }) + "\n");
// Home-screen icon: the same chip on an opaque paper tile, since iOS fills transparency with black.
await out("apple-touch-icon.png", await png(chip({ size: 180, pins: 4, long: 14, wide: 15, line: 6, sketch: true, tile: 16 })));
console.log(`Wrote the tab icon at ${Object.keys(tab).join(", ")}px, favicon.svg in two tones, and apple-touch-icon.png`);
