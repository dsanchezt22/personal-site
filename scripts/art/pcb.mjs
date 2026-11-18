// Hero drawing: a close-up of an imagined board carrying parts from Diego's own
// projects (key-switch matrix, a memory mesh, an adder driving a display, a 48 V
// stage). Parts are placed by hand on a 10px grid; a small maze router then draws
// the copper between them, so the routing is dense without being hand-typed.
import { reseed, rnd, R, f, poly, line, rect, ell, rectPts, ellPts, hatch, srect, text } from "./kit.mjs";

const G = 10;
const W = 128;
const H = 80;
const DX = [1, 1, 0, -1, -1, -1, 0, 1];
const DY = [0, 1, 1, 1, 0, -1, -1, -1];
const dirOf = (dx, dy) => DX.findIndex((v, i) => v === dx && DY[i] === dy);

export function pcb() {
  reseed(2029);
  const occ = new Int32Array(W * H); // 0 free, -1 part, -2 trace, >0 reserved for that pin
  const axes = new Uint8Array(W * H); // which axes a trace uses through the cell
  const clip = new Uint8Array(W * H); // diagonal axes that pass the cell's corners
  const B = {};
  const add = (k, d) => (B[k] = (B[k] ?? "") + d);
  const wash = {};
  const tint = (k, d) => (wash[k] = (wash[k] ?? "") + d);
  const pins = [];
  const routed = [];
  let labels = "";
  let part = 0;
  const idx = (x, y) => y * W + x;
  const inb = (x, y) => x >= 0 && y >= 0 && x < W && y < H;
  const cx = (g) => g * G + 5;
  const block = (x, y, w = 1, h = 1) => {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (inb(i, j)) occ[idx(i, j)] = -1;
  };
  const pin = (x, y, dx = 0, dy = 0) => {
    const p = { x, y, dx, dy, id: pins.length + 1, part, done: !inb(x, y) };
    pins.push(p);
    if (inb(x, y)) occ[idx(x, y)] = -1;
    if ((dx || dy) && inb(x + dx, y + dy) && occ[idx(x + dx, y + dy)] === 0) occ[idx(x + dx, y + dy)] = p.id;
    return p;
  };

  // ---- parts -------------------------------------------------------------
  // A raised body: top face, the two side faces you would see from above-left
  // light, a bevel line and pencil shading.
  const body = (x, y, w, h, o = {}) => {
    const d = o.d ?? 4;
    add("sf", poly([[x, y + h], [x + d, y + h + d], [x + w + d, y + h + d], [x + w + d, y + d], [x + w, y], [x + w, y + h]], true));
    add("f", line(x + w, y + h, x + w + d, y + h + d));
    add("bf", rect(x, y, w, h, o.r ?? 2));
    if (o.bevel !== false) add("f", srect(x + 3, y + 3, w - 6, h - 6, 0));
    if (o.gap !== 0) add("h", hatch(rectPts(x + 4, y + 4, w - 8, h - 8), o.ang ?? 32, o.gap ?? 7, 0.45));
    if (o.tint) tint(o.tint, rect(x, y, w, h, 2));
  };
  const leg = (px, py, dx, dy) => {
    const X = cx(px);
    const Y = cx(py);
    add("pad", dx ? rect(X - 6, Y - 3, 12, 6, 1.5) : rect(X - 3, Y - 6, 6, 12, 1.5));
    add("ld", rect(X - (dx ? (dx > 0 ? 7 : 1) : 1.8), Y - (dy ? (dy > 0 ? 7 : 1) : 1.8), dx ? 8 : 3.6, dy ? 8 : 3.6));
    return pin(px, py, dx, dy);
  };

  const qfp = (gx, gy, n, mark, col = "wl") => {
    part++;
    const s = n + 2;
    const x = gx * G + 1;
    const y = gy * G + 1;
    const S = s * G - 2;
    block(gx - 1, gy - 1, s + 2, s + 2);
    const side = { t: [], r: [], b: [], l: [] };
    for (let i = 0; i < n; i++) {
      side.t.push(leg(gx + 1 + i, gy - 1, 0, -1));
      side.b.push(leg(gx + 1 + i, gy + s, 0, 1));
      side.l.push(leg(gx - 1, gy + 1 + i, -1, 0));
      side.r.push(leg(gx + s, gy + 1 + i, 1, 0));
    }
    body(x, y, S, S, { d: 5, tint: col });
    // heavier shading toward the lower right corner
    add("h", hatch([[x + S - 6, y + S * 0.45], [x + S - 6, y + S - 6], [x + S * 0.45, y + S - 6]], -58, 4.5, 0.4));
    add("dot", ell(x + 14, y + 14, 4.5));
    add("f", poly([[x - 9, y - 9], [x - 2, y - 9], [x - 9, y - 2]], true));
    labels += text(x + S / 2, y + S / 2 - 4, mark[0], "mk") + text(x + S / 2, y + S / 2 + 12, mark[1], "mk");
    return side;
  };

  // Two rows of legs. t=true stands the long axis upright.
  const dual = (gx, gy, n, wd, t, o = {}) => {
    part++;
    const c = (i, j) => (t ? [gx + j, gy + i] : [gx + i, gy + j]);
    const [bw, bh] = t ? [wd, n] : [n, wd];
    block(gx - 1, gy - 1, bw + 2, bh + 2);
    const side = { a: [], b: [] };
    for (const [key, j, dj, list] of [["a", -1, -1, o.a], ["b", wd, 1, o.b]]) {
      for (let i = 0; i < n; i++) {
        if (list && !list.includes(i)) continue;
        const [px, py] = c(i, j);
        side[key].push(leg(px, py, t ? dj : 0, t ? 0 : dj));
      }
    }
    const [x, y, w, h] = t ? [gx * G + 1, gy * G - 2, wd * G - 2, n * G + 4] : [gx * G - 2, gy * G + 1, n * G + 4, wd * G - 2];
    body(x, y, w, h, { d: o.d ?? 4, tint: o.tint ?? "wb", gap: o.gap ?? 6, ang: t ? 58 : 32 });
    add("dot", t ? ell(x + 8, y + 8, 2.6) : ell(x + 8, y + h - 8, 2.6));
    if (n > 3) add("i", t ? `M${f(x + w / 2 - 6)} ${f(y)}a6 6 0 0 0 12 0` : `M${f(x)} ${f(y + h / 2 - 6)}a6 6 0 0 1 0 12`);
    return side;
  };

  // Two-pad parts: resistor, capacitor, LED, diode, crystal.
  const passive = (gx, gy, L, wd, t, kind = "c") => {
    part++;
    const X0 = gx * G;
    const Y0 = gy * G;
    const rc = (u, v, w, h, r) => (t ? rect(X0 + v, Y0 + u, h, w, r) : rect(X0 + u, Y0 + v, w, h, r));
    const pt = (u, v) => (t ? [X0 + v, Y0 + u] : [X0 + u, Y0 + v]);
    const mid = (wd - 1) / 2;
    const len = L * G;
    const wid = wd * G;
    block(gx, gy, t ? wd : L, t ? L : wd);
    const a = t ? pin(gx + mid, gy, 0, -1) : pin(gx, gy + mid, -1, 0);
    const b = t ? pin(gx + mid, gy + L - 1, 0, 1) : pin(gx + L - 1, gy + mid, 1, 0);
    const pl = wd === 1 ? 9 : 13;
    add("sk", rc(-2.5, -2.5, pl + 5, wid + 5, 4) + rc(len - pl - 2.5, -2.5, pl + 5, wid + 5, 4));
    add("pad", rc(0.5, 1, pl, wid - 2, 2) + rc(len - pl - 0.5, 1, pl, wid - 2, 2));
    const e = wd === 1 ? 5 : 6; // body starts this far in
    const v0 = wd === 1 ? 1.5 : 3;
    const bl = len - 2 * e;
    const bh = wid - 2 * v0;
    const cap = wd === 1 ? 3.5 : 6;
    if (wd > 1) {
      const [p, q] = [pt(e, v0), pt(e + bl, v0 + bh)];
      const [x, y, w, h] = [Math.min(p[0], q[0]), Math.min(p[1], q[1]), Math.abs(q[0] - p[0]), Math.abs(q[1] - p[1])];
      add("sf", poly([[x, y + h], [x + 3, y + h + 3], [x + w + 3, y + h + 3], [x + w + 3, y + 3], [x + w, y], [x + w, y + h]], true));
    }
    add("bf", rc(e, v0, bl, bh, kind === "x" ? bh / 2 : 1.5));
    if (kind === "x") {
      add("f", rc(e + 3, v0 + 3, bl - 6, bh - 6, bh / 2 - 3));
      add("h", hatch([pt(e + 10, v0 + 5), pt(e + bl - 10, v0 + 5), pt(e + bl - 10, v0 + bh - 5), pt(e + 10, v0 + bh - 5)], t ? 60 : 30, 5, 0.5));
      tint("wb", rc(e, v0, bl, bh, bh / 2));
    } else {
      add("tm", rc(e, v0, cap, bh, 1) + rc(e + bl - cap, v0, cap, bh, 1));
      const inner = [pt(e + cap + 1, v0 + 1), pt(e + bl - cap - 1, v0 + 1), pt(e + bl - cap - 1, v0 + bh - 1), pt(e + cap + 1, v0 + bh - 1)];
      if (kind === "r") add("h", hatch(inner, t ? 40 : -50, 2.6, 0.3));
      else if (kind === "c" && wd > 1) add("h", hatch(inner, t ? -30 : 60, 5.5, 0.5));
      else if (kind === "d") add("i", line(...pt(e + cap + 3, v0), ...pt(e + cap + 3, v0 + bh)));
      else if (kind === "led") add("f", rc(e + cap + 1.5, v0 + 1.5, bl - 2 * cap - 3, bh - 3, 2));
      tint({ r: "wg", c: "wp", d: "wg", led: pick(["wr", "wm", "wy"]) }[kind], rc(e + cap, v0, bl - 2 * cap, bh, 1));
    }
    return { a, b };
  };
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

  const ecap = (gx, gy) => {
    part++;
    block(gx - 1, gy, 9, 7);
    const X = gx * G + 35;
    const Y = gy * G + 35;
    for (const [px, d] of [[gx - 1, -1], [gx + 7, 1]]) add("pad", rect(cx(px) - (d > 0 ? 9 : 5), Y - 9, 14, 18, 2));
    const a = pin(gx - 1, gy + 3, -1, 0);
    const b = pin(gx + 7, gy + 3, 1, 0);
    add("sf", poly([[X - 33, Y + 33], [X - 29, Y + 37], [X + 37, Y + 37], [X + 37, Y - 22], [X + 33, Y - 26], [X + 33, Y + 33]], true));
    add("bf", poly([[X - 33, Y - 33], [X + 24, Y - 33], [X + 33, Y - 24], [X + 33, Y + 24], [X + 24, Y + 33], [X - 33, Y + 33]], true));
    add("dot", ell(X, Y, 29));
    add("f", ell(X, Y, 25) + line(X - 9, Y - 20, X - 9, Y + 20) + line(X - 16, Y + 12, X - 16, Y + 20) + line(X - 20, Y + 16, X - 12, Y + 16));
    add("h", hatch(ellPts(X, Y, 25, 25, 18, -0.38 * Math.PI, 0.38 * Math.PI), 90, 3, 0.3));
    tint("wy", ell(X, Y, 29));
    return { a, b };
  };

  const inductor = (gx, gy) => {
    part++;
    block(gx - 1, gy, 7, 5);
    const X = gx * G + 25;
    const Y = gy * G + 25;
    for (const [px, d] of [[gx - 1, -1], [gx + 5, 1]]) add("pad", rect(cx(px) - (d > 0 ? 9 : 5), Y - 10, 14, 20, 2));
    const a = pin(gx - 1, gy + 2, -1, 0);
    const b = pin(gx + 5, gy + 2, 1, 0);
    body(X - 23, Y - 23, 46, 46, { d: 5, r: 7, bevel: false, gap: 0, tint: "wg" });
    add("dot", ell(X, Y, 17));
    add("f", ell(X, Y, 13) + ell(X, Y, 9) + ell(X, Y, 5));
    add("h", hatch(ellPts(X, Y, 17, 17, 18), 20, 3.4, 0.4));
    return { a, b };
  };

  // Unpopulated through-hole header: rings, holes and a silk outline.
  const header = (gx, gy, n, t) => {
    part++;
    const out = [];
    for (let i = 0; i < n; i++) {
      const [px, py] = t ? [gx, gy + 2 * i] : [gx + 2 * i, gy];
      const X = cx(px);
      const Y = cx(py);
      add("pad", i ? ell(X, Y, 7) : rect(X - 7, Y - 7, 14, 14, 2));
      add("vh", ell(X, Y, 3.4));
      add("f", line(X - 1.6, Y - 1.6, X + 1.6, Y + 1.6));
      const d = i % 2 ? 1 : -1;
      out.push(t ? pin(px, py, d, 0) : pin(px, py, 0, d));
    }
    const [x, y] = [gx * G - 6, gy * G - 6];
    add("sk2", t ? rect(x, y, 22, (2 * n - 1) * G + 12, 3) : rect(x, y, (2 * n - 1) * G + 12, 22, 3));
    return out;
  };

  const sevenSeg = (gx, gy, digits) => {
    part++;
    block(gx, gy - 1, 12, 17);
    const side = { a: [], b: [] };
    for (let i = 0; i < 5; i++) {
      for (const [key, py, d] of [["a", gy - 1, -1], ["b", gy + 15, 1]]) {
        const px = gx + 1 + 2 * i;
        add("pad", ell(cx(px), cx(py), 6.5));
        add("vh", ell(cx(px), cx(py), 2.8));
        side[key].push(pin(px, py, 0, d));
      }
    }
    const x = gx * G + 1;
    const y = gy * G + 4;
    body(x, y, 118, 142, { d: 6, gap: 0 });
    add("f", rect(x + 7, y + 7, 104, 128, 4));
    const hex = (x0, y0, x1, y1) =>
      y0 === y1
        ? [[x0, y0], [x0 + 4, y0 - 4], [x1 - 4, y0 - 4], [x1, y0], [x1 - 4, y0 + 4], [x0 + 4, y0 + 4]]
        : [[x0, y0], [x0 + 4, y0 + 4], [x0 + 4, y1 - 4], [x0, y1], [x0 - 4, y1 - 4], [x0 - 4, y0 + 4]];
    const map = { 2: "abged", 9: "abcdfg" };
    digits.forEach((digit, k) => {
      const ox = x + 20 + k * 50;
      const oy = y + 28;
      const w = 30;
      const h = 84;
      const seg = {
        a: hex(ox + 2, oy, ox + w - 2, oy),
        g: hex(ox + 2, oy + h / 2, ox + w - 2, oy + h / 2),
        d: hex(ox + 2, oy + h, ox + w - 2, oy + h),
        f: hex(ox, oy + 2, ox, oy + h / 2 - 2),
        b: hex(ox + w, oy + 2, ox + w, oy + h / 2 - 2),
        e: hex(ox, oy + h / 2 + 2, ox, oy + h - 2),
        c: hex(ox + w, oy + h / 2 + 2, ox + w, oy + h - 2),
      };
      for (const [name, pts] of Object.entries(seg)) {
        const lit = map[digit].includes(name);
        add(lit ? "lit" : "f", poly(pts, true));
        if (lit) tint("wr", poly(pts, true));
      }
      add("f", ell(ox + w + 9, oy + h + 2, 2.6));
    });
    return side;
  };

  const mount = (gx, gy) => {
    part++;
    block(gx, gy, 6, 6);
    const X = gx * G + 30;
    const Y = gy * G + 30;
    add("pad", ell(X, Y, 25));
    add("vh", ell(X, Y, 14));
    for (const [px, py] of ellPts(X, Y, 19.5, 19.5, 10)) add("vh", ell(px, py, 1.9));
    add("f", line(X - 9, Y, X + 9, Y) + line(X, Y - 9, X, Y + 9) + ell(X, Y, 5));
    tint("wy", ell(X, Y, 25));
  };

  // Mechanical key-switch footprint: stem hole, two guide holes, two solder pads.
  const keySwitch = (gx, gy) => {
    part++;
    const X = cx(gx + 6);
    const Y = cx(gy + 6);
    add("sk2", srect(X - 65, Y - 65, 130, 130, 3) + srect(X - 58, Y - 58, 116, 116, 0));
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]])
      add("f", line(X + sx * 52, Y + sy * 44, X + sx * 44, Y + sy * 52));
    add("vh", ell(X, Y, 20) + ell(X - 50, Y, 8.5) + ell(X + 50, Y, 8.5));
    add("f", ell(X, Y, 15) + line(X - 6, Y, X + 6, Y) + line(X, Y - 6, X, Y + 6));
    block(gx + 4, gy + 4, 5, 5);
    block(gx, gy + 5, 3, 3);
    block(gx + 10, gy + 5, 3, 3);
    const out = [];
    for (const [px, py, dx, dy] of [[gx + 3, gy + 4, -1, 0], [gx + 8, gy + 2, 0, -1]]) {
      add("pad", ell(cx(px), cx(py), 11));
      add("vh", ell(cx(px), cx(py), 5.2));
      block(px - 1, py - 1, 3, 3);
      out.push(pin(px + dx, py + dy, dx, dy));
    }
    tint("wm", rect(X - 58, Y - 58, 116, 116, 6));
    return out;
  };

  // Power transistor: a large soldered tab with the body over it and two legs.
  const dpak = (gx, gy) => {
    part++;
    block(gx, gy, 6, 8);
    const x = gx * G;
    const y = gy * G;
    add("pad", rect(x + 1, y + 1, 58, 60, 3));
    const legs = [gx + 1, gx + 4].map((px) => {
      add("pad", rect(cx(px) - 5, cx(gy + 7) - 8, 10, 14, 2));
      add("ld", rect(cx(px) - 3, y + 62, 6, 12));
      return pin(px, gy + 7, 0, 1);
    });
    const tab = pin(gx + 2, gy, 0, -1);
    add("f", srect(x + 8, y + 6, 44, 8, 0) + ell(x + 30, y + 10, 2.5));
    body(x + 4, y + 18, 52, 46, { d: 5, tint: "wl", gap: 5, ang: 62 });
    return { legs, tab };
  };

  const testPoint = (gx, gy) => {
    part++;
    add("pad", ell(cx(gx), cx(gy), 6.5));
    add("f", ell(cx(gx), cx(gy), 3));
    return pin(gx, gy);
  };

  // Length-matching serpentine, the kind memory buses need.
  const meander = (gx, gy, n, h) => {
    part++;
    const pts = [];
    for (let k = 0; k < n; k++) pts.push([gx + 2 * k, gy], [gx + 2 * k, gy + h], [gx + 2 * k + 1, gy + h], [gx + 2 * k + 1, gy]);
    block(gx, gy, 2 * n, h + 1);
    add("tr", poly(pts.map(([px, py]) => [cx(px), cx(py)])));
    return { a: pin(gx, gy, -1, 0), b: pin(gx + 2 * n - 1, gy, 1, 0) };
  };

  const label = (str, gx, gy, size = 34, turn = false) => {
    const w = Math.ceil((str.length * size * 0.68) / G);
    const h = Math.ceil((size * 0.78) / G);
    block(gx, gy, turn ? h : w, turn ? w : h);
    const x = gx * G + 1;
    const y = gy * G + (turn ? w * G - 1 : size * 0.76);
    const tr = turn ? ` transform="rotate(-90 ${x} ${y}) translate(0 ${f(size * 0.76)})"` : "";
    labels += text(x, y, str, "silk", ` font-size="${size}"${tr}`);
  };

  // ---- router ------------------------------------------------------------
  function route(a, b) {
    const mine = (i) => occ[i] === 0 || occ[i] === a.id || occ[i] === b.id;
    const aFree = !a.dx && !a.dy;
    const bFree = !b.dx && !b.dy;
    const sx = a.x + a.dx;
    const sy = a.y + a.dy;
    const tx = b.x + b.dx;
    const ty = b.y + b.dy;
    if (!inb(sx, sy) || !inb(tx, ty)) return false;
    if ((!aFree && !mine(idx(sx, sy))) || (!bFree && !mine(idx(tx, ty)))) return false;
    const need = bFree ? -1 : dirOf(-b.dx, -b.dy);
    const cost = new Float32Array(W * H * 8).fill(Infinity);
    const from = new Int32Array(W * H * 8).fill(-1);
    const heap = [];
    const push = (pr, st) => {
      heap.push([pr, st]);
      for (let i = heap.length - 1; i > 0; ) {
        const p = (i - 1) >> 1;
        if (heap[p][0] <= heap[i][0]) break;
        [heap[p], heap[i]] = [heap[i], heap[p]];
        i = p;
      }
    };
    const pop = () => {
      const top = heap[0];
      const last = heap.pop();
      if (heap.length) {
        heap[0] = last;
        for (let i = 0; ; ) {
          let m = i;
          const l = 2 * i + 1;
          if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
          if (l + 1 < heap.length && heap[l + 1][0] < heap[m][0]) m = l + 1;
          if (m === i) break;
          [heap[m], heap[i]] = [heap[i], heap[m]];
          i = m;
        }
      }
      return top;
    };
    const est = (x, y) => {
      const ex = Math.abs(x - tx);
      const ey = Math.abs(y - ty);
      return 10 * Math.max(ex, ey) + 4 * Math.min(ex, ey);
    };
    for (let d = 0; d < 8; d++) {
      if (!aFree && d !== dirOf(a.dx, a.dy)) continue;
      const st = idx(sx, sy) * 8 + d;
      cost[st] = 0;
      push(est(sx, sy), st);
    }
    let goal = -1;
    for (let pops = 0; heap.length && pops < 50000; pops++) {
      const [, st] = pop();
      const d = st & 7;
      const ci = st >> 3;
      const x = ci % W;
      const y = (ci / W) | 0;
      if (x === tx && y === ty && (need < 0 || ((d - need + 9) & 7) <= 2)) {
        goal = st;
        break;
      }
      for (const turn of [0, 7, 1]) {
        const nd = (d + turn) & 7;
        const nx = x + DX[nd];
        const ny = y + DY[nd];
        if (!inb(nx, ny)) continue;
        const ni = idx(nx, ny);
        if (!mine(ni) && !(bFree && nx === tx && ny === ty)) continue;
        const bit = 1 << (nd & 3);
        if (clip[ci] & ~bit || clip[ni] & ~bit) continue;
        if (nd & 1) {
          const n1 = idx(nx, y);
          const n2 = idx(x, ny);
          if (![n1, n2].every((n) => mine(n) || (occ[n] === -2 && axes[n] === bit))) continue;
        }
        const c = cost[st] + (nd & 1 ? 14 : 10) + (turn ? 9 : 0);
        const ns = ni * 8 + nd;
        if (c < cost[ns]) {
          cost[ns] = c;
          from[ns] = st;
          push(c + est(nx, ny), ns);
        }
      }
    }
    if (goal < 0) return false;
    const cells = [];
    for (let st = goal; st >= 0; st = from[st]) cells.unshift(st >> 3);
    const pts = cells.map((i) => [i % W, (i / W) | 0]);
    if (!aFree) pts.unshift([a.x, a.y]);
    if (!bFree) pts.push([b.x, b.y]);
    lay(pts);
    a.done = b.done = true;
    routed.push(pts);
    return true;
  }

  // Commit a path of cells: mark it so later traces keep their distance, and ink it.
  function lay(pts) {
    for (let i = 0; i < pts.length; i++) {
      const [x, y] = pts[i];
      const ci = idx(x, y);
      if (occ[ci] !== -1) occ[ci] = -2;
      if (!i) continue;
      const [px, py] = pts[i - 1];
      const bit = 1 << (dirOf(x - px, y - py) & 3);
      axes[ci] |= bit;
      axes[idx(px, py)] |= bit;
      if (x !== px && y !== py) {
        clip[idx(x, py)] |= bit;
        clip[idx(px, y)] |= bit;
      }
    }
    const keep = pts.filter((p, i) => {
      if (!i || i === pts.length - 1) return true;
      const [a, b] = [pts[i - 1], pts[i + 1]];
      return (p[0] - a[0]) * (b[1] - p[1]) !== (p[1] - a[1]) * (b[0] - p[0]);
    });
    add("tr", poly(keep.map(([x, y]) => [cx(x), cx(y)])));
  }

  const via = (x, y) => {
    add("pad", ell(cx(x), cx(y), 4.6));
    add("vh", ell(cx(x), cx(y), 1.9));
  };

  // A pin with nowhere to go drops to the other layer through a via.
  function stub(p) {
    p.done = true;
    if (!p.dx && !p.dy) return;
    let x = p.x + p.dx;
    let y = p.y + p.dy;
    if (!inb(x, y) || occ[idx(x, y)] !== p.id) return;
    const pts = [[p.x, p.y], [x, y]];
    let d = dirOf(p.dx, p.dy);
    for (let n = Math.floor(R(1, 5)); n > 0; n--) {
      const nd = (d + pick([0, 0, 0, 1, 7])) & 7;
      const nx = x + DX[nd];
      const ny = y + DY[nd];
      const bit = 1 << (nd & 3);
      if (!inb(nx, ny) || occ[idx(nx, ny)] !== 0 || clip[idx(nx, ny)] & ~bit || clip[idx(x, y)] & ~bit) break;
      if (nd & 1 && (occ[idx(nx, y)] !== 0 || occ[idx(x, ny)] !== 0)) break;
      pts.push([nx, ny]);
      [x, y, d] = [nx, ny, nd];
    }
    lay(pts);
    via(x, y);
  }

  const bus = (as, bs) => as.forEach((a, i) => bs[i] && !a.done && !bs[i].done && route(a, bs[i]));

  // ---- layout (cells) ----------------------------------------------------
  // Room for the name: nothing is placed or routed here.
  block(0, 24, 51, 32);
  for (const [x, y, sx, sy] of [[522, 232, -1, 1], [522, 568, -1, -1]])
    add("f", line(x, y, x + sx * 26, y) + line(x, y, x, y + sy * 26) + line(x + sx * 5, y + sy * 5, x + sx * 18, y + sy * 5) + line(x + sx * 5, y + sy * 5, x + sx * 5, y + sy * 18));

  // top left: key-switch matrix, cropped by the top edge
  [1, 17, 33].map((x) => keySwitch(x, -4));
  const dio = [4, 20, 36].map((x) => passive(x, 10, 3, 1, false, "d"));
  ["SW1", "SW2", "SW3"].forEach((s, i) => label(s, 8 + 16 * i, 12, 26));
  const j1 = header(3, 19, 7);
  label("J1", 18, 17, 34);
  dual(29, 18, 3, 2, false, { a: [0, 2], b: [1], tint: "wl" });
  label("Q4", 34, 18, 24);
  passive(40, 17, 4, 3, false, "c");
  const pull = [0, 1, 2].map((i) => passive(47 + 2 * i, 2, 3, 1, true, "r"));
  const leds = [0, 1, 2].map((i) => passive(46, 8 + 3 * i, 3, 1, false, "led"));
  const ledR = [0, 1, 2].map((i) => passive(50, 8 + 3 * i, 3, 1, false, "r"));

  // top right: controller, clock, flash, power
  const u1 = qfp(80, 2, 14, ["DST-01", "2029"], "wl");
  label("U1", 68, 11, 44);
  const y1 = passive(101, 2, 6, 3, false, "x");
  label("Y1", 108, 2, 30);
  const yc = [100, 104].map((x) => passive(x, 6, 3, 1, false, "c"));
  const u2 = dual(62, 4, 4, 5, false, { tint: "wb" });
  label("U2", 54, 2, 34);
  const dec = [
    passive(82, 21, 3, 1, false, "c"),
    passive(90, 21, 3, 1, false, "c"),
    passive(75, 4, 3, 1, true, "c"),
    passive(99, 9, 3, 1, true, "c"),
    passive(99, 14, 3, 1, true, "c"),
  ];
  const c1 = passive(113, 7, 4, 3, false, "c");
  label("C1", 118, 7, 30);
  const r1 = passive(113, 12, 4, 3, false, "r");
  label("R1", 106, 12, 26);
  const c2 = ecap(120, 13);
  label("C2", 121, 21, 30);
  const l1 = inductor(107, 16);
  label("L1", 107, 22, 26);

  // middle: the adder, its resistors and the display it drives
  const big = [
    passive(55, 13, 4, 3, false, "r"),
    passive(55, 19, 4, 3, false, "c"),
    passive(62, 13, 4, 3, false, "c"),
    passive(62, 19, 6, 3, false, "d"),
  ];
  label("R7", 55, 24, 26);
  label("D9", 64, 24, 26);
  dual(71, 24, 3, 2, false, { a: [0, 2], b: [1], tint: "wl" });
  const u3 = dual(54, 32, 7, 5, false, { tint: "wb" });
  const u4 = dual(66, 32, 7, 5, false, { tint: "wb" });
  label("U3", 54, 27, 30);
  const segR = [0, 1, 2, 3, 4, 5, 6].map((i) => passive(55 + 2 * i, 42, 3, 1, true, "r"));
  const ds = sevenSeg(56, 50, [2, 9]);
  label("DS1", 70, 50, 26, true);
  passive(54, 70, 3, 1, false, "c");
  passive(62, 70, 3, 1, false, "c");
  const j3 = header(54, 76, 7);
  label("J3", 69, 74, 34);

  // right: the memory mesh, eight parts bussed to their neighbours
  const mem = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) mem.push(dual(81 + 14 * c, 44 + 17 * r, 8, 6, true, { tint: "ws", d: 5 }));
  ["U5", "U6", "U7", "U8"].forEach((s, i) => label(s, 81 + 14 * i, 39, 26));
  const memC = [0, 1, 2, 3].map((c) => passive(82 + 14 * c, 56, 3, 1, false, "c"));
  const memC2 = [0, 1, 2, 3].map((c) => passive(82 + 14 * c, 71, 3, 1, false, "c"));
  const mA = meander(100, 30, 5, 5);
  const mB = meander(114, 30, 5, 5);
  label("MESH", 84, 74, 44);
  [104, 107, 110].map((x) => testPoint(x, 76));
  mount(118, 72);

  // bottom left: the 48 V stage
  const c20 = ecap(4, 62);
  label("C20", 3, 70, 26);
  const l2 = inductor(15, 63);
  passive(14, 59, 3, 1, false, "c");
  const q2 = dpak(25, 61);
  const q3 = dpak(35, 61);
  label("Q2", 26, 71, 30);
  label("Q3", 36, 71, 30);
  const d8 = passive(44, 62, 6, 3, false, "d");
  const r20 = passive(44, 67, 4, 3, false, "r");
  label("48V", 43, 72, 34);
  const j4 = header(3, 77, 8);
  label("J4", 20, 75, 34);
  const q6 = dual(31, 77, 3, 2, false, { a: [0, 2], b: [1], tint: "wl" });
  const c22 = passive(36, 76, 4, 3, false, "c");
  [45, 48].map((x) => testPoint(x, 77));

  // ---- nets --------------------------------------------------------------
  // the mesh first so its buses stay straight
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) bus(mem[r * 4 + c].b.slice(1, 7), mem[r * 4 + c + 1].a.slice(1, 7));
  for (let c = 0; c < 4; c++) {
    route(mem[c].b[7], memC[c].b);
    route(mem[c + 4].a[0], memC[c].a);
    route(mem[c + 4].b[7], memC2[c].b);
  }
  bus(u1.b.slice(8, 12), [mA.a, mem[1].a[0], mem[0].b[0], mem[0].a[0]]);
  route(mA.b, mB.a);
  route(mB.b, mem[3].a[0]);
  bus(u1.r.slice(10, 13), [mem[2].a[0], mem[2].b[0], mem[1].b[0]]);
  // the adder drives the display through its resistors
  bus(u4.b, segR.map((p) => p.a));
  bus(segR.slice(1, 6).map((p) => p.b), ds.a);
  bus(u3.b.slice(0, 4), [ds.b[0], j3[0], j3[1], j3[2]]);
  bus(u3.a.slice(3), u4.a.slice(0, 4).reverse());
  // controller to flash, clock, pull-ups, LEDs
  bus(u1.l.slice(2, 6), u2.b.slice().reverse());
  bus(u2.a, [pull[2].a, pull[1].a, dec[2].a, pull[0].a]);
  route(u1.r[1], y1.a);
  route(y1.b, yc[1].b);
  route(u1.r[3], yc[0].a);
  bus(u1.l.slice(8, 11), ledR.map((p) => p.b).reverse());
  leds.forEach((d, i) => route(d.b, ledR[i].a));
  bus(dio.map((d) => d.b), [j1[1], j1[3], j1[5]]);
  bus(u1.r.slice(5, 8), [c1.a, r1.a, dec[3].a]);
  route(c1.b, c2.a);
  route(l1.b, c2.a);
  route(big[0].b, big[2].a);
  route(big[1].b, big[3].a);
  // 48 V stage
  route(c20.b, l2.a);
  route(l2.b, q2.tab);
  route(q2.legs[1], q3.legs[0]);
  route(q3.tab, d8.a);
  route(d8.b, r20.b);
  bus(j4.slice(0, 3), [q6.a[0], q6.b[0], c22.a]);
  // every remaining pin: join a near neighbour on another part, else drop a via
  const rest = pins.filter((p) => !p.done).sort((p, q) => p.id * 7919 % 131 - q.id * 7919 % 131);
  for (const p of rest) {
    if (p.done) continue;
    const near = rest
      .filter((q) => !q.done && q.part !== p.part && Math.abs(q.x - p.x) + Math.abs(q.y - p.y) < 34)
      .sort((m, n) => Math.hypot(m.x - p.x, m.y - p.y) - Math.hypot(n.x - p.x, n.y - p.y));
    if (!near.slice(0, 3).some((q) => route(p, q))) stub(p);
  }
  // stitching vias in whatever open board is left
  for (let y = 2; y < H - 2; y++)
    for (let x = 2; x < W - 2; x++) {
      if (rnd() > 0.014) continue;
      let open = true;
      for (let j = -2; j <= 2 && open; j++) for (let i = -2; i <= 2; i++) if (occ[idx(x + i, y + j)] !== 0 || clip[idx(x + i, y + j)]) open = false;
      if (!open) continue;
      via(x, y);
      block(x - 1, y - 1, 3, 3);
    }

  // ---- render ------------------------------------------------------------
  const order = ["sk", "vh", "sk2", "ld", "sf", "bf", "tm", "lit", "dot", "h", "f", "i"];
  const paths = (o) => o.filter((k) => B[k]).map((k) => `<path class="${k}" d="${B[k]}"/>`).join("");
  const copper = `<use href="#pcb-tr" class="co"/><use href="#pcb-pad" class="po"/><use href="#pcb-tr" class="ci"/><use href="#pcb-pad" class="pi"/>`;
  const pulses = routed
    .filter((p) => p.length > 26)
    .sort((a, b) => b.length - a.length)
    .slice(0, 10)
    .map((p, i) => {
      const d = poly(p.map(([x, y]) => [cx(x), cx(y)]));
      const dur = f(7 + (i % 4) * 1.7);
      const begin = f(i * 1.3);
      return `<circle r="3.2" opacity="0"><animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;.45;1" calcMode="linear" path="${d}"/><animate attributeName="opacity" dur="${dur}s" begin="${begin}s" repeatCount="indefinite" values="0;1;1;0;0" keyTimes="0;.04;.41;.45;1"/></circle>`;
    })
    .join("");
  const attrs = `viewBox="0 0 ${W * G} ${H * G}" preserveAspectRatio="xMinYMid slice" aria-hidden="true"`;
  const base =
    `<svg class="pcb" ${attrs}><defs><path id="pcb-tr" d="${B.tr}"/><path id="pcb-pad" d="${B.pad}"/></defs>` +
    `<g filter="url(#ink-hero)">${paths(["sk"])}${copper}${paths(order.slice(1))}${labels}</g>` +
    `<g class="pulse">${pulses}</g></svg>`;
  const washes = Object.entries(wash).map(([k, d]) => `<path class="${k}" d="${d}"/>`).join("");
  const washSvg = `<svg class="pcb-wash" ${attrs}><rect class="wboard" width="${W * G}" height="${H * G}"/><use href="#pcb-tr" class="wcu"/><use href="#pcb-pad" class="wcupad"/>${washes}</svg>`;
  return base + washSvg;
}
