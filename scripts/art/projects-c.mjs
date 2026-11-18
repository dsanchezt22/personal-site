// Project drawings, third set: the typing-force harvester and the effects box.
import { reseed, R, f, poly, line, rect, ell, rectPts, ellPts, hatch, curve, sheet, text, iso, tube, xf, rr, scribble, svg, box } from "./kit.mjs";

const W = 480;
const H = 270;
const on = (T, pts) => pts.map(([x, y]) => T(x, y));

// Typing-force energy harvester: a finger on a key switch over a piezo disc on a
// force plate; bridge rectifier, capacitor, rocker switch and LED; the logged spikes.
function piezo() {
  reseed(113);
  const s = sheet();
  s.hair(line(8, 252, 196, 253) + line(204, 252, 472, 251));
  // force plate
  const P = iso(98, 156);
  s.hair(hatch([P(-60, 46, 0), P(60, 46, 0), P(66, 36, 0), P(78, 52, 0), P(-48, 62, 0)], 8, 2.6, 0.4));
  box(s, P, -56, -40, 0, 112, 80, 10, { tint: "wb", g: 3 });
  s.fine(poly([P(-50, -34, 10), P(50, -34, 10), P(50, 34, 10), P(-50, 34, 10)], true) + scribble(...P(-40, 30, 10), 34));
  const lead = curve([P(56, 20, 4), [176, 214], [150, 238], [96, 244], [40, 236], [-6, 246]]);
  s.add("wo", lead).raw("").add("wi", lead);
  // the 41 mm disc
  const [dx, dy] = P(0, 0, 10);
  s.shape(ell(dx, dy + 2, 36, 20.8));
  s.shape(ell(dx, dy, 36, 20.8), "b");
  s.wash("wy", ell(dx, dy, 36, 20.8));
  s.shape(ell(dx, dy, 24, 13.9));
  s.wash("wg", ell(dx, dy, 24, 13.9));
  s.hair(hatch(ellPts(dx, dy, 35, 19.8, 24).concat(ellPts(dx, dy, 25, 14.6, 24).reverse()), 28, 2.6, 0.3));
  // switch and keycap
  box(s, P, -9, -9, 11, 18, 18, 9, { tint: "wg" });
  box(s, P, -3, -3, 20, 6, 6, 5, {});
  box(s, P, -12, -12, 25, 24, 24, 4, { tint: "ws" });
  box(s, P, -9, -9, 29, 18, 18, 6, { tint: "ws" });
  // finger pressing down
  const tipAt = P(0, 0, 37);
  const knuckle = [tipAt[0] - 58, tipAt[1] - 72];
  const arm = tube(knuckle, [tipAt[0] - 5, tipAt[1] - 7], 22);
  s.shape(poly(arm, true));
  s.shape(ell(tipAt[0] - 4, tipAt[1] - 6, 11.5, 11));
  s.add("wi", line(...arm[1], ...arm[2])).raw("");
  s.wash("wp", poly(arm, true) + ell(tipAt[0] - 4, tipAt[1] - 6, 11.5, 11));
  s.fine(`M${f(tipAt[0] - 11)} ${f(tipAt[1] - 12)}q8 -7 15 2` + line(tipAt[0] - 36, tipAt[1] - 52, tipAt[0] - 27, tipAt[1] - 58) + line(tipAt[0] - 33, tipAt[1] - 47, tipAt[0] - 24, tipAt[1] - 53));
  s.ink(line(136, 62, 136, 96) + poly([[131, 90], [136, 98], [141, 90]]));
  s.raw(text(144, 80, "2.5 ± 1 N", "t"));
  s.fine(poly([[dx - 30, dy + 8], [52, 196], [20, 196]]));
  s.raw(text(22, 191, "41 mm", "t s"));
  // the 10 mm disc, set aside
  s.shape(ell(30, 222, 11, 6.4));
  s.wash("wy", ell(30, 222, 11, 6.4));
  s.fine(ell(30, 222, 6.5, 3.8));
  s.raw(text(46, 226, "10 mm", "t s"));
  // circuit board
  s.hair(hatch([[206, 236], [402, 236], [407, 242], [211, 242]], 0, 1.5) + hatch([[402, 132], [407, 138], [407, 242], [402, 236]], 90, 1.5));
  s.shape(rect(200, 126, 202, 110, 4), "b");
  s.wash("wm", rect(200, 126, 202, 110, 4));
  s.add("dots", [136, 148, 160, 172, 184, 196, 208, 226].map((y) => line(208, y, 394, y)).join(""));
  for (const [x, y] of [[206, 132], [396, 132], [206, 230], [396, 230]]) s.fine(ell(x, y, 2.2));
  // leads from the disc to the bridge's two AC corners
  const top = [238, 152];
  const right = [266, 180];
  const bottom = [238, 208];
  const left = [210, 180];
  for (const [end, lift, c] of [[top, -44, "sr"], [bottom, 30, "sb"]]) {
    const d = curve([[dx + 34, dy + 2], [160, dy + lift], [206, end[1] + lift * 0.3], end]);
    s.raw("").add("wo", d).raw("").add("wi", d).wash("kx", d).wash(c, d);
  }
  // bridge rectifier: four diodes all pointing to the + corner
  const diode = (a, b) => {
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const D = xf((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (ang * 180) / Math.PI);
    s.fine(line(...a, ...b));
    s.shape(poly(on(D, [[-5, -5], [-5, 5], [5, 0]]), true));
    s.ink(line(...D(5, -5), ...D(5, 5)));
  };
  diode(left, top);
  diode(left, bottom);
  diode(top, right);
  diode(bottom, right);
  for (const p of [top, right, bottom, left]) s.add("solid", ell(...p, 2.4));
  // rails
  s.ink(poly([right, [284, 180], [284, 206], [300, 206]]) + poly([[314, 206], [334, 206], [334, 196]]) + poly([[358, 196], [358, 206], [372, 206], [372, 197]]));
  s.ink(poly([[386, 197], [386, 224], [204, 224], [204, 186], left]) + line(314, 198, 314, 224));
  s.add("solid", ell(314, 224, 2.2));
  // capacitor
  s.shape(`M293 150V196a14 5 0 0 0 28 0V150Z`, "b");
  s.wash("ws", `M293 150V196a14 5 0 0 0 28 0V150Z`);
  s.shape(ell(307, 150, 14, 5));
  s.fine(ell(307, 150, 9, 3) + line(315, 158, 315, 194) + line(311.5, 162, 318, 162) + line(311.5, 172, 318, 172) + line(311.5, 182, 318, 182));
  s.hair(hatch(rectPts(295, 156, 8, 38), 90, 2.4, 0.3));
  s.shape(rect(291, 131, 32, 11, 2), "f");
  s.raw(text(307, 139.5, "470 µF", "t s mid"));
  // rocker switch
  s.shape(rect(331, 166, 30, 30, 3), "b");
  s.wash("wg", rect(331, 166, 30, 30, 3));
  const rocker = poly([[335, 176], [357, 170], [357, 186], [335, 190]], true);
  s.shape(rocker);
  s.wash("wr", rocker);
  s.fine(line(346, 173, 346, 188) + ell(351.5, 178, 2));
  // LED
  const led = "M371 197V180a8 8 0 0 1 16 0V197Z";
  s.shape(led, "b");
  s.wash("wr", led);
  s.shape(rect(368, 196, 22, 5, 1), "f");
  s.fine("M375 181a4.5 4.5 0 0 1 4 -4.5");
  s.fine(line(379, 164, 379, 156) + line(366, 170, 359, 164) + line(392, 170, 399, 164));
  // logged spikes
  const C = xf(322, 16, 2);
  s.hair(hatch(on(C, rectPts(4, 5, 146, 94)), 40, 2.4, 0.3));
  s.shape(poly(on(C, rr(0, 0, 146, 94, 2)), true), "b");
  s.ink(poly(on(C, [[14, 10], [14, 76], [136, 76]])));
  for (let k = 1; k < 7; k++) s.hair(line(...C(14 + 17 * k, 76), ...C(14 + 17 * k, 79)) + line(...C(11, 76 - 10 * k), ...C(14, 76 - 10 * k)));
  for (let k = 0; k < 6; k++) {
    const x = 22 + 15 * k;
    s.ink(poly(on(C, [[x - 2, 76], [x, 76 - R(40, 58)], [x + 4, 72], [x + 6, 76]])));
    s.add("dash2", poly(on(C, [[x + 7, 76], [x + 9, 76 - R(6, 12)], [x + 12, 76]])));
  }
  s.ink(line(...C(112, 18), ...C(120, 18)));
  s.add("dash2", line(...C(112, 30), ...C(120, 30)));
  for (const [str, y] of [["41 mm", 20.5], ["10 mm", 32.5]]) {
    const [tx, ty] = C(123, y);
    s.raw(text(tx, ty, str, "t xs", ` transform="rotate(2 ${f(tx)} ${f(ty)})"`));
  }
  s.fine(scribble(40, 86, 60, C));
  const rays = `<path class="ray" style="--i:0" d="M379 152v-8M361 160l-6 -6M397 160l6 -6"/><path class="ray" style="--i:2" d="M370 154l-3 -7M388 154l3 -7"/>`;
  return svg("piezo", W, H, s.done() + `<g class="live">${rays}</g>`);
}

// RMX-1000-style effects box: pads, knobs and a level meter, the echo it adds to
// a waveform, and the impulse response behind that echo.
function rmx() {
  reseed(127);
  const s = sheet();
  // a note, then its echoes
  s.hair(line(18, 36, 300, 36));
  const wave = [];
  for (let x = 22; x <= 296; x += 2.5) {
    const t = x - 22;
    const gain = t < 92 ? 1 : t < 184 ? 0.58 : 0.32;
    wave.push([x, 36 - Math.sin(t * 0.6) * 20 * gain * Math.exp(-(t % 92) / 24)]);
  }
  s.ink(curve(wave));
  for (const x of [22, 114, 206]) s.fine(line(x, 50, x, 62));
  s.fine(line(26, 58, 110, 58) + poly([[31, 55], [25, 58], [31, 61]]) + poly([[105, 55], [111, 58], [105, 61]]));
  s.raw(text(68, 69, "D", "t s mid"));
  // its impulse response
  s.ink(poly([[336, 10], [336, 50], [462, 50]]));
  s.bold(line(350, 50, 350, 16) + line(412, 50, 412, 30));
  s.shape(ell(350, 16, 3.2)).shape(ell(412, 30, 3.2));
  s.raw(text(418, 28, "a", "t s") + text(350, 59, "0", "t s mid") + text(412, 59, "D", "t s mid") + text(398, 71, "h[n] = δ[n] + a·δ[n−D]", "t s mid"));
  // the box
  const B = xf(44, 98, -3);
  const pts = (a) => on(B, a);
  s.hair(hatch(pts(rr(8, 10, 336, 152, 12)), 30, 2.4, 0.3));
  s.shape(poly(pts(rr(0, 0, 336, 152, 10)), true), "b");
  s.wash("wl", poly(pts(rr(0, 0, 336, 152, 10)), true));
  s.fine(poly(pts(rr(6, 6, 324, 140, 7)), true));
  for (const [x, y] of [[12, 12], [324, 12], [12, 140], [324, 140]]) s.fine(ell(...B(x, y), 2.4) + line(...B(x - 1.6, y - 1.6), ...B(x + 1.6, y + 1.6)));
  // jacks and cables on the back edge
  s.shape(poly(pts(rr(33, -9, 14, 10, 2)), true));
  s.shape(poly(pts(rr(335, 58, 10, 14, 2)), true));
  s.raw(text(...B(52, -3), "in", "t s") + text(...B(349, 54), "out", "t s"));
  const cableIn = curve([B(40, -9), B(34, -30), B(6, -34), B(-20, -16), B(-50, -22)]);
  const cableOut = curve([B(345, 65), B(366, 62), B(378, 40), [424, 104], [432, 120]]);
  s.raw("").add("wo", cableIn + cableOut).raw("").add("wi", cableIn + cableOut);
  // level meter
  s.shape(poly(pts(rr(18, 18, 134, 30, 3)), true));
  s.wash("wx", poly(pts(rr(18, 18, 134, 30, 3)), true));
  [10, 16, 20, 14, 22, 18, 12, 20, 24, 16, 9, 14, 6, 4].forEach((h, k) => {
    const bar = poly(pts(rectPts(24 + k * 9, 44 - h, 6, h)), true);
    s.shape(bar, "f");
    s.wash(k < 8 ? "wm" : k < 11 ? "wy" : "wr", bar);
  });
  // pads
  const taps = [];
  for (let j = 0; j < 2; j++)
    for (let i = 0; i < 4; i++) {
      const pad = poly(pts(rr(18 + 34 * i, 60 + 40 * j, 30, 32, 4)), true);
      s.shape(pad);
      s.wash(["wr", "wy", "wm", "ws"][(i + j * 3) % 4], pad);
      s.fine(poly(pts(rr(21, 63, 24, 26, 3).map(([x, y]) => [x + 34 * i, y + 40 * j])), true));
      s.hair(line(...B(24 + 34 * i, 86 + 40 * j), ...B(42 + 34 * i, 86 + 40 * j)));
      if ((i + j) % 2 === 0) taps.push(pad);
    }
  // three small isolator knobs and a lever
  const knob = (x, y, r, turn) => {
    const [cx, cy] = B(x, y);
    s.shape(ell(cx, cy, r), "b");
    s.wash("wg", ell(cx, cy, r));
    s.fine(ell(cx, cy, r * 0.68));
    for (let k = 0; k < 11; k++) {
      const a = ((-225 + k * 27 - 3) * Math.PI) / 180;
      s.hair(line(cx + Math.cos(a) * (r + 2.5), cy + Math.sin(a) * (r + 2.5), cx + Math.cos(a) * (r + 5.5), cy + Math.sin(a) * (r + 5.5)));
    }
    const a = ((turn - 3) * Math.PI) / 180;
    s.bold(line(cx + Math.cos(a) * r * 0.2, cy + Math.sin(a) * r * 0.2, cx + Math.cos(a) * r * 0.92, cy + Math.sin(a) * r * 0.92));
  };
  ["bass", "mid", "treble"].forEach((name, k) => {
    knob(182 + 36 * k, 30, 9, [-160, -90, -40][k]);
    const [tx, ty] = B(182 + 36 * k, 53);
    s.raw(text(tx, ty, name, "t s mid", ` transform="rotate(-3 ${f(tx)} ${f(ty)})"`));
  });
  s.shape(poly(pts(rr(292, 16, 12, 34, 5)), true));
  s.shape(ell(...B(298, 24), 7.5));
  s.wash("wr", ell(...B(298, 24), 7.5));
  // three large effect knobs
  ["echo", "reverb", "filter"].forEach((name, k) => {
    knob(190 + 54 * k, 96, 20, [-200, -70, -120][k]);
    const [tx, ty] = B(190 + 54 * k, 136);
    s.raw(text(tx, ty, name, "t mid", ` transform="rotate(-3 ${f(tx)} ${f(ty)})"`));
  });
  // speaker
  s.hair(hatch([[416, 232], [470, 232], [474, 238], [420, 238]], 0, 1.5));
  s.shape(rect(410, 118, 58, 114, 5), "b");
  s.wash("wb", rect(410, 118, 58, 114, 5));
  s.shape(ell(439, 194, 21)).fine(ell(439, 194, 15) + ell(439, 194, 5.5));
  s.hair(hatch(ellPts(439, 194, 15, 15, 16).concat(ellPts(439, 194, 6, 6, 12).reverse()), 40, 2.2));
  s.shape(ell(439, 142, 9)).fine(ell(439, 142, 3.5));
  const live = taps.map((d, i) => `<path class="tap" style="--i:${i}" d="${d}"/>`).join("");
  return svg("rmx", W, H, s.done() + `<g class="live">${live}</g>`);
}

export const projectsC = { piezo: piezo(), rmx: rmx() };
