// Drawing kit for the site's original line art. Everything is generated at build
// time from a fixed seed, so the same source always yields the same drawing.
let seed = 1;
export const reseed = (s) => (seed = s);
export const rnd = () => ((seed = (seed * 48271) % 2147483647) - 1) / 2147483646;
export const R = (a, b) => a + rnd() * (b - a);
export const f = (v) => Math.round(v * 10) / 10;

export const poly = (pts, close) =>
  "M" + pts.map((p) => f(p[0]) + " " + f(p[1])).join("L") + (close ? "Z" : "");
export const line = (x1, y1, x2, y2) => `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`;
export const rect = (x, y, w, h, r = 0) =>
  r
    ? `M${f(x + r)} ${f(y)}h${f(w - 2 * r)}a${r} ${r} 0 0 1 ${r} ${r}v${f(h - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${r}h${f(2 * r - w)}a${r} ${r} 0 0 1 ${-r} ${-r}v${f(2 * r - h)}a${r} ${r} 0 0 1 ${r} ${-r}Z`
    : `M${f(x)} ${f(y)}h${f(w)}v${f(h)}h${f(-w)}Z`;
export const ell = (cx, cy, rx, ry = rx) =>
  `M${f(cx - rx)} ${f(cy)}a${f(rx)} ${f(ry)} 0 1 0 ${f(2 * rx)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-2 * rx)} 0Z`;
export const rectPts = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
export const ellPts = (cx, cy, rx, ry = rx, n = 22, a0 = 0, a1 = Math.PI * 2) =>
  Array.from({ length: n }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / (a1 - a0 >= Math.PI * 2 ? n : n - 1);
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });

// A box drawn the way a pen draws it: four strokes that overshoot the corners.
export const srect = (x, y, w, h, o = 2) =>
  line(x - R(0, o), y + R(-0.4, 0.4), x + w + R(0, o), y + R(-0.4, 0.4)) +
  line(x + w + R(-0.4, 0.4), y - R(0, o), x + w + R(-0.4, 0.4), y + h + R(0, o)) +
  line(x + w + R(0, o), y + h + R(-0.4, 0.4), x - R(0, o), y + h + R(-0.4, 0.4)) +
  line(x + R(-0.4, 0.4), y + h + R(0, o), x + R(-0.4, 0.4), y - R(0, o));

// Pencil shading: parallel strokes clipped to any simple polygon, unevenly spaced.
export function hatch(pts, ang = 45, gap = 4, jit = 0.3) {
  const a = (ang * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  const q = pts.map(([x, y]) => [x * c + y * s, -x * s + y * c]);
  const ys = q.map((p) => p[1]);
  const top = Math.max(...ys);
  let d = "";
  for (let y = Math.min(...ys) + gap * R(0.3, 0.9); y < top; y += gap * R(1 - jit, 1 + jit)) {
    const xs = [];
    for (let i = 0; i < q.length; i++) {
      const [x1, y1] = q[i];
      const [x2, y2] = q[(i + 1) % q.length];
      if (y1 <= y !== y2 <= y) xs.push(x1 + ((y - y1) / (y2 - y1)) * (x2 - x1));
    }
    xs.sort((m, n) => m - n);
    for (let i = 0; i + 1 < xs.length; i += 2) {
      const xa = xs[i] + R(0, 1.2);
      const xb = xs[i + 1] - R(0, 1.2);
      if (xb - xa > 1.5) d += line(xa * c - y * s, xa * s + y * c, xb * c - y * s, xb * s + y * c);
    }
  }
  return d;
}

// Smooth open curve through points (Catmull-Rom as cubic Béziers).
export function curve(pts, close) {
  const n = pts.length;
  const at = (i) => (close ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < (close ? n : n - 1); i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + (close ? "Z" : "");
}

// One drawing. Shapes are emitted back to front; `shape` is opaque (paper fill
// plus outline) so nearer things hide farther ones. Washes are colour fills kept
// in their own top layer and multiplied over the ink, like watercolour; they
// keep their order, so a white wash ("wx") can lift colour back off a shape.
export function sheet() {
  let out = "";
  let bucket = new Map();
  const wash = [];
  const flush = () => {
    for (const [c, d] of bucket) out += `<path class="${c}" d="${d}"/>`;
    bucket = new Map();
  };
  const s = {
    add: (c, d) => (bucket.set(c, (bucket.get(c) ?? "") + d), s),
    ink: (d) => s.add("i", d),
    fine: (d) => s.add("f", d),
    hair: (d) => s.add("h", d),
    bold: (d) => s.add("b", d),
    shape: (d, c = "i") => (flush(), (out += `<path class="p ${c}" d="${d}"/>`), s),
    wash: (c, d) => (wash.at(-1)?.[0] === c ? (wash.at(-1)[1] += d) : wash.push([c, d]), s),
    raw: (x) => (flush(), (out += x), s),
    done: () => {
      flush();
      const w = wash.map(([c, d]) => `<path class="${c}" d="${d}"/>`).join("");
      return `<g class="ink">${out}</g><g class="wash">${w}</g>`;
    },
  };
  return s;
}

export const text = (x, y, str, cls = "t", extra = "") =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}"${extra}>${str}</text>`;

// Isometric projection helper: x right-down, y left-down, z up.
export const iso = (ox, oy, k = 1) => (x, y, z = 0) => [
  ox + (x - y) * 0.866 * k,
  oy + (x + y) * 0.5 * k - z * k,
];

// A straight tube (frame member, straw, lead) as a four-point polygon.
export const tube = ([x1, y1], [x2, y2], w) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const nx = (-Math.sin(a) * w) / 2;
  const ny = (Math.cos(a) * w) / 2;
  return [[x1 + nx, y1 + ny], [x2 + nx, y2 + ny], [x2 - nx, y2 - ny], [x1 - nx, y1 - ny]];
};
// Place local coordinates: translate, rotate, optionally mirror.
export const xf = (tx, ty, deg = 0, sx = 1) => {
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return (x, y) => [tx + sx * (x * c - y * s), ty + x * s + y * c];
};
// Rectangle with clipped corners, as points (so it can be transformed).
export const rr = (x, y, w, h, r = 2) => [[x + r, y], [x + w - r, y], [x + w, y + r], [x + w, y + h - r], [x + w - r, y + h], [x + r, y + h], [x, y + h - r], [x, y + r]];
// Stand-in for handwriting or printed text: a run of short uneven strokes.
export const scribble = (x, y, len, T = (a, b) => [a, b]) => {
  let d = "";
  for (let u = x; u < x + len; ) {
    const w = Math.min(R(4, 15), x + len - u);
    if (w > 2) d += line(...T(u, y + R(-0.4, 0.4)), ...T(u + w, y + R(-0.4, 0.4)));
    u += w + R(2.5, 4.5);
  }
  return d;
};
export const svg = (name, w, h, inner, extra = "") =>
  `<svg class="art art-${name}" viewBox="0 0 ${w} ${h}" aria-hidden="true"${extra}>${inner}</svg>`;
