// Project drawings, second half: software and applied AI.
import { reseed, R, f, poly, line, rect, ell, rectPts, ellPts, hatch, curve, sheet, text, iso, tube, xf, rr, scribble, svg, box } from "./kit.mjs";

const W = 480;
const H = 270;
const on = (T, pts) => pts.map(([x, y]) => T(x, y));
const arrow = (x1, y1, x2, y2, h = 4) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  return line(x1, y1, x2, y2) + poly([[x2 - h * Math.cos(a - 0.5), y2 - h * Math.sin(a - 0.5)], [x2, y2], [x2 - h * Math.cos(a + 0.5), y2 - h * Math.sin(a + 0.5)]]);
};

// FStea AI: nine signal collectors feed a cup of milk tea; ranked trends and a
// product concept come out the other side.
function fstea() {
  reseed(83);
  const s = sheet();
  // collectors
  const glyphs = [
    (x, y) => rect(x - 7, y - 6, 14, 10, 3) + poly([[x - 3, y + 4], [x - 4, y + 8], [x + 1, y + 4]]) + line(x - 3.5, y - 1, x + 3.5, y - 1),
    (x, y) => poly([[x - 8, y - 6], [x - 5, y - 6], [x - 3, y + 3], [x + 6, y + 3], [x + 7.5, y - 3], [x - 4.3, y - 3]]) + ell(x - 2, y + 6, 1.5) + ell(x + 5, y + 6, 1.5),
    (x, y) => poly([[x - 7, y - 1], [x, y - 8], [x + 7, y - 8], [x + 7, y - 1], [x, y + 7]], true) + ell(x + 3.6, y - 4.4, 1.5),
    (x, y) => ell(x - 1.5, y - 1.5, 5.5) + line(x + 2.5, y + 2.5, x + 7.5, y + 7.5),
    (x, y) => rect(x - 7, y - 6, 14, 13, 2) + line(x - 7, y - 2, x + 7, y - 2) + line(x - 3, y - 8.5, x - 3, y - 4.5) + line(x + 3, y - 8.5, x + 3, y - 4.5) + line(x - 3, y + 2.5, x + 3, y + 2.5),
    (x, y) => line(x - 3.5, y - 7.5, x - 5, y + 7.5) + line(x + 4, y - 7.5, x + 2.5, y + 7.5) + line(x - 8, y - 2.5, x + 8, y - 2.5) + line(x - 8.5, y + 3, x + 7.5, y + 3),
    (x, y) => poly(ellPts(x, y, 1, 1, 10).map(([px, py], i) => [x + (px - x) * (i % 2 ? 3.6 : 8.5), y + (py - y) * (i % 2 ? 3.6 : 8.5)]), true),
    (x, y) => poly([[x - 8, y - 2], [x - 6, y - 7], [x + 6, y - 7], [x + 8, y - 2]], true) + rect(x - 6.5, y - 2, 13, 9) + rect(x - 2, y + 1.6, 4, 5.4),
    (x, y) => ell(x, y, 4) + ellPts(x, y, 1, 1, 8).map(([px, py]) => line(x + (px - x) * 6, y + (py - y) * 6, x + (px - x) * 8.5, y + (py - y) * 8.5)).join(""),
  ];
  const tints = ["ws", "wp", "wy", "wl", "wm", "wr", "wy", "ws", "wp"];
  const flows = [];
  glyphs.forEach((g, k) => {
    const x = 30 + 38 * (k % 3) + (k > 5 ? 6 : k > 2 ? 3 : 0);
    const y = 60 + 46 * Math.floor(k / 3);
    const path = [[x + 15, y], [128 + (k % 3) * 8, y + (150 - y) * 0.3], [158, 146 + (y - 150) * 0.12], [186, 144 + (y - 150) * 0.05]];
    if (k % 3 === 2) flows.push(path);
    s.fine(curve(path));
    s.shape(ell(x, y, 15));
    s.wash(tints[k], ell(x, y, 15));
    s.fine(g(x, y));
  });
  for (let k = 0; k < 9; k++) if (k % 3 < 2) s.fine(line(46 + 38 * (k % 3) + (k > 5 ? 6 : k > 2 ? 3 : 0), 60 + 46 * Math.floor(k / 3), 52 + 38 * (k % 3) + (k > 5 ? 6 : k > 2 ? 3 : 0), 60 + 46 * Math.floor(k / 3)));
  s.ink(poly([[183, 139], [190, 144], [183, 149]]));
  s.fine(scribble(18, 30, 96) + scribble(18, 206, 70));
  // the cup
  const cx = 244;
  const top = 76;
  const bot = 230;
  const hw = (y) => 46 - (14 * (y - top)) / (bot - top);
  s.hair(hatch(ellPts(cx + 6, bot + 6, 52, 7, 16), 4, 2, 0.3));
  const cup = `M${cx - 46} ${top}L${cx + 46} ${top}L${cx + 32} ${bot - 4}Q${cx + 31} ${bot + 3} ${cx + 24} ${bot + 3}L${cx - 24} ${bot + 3}Q${cx - 31} ${bot + 3} ${cx - 32} ${bot - 4}Z`;
  s.shape(cup, "b");
  const tea = `M${f(cx - hw(98))} 98L${f(cx + hw(98))} 98L${cx + 32} ${bot - 4}Q${cx + 31} ${bot + 3} ${cx + 24} ${bot + 3}L${cx - 24} ${bot + 3}Q${cx - 31} ${bot + 3} ${cx - 32} ${bot - 4}Z`;
  s.wash("wp", tea);
  s.fine(ell(cx, 98, hw(98) - 1, 4) + line(cx - 44, 82, cx + 44, 82));
  s.hair(line(cx - 39, 104, cx - 31, 200) + line(cx - 35, 110, cx - 30, 170) + line(cx + 36, 120, cx + 31, 190));
  // straw seen through the cup
  const sx = (y) => 272 - 0.18 * (y - 12);
  s.hair(line(sx(46) - 5.5, 46, sx(212) - 5.5, 212) + line(sx(46) + 5.5, 46, sx(212) + 5.5, 212));
  // ice
  for (const [x, y, a] of [[222, 112, 14], [250, 116, -20], [236, 128, 38]]) {
    const I = xf(x, y, a);
    s.shape(poly(on(I, rr(-8, -8, 16, 16, 3)), true), "f");
    s.hair(line(...I(-4, -4), ...I(2, -4)) + line(...I(-4, -4), ...I(-4, 2)));
    s.wash("ws", poly(on(I, rr(-8, -8, 16, 16, 3)), true));
  }
  // pearls
  for (const [y, n] of [[222, 5], [211, 6], [200, 5], [190, 4]])
    for (let k = 0; k < n; k++) {
      const x = cx + (k - (n - 1) / 2) * 11.6 + R(-1.5, 1.5);
      const py = y + R(-1.5, 1.5);
      s.shape(ell(x, py, 5.6), "f");
      s.hair(hatch(ellPts(x, py, 5.6, 5.6, 12), 45, 1.5, 0.2));
      s.wash("wg", ell(x, py, 5.6));
      s.fine(`M${f(x - 3)} ${f(py - 1.5)}q1 -2.4 3.4 -2.6`);
    }
  // leaf mark on the cup
  const leaf = (x, y, len, deg) => {
    const L = xf(x, y, deg);
    const d = curve(on(L, [[0, 0], [len * 0.3, -len * 0.22], [len * 0.7, -len * 0.2], [len, 0], [len * 0.7, len * 0.2], [len * 0.3, len * 0.22]]), true);
    s.shape(d, "f");
    s.wash("wm", d);
    s.hair(line(...L(1, 0), ...L(len - 1, 0)) + [0.3, 0.5, 0.7].map((t) => line(...L(len * t, 0), ...L(len * (t + 0.12), -len * 0.14)) + line(...L(len * t, 0), ...L(len * (t + 0.12), len * 0.14))).join(""));
  };
  s.shape(ell(cx, 150, 17), "f");
  leaf(cx - 9, 156, 22, -38);
  // drops of condensation
  for (const [x, y] of [[214, 138], [270, 150], [218, 176], [266, 184], [274, 120]]) s.fine(`M${x} ${y}q-2.6 4.6 0 6.2q2.6 -1.6 0 -6.2`);
  // lid and the straw above it
  const dome = `M${cx - 50} ${top}Q${cx - 48} ${top - 30} ${cx} ${top - 32}Q${cx + 48} ${top - 30} ${cx + 50} ${top}Z`;
  s.shape(dome);
  s.hair(curve([[cx - 40, top - 6], [cx - 34, top - 20], [cx - 16, top - 27]]) + line(sx(46) - 5.5, 46, sx(top) - 5.5, top) + line(sx(46) + 5.5, 46, sx(top) + 5.5, top));
  s.shape(rect(cx - 53, top - 3, 106, 8, 4));
  const straw = tube([272, 12], [sx(46), 46], 11);
  s.shape(poly(straw, true));
  s.wash("wr", poly(straw, true));
  for (let y = 16; y < 44; y += 7) s.fine(line(sx(y) - 5.5, y + 2, sx(y) + 5.5, y - 2));
  s.shape(ell(272, 12, 5.6, 2.2), "f");
  // a sprig of tea
  s.ink(curve([[142, 250], [164, 244], [186, 246], [204, 238]]));
  leaf(150, 249, 24, -150);
  leaf(164, 244, 26, -70);
  leaf(176, 246, 22, 60);
  leaf(190, 244, 24, -50);
  leaf(204, 238, 20, -10);
  // ranked trends
  const T = xf(316, 22, 3);
  s.hair(hatch(on(T, rectPts(4, 5, 142, 126)), 40, 2.4, 0.3));
  s.shape(poly(on(T, rr(0, 0, 142, 126, 2)), true), "b");
  s.ink(scribble(12, 14, 74, T));
  s.shape(ell(...T(71, 2), 4), "f");
  s.wash("wr", ell(...T(71, 2), 4));
  [104, 86, 66, 52, 34].forEach((len, k) => {
    const y = 32 + 19 * k;
    const [tx, ty] = T(10, y + 4);
    s.raw(text(tx, ty, String(k + 1), "t", ` transform="rotate(3 ${f(tx)} ${f(ty)})"`));
    s.shape(poly(on(T, rectPts(22, y - 5, len, 10)), true));
    s.hair(hatch(on(T, rectPts(22, y - 5, len, 10)), 50, 3, 0.3));
    s.wash(k ? "ws" : "wp", poly(on(T, rectPts(22, y - 5, len, 10)), true));
    const up = k !== 3;
    s.fine(arrow(...T(len + 30, y + (up ? 4 : -4)), ...T(len + 30, y + (up ? -4 : 4)), 3));
  });
  // product concept sheet
  const C = xf(330, 164, -4);
  s.hair(hatch(on(C, rectPts(4, 5, 132, 94)), 40, 2.4, 0.3));
  s.shape(poly(on(C, rr(0, 0, 132, 94, 2)), true), "b");
  const can = on(C, [[16, 22], [18, 16], [38, 16], [40, 22], [40, 76], [37, 82], [19, 82], [16, 76]]);
  s.shape(poly(can, true));
  s.wash("wy", poly(can, true));
  s.fine(line(...C(16, 22), ...C(40, 22)) + line(...C(16, 76), ...C(40, 76)) + poly(on(C, rectPts(19, 36, 18, 26)), true) + ell(...C(28, 16), 5, 1.4));
  s.wash("wm", poly(on(C, rectPts(19, 36, 18, 26)), true));
  s.hair(scribble(21, 44, 14, C) + scribble(21, 50, 12, C) + scribble(21, 56, 14, C));
  s.fine(line(...C(48, 16), ...C(48, 82)) + line(...C(45, 16), ...C(51, 16)) + line(...C(45, 82), ...C(51, 82)));
  s.ink(scribble(60, 18, 58, C));
  for (let k = 0; k < 5; k++) s.fine(ell(...C(62, 34 + 11 * k), 1.6) + scribble(68, 34 + 11 * k, R(34, 56), C));
  const live = flows.map((p, i) => `<circle class="flow" r="2.4" style="--i:${i};offset-path:path('${curve(p)}')"/>`).join("");
  return svg("fstea", W, H, s.done() + `<g class="live">${live}</g>`);
}

// Open-source contributions: a branch waiting on review, the two cmux pull
// requests, and Pi.
function opensource() {
  reseed(137);
  const s = sheet();
  // history: main, and a branch that has not merged yet
  s.bold(line(40, 22, 40, 250));
  const branch = curve([[40, 196], [52, 180], [80, 168], [84, 140], [84, 96]]);
  s.ink(branch);
  s.wash("sb", branch);
  s.add("dash2", curve([[84, 96], [84, 70], [64, 52], [40, 44]]));
  for (const y of [44, 96, 148, 196, 236]) s.shape(ell(40, y, 5.6));
  s.wash("wg", [44, 96, 148, 196, 236].map((y) => ell(40, y, 5.6)).join(""));
  for (const y of [96, 132]) {
    s.shape(ell(84, y, 5.6));
    s.wash("ws", ell(84, y, 5.6));
  }
  s.fine(scribble(8, 148, 22) + scribble(6, 236, 24) + scribble(94, 132, 12) + poly([[80, 76], [84, 68], [89, 76]]));
  s.raw(text(40, 264, "main", "t s mid"));
  // pull request cards
  const card = (T, turn, title, rows) => {
    const h = 50 + rows.length * 11;
    s.hair(hatch(on(T, rectPts(5, 6, 212, h)), 35, 2.4, 0.3));
    s.shape(poly(on(T, rr(0, 0, 212, h, 4)), true), "b");
    s.wash("wx", poly(on(T, rr(0, 0, 212, h, 4)), true));
    // pull-request glyph
    s.fine(ell(...T(16, 12), 3.4) + ell(...T(16, 30), 3.4) + line(...T(16, 15.4), ...T(16, 26.6)) + ell(...T(29, 30), 3.4) + curve(on(T, [[29, 26.6], [29, 18], [22, 13], [19.4, 12]])));
    const [tx, ty] = T(40, 20);
    s.raw(text(tx, ty, title, "t", ` transform="rotate(${turn} ${f(tx)} ${f(ty)})"`));
    const tag = poly(on(T, rr(160, 9, 42, 16, 7)), true);
    s.shape(tag, "f");
    s.wash("wm", tag);
    const [gx, gy] = T(181, 20.5);
    s.raw(text(gx, gy, "open", "t s mid", ` transform="rotate(${turn} ${f(gx)} ${f(gy)})"`));
    s.fine(scribble(40, 30, 96, T));
    s.hair(line(...T(8, 40), ...T(204, 40)));
    rows.forEach((add, k) => {
      const y = 52 + 11 * k;
      const row = poly(on(T, rectPts(8, y - 5, 196, 10)), true);
      if (add !== null) s.wash(add ? "wm" : "wr", row);
      if (add !== null) s.ink(line(...T(13, y), ...T(18, y)) + (add ? line(...T(15.5, y - 2.5), ...T(15.5, y + 2.5)) : ""));
      s.fine(scribble(26 + (k % 3) * 8, y, R(70, 150), T));
    });
  };
  card(xf(110, 20, -2), -2, "cmux #45837", [null, false, true, true, null, true]);
  card(xf(140, 150, 3), 3, "cmux #42241", [null, true, true, false, true]);
  s.fine(curve([[90, 100], [100, 92], [108, 84]]) + poly([[103, 84], [109, 83], [108, 89]]));
  // Pi
  const Pc = xf(352, 26, 4);
  s.hair(hatch(on(Pc, rectPts(5, 6, 104, 134)), 35, 2.4, 0.3));
  s.shape(poly(on(Pc, rr(0, 0, 104, 134, 4)), true), "b");
  s.wash("wx", poly(on(Pc, rr(0, 0, 104, 134, 4)), true));
  s.wash("wl", poly(on(Pc, rr(0, 0, 104, 52, 4)), true));
  s.fine(line(...Pc(0, 52), ...Pc(104, 52)));
  const [px, py] = Pc(52, 40);
  s.raw(text(px, py, "π", "t mid pi", ` transform="rotate(4 ${f(px)} ${f(py)})"`));
  const [qx, qy] = Pc(52, 72);
  s.raw(text(qx, qy, "Pi", "t mid", ` transform="rotate(4 ${f(qx)} ${f(qy)})"`));
  for (let k = 0; k < 2; k++) s.fine(scribble(14, 84 + 10 * k, R(54, 74), Pc));
  const who = poly(on(Pc, rr(12, 106, 80, 18, 8)), true);
  s.shape(who, "f");
  s.wash("wy", who);
  const [wx, wy] = Pc(52, 118.5);
  s.raw(text(wx, wy, "contributor", "t s mid", ` transform="rotate(4 ${f(wx)} ${f(wy)})"`));
  // terminal
  s.hair(hatch([[372, 256], [466, 256], [470, 261], [376, 261]], 0, 1.5));
  s.shape(rect(366, 192, 100, 64, 5), "b");
  s.wash("wg", rect(366, 192, 100, 14, 2));
  s.ink(line(366, 206, 466, 206) + poly([[374, 216], [379, 220], [374, 224]]) + poly([[374, 234], [379, 238], [374, 242]]));
  for (const [k, c] of ["wr", "wy", "wm"].entries()) s.shape(ell(375 + k * 9, 199, 2.8), "f").wash(c, ell(375 + k * 9, 199, 2.8));
  s.fine(scribble(385, 220, 64) + scribble(385, 229, 40));
  const live = `<path class="blink" d="${rect(385, 233.5, 6, 9)}"/><circle class="hop" cx="84" cy="96" r="2.6" style="--dx:-40px;--dy:-52px"/>`;
  return svg("opensource", W, H, s.done() + `<g class="live">${live}</g>`);
}

// Realization Engine: listing photos become a furnished dollhouse you can edit by
// describing a piece; the layout is checked as you go.
function realization() {
  reseed(149);
  const s = sheet();
  // the request
  s.shape(rect(150, 10, 316, 24, 6));
  s.ink(line(160, 22, 168, 22) + line(164, 18, 164, 26));
  s.raw(text(176, 25.5, "a 2.1 m navy sofa against the wall", "t s"));
  s.shape(rect(420, 13, 40, 18, 5));
  s.wash("wb", rect(420, 13, 40, 18, 5));
  s.raw(text(440, 25.5, "Place", "t s mid"));
  // listing photos
  const photo = (T, tint, scene) => {
    s.hair(hatch(on(T, rectPts(4, 5, 88, 66)), 35, 2.4, 0.3));
    s.shape(poly(on(T, rr(0, 0, 88, 66, 2)), true), "b");
    s.shape(poly(on(T, rectPts(5, 5, 78, 44)), true), "f");
    s.wash(tint, poly(on(T, rectPts(5, 5, 78, 44)), true));
    s.fine(scene(T) + scribble(8, 57, 50, T));
  };
  photo(xf(16, 50, -7), "ws", (T) => poly(on(T, [[22, 44], [22, 26], [44, 12], [66, 26], [66, 44]])) + poly(on(T, [[16, 30], [44, 10], [72, 30]])) + poly(on(T, rectPts(38, 32, 10, 12)), true) + poly(on(T, rectPts(52, 28, 9, 8)), true) + line(...T(5, 44), ...T(83, 44)));
  photo(xf(30, 112, 5), "wy", (T) => poly(on(T, [[5, 5], [26, 16], [26, 38], [5, 49]])) + poly(on(T, [[83, 5], [62, 16], [62, 38], [83, 49]])) + poly(on(T, rectPts(26, 16, 36, 22)), true) + poly(on(T, rectPts(36, 20, 16, 12)), true) + line(...T(44, 20), ...T(44, 32)) + poly(on(T, [[30, 44], [30, 38], [56, 38], [56, 44]])));
  photo(xf(14, 176, -3), "wp", (T) => line(...T(5, 34), ...T(83, 34)) + poly(on(T, rectPts(12, 34, 52, 14)), true) + line(...T(30, 34), ...T(30, 48)) + line(...T(46, 34), ...T(46, 48)) + line(...T(60, 5), ...T(60, 16)) + poly(on(T, [[54, 22], [60, 16], [66, 22]]), true) + poly(on(T, rectPts(14, 12, 22, 14)), true));
  s.bold(curve([[128, 130], [150, 118], [176, 124]]) + poly([[168, 117], [178, 125], [167, 130]]));
  // the dollhouse
  const P = iso(322, 96, 1.04);
  const quad = (x, y, w, d, z = 0) => [P(x, y, z), P(x + w, y, z), P(x + w, y + d, z), P(x, y + d, z)];
  s.hair(hatch([P(-10, 122, -6), P(158, 122, -6), P(166, 112, -6), P(178, 128, -6), P(4, 140, -6)], 8, 2.6, 0.4));
  box(s, P, -4, -4, -6, 158, 118, 6, { tint: "wg", g: 3 });
  s.wash("wy", poly(quad(0, 0, 78, 59), true)).wash("ws", poly(quad(0, 62, 78, 48), true)).wash("wp", poly(quad(81, 0, 69, 110), true));
  for (let y = 6; y < 58; y += 7) s.hair(line(...P(1, y), ...P(77, y)));
  for (let k = 1; k < 7; k++) s.hair(line(...P(81 + k * 10, 12), ...P(81 + k * 10, 110)));
  for (let k = 2; k < 11; k++) s.hair(line(...P(81, k * 10), ...P(150, k * 10)));
  // back walls with windows
  box(s, P, -4, -4, 0, 4, 118, 40, { tint: "wx", g: 6 });
  box(s, P, 0, -4, 0, 154, 4, 40, { tint: "wx", g: 6 });
  for (const w of [[P(18, 0, 14), P(46, 0, 14), P(46, 0, 30), P(18, 0, 30)], [P(100, 0, 16), P(128, 0, 16), P(128, 0, 30), P(100, 0, 30)], [P(0, 14, 14), P(0, 40, 14), P(0, 40, 30), P(0, 14, 30)], [P(0, 74, 14), P(0, 98, 14), P(0, 98, 30), P(0, 74, 30)]]) {
    s.shape(poly(w, true), "f");
    s.wash("ws", poly(w, true));
    s.hair(line(...w[0].map((v, i) => (v + w[1][i]) / 2), ...w[3].map((v, i) => (v + w[2][i]) / 2)));
  }
  // living room
  s.wash("wr", poly(quad(16, 26, 44, 24), true));
  s.fine(poly(quad(16, 26, 44, 24), true) + poly(quad(19, 29, 38, 18), true));
  box(s, P, 10, 3, 0, 40, 5, 15, { tint: "wb" });
  box(s, P, 10, 8, 0, 40, 11, 7, { tint: "wb" });
  s.add("dash2", poly(quad(6, 1, 48, 22), true));
  box(s, P, 28, 32, 0, 18, 10, 5, { tint: "wy" });
  box(s, P, 62, 4, 0, 8, 8, 9, { tint: "wp" });
  for (const a of [-2.3, -1.6, -0.9]) {
    const [bx, by] = P(66, 8, 9);
    s.fine(curve([[bx, by], [bx + Math.cos(a) * 8, by + Math.sin(a) * 10], [bx + Math.cos(a) * 12, by + Math.sin(a) * 18]]));
  }
  // wall between living room and kitchen, far part
  box(s, P, 78, 0, 0, 3, 38, 30, { tint: "wx", g: 6 });
  // kitchen and dining
  box(s, P, 84, 2, 0, 62, 10, 12, { tint: "wg" });
  s.fine(ell(...P(100, 7, 12), 6, 3) + ell(...P(128, 7, 12), 3.4, 1.8) + ell(...P(138, 7, 12), 3.4, 1.8));
  // wall between living room and bedroom
  box(s, P, 0, 59, 0, 30, 3, 30, { tint: "wx", g: 6 });
  box(s, P, 46, 59, 0, 32, 3, 30, { tint: "wx", g: 6 });
  // bedroom
  box(s, P, 8, 70, 0, 36, 32, 6, { tint: "wl" });
  box(s, P, 10, 73, 6, 9, 11, 3, { tint: "wx" });
  box(s, P, 10, 88, 6, 9, 11, 3, { tint: "wx" });
  s.fine(line(...P(24, 70, 6), ...P(24, 102, 6)));
  box(s, P, 60, 64, 0, 16, 10, 24, { tint: "wy" });
  box(s, P, 78, 56, 0, 3, 54, 30, { tint: "wx", g: 6 });
  // dining set
  for (const [x, y] of [[106, 50], [122, 50]]) box(s, P, x, y, 0, 8, 6, 7, { tint: "ws" });
  for (const [x, y] of [[104, 58], [132, 58], [104, 76], [132, 76]]) s.ink(line(...P(x, y, 0), ...P(x, y, 9)));
  box(s, P, 102, 56, 9, 32, 22, 2, { tint: "wy" });
  for (const [x, y] of [[106, 80], [122, 80]]) box(s, P, x, y, 0, 8, 6, 7, { tint: "ws" });
  // low front walls
  box(s, P, -4, 110, 0, 158, 4, 6, { tint: "wx" });
  box(s, P, 150, -4, 0, 4, 118, 6, { tint: "wx" });
  // room tags
  const tag = (tx, ty, [fx, fy], name, size) => {
    s.fine(line(tx, ty, fx, fy) + ell(fx, fy, 1.6));
    s.shape(rect(tx - 30, ty - (size ? 14 : 9), 60, size ? 24 : 16, 6), "f");
    s.raw(text(tx, ty - (size ? 4 : -2), name, "t s mid") + (size ? text(tx, ty + 5, size, "t xs mid") : ""));
  };
  tag(232, 64, P(34, 30, 0), "Living", "≈ 4.3 × 4.4 m");
  tag(438, 62, P(120, 34, 0), "Kitchen", "≈ 4.2 × 4.2 m");
  tag(212, 196, P(30, 100, 6), "Bed", null);
  // layout check
  s.shape(rect(150, 222, 112, 42, 4));
  s.ink(scribble(158, 231, 50));
  for (let k = 0; k < 2; k++) s.fine(poly([[158, 242 + 10 * k], [161, 245 + 10 * k], [167, 238 + 10 * k]]) + scribble(172, 242 + 10 * k, R(50, 76)));
  const [sx, sy] = P(30, 10, 16);
  const live = `<circle class="hop" cx="300" cy="36" r="2.6" style="--dx:${f(sx - 300)}px;--dy:${f(sy - 36)}px"/><path class="arc" style="--i:0" d="${poly(quad(6, 1, 48, 22), true)}"/>`;
  return svg("realization", W, H, s.done() + `<g class="live">${live}</g>`);
}

export const projectsB = { fstea: fstea(), opensource: opensource(), realization: realization() };
