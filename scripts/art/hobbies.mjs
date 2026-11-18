// Hobby drawings: soccer, hiking, consumer electronics, AI agents, music.
import { reseed, R, f, poly, line, rect, ell, rectPts, ellPts, hatch, curve, sheet, text, tube, xf, rr, scribble, svg } from "./kit.mjs";

const W = 300;
const H = 190;
const on = (T, pts) => pts.map(([x, y]) => T(x, y));

// Soccer: a shot on its way to the top corner, and two scarves.
function soccer() {
  reseed(251);
  const s = sheet();
  // pitch
  s.ink(line(6, 160, 294, 160));
  s.wash("wm", "M0 160H300V190H0Z");
  s.fine(`M96 160a60 16 0 0 0 150 0` + line(6, 176, 294, 176));
  for (let k = 0; k < 16; k++) {
    const x = R(8, 292);
    const y = R(164, 186);
    s.hair(line(x, y, x - 2, y - 5) + line(x + 2, y, x + 3, y - 6));
  }
  // net, then the frame over it
  const side = [[178, 34], [204, 54], [204, 160], [178, 160]];
  s.hair(hatch(rectPts(34, 36, 144, 124), 0, 8, 0.05) + hatch(rectPts(34, 36, 144, 124), 90, 8, 0.05) + hatch(side, 35, 6, 0.1) + hatch(side, -35, 6, 0.1));
  s.fine(poly(side));
  for (const [a, b] of [[[32, 160], [32, 32]], [[30, 32], [180, 32]], [[178, 32], [178, 160]]]) s.shape(poly(tube(a, b, 6), true));
  s.fine(line(28, 160, 208, 160));
  // corner flag
  s.ink(line(276, 160, 276, 112));
  s.shape(poly([[276, 112], [292, 118], [276, 125]], true), "f");
  s.wash("wy", poly([[276, 112], [292, 118], [276, 125]], true));
  // scarves
  const scarf = (T, turn, name, stripes) => {
    const band = on(T, rr(0, 0, 96, 20, 2));
    s.hair(hatch(on(T, rectPts(3, 4, 96, 20)), 35, 2.4, 0.3));
    s.shape(poly(band, true), "b");
    s.wash("wr", poly(band, true));
    for (const [x, w, c] of stripes) s.wash(c, poly(on(T, rectPts(x, 0, w, 20)), true)).fine(line(...T(x, 0), ...T(x, 20)) + line(...T(x + w, 0), ...T(x + w, 20)));
    for (let k = 0; k < 7; k++) s.fine(line(...T(0, 2 + k * 2.7), ...T(-6, 2 + k * 2.7)) + line(...T(96, 2 + k * 2.7), ...T(102, 2 + k * 2.7)));
    const [tx, ty] = T(48, 13.5);
    s.raw(text(tx, ty, name, "t mid", ` transform="rotate(${turn} ${f(tx)} ${f(ty)})"`));
  };
  scarf(xf(196, 10, 5), 5, "Bayern", [[0, 12, "wx"], [84, 12, "wx"]]);
  scarf(xf(192, 40, -6), -6, "Chivas", [[0, 8, "ws"], [8, 6, "wx"], [82, 6, "wx"], [88, 8, "ws"]]);
  // the shot
  s.add("dash2", curve([[288, 150], [262, 128], [244, 112]]));
  s.fine(line(250, 132, 262, 142) + line(240, 138, 250, 147));
  const ball = sheet();
  const [bx, by] = [228, 98];
  ball.shape(ell(bx, by, 17), "b");
  const inner = ellPts(bx, by, 6.5, 6.5, 5, -Math.PI / 2, Math.PI * 1.5);
  ball.add("solid", poly(inner, true));
  inner.forEach(([x, y], i) => {
    const a = Math.atan2(y - by, x - bx);
    const edge = [bx + Math.cos(a) * 13, by + Math.sin(a) * 13];
    ball.fine(line(x, y, ...edge));
    ball.add("solid", poly([edge, [bx + Math.cos(a - 0.34) * 17, by + Math.sin(a - 0.34) * 17], [bx + Math.cos(a + 0.34) * 17, by + Math.sin(a + 0.34) * 17]], true));
    const next = inner[(i + 1) % 5];
    const m = Math.atan2((y + next[1]) / 2 - by, (x + next[0]) / 2 - bx);
    ball.fine(line(...edge, bx + Math.cos(m) * 12.5, by + Math.sin(m) * 12.5) + line(bx + Math.cos(m) * 12.5, by + Math.sin(m) * 12.5, bx + Math.cos(a + 1.257) * 13, by + Math.sin(a + 1.257) * 13));
  });
  return svg("hobby", W, H, s.done() + `<g class="live"><g class="kick" style="--dx:-66px;--dy:-44px">${ball.done()}</g></g>`);
}

// Hiking: the scramble up Mt. Cloudripper, flag on the summit.
function hiking() {
  reseed(257);
  const s = sheet();
  // sky
  s.shape(ell(256, 34, 12));
  s.wash("wy", ell(256, 34, 12));
  for (const [x, y] of ellPts(256, 34, 1, 1, 10)) s.fine(line(256 + (x - 256) * 16, 34 + (y - 34) * 16, 256 + (x - 256) * 21, 34 + (y - 34) * 21));
  s.fine(curve([[20, 58], [28, 50], [40, 51], [48, 44], [62, 46], [70, 52], [82, 58]]) + "L20 58" + "M96 40q4 -5 8 0q4 -5 8 0M210 66q3 -4 6 0q3 -4 6 0");
  // far ridge
  const far = [[0, 132], [30, 112], [52, 122], [84, 98], [110, 112], [190, 104], [236, 92], [262, 108], [300, 96]];
  s.fine(curve(far));
  s.wash("wb", curve(far) + "L300 172L0 172Z");
  // the mountain
  const peak = [[14, 172], [56, 124], [80, 134], [116, 74], [132, 86], [158, 30], [176, 60], [194, 50], [226, 112], [248, 100], [290, 172]];
  s.shape(poly(peak, true), "b");
  s.wash("wg", poly(peak, true));
  s.hair(hatch([[158, 30], [176, 60], [194, 50], [226, 112], [248, 100], [290, 172], [196, 172], [168, 110]], 62, 3, 0.35));
  s.hair(hatch([[116, 74], [132, 86], [140, 70], [150, 120], [128, 172], [108, 172], [118, 110]], 62, 4.4, 0.4));
  s.fine(curve([[158, 30], [166, 78], [160, 118], [176, 172]]) + curve([[116, 74], [122, 108], [112, 172]]) + curve([[194, 50], [206, 96], [232, 172]]) + curve([[56, 124], [64, 148], [58, 172]]));
  const snow = poly([[158, 30], [170, 50], [163, 46], [158, 56], [152, 47], [146, 54], [148, 48]], true);
  s.shape(snow, "f");
  s.wash("wx", snow);
  for (let k = 0; k < 40; k++) {
    const x = R(40, 270);
    const y = R(120, 168);
    s.hair(line(x, y, x + R(1.5, 4), y + R(-1, 1)));
  }
  for (const [x, y, r] of [[92, 166, 7], [206, 164, 9], [232, 168, 5]]) s.shape(poly(ellPts(x, y, r, r * 0.7, 6).map(([px, py]) => [px + R(-1.5, 1.5), py + R(-1.5, 1.5)]), true), "f");
  // the route up, with cairns
  s.add("dash2", poly([[34, 170], [62, 150], [86, 144], [104, 116], [122, 104], [130, 88], [142, 72], [146, 52], [156, 34]]));
  for (const [x, y] of [[86, 144], [122, 104]]) s.shape(ell(x + 6, y, 4, 2.2), "f").shape(ell(x + 6, y - 3.4, 3, 1.8), "f").shape(ell(x + 6, y - 6.2, 2, 1.3), "f");
  // hiker on the last pitch
  const [hx, hy] = [143, 62];
  s.shape(rect(hx - 6, hy - 9, 5, 8, 1.5), "f");
  s.wash("wr", rect(hx - 6, hy - 9, 5, 8, 1.5));
  s.ink(line(hx, hy - 10, hx - 1, hy - 1) + line(hx - 1, hy - 1, hx - 4, hy + 6) + line(hx - 1, hy - 1, hx + 3, hy + 5) + line(hx, hy - 8, hx + 5, hy - 12) + line(hx, hy - 8, hx - 3, hy - 3));
  s.shape(ell(hx + 0.5, hy - 13, 2.8), "f");
  s.fine(line(hx + 5, hy - 12, hx + 7, hy - 1));
  // pines
  const pine = (x, y, h) => {
    s.fine(line(x, y, x, y - h * 0.2));
    for (let k = 0; k < 3; k++) {
      const top = y - h + k * h * 0.22;
      const w = h * (0.16 + k * 0.08);
      const tri = poly([[x, top], [x + w, top + h * 0.38], [x - w, top + h * 0.38]], true);
      s.shape(tri, "f");
      s.wash("wm", tri);
    }
  };
  [[20, 174, 30], [36, 176, 22], [262, 176, 26], [278, 174, 34], [248, 176, 18]].forEach((p) => pine(...p));
  s.ink(line(4, 174, 296, 174));
  s.hair(hatch([[6, 176], [294, 176], [288, 184], [12, 184]], 0, 2.4, 0.4));
  // name
  s.raw(text(14, 22, "Mt. Cloudripper", "t"));
  s.fine(poly([[14, 26], [92, 26], [150, 30]]));
  const flag = `<g class="wave"><path class="pole" d="${line(158, 30, 158, 12)}"/><path class="flag" d="${poly([[158, 12], [174, 16.5], [158, 21]], true)}"/></g>`;
  return svg("hobby", W, H, s.done() + `<g class="live">${flag}</g>`);
}

// Consumer electronics: an EQ on the phone, the DAC it drives, in-ears, and the bike.
function electronics() {
  reseed(263);
  const s = sheet();
  s.hair(line(6, 182, 294, 183));
  // phone with a ten-band EQ
  const P = xf(16, 20, -5);
  s.hair(hatch(on(P, rr(5, 6, 92, 150, 12)), 35, 2.4, 0.3));
  s.shape(poly(on(P, rr(0, 0, 92, 150, 9)), true), "b");
  s.wash("wl", poly(on(P, rr(0, 0, 92, 150, 9)), true));
  s.shape(poly(on(P, rr(5, 8, 82, 134, 5)), true));
  s.wash("wx", poly(on(P, rr(5, 8, 82, 134, 5)), true));
  s.shape(poly(on(P, rr(34, 11, 24, 5, 2)), true), "f");
  s.ink(scribble(12, 26, 44, P));
  const levels = [58, 50, 46, 54, 62, 66, 60, 50, 44, 48];
  levels.forEach((y, k) => s.hair(line(...P(13 + k * 7.4, 38), ...P(13 + k * 7.4, 92))));
  s.hair(line(...P(10, 65), ...P(84, 65)));
  s.ink(curve(on(P, levels.map((y, k) => [13 + k * 7.4, y]))));
  s.wash("sb", curve(on(P, levels.map((y, k) => [13 + k * 7.4, y]))));
  for (let k = 0; k < 3; k++) s.fine(scribble(12, 104 + 8 * k, R(40, 66), P));
  s.shape(ell(...P(46, 131), 6.5));
  s.fine(poly(on(P, [[44, 128], [49, 131], [44, 134]]), true) + poly(on(P, [[26, 128], [21, 131], [26, 134]])) + poly(on(P, [[66, 128], [71, 131], [66, 134]])));
  // the DAC/amp on its clip
  const D = xf(126, 96, 8);
  s.hair(hatch(on(D, rr(4, 5, 46, 70, 9)), 35, 2.4, 0.3));
  s.shape(poly(on(D, rr(0, 0, 46, 70, 8)), true), "b");
  s.wash("wg", poly(on(D, rr(0, 0, 46, 70, 8)), true));
  s.fine(poly(on(D, rr(4, 4, 38, 62, 6)), true) + ell(...D(23, 14), 2));
  for (const y of [14, 30]) s.shape(poly(on(D, rr(-3, y, 4, 12, 1.5)), true), "f").shape(poly(on(D, rr(45, y, 4, 12, 1.5)), true), "f");
  s.shape(poly(on(D, rr(15, -6, 16, 8, 2)), true), "f");
  s.hair(hatch(on(D, rectPts(8, 46, 30, 14)), 0, 2.6));
  const [kx, ky] = D(23, 36);
  s.raw(text(kx, ky, "5K", "t mid", ` transform="rotate(8 ${f(kx)} ${f(ky)})"`));
  const usb = curve([P(60, 150), [84, 176], [118, 180], D(23, 70)]);
  s.raw("").add("wo", usb).raw("").add("wi", usb);
  // in-ears
  const split = [226, 112];
  const shell = (cx, cy, turn, mirror) => {
    const E = xf(cx, cy, turn, mirror);
    const cable = curve([E(-4, 12), E(-14, 30), [split[0] + mirror * -8, split[1] - 22], split]);
    s.raw("").add("wo", cable).raw("").add("wi", cable);
    s.shape(poly(on(E, [[13, -5], [24, -9], [26, 2], [15, 4]]), true));
    s.shape(ell(...E(27, -4), 5, 7.5));
    s.hair(hatch(ellPts(...E(27, -4), 5, 7.5, 12), 80, 2));
    const body = curve(on(E, [[-14, -6], [-6, -15], [8, -14], [16, -4], [13, 9], [0, 15], [-11, 10]]), true);
    s.shape(body, "b");
    s.wash("wg", body);
    s.fine(ell(...E(0, -1), 8) + ell(...E(0, -1), 4.6));
    s.hair(hatch(ellPts(...E(0, -1), 8, 8, 14), 45, 2) + hatch(ellPts(...E(0, -1), 8, 8, 14), -45, 2));
  };
  shell(200, 42, -14, 1);
  shell(262, 48, 14, -1);
  s.shape(rect(split[0] - 4, split[1] - 4, 8, 10, 3), "f");
  const down = curve([[split[0], split[1] + 6], [220, 146], [176, 84], D(23, -6)]);
  s.raw("").add("wo", down).raw("").add("wi", down);
  s.raw(text(232, 22, "IE600", "t s mid"));
  // the e-bike
  const [ax, bx2, gy] = [218, 268, 164];
  for (const x of [ax, bx2]) {
    s.shape(ell(x, gy, 16), "b");
    s.fine(ell(x, gy, 12.5) + ell(x, gy, 2.4));
    for (const [px, py] of ellPts(x, gy, 12.5, 12.5, 8)) s.hair(line(x, gy, px, py));
  }
  s.ink(poly([[ax, gy], [236, 142], [258, 140], [bx2, gy]]) + poly([[236, 142], [242, 164], [ax, gy]]) + line(242, 164, 258, 140) + line(233, 136, 240, 136) + poly([[258, 140], [256, 132], [263, 131]]));
  const pack = poly(tube([244, 158], [255, 143], 6), true);
  s.shape(pack, "f");
  s.wash("wy", pack);
  s.shape(ell(242, 164, 4.4), "f");
  const knobs = levels.map((y, k) => `<path class="bob" style="--i:${k}" d="${poly(on(P, rectPts(10.5 + k * 7.4, y - 2, 5, 4)), true)}"/>`).join("");
  return svg("hobby", W, H, s.done() + `<g class="live">${knobs}</g>`);
}

// AI systems and personal agents: an assistant at work, with its tools and chats.
function agents() {
  reseed(269);
  const s = sheet();
  s.ink(line(6, 176, 294, 176));
  s.hair(hatch([[10, 178], [290, 178], [284, 186], [16, 186]], 0, 2.2, 0.4));
  // tools on dotted lines back to the agent
  const tools = [
    (x, y) => rect(x - 7, y - 6, 14, 13, 2) + line(x - 7, y - 2, x + 7, y - 2) + line(x - 3, y - 8.5, x - 3, y - 4.5) + line(x + 3, y - 8.5, x + 3, y - 4.5),
    (x, y) => rect(x - 8, y - 5.5, 16, 11, 1.5) + poly([[x - 8, y - 5], [x, y + 1], [x + 8, y - 5]]),
    (x, y) => ell(x - 2, y - 2, 5) + line(x + 1.6, y + 1.6, x + 7, y + 7),
    (x, y) => poly([[x - 7, y + 6], [x + 2, y - 3]]) + ell(x + 4.5, y - 5, 3.6) + line(x - 8, y + 4, x - 5, y + 7),
  ];
  tools.forEach((g, k) => {
    const x = 196 + k * 28;
    s.add("dash2", curve([[150, 132], [176, 150 - k * 4], [x, 150 - (k % 2) * 6], [x, 136]]));
    s.shape(rect(x - 12, 112, 24, 24, 5));
    s.wash(["wy", "ws", "wm", "wp"][k], rect(x - 12, 112, 24, 24, 5));
    s.fine(g(x, 124));
  });
  // the agent
  const arm = (a, b) => {
    s.shape(poly(tube(a, b, 9), true));
    s.wash("wb", poly(tube(a, b, 9), true));
    s.shape(ell(...b, 7));
    s.fine(ell(...b, 3));
  };
  arm([50, 128], [22, 100]);
  arm([150, 132], [170, 148]);
  s.shape(rect(88, 100, 24, 14, 2), "f");
  s.shape(rect(46, 110, 108, 62, 13), "b");
  s.wash("wb", rect(46, 110, 108, 62, 13));
  s.shape(rect(68, 124, 64, 32, 4));
  s.wash("wx", rect(68, 124, 64, 32, 4));
  s.fine(scribble(74, 134, 50) + scribble(74, 142, 34) + ell(76, 150, 2.2) + ell(84, 150, 2.2) + ell(92, 150, 2.2) + ell(56, 164, 2) + ell(144, 164, 2));
  s.wash("wm", ell(76, 150, 2.2)).wash("wy", ell(84, 150, 2.2)).wash("wr", ell(92, 150, 2.2));
  s.ink(line(100, 40, 100, 22));
  s.shape(ell(100, 19, 5));
  s.wash("wr", ell(100, 19, 5));
  for (const x of [50, 150]) s.shape(rect(x - 5, 62, 10, 20, 3), "f");
  s.shape(rect(56, 38, 88, 66, 18), "b");
  s.wash("ws", rect(56, 38, 88, 66, 18));
  s.fine(rect(62, 44, 76, 54, 14));
  s.shape(ell(84, 66, 9.5)).shape(ell(116, 66, 9.5));
  s.wash("wx", ell(84, 66, 9.5) + ell(116, 66, 9.5));
  s.ink("M88 86q12 9 24 0");
  s.hair(hatch([[124, 46], [136, 54], [136, 90], [124, 98]], 60, 2.4));
  // chats
  const bubble = (x, y, w, h, tint, name) => {
    const d = `${rect(x, y, w, h, 8)}M${x + 14} ${y + h}l-6 9l14 -9`;
    s.shape(d);
    s.wash(tint, rect(x, y, w, h, 8));
    s.fine(scribble(x + 10, y + h - 9, w - 30));
    s.raw(text(x + 10, y + 13, name, "t s"));
  };
  bubble(170, 14, 116, 36, "wy", "Hermes");
  bubble(184, 62, 104, 34, "wm", "Grok");
  const live = `<circle class="wink" cx="84" cy="66" r="3.6"/><circle class="wink" cx="116" cy="66" r="3.6"/>` + [0, 1, 2].map((k) => `<circle class="tap" style="--i:${k}" cx="${262 + k * 7}" cy="87" r="2.2"/>`).join("");
  return svg("hobby", W, H, s.done() + `<g class="live">${live}</g>`);
}

// Music: a turntable and a two-channel mixer under a track's waveform.
function music() {
  reseed(271);
  const s = sheet();
  // the track
  for (let x = 12; x < 290; x += 2.6) {
    const h = 2 + Math.abs(Math.sin(x * 0.21) * Math.sin(x * 0.047 + 1)) * 12 + R(0, 3);
    s.fine(line(x, 16 - h / 2, x, 16 + h / 2));
  }
  s.wash("sb", line(12, 16, 150, 16));
  // turntable
  s.hair(hatch([[18, 176], [170, 176], [174, 182], [22, 182]], 0, 1.5) + hatch([[166, 38], [171, 44], [171, 182], [166, 176]], 90, 1.5));
  s.shape(rect(12, 32, 154, 144, 8), "b");
  s.wash("wg", rect(12, 32, 154, 144, 8));
  const [cx, cy] = [80, 104];
  s.shape(ell(cx, cy, 60));
  s.hair(ellPts(cx, cy, 57.5, 57.5, 48).map(([x, y]) => ell(x, y, 0.5)).join(""));
  s.shape(ell(cx, cy, 53), "b");
  s.wash("wb", ell(cx, cy, 53));
  for (const r of [48, 44, 40.5, 36, 33, 29, 25.5]) s.hair(ell(cx, cy, r));
  s.shape(ell(cx, cy, 18));
  s.wash("wr", ell(cx, cy, 18));
  s.fine(ell(cx, cy, 14) + scribble(cx - 9, cy - 6, 18) + scribble(cx - 7, cy + 7, 14));
  s.shape(ell(cx, cy, 2.4), "f");
  // tonearm
  s.shape(ell(146, 52, 10));
  s.fine(ell(146, 52, 5));
  s.shape(poly(tube([146, 52], [154, 38], 8), true));
  s.shape(poly(tube([146, 52], [112, 100], 4.4), true));
  const head = xf(112, 100, 124);
  s.shape(poly(on(head, rr(-2, -5, 16, 10, 2)), true));
  s.wash("wy", poly(on(head, rr(-2, -5, 16, 10, 2)), true));
  // pitch fader and start button
  s.shape(rect(146, 110, 8, 52, 3), "f");
  s.shape(rect(142, 128, 16, 8, 2));
  for (let k = 0; k < 6; k++) s.hair(line(158, 114 + k * 9, 162, 114 + k * 9));
  s.shape(ell(30, 158, 9));
  s.wash("wm", ell(30, 158, 9));
  s.fine(ell(30, 158, 5.6) + ell(22, 44, 2.2) + ell(156, 166, 2.2));
  // mixer
  s.hair(hatch([[184, 176], [290, 176], [294, 182], [188, 182]], 0, 1.5));
  s.shape(rect(178, 32, 112, 144, 6), "b");
  s.wash("wl", rect(178, 32, 112, 144, 6));
  for (const x of [198, 270])
    for (const y of [48, 68]) {
      s.shape(ell(x, y, 7));
      s.wash("wg", ell(x, y, 7));
      const a = R(-2.4, -0.6);
      s.ink(line(x, y, x + Math.cos(a) * 6.4, y + Math.sin(a) * 6.4));
      for (let k = 0; k < 7; k++) {
        const t = ((-210 + k * 40) * Math.PI) / 180;
        s.hair(line(x + Math.cos(t) * 9, y + Math.sin(t) * 9, x + Math.cos(t) * 11, y + Math.sin(t) * 11));
      }
    }
  [[226, [1, 1, 1, 1, 1, 0, 0]], [236, [1, 1, 1, 1, 0, 0, 0]]].forEach(([x, lit]) =>
    lit.forEach((on2, k) => {
      const bar = rect(x, 82 - k * 7, 7, 5, 1);
      s.shape(bar, "f");
      if (on2) s.wash(k < 3 ? "wm" : k < 4 ? "wy" : "wr", bar);
    }),
  );
  for (const [x, y] of [[198, 124], [270, 108]]) {
    s.shape(rect(x - 3, 92, 6, 56, 3), "f");
    for (let k = 0; k < 6; k++) s.hair(line(x + 7, 96 + k * 9.6, x + 11, 96 + k * 9.6));
    s.shape(rect(x - 9, y - 5, 18, 10, 2));
    s.wash("wx", rect(x - 9, y - 5, 18, 10, 2));
    s.fine(line(x - 9, y, x + 9, y));
  }
  s.shape(rect(196, 158, 76, 6, 3), "f");
  s.shape(rect(222, 153, 12, 16, 2));
  s.wash("wy", rect(222, 153, 12, 16, 2));
  s.fine(line(228, 153, 228, 169) + scribble(214, 104, 40) + ell(234, 126, 6) + scribble(214, 140, 40));
  s.wash("wr", ell(234, 126, 6));
  // a few marks on the label turn with the record
  let marks = ell(cx, cy, 52.6);
  for (const a of [0.4, 2.2, 3.9, 5.3]) marks += line(cx + Math.cos(a) * 21, cy + Math.sin(a) * 21, cx + Math.cos(a) * 50, cy + Math.sin(a) * 50);
  return svg("hobby", W, H, s.done() + `<g class="live"><path class="spin" d="${marks}"/><path class="scan across" d="${line(150, 6, 150, 26)}"/></g>`);
}

export const hobbies = {
  "hobby-soccer": soccer(),
  "hobby-hiking": hiking(),
  "hobby-electronics": electronics(),
  "hobby-agents": agents(),
  "hobby-music": music(),
};
