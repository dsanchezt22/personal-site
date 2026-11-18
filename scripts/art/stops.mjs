// One drawing per stop on the experience circuit, revealed when the stop opens.
import { reseed, poly, line, rect, ell, rectPts, ellPts, hatch, curve, sheet, text, iso, tube, xf, rr, scribble, svg, box } from "./kit.mjs";

const W = 240;
const H = 140;
const on = (T, pts) => pts.map(([x, y]) => T(x, y));
const leaf = (s, x, y, len, deg, tint = "wm") => {
  const L = xf(x, y, deg);
  const d = curve(on(L, [[0, 0], [len * 0.3, -len * 0.24], [len * 0.72, -len * 0.2], [len, 0], [len * 0.72, len * 0.2], [len * 0.3, len * 0.24]]), true);
  s.shape(d);
  s.wash(tint, d);
  s.hair(line(...L(1, 0), ...L(len - 1, 0)) + [0.3, 0.5, 0.7].map((t) => line(...L(len * t, 0), ...L(len * (t + 0.13), -len * 0.15)) + line(...L(len * t, 0), ...L(len * (t + 0.13), len * 0.15))).join(""));
};
const hops = (list) => list.map(([x, y, dx, dy]) => `<circle class="hop" cx="${x}" cy="${y}" r="2.4" style="--dx:${dx}px;--dy:${dy}px"/>`).join("");

// Verdnt Group: something growing out of a chip, with the tea it feeds beside it.
function verdnt() {
  reseed(211);
  const s = sheet();
  s.hair(hatch([[24, 128], [176, 128], [182, 134], [30, 134]], 0, 1.6));
  s.shape(rect(18, 92, 158, 36, 4), "b");
  s.wash("wm", rect(18, 92, 158, 36, 4));
  // traces spread from the chip like roots
  for (const [x, dir, drop, run] of [[76, -1, 8, 34], [82, -1, 16, 20], [90, -1, 22, 8], [104, 1, 22, 10], [112, 1, 14, 26], [118, 1, 7, 40]]) {
    const end = [x + dir * (drop + run), 106 + drop];
    s.fine(poly([[x, 106], [x + dir * drop, 106 + drop], end]) + ell(end[0], end[1], 2));
  }
  for (const [x, y] of [[26, 100], [168, 100], [26, 120], [168, 120]]) s.fine(ell(x, y, 2.2));
  s.fine(scribble(128, 100, 34));
  for (let k = 0; k < 6; k++) s.shape(rect(76 + k * 7.2, 78, 3.2, 6), "f").shape(rect(76 + k * 7.2, 104, 3.2, 6), "f");
  s.shape(rect(72, 83, 48, 22, 2), "b");
  s.wash("wl", rect(72, 83, 48, 22, 2));
  s.hair(hatch(rectPts(74, 85, 44, 18), 35, 3.6, 0.4));
  s.fine(ell(78, 100, 1.6));
  // the seedling
  s.bold(curve([[96, 84], [94, 66], [98, 46], [96, 26]]));
  leaf(s, 95, 70, 34, -158);
  leaf(s, 97, 58, 38, -24);
  leaf(s, 97, 42, 28, -150);
  leaf(s, 96, 28, 26, -52);
  leaf(s, 96, 26, 16, -108);
  // ranked bars on the left
  [[34, 30], [26, 40], [18, 50]].forEach(([len, y], k) => {
    s.shape(rect(22, y, len, 7), "f");
    s.wash(k ? "ws" : "wp", rect(22, y, len, 7));
  });
  s.fine(line(18, 26, 18, 62) + scribble(22, 66, 30));
  // a cup of milk tea
  const cx = 208;
  s.hair(hatch(ellPts(cx + 3, 130, 26, 4, 12), 4, 1.8));
  const cup = `M${cx - 22} 62L${cx + 22} 62L${cx + 15} 124Q${cx} 130 ${cx - 15} 124Z`;
  s.shape(poly(tube([cx + 12, 22], [cx + 4, 62], 6), true));
  s.wash("wr", poly(tube([cx + 12, 22], [cx + 4, 62], 6), true));
  s.shape(cup, "b");
  s.wash("wp", `M${cx - 20} 78L${cx + 20} 78L${cx + 15} 124Q${cx} 130 ${cx - 15} 124Z`);
  s.fine(ell(cx, 78, 19.5, 2.6) + line(cx - 21, 66, cx + 21, 66));
  for (const [x, y] of [[-9, 118], [0, 120], [9, 118], [-5, 110], [5, 110], [0, 101]]) {
    s.shape(ell(cx + x, y, 4.2), "f");
    s.hair(hatch(ellPts(cx + x, y, 4.2, 4.2, 10), 45, 1.4));
    s.wash("wg", ell(cx + x, y, 4.2));
  }
  s.shape(`M${cx - 25} 62Q${cx - 24} 46 ${cx} 45Q${cx + 24} 46 ${cx + 25} 62Z`);
  s.shape(rect(cx - 27, 60, 54, 5, 2.5));
  s.fine(curve([[122, 96], [150, 88], [176, 96], [186, 100]]) + poly([[182, 96], [187, 100], [181, 103]]));
  return svg("stop", W, H, s.done() + `<g class="live">${hops([[97, 80, 0, -20], [97, 56, 0, -18]])}</g>`);
}

// Robust Systems Group: a wafer, with one die pulled out to show its mesh.
function rsg() {
  reseed(223);
  const s = sheet();
  const wafer = ellPts(70, 76, 56, 46, 40);
  s.hair(hatch(ellPts(76, 84, 58, 47, 30), 30, 2.2, 0.3));
  s.shape(ell(70, 76, 56, 46), "b");
  s.wash("ws", ell(70, 76, 56, 46));
  s.fine(hatch(wafer, 0, 8.2, 0.02) + hatch(wafer, 90, 9.6, 0.02) + ell(70, 76, 52, 42.5));
  s.ink(line(52, 120, 88, 120));
  s.shape(rect(76, 62, 10, 8.4), "b");
  s.wash("wp", rect(76, 62, 10, 8.4));
  s.add("dash2", line(76, 62, 150, 22) + line(86, 70.4, 150, 100));
  // the die, enlarged
  s.hair(hatch([[154, 104], [232, 104], [236, 109], [158, 109]], 0, 1.5) + hatch([[228, 22], [233, 27], [233, 108], [228, 102]], 90, 1.5));
  s.shape(rect(150, 20, 78, 82, 3), "b");
  s.wash("wm", rect(150, 20, 78, 82, 3));
  const at = (i, j) => [164 + i * 25, 35 + j * 26];
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      const [x, y] = at(i, j);
      for (const o of [-3, 0, 3]) {
        if (i < 2) s.fine(line(x + 8, y + o, x + 17, y + o));
        if (j < 2) s.fine(line(x + o, y + 8, x + o, y + 18));
      }
    }
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      const [x, y] = at(i, j);
      const centre = i === 1 && j === 1;
      s.shape(rect(x - 8, y - 8, 16, 16, 2));
      s.wash(centre ? "wl" : "ws", rect(x - 8, y - 8, 16, 16, 2));
      s.hair(centre ? hatch(rectPts(x - 6, y - 6, 12, 12), 45, 2.4) : line(x - 5, y - 2.5, x + 5, y - 2.5) + line(x - 5, y + 2.5, x + 5, y + 2.5) + line(x, y - 5, x, y + 5));
    }
  for (let k = 0; k < 9; k++) s.fine(ell(156 + k * 8.2, 24.5, 1.2) + ell(156 + k * 8.2, 97.5, 1.2));
  s.raw(text(189, 120, "mesh", "t mid"));
  s.fine(scribble(166, 128, 46) + scribble(18, 18, 44) + line(14, 24, 60, 24));
  const live = hops([[at(0, 0)[0] + 8, at(0, 0)[1], 9, 0], [at(1, 0)[0], at(1, 0)[1] + 8, 0, 10], [at(1, 2)[0] + 8, at(1, 2)[1], 9, 0], [at(2, 1)[0], at(2, 1)[1] + 8, 0, 10]]);
  return svg("stop", W, H, s.done() + `<g class="live">${live}</g>`);
}

// Amazon Lab126: two arms passing a block, and the notes they work from.
function lab126() {
  reseed(227);
  const s = sheet();
  s.ink(line(8, 122, 232, 122));
  s.hair(hatch([[10, 124], [230, 124], [224, 132], [16, 132]], 0, 2, 0.4));
  // knowledge cards under a magnifier
  for (const [x, y, a, tint] of [[98, 96, -8, "wy"], [108, 94, 6, "wx"], [118, 98, -3, "wx"]]) {
    const C = xf(x, y, a);
    s.shape(poly(on(C, rr(0, 0, 40, 24, 2)), true), "f");
    s.wash(tint, poly(on(C, rr(0, 0, 40, 24, 2)), true));
    s.hair(scribble(4, 6, 28, C) + scribble(4, 12, 22, C) + scribble(4, 18, 30, C));
  }
  s.shape(ell(150, 104, 9));
  s.wash("ws", ell(150, 104, 9));
  s.bold(line(156.5, 110.5, 166, 120));
  const arm = (T, tint) => {
    const P = (x, y) => T(x, y);
    s.shape(poly(on(T, rr(-16, 104, 34, 18, 3)), true), "b");
    s.wash("wg", poly(on(T, rr(-16, 104, 34, 18, 3)), true));
    s.hair(hatch(on(T, rectPts(-14, 106, 30, 14)), 60, 3));
    s.shape(poly(tube(P(0, 104), P(18, 56), 11), true));
    s.wash(tint, poly(tube(P(0, 104), P(18, 56), 11), true));
    s.hair(line(...P(2, 98), ...P(17, 60)));
    s.shape(poly(tube(P(18, 56), P(62, 44), 8.5), true));
    s.wash(tint, poly(tube(P(18, 56), P(62, 44), 8.5), true));
    s.hair(line(...P(22, 53), ...P(58, 43)));
    s.shape(ell(...P(0, 104), 7)).fine(ell(...P(0, 104), 3));
    s.shape(ell(...P(18, 56), 8)).fine(ell(...P(18, 56), 3.5));
    s.shape(ell(...P(62, 44), 5.5)).fine(ell(...P(62, 44), 2));
    s.shape(poly(on(T, [[64, 39], [70, 38], [70, 50], [64, 49]]), true), "f");
    s.bold(poly(on(T, [[70, 40], [80, 38], [84, 41]])) + poly(on(T, [[70, 48], [80, 50], [84, 47]])));
    s.fine(curve(on(T, [[8, 44], [18, 40], [28, 44]])) + curve(on(T, [[-12, 96], [-14, 88], [-10, 80]])));
  };
  arm(xf(36, 0), "wy");
  arm(xf(204, 0, 0, -1), "ws");
  // the block between the grippers
  s.shape(rect(111, 34, 18, 18, 2), "b");
  s.wash("wr", rect(111, 34, 18, 18, 2));
  s.hair(hatch(rectPts(113, 36, 14, 14), 45, 3));
  s.fine(line(120, 12, 120, 26) + poly([[117, 22], [120, 27], [123, 22]]) + scribble(96, 8, 48));
  const arcs = `<path class="arc" style="--i:0" d="M52 34q8 -6 18 -4"/><path class="arc" style="--i:1" d="M188 34q-8 -6 -18 -4"/><path class="arc" style="--i:2" d="M104 28q-4 6 -2 14"/><path class="arc" style="--i:3" d="M136 28q4 6 2 14"/>`;
  return svg("stop", W, H, s.done() + `<g class="live">${arcs}</g>`);
}

// Code Four: a badge, and outreach leaving on its own.
function codefour() {
  reseed(229);
  const s = sheet();
  const shield = "M66 14L104 27V66Q104 104 66 126Q28 104 28 66V27Z";
  s.hair(hatch([[72, 22], [110, 34], [110, 72], [100, 104], [72, 132], [86, 100]], 55, 2.4, 0.3));
  s.shape(shield, "b");
  s.wash("wb", shield);
  s.fine("M66 21L98 32V66Q98 99 66 118Q34 99 34 66V32Z");
  s.hair(hatch([[66, 22], [97, 33], [97, 66], [88, 96], [66, 116]], 60, 3.4, 0.4));
  const star = ellPts(66, 60, 1, 1, 10, -Math.PI / 2, Math.PI * 1.5).map(([x, y], i) => [66 + (x - 66) * (i % 2 ? 9 : 22), 60 + (y - 60) * (i % 2 ? 9 : 22)]);
  s.shape(poly(star, true));
  s.wash("wy", poly(star, true));
  s.fine(ell(66, 60, 4));
  const band = "M30 86Q66 100 102 86V99Q66 113 30 99Z";
  s.shape(band);
  s.wash("wx", band);
  s.fine(scribble(46, 99, 40));
  // outreach: a gear turning out envelopes
  s.add("dash2", curve([[112, 104], [140, 64], [176, 42], [226, 30]]));
  const gear = ellPts(132, 108, 1, 1, 16).map(([x, y], i) => [132 + (x - 132) * (i % 2 ? 11 : 15), 108 + (y - 108) * (i % 2 ? 11 : 15)]);
  s.shape(poly(gear, true));
  s.wash("wg", poly(gear, true));
  s.fine(ell(132, 108, 6) + ell(132, 108, 2));
  for (const [x, y, a, w] of [[144, 62, -30, 26], [176, 38, -18, 28], [206, 22, -10, 24], [182, 84, 8, 30], [208, 100, 14, 26]]) {
    const E = xf(x, y, a);
    s.shape(poly(on(E, rr(0, 0, w, w * 0.64, 1.5)), true));
    s.wash("wy", poly(on(E, rr(0, 0, w, w * 0.64, 1.5)), true));
    s.fine(poly(on(E, [[1, 1], [w / 2, w * 0.36], [w - 1, 1]])));
    s.hair(line(...E(-9, 4), ...E(-3, 4)) + line(...E(-11, 9), ...E(-3, 9)));
  }
  s.raw(text(216, 132, "520+", "t mid big"));
  s.fine(line(198, 136, 234, 136));
  return svg("stop", W, H, s.done() + `<g class="live">${hops([[116, 98, 22, -32], [150, 56, 28, -16]])}</g>`);
}

// Duke: stacked thin films, a lattice, and a watched network.
function duke() {
  reseed(233);
  const s = sheet();
  const P = iso(66, 46, 0.86);
  s.hair(hatch([P(-4, 74, -22), P(78, 74, -22), P(84, 66, -22), P(96, 80, -22), P(8, 90, -22)], 8, 2.6, 0.4));
  box(s, P, 0, 0, -22, 72, 72, 12, { tint: "wg", g: 2.8 });
  box(s, P, 4, 4, -10, 64, 64, 5, { tint: "wl" });
  box(s, P, 10, 10, -5, 52, 52, 4, { tint: "wp" });
  box(s, P, 18, 18, -1, 36, 36, 3, { tint: "wm" });
  for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) s.fine(ell(...P(23 + a * 8.6, 23 + b * 8.6, 2), 1.5, 0.9));
  s.fine(line(40, 6, 62, 30) + poly([[56, 28], [62.5, 30.5], [61, 24]]) + line(34, 12, 46, 25) + line(48, 2, 68, 24));
  s.fine(scribble(8, 132, 60));
  // honeycomb lattice
  const hex = (cx, cy, r) => ellPts(cx, cy, r, r, 6, Math.PI / 6, Math.PI * 2 + Math.PI / 6);
  for (let row = 0; row < 3; row++)
    for (let col = 0; col < 4 - (row % 2); col++) {
      const cx = 150 + col * 19 + (row % 2) * 9.5;
      const cy = 22 + row * 16.4;
      const pts = hex(cx, cy, 10.9);
      s.shape(poly(pts, true), "f");
      s.wash(row === 1 && col === 1 ? "wy" : "ws", poly(pts, true));
      for (const [x, y] of pts) s.shape(ell(x, y, 1.9), "f");
    }
  // a small network with one node flagged, behind a shield
  const nodes = [[132, 100], [158, 84], [162, 118], [190, 126], [224, 112], [222, 84]];
  for (const [a, b] of [[0, 1], [0, 2], [1, 2], [2, 3], [3, 4], [4, 5], [1, 5]]) s.fine(line(...nodes[a], ...nodes[b]));
  nodes.forEach(([x, y], k) => {
    s.shape(ell(x, y, 5.5));
    s.wash(k === 3 ? "wr" : "wb", ell(x, y, 5.5));
    if (k === 3) s.fine(line(x - 2, y - 2, x + 2, y + 2) + line(x + 2, y - 2, x - 2, y + 2));
  });
  const shield = "M192 78L208 83V98Q208 110 192 117Q176 110 176 98V83Z";
  s.shape(shield, "b");
  s.wash("wm", shield);
  s.fine(ell(192, 94, 3.6) + poly([[190.5, 96], [189.5, 105], [194.5, 105], [193.5, 96]]));
  const live = hops([[132, 100, 26, -16], [162, 118, 28, 8], [224, 112, -2, -28]]);
  return svg("stop", W, H, s.done() + `<g class="live">${live}</g>`);
}

// Stanford: cap on the books, the degree, and a scrap of schematic.
function stanford() {
  reseed(239);
  const s = sheet();
  s.ink(line(10, 126, 230, 126));
  s.hair(hatch([[14, 128], [226, 128], [220, 135], [20, 135]], 0, 2, 0.4));
  // books
  for (const [x, y, w, h, tint] of [[24, 106, 104, 20, "wb"], [32, 88, 92, 18, "wy"], [28, 72, 98, 16, "wm"]]) {
    s.shape(rect(x, y, w, h, 2), "b");
    s.wash(tint, rect(x, y, w, h, 2));
    s.fine(line(x + 10, y, x + 10, y + h) + line(x + 14, y, x + 14, y + h) + rect(x + w - 16, y + 3, 14, h - 6, 1));
    s.hair(hatch(rectPts(x + w - 15, y + 4, 12, h - 8), 0, 2.2) + scribble(x + 22, y + h / 2, w * 0.4));
  }
  // cap
  s.shape("M52 46V60Q78 72 104 60V46Z");
  s.hair(hatch([[53, 50], [103, 50], [103, 59], [78, 68], [53, 59]], 90, 2.4, 0.3));
  const top = poly([[78, 22], [130, 40], [78, 58], [26, 40]], true);
  s.shape(top, "b");
  s.wash("wr", top);
  s.hair(hatch([[78, 26], [122, 40], [78, 54]], 20, 3, 0.4));
  s.shape(ell(78, 40, 3), "f");
  s.ink(curve([[78, 40], [106, 46], [118, 52], [120, 70]]));
  s.shape(rect(117, 70, 6, 5, 1), "f");
  s.fine(line(118, 75, 116.5, 90) + line(120, 75, 120, 91) + line(122, 75, 123.5, 90));
  // diploma
  const D = xf(150, 78, -8);
  s.hair(hatch(on(D, rectPts(4, 6, 78, 30)), 30, 2.2));
  s.shape(poly(on(D, rr(0, 0, 76, 30, 2)), true), "b");
  s.wash("wy", poly(on(D, rr(0, 0, 76, 30, 2)), true));
  s.shape(ell(...D(0, 15), 4, 15)).shape(ell(...D(76, 15), 4, 15));
  s.fine(ell(...D(76, 15), 1.6, 9) + scribble(10, 9, 50, D) + scribble(14, 15, 42, D) + scribble(10, 21, 30, D));
  const [bx, by] = D(38, 30);
  s.shape(poly([[bx - 5, by + 2], [bx - 9, by + 22], [bx - 2, by + 17], [bx + 3, by + 23], [bx + 5, by + 2]], true));
  s.wash("wr", poly([[bx - 5, by + 2], [bx - 9, by + 22], [bx - 2, by + 17], [bx + 3, by + 23], [bx + 5, by + 2]], true));
  s.shape(ell(bx, by + 2, 7.5));
  s.wash("wr", ell(bx, by + 2, 7.5));
  s.fine(ell(bx, by + 2, 4.5));
  // a scrap of schematic
  const y = 30;
  s.fine(line(150, y, 160, y) + poly([[160, y], [162.5, y - 5], [167.5, y + 5], [172.5, y - 5], [177.5, y + 5], [182.5, y - 5], [185, y]]) + line(185, y, 196, y) + line(196, y - 7, 196, y + 7) + line(200, y - 7, 200, y + 7) + line(200, y, 214, y) + line(214, y, 214, y + 10) + line(208, y + 10, 220, y + 10) + line(210.5, y + 13, 217.5, y + 13) + line(213, y + 16, 215, y + 16) + ell(150, y, 1.8));
  s.raw(text(184, 16, "B.S. EE · 2029", "t mid"));
  return svg("stop", W, H, s.done());
}

export const stops = {
  "stop-verdnt": verdnt(),
  "stop-memory": rsg(),
  "stop-robot": lab126(),
  "stop-badge": codefour(),
  "stop-films": duke(),
  "stop-cap": stanford(),
};
