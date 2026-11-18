// Project drawings, second half: software and applied AI.
import { reseed, R, f, poly, line, rect, ell, rectPts, ellPts, hatch, curve, sheet, text, tube, xf, rr, scribble, svg } from "./kit.mjs";

const W = 480;
const H = 270;
const on = (T, pts) => pts.map(([x, y]) => T(x, y));
// A wobbly closed outline around a centre: rice, clouds, florets.
const blob = (cx, cy, rx, ry, n = 9, wob = 0.16) =>
  ellPts(cx, cy, 1, 1, n).map(([x, y]) => {
    const k = 1 + R(-wob, wob);
    return [cx + (x - cx) * rx * k, cy + (y - cy) * ry * k];
  });
const arrow = (x1, y1, x2, y2, h = 4) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  return line(x1, y1, x2, y2) + poly([[x2 - h * Math.cos(a - 0.5), y2 - h * Math.sin(a - 0.5)], [x2, y2], [x2 - h * Math.cos(a + 0.5), y2 - h * Math.sin(a + 0.5)]]);
};

// Course notebook: the agent loop sketched in a notebook, a terminal session,
// and the five tools of the MCP server plugged in underneath.
function developer() {
  reseed(71);
  const s = sheet();
  s.hair(line(6, 262, 150, 263) + line(160, 262, 474, 261));
  // notebook
  const N = xf(22, 74, -5);
  s.hair(hatch(on(N, rectPts(4, 6, 130, 166)), 30, 2.2, 0.3));
  s.shape(poly(on(N, rr(0, 0, 130, 166, 3)), true), "b");
  s.wash("wy", poly(on(N, rr(0, 0, 130, 166, 3)), true));
  for (let k = 0; k < 13; k++) s.hair(line(...N(16, 22 + 11 * k), ...N(124, 22 + 11 * k)));
  s.wash("sr", line(...N(27, 4), ...N(27, 162)));
  for (let k = 0; k < 14; k++) {
    s.shape(ell(...N(8, 12 + 11.4 * k), 2), "f");
    s.ink(`M${N(8, 12 + 11.4 * k).map(f).join(" ")}q-9 -4 -10 2`);
  }
  for (let k = 0; k < 3; k++) s.fine(scribble(32, 20 + 11 * k, R(54, 86), N));
  // the loop: prompt -> tool call -> context -> prompt
  const nodes = [[34, 62, "prompt"], [86, 62, "tool call"], [60, 100, "context"]];
  for (const [x, y, name] of nodes) {
    s.shape(poly(on(N, rr(x, y, 40, 17, 4)), true));
    const [tx, ty] = N(x + 20, y + 12);
    s.raw(text(tx, ty, name, "t s mid", ` transform="rotate(-5 ${f(tx)} ${f(ty)})"`));
  }
  s.wash("ws", poly(on(N, rr(34, 62, 40, 17, 4)), true)).wash("wl", poly(on(N, rr(86, 62, 40, 17, 4)), true)).wash("wm", poly(on(N, rr(60, 100, 40, 17, 4)), true));
  s.fine(arrow(...N(75, 70), ...N(85, 70)) + arrow(...N(108, 80), ...N(96, 99)) + arrow(...N(64, 99), ...N(52, 80)));
  s.fine(curve(on(N, [[44, 56], [60, 46], [96, 46], [112, 56]])) + arrow(...N(110, 54), ...N(113, 58), 3));
  for (let k = 0; k < 3; k++) s.fine(scribble(32, 131 + 11 * k, R(40, 84), N));
  s.ink(poly(on(N, [[100, 148], [106, 155], [120, 138]])));
  // pencil
  const P = xf(36, 252, -20);
  s.shape(poly(on(P, rr(0, -4.5, 100, 9, 1)), true));
  s.wash("wy", poly(on(P, rr(0, -4.5, 100, 9, 1)), true));
  s.hair(line(...P(0, -1.5), ...P(100, -1.5)) + line(...P(0, 1.5), ...P(100, 1.5)));
  s.shape(poly(on(P, [[0, -4.5], [-15, 0], [0, 4.5]]), true));
  s.add("solid", poly(on(P, [[-15, 0], [-9.5, -1.7], [-9.5, 1.7]]), true));
  s.shape(poly(on(P, rectPts(100, -4.5, 10, 9)), true), "f");
  s.hair(hatch(on(P, rectPts(100, -4.5, 10, 9)), 70, 2));
  s.shape(poly(on(P, rr(110, -4.5, 11, 9, 3)), true));
  s.wash("wr", poly(on(P, rr(110, -4.5, 11, 9, 3)), true));
  // terminal window
  s.hair(hatch([[176, 202], [460, 202], [465, 208], [181, 208]], 0, 1.5) + hatch([[460, 26], [465, 32], [465, 208], [460, 202]], 90, 1.5));
  s.shape(rect(172, 20, 288, 182, 6), "b");
  s.ink(line(172, 40, 460, 40));
  s.wash("wg", rect(172, 20, 288, 20, 2));
  for (const [k, c] of ["wr", "wy", "wm"].entries()) s.shape(ell(185 + k * 11, 30, 3.4), "f").wash(c, ell(185 + k * 11, 30, 3.4));
  s.fine(scribble(286, 30, 60));
  const prompt = (y, len) => s.ink(poly([[183, y - 3.5], [188, y], [183, y + 3.5]])).fine(scribble(195, y, len));
  const tool = (y, tint, len) => {
    s.shape(rect(195, y - 7, 250, 27, 3), "f");
    s.wash(tint, rect(195, y - 7, 250, 27, 3));
    s.shape(rect(201, y - 3, 34, 9, 2), "f");
    s.fine(scribble(205, y + 1.5, 26) + scribble(242, y + 1.5, len) + poly([[424, y + 6], [429, y + 11], [438, y - 1]]));
    s.hair(scribble(205, y + 13, len + 60));
  };
  prompt(53, 150);
  s.hair(scribble(195, 64, 210));
  tool(81, "ws", 110);
  s.hair(scribble(195, 110, 170));
  tool(127, "wl", 90);
  prompt(160, 96);
  for (const y of [171, 182]) s.fine(poly([[196, y - 1], [199, y + 2], [205, y - 4]]) + scribble(211, y, y === 171 ? 150 : 104));
  s.ink(poly([[183, 189.5], [188, 193], [183, 196.5]]));
  // five tools, each a plug wired into the session
  const icons = [
    (x, y) => poly([[x, y - 8], [x + 8, y + 6], [x - 8, y + 6]], true) + line(x - 4, y - 1, x + 4, y - 1),
    (x, y) => ell(x, y, 7.5) + ell(x, y, 4.5) + line(x - 1.5, y, x + 1.5, y),
    (x, y) => rect(x - 7.5, y - 6.5, 15, 13) + line(x - 7.5, y - 2, x + 7.5, y - 2) + line(x - 7.5, y + 2.4, x + 7.5, y + 2.4) + line(x - 2.5, y - 6.5, x - 2.5, y + 6.5) + line(x + 2.5, y - 6.5, x + 2.5, y + 6.5),
    (x, y) => ell(x - 4.5, y, 3.6) + line(x - 0.9, y, x + 8, y) + line(x + 4.5, y, x + 4.5, y + 3.4) + line(x + 7.4, y, x + 7.4, y + 3.4),
    (x, y) => curve([[x - 8.5, y], [x - 4, y - 5], [x + 4, y - 5], [x + 8.5, y], [x + 4, y + 5], [x - 4, y + 5]], true) + ell(x, y, 2.6),
  ];
  ["wy", "wp", "wm", "wl", "ws"].forEach((tint, k) => {
    const x = 206 + k * 55;
    const cable = curve([[x + (k - 2) * -9, 202], [x + (k - 2) * -5, 214], [x, 219], [x, 226]]);
    s.raw("").add("wo", cable).raw("").add("wi", cable);
    s.shape(rect(x - 5, 222, 10, 7, 1), "f");
    s.shape(rect(x - 15, 228, 30, 28, 5));
    s.wash(tint, rect(x - 15, 228, 30, 28, 5));
    s.fine(icons[k](x, 242));
  });
  s.fine(poly([[188, 258], [188, 262], [444, 262], [444, 258]]));
  s.raw(text(316, 269, "MCP", "t s mid"));
  const live = `<path class="blink" d="${rect(194, 188, 7, 10)}"/>`;
  return svg("developer", W, H, s.done() + `<g class="live">${live}</g>`);
}

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

// A better winery day: vineyard rows running to a hillside winery, with a
// bottle, a glass and grapes on a barrel in front.
function winery() {
  reseed(97);
  const s = sheet();
  // sky
  s.shape(ell(404, 46, 15));
  s.wash("wy", ell(404, 46, 15));
  const cloud = (x, y, w) => {
    const d = curve([[x, y], [x + w * 0.12, y - 9], [x + w * 0.3, y - 8], [x + w * 0.42, y - 16], [x + w * 0.62, y - 13], [x + w * 0.74, y - 6], [x + w * 0.92, y - 7], [x + w, y]]) + `L${x} ${y}`;
    s.fine(d);
    s.hair(line(x + w * 0.1, y + 4, x + w * 0.8, y + 4) + line(x + w * 0.25, y + 8, x + w * 0.6, y + 8));
  };
  cloud(60, 44, 86);
  cloud(214, 30, 64);
  s.fine("M300 52q4 -5 8 0q4 -5 8 0M330 40q3 -4 6 0q3 -4 6 0");
  // far hills
  const far = [[0, 110], [56, 94], [126, 104], [196, 86], [262, 98], [300, 92]];
  const near = [[250, 104], [300, 96], [352, 104], [420, 96], [480, 104]];
  s.fine(curve(far));
  s.hair(hatch([[150, 96], [196, 86], [262, 98], [220, 108]], 65, 3, 0.4) + hatch([[20, 104], [56, 94], [110, 102], [70, 112]], 65, 3, 0.4));
  s.wash("wm", curve(far) + "L300 124L0 124Z");
  // the winery
  const cypress = (x, base, h) => {
    const d = curve([[x, base], [x - h * 0.13, base - h * 0.4], [x, base - h], [x + h * 0.13, base - h * 0.4]], true);
    s.shape(d);
    s.wash("wm", d);
    const zig = [];
    for (let k = 1; k < 9; k++) zig.push([x + (k % 2 ? -1 : 1) * h * 0.07 * (1 - k / 10), base - (h * k) / 9.5]);
    s.hair(poly(zig));
    s.fine(line(x, base, x, base + 4));
  };
  cypress(268, 118, 34);
  cypress(280, 118, 46);
  s.shape(rect(292, 96, 28, 22));
  s.wash("wp", rect(292, 96, 28, 22));
  s.shape(poly([[288, 96], [306, 85], [322, 96]], true));
  s.wash("wr", poly([[288, 96], [306, 85], [322, 96]], true));
  s.fine(rect(300, 102, 7, 9) + line(303.5, 102, 303.5, 111));
  s.shape(rect(388, 66, 18, 52));
  s.wash("wp", rect(388, 66, 18, 52));
  s.shape(poly([[384, 66], [397, 48], [410, 66]], true));
  s.wash("wr", poly([[384, 66], [397, 48], [410, 66]], true));
  s.hair(hatch([[386, 65], [397, 50], [408, 65]], 0, 2.6));
  s.fine(rect(394, 74, 6, 10, 3) + rect(394, 94, 6, 10, 3) + line(397, 48, 397, 38) + poly([[397, 38], [406, 41], [397, 44]], true));
  s.shape(rect(318, 82, 70, 36));
  s.wash("wp", rect(318, 82, 70, 36));
  s.shape(poly([[312, 82], [353, 58], [394, 82]], true));
  s.wash("wr", poly([[312, 82], [353, 58], [394, 82]], true));
  s.hair(hatch([[316, 81], [353, 60], [390, 81]], 0, 2.8, 0.2));
  s.ink("M346 118V101a7 7 0 0 1 14 0V118");
  s.hair(hatch([[347, 118], [347, 102], [353, 96], [359, 102], [359, 118]], 90, 2.4));
  s.fine(ell(353, 72, 4.5) + line(353, 67.5, 353, 76.5) + line(348.5, 72, 357.5, 72));
  for (const x of [324, 334, 366, 376]) s.fine(rect(x, 94, 7, 11) + line(x + 3.5, 94, x + 3.5, 105) + line(x, 99.5, x + 7, 99.5));
  s.hair(hatch(rectPts(319, 108, 24, 9), 0, 3, 0.5) + hatch(rectPts(363, 108, 24, 9), 0, 3, 0.5));
  cypress(416, 118, 52);
  cypress(430, 118, 36);
  cypress(446, 118, 44);
  s.fine(curve(near));
  s.ink(curve([[236, 122], [300, 118], [360, 120], [420, 118], [480, 122]]));
  // vineyard
  s.wash("wy", "M0 122L480 122L480 270L0 270Z");
  const vp = [318, 118];
  for (const bx of [-240, -100, 20, 130, 240, 350, 470, 600, 760]) {
    const at = (t) => [vp[0] + (bx - vp[0]) * t, vp[1] + (270 - vp[1]) * t];
    s.fine(line(...at(0.05), ...at(1)));
    s.wash("sm", line(...at(0.05), ...at(1)));
    for (let t = 0.07; t < 1; t *= 1.24) {
      const [x, y] = at(t);
      const k = 3 + t * 22;
      s.fine(`M${f(x - k * 0.5)} ${f(y)}q${f(k * 0.1)} ${f(-k * 0.8)} ${f(k * 0.5)} ${f(-k * 0.55)}q${f(k * 0.4)} ${f(-k * 0.25)} ${f(k * 0.5)} ${f(k * 0.55)}` + line(x, y, x, y - k * 0.9));
      if (t > 0.3) s.hair(`M${f(x - k * 0.3)} ${f(y - k * 0.5)}q${f(k * 0.3)} ${f(-k * 0.5)} ${f(k * 0.6)} 0`);
    }
  }
  // barrel head, bottle, glass, grapes
  const staves = "M16 214Q8 250 20 272L188 272Q200 250 192 214Z";
  s.shape(staves, "b");
  s.wash("wp", staves);
  for (const x of [40, 66, 92, 118, 144, 168]) s.fine(curve([[x, 232], [x + (x - 104) * 0.04, 252], [x + (x - 104) * 0.02, 272]]));
  s.ink("M13 236Q104 262 195 236M12 246Q104 272 196 246");
  s.hair(hatch([[13, 236], [60, 247], [104, 250], [150, 247], [195, 236], [196, 246], [150, 257], [104, 260], [60, 257], [12, 246]], 80, 2.2, 0.3));
  s.shape(ell(104, 214, 88, 23), "b");
  s.wash("wp", ell(104, 214, 88, 23));
  s.fine(ell(104, 214, 80, 19.5));
  s.hair(hatch(ellPts(104, 214, 80, 19.5, 24), 6, 3.4, 0.4));
  s.fine(hatch(ellPts(104, 214, 80, 19.5, 24), 6, 12, 0.1));
  // bottle
  const bottle = "M54 208V132Q54 119 64 113V86H76V113Q86 119 86 132V208Q70 214 54 208Z";
  s.hair(hatch(ellPts(78, 212, 22, 5, 12), 4, 1.8));
  s.shape(bottle, "b");
  s.wash("wm", bottle);
  s.ink(line(62, 82, 78, 82) + line(64, 100, 76, 100));
  s.hair(hatch(rectPts(64, 84, 12, 16), 60, 2) + line(58, 134, 58, 148) + line(58, 190, 58, 204) + line(82, 136, 82, 146));
  s.shape(rect(57, 150, 26, 38, 1), "f");
  s.wash("wx", rect(57, 150, 26, 38, 1));
  s.fine(ell(70, 160, 5) + line(70, 155, 70, 165) + scribble(60, 171, 20) + scribble(62, 177, 16) + scribble(60, 183, 20));
  // glass
  const bowl = "M127 136Q124 172 145 177Q166 172 163 136Z";
  s.shape(ell(145, 207, 15, 4), "f");
  s.ink(line(145, 177, 145, 205));
  s.shape(bowl);
  s.wash("wr", "M128.5 153Q130 172 145 175.5Q160 172 161.5 153Z");
  s.fine(ell(145, 136, 18, 4) + ell(145, 153, 16.5, 3.2));
  s.hair("M133 142q-1 14 4 24" + line(140, 204, 150, 204));
  // grapes with a leaf
  const lf = curve([[98, 200], [88, 192], [78, 196], [72, 188], [80, 182], [84, 172], [94, 178], [104, 174], [106, 186], [114, 192], [104, 196]], true);
  s.shape(lf);
  s.wash("wm", lf);
  s.hair(line(98, 199, 86, 180) + line(92, 190, 78, 192) + line(94, 186, 102, 180));
  s.ink(curve([[104, 198], [110, 190], [120, 188]]));
  for (const [row, n] of [[0, 4], [1, 3], [2, 3], [3, 2], [4, 1]])
    for (let k = 0; k < n; k++) {
      const x = 112 + (k - (n - 1) / 2) * 10.4 + R(-1, 1);
      const y = 200 + row * 8.4 + R(-1, 1);
      s.shape(ell(x, y, 5.6), "f");
      s.wash("wl", ell(x, y, 5.6));
      s.hair(`M${f(x - 3)} ${f(y - 1.5)}q1 -2.4 3.4 -2.6` + hatch(ellPts(x + 1.4, y + 1.6, 3.4, 3.2, 8), 40, 1.6));
    }
  // cork
  const K = xf(166, 222, -24);
  s.shape(poly(on(K, rr(-8, -4.5, 16, 9, 2)), true), "f");
  s.hair(hatch(on(K, rectPts(-7, -4, 14, 8)), 80, 2.2));
  let rays = "";
  for (const [x, y] of ellPts(404, 46, 1, 1, 12)) rays += line(404 + (x - 404) * 20, 46 + (y - 46) * 20, 404 + (x - 404) * 27, 46 + (y - 46) * 27);
  return svg("winery", W, H, s.done() + `<g class="live"><path class="spin slow" d="${rays}${ell(404, 46, 27.2)}"/></g>`);
}

// Plate Scanner: a dining-hall plate on its tray under a phone that has boxed
// and listed what it sees.
function plate() {
  reseed(109);
  const s = sheet();
  // tray
  s.hair(hatch([[16, 258], [312, 258], [318, 264], [22, 264]], 0, 1.5) + hatch([[312, 22], [318, 28], [318, 264], [312, 258]], 90, 1.5));
  s.shape(rect(8, 14, 304, 244, 12), "b");
  s.wash("wb", rect(8, 14, 304, 244, 12));
  s.fine(rect(16, 22, 288, 228, 7));
  // napkin and fork
  const N = xf(24, 62, -3);
  s.shape(poly(on(N, rr(0, 0, 46, 160, 2)), true));
  s.wash("wx", poly(on(N, rr(0, 0, 46, 160, 2)), true));
  s.fine(line(...N(38, 0), ...N(38, 160)));
  s.hair(hatch(on(N, rectPts(2, 4, 34, 152)), 0, 9, 0.2));
  const F = xf(46, 66, -3);
  s.shape(poly(on(F, [[-8, 0], [-8, 34], [-3.5, 46], [-3, 140], [3, 140], [3.5, 46], [8, 34], [8, 0], [5, 0], [5, 28], [2.4, 28], [2.4, 0], [-2.4, 0], [-2.4, 28], [-5, 28], [-5, 0]]), true));
  s.hair(line(...F(0, 52), ...F(0, 134)));
  // water glass
  s.hair(hatch(ellPts(290, 54, 21, 21, 14), 30, 2.2));
  s.shape(ell(286, 50, 20));
  s.wash("ws", ell(286, 50, 20));
  s.fine(ell(286, 50, 15.5) + "M276 42q5 -6 12 -6");
  // plate
  const [px, py] = [176, 140];
  s.hair(hatch(ellPts(px + 6, py + 8, 95, 95, 30), 35, 2.2, 0.3));
  s.shape(ell(px, py, 93), "b");
  s.wash("wx", ell(px, py, 93));
  s.ink(ell(px, py, 69));
  s.fine(ell(px, py, 65.5));
  for (const [x, y] of ellPts(px, py, 1, 1, 44)) s.hair(line(px + (x - px) * 75, py + (y - py) * 75, px + (x - px) * 87, py + (y - py) * 87));
  // rice
  const rice = blob(148, 116, 30, 25, 10, 0.12);
  s.shape(curve(rice, true));
  for (let k = 0; k < 60; k++) {
    const a = R(0, Math.PI * 2);
    const r = Math.sqrt(R(0, 1));
    const [x, y] = [148 + Math.cos(a) * r * 24, 116 + Math.sin(a) * r * 19];
    const t = R(0, Math.PI);
    s.fine(line(x, y, x + 3 * Math.cos(t), y + 3 * Math.sin(t)));
  }
  // grilled chicken
  const G = xf(210, 126, -18);
  const meat = on(G, blob(0, 0, 32, 21, 9, 0.1));
  s.shape(curve(meat, true));
  s.wash("wp", curve(meat, true));
  s.ink(hatch(on(G, ellPts(0, 0, 26, 15, 12)), 40, 9, 0.1));
  s.hair(hatch(on(G, ellPts(0, 0, 26, 15, 12)), 40, 3, 0.3) + curve(on(G, [[-22, 8], [-10, 14], [6, 13], [22, 4]])));
  // broccoli
  const floret = (x, y, r) => {
    s.shape(poly([[x - r * 0.3, y + r * 0.5], [x - r * 0.2, y + r * 1.3], [x + r * 0.25, y + r * 1.3], [x + r * 0.3, y + r * 0.5]], true), "f");
    s.wash("wm", poly([[x - r * 0.3, y + r * 0.5], [x - r * 0.2, y + r * 1.3], [x + r * 0.25, y + r * 1.3], [x + r * 0.3, y + r * 0.5]], true));
    const out = ellPts(x, y, 1, 1, 14).map(([ax, ay], i) => [x + (ax - x) * r * (i % 2 ? 0.8 : 1.05), y + (ay - y) * r * 0.85 * (i % 2 ? 0.8 : 1.05)]);
    s.shape(curve(out, true));
    s.wash("wm", curve(out, true));
    for (let k = 0; k < 5; k++) {
      const [bx, by] = [x + R(-0.5, 0.5) * r, y + R(-0.45, 0.4) * r];
      s.fine(`M${f(bx - 3)} ${f(by)}q3 -4.4 6 0`);
    }
    s.hair(hatch(ellPts(x + r * 0.3, y + r * 0.35, r * 0.5, r * 0.36, 8), 50, 2));
  };
  floret(150, 168, 15);
  floret(128, 160, 11);
  floret(172, 180, 13);
  // tomatoes
  for (const [x, y] of [[212, 168], [228, 182], [206, 188]]) {
    s.shape(ell(x, y, 9.5));
    s.wash("wr", ell(x, y, 9.5));
    s.fine(`M${x - 5} ${y - 3}q2 -4 6 -4.6` + ellPts(x + 1, y - 2, 1, 1, 5).map(([ax, ay]) => line(x + 1, y - 2, x + 1 + (ax - x - 1) * 4, y - 2 + (ay - y + 2) * 4)).join(""));
  }
  // lemon wedge
  const lemon = "M176 84a22 22 0 0 1 40 6Z";
  s.shape(lemon);
  s.wash("wy", lemon);
  s.fine("M180 85a17 17 0 0 1 31 4.5" + line(196, 87.5, 190, 74) + line(196, 87.5, 200, 73) + line(196, 87.5, 208, 78));
  // what the scanner has found: dashed boxes with tags
  for (const [x, y, w, h, len] of [[112, 86, 70, 58, 20], [172, 98, 78, 56, 26], [108, 144, 84, 56, 24], [190, 152, 54, 52, 22]]) {
    s.add("dash2", rect(x, y, w, h, 3));
    s.shape(rect(x, y - 10, len + 10, 10, 2), "f");
    s.fine(scribble(x + 4, y - 5, len));
  }
  // viewfinder corners
  for (const [x, y, sx, sy] of [[80, 44, 1, 1], [272, 44, -1, 1], [272, 236, -1, -1], [80, 236, 1, -1]]) s.bold(poly([[x, y + sy * 20], [x, y], [x + sx * 20, y]]));
  // phone
  const P = xf(338, 24, 5);
  s.hair(hatch(on(P, rr(6, 8, 122, 222, 16)), 35, 2.4, 0.3));
  s.shape(poly(on(P, rr(0, 0, 122, 222, 9)), true), "b");
  s.wash("wl", poly(on(P, rr(0, 0, 122, 222, 9)), true));
  s.shape(poly(on(P, rr(6, 8, 110, 206, 6)), true));
  s.wash("wx", poly(on(P, rr(6, 8, 110, 206, 6)), true));
  s.shape(poly(on(P, rr(46, 12, 30, 7, 3)), true), "f");
  s.fine(line(...P(122, 50), ...P(124, 50)) + line(...P(124, 50), ...P(124, 78)) + line(...P(124, 78), ...P(122, 78)));
  // camera view on the screen
  s.fine(ell(...P(61, 68), 39) + ell(...P(61, 68), 29));
  const minis = [[50, 58, 13, 10, "wy"], [74, 62, 13, 9, "wp"], [52, 80, 12, 9, "wm"], [74, 84, 8, 8, "wr"]];
  for (const [x, y, rx, ry, c] of minis) {
    const d = curve(on(P, blob(x, y, rx, ry, 8, 0.12)), true);
    s.shape(d, "f");
    s.wash(c, d);
    s.add("dash2", poly(on(P, rectPts(x - rx - 2, y - ry - 2, 2 * rx + 4, 2 * ry + 4)), true));
  }
  s.fine(line(...P(12, 116), ...P(110, 116)));
  minis.forEach(([, , , , c], k) => {
    const y = 128 + 17 * k;
    s.shape(ell(...P(19, y), 4.5), "f");
    s.wash(c, ell(...P(19, y), 4.5));
    s.fine(scribble(29, y, R(30, 44), P));
    s.ink(scribble(88, y, 18, P));
    s.hair(line(...P(12, y + 8.5), ...P(110, y + 8.5)));
  });
  s.shape(ell(...P(61, 201), 8.5));
  s.fine(ell(...P(61, 201), 5.5));
  const live = `<path class="scan" d="${line(84, 46, 268, 46)}"/>`;
  return svg("plate", W, H, s.done() + `<g class="live">${live}</g>`);
}

export const projectsB = { developer: developer(), fstea: fstea(), winery: winery(), plate: plate() };
