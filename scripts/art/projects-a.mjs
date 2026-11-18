// Project drawings, first half: research and hardware.
import { reseed, R, f, poly, line, rect, ell, rectPts, ellPts, hatch, curve, sheet, text, iso, tube, xf, rr, scribble, svg, box } from "./kit.mjs";

const W = 480;
const H = 270;

// Memory for AI inference: a logic die inside a mesh of memory tiles, next to a
// stacked (HBM-style) memory for comparison.
function memory() {
  reseed(31);
  const s = sheet();
  const P = iso(196, 34);
  const quad = (x, y, w, d, z) => [P(x, y, z), P(x + w, y, z), P(x + w, y + d, z), P(x, y + d, z)];
  // shadow on the bench
  s.hair(hatch([P(-6, 166, -8), P(256, 166, -8), P(262, 150, -8), P(280, 170, -8), P(10, 186, -8)], 8, 3, 0.4));
  box(s, P, 0, 0, -8, 250, 160, 8, { tint: "wm", g: 3.2 });
  for (let x = 6; x < 250; x += 11) s.fine(ell(...P(x, 160, -11), 3.2, 1.7));
  for (let y = 6; y < 160; y += 11) s.fine(ell(...P(250, y, -11), 3.2, 1.7));
  s.fine(poly(quad(4, 4, 242, 152, 0), true));
  // surface wiring: mesh links between neighbouring tiles, and a bus to the stack
  const at = (i) => 10 + i * 50;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      for (let k = 0; k < 4; k++) {
        if (i < 2) s.fine(line(...P(at(i) + 38, at(j) + 9 + 7 * k, 0), ...P(at(i) + 52, at(j) + 9 + 7 * k, 0)));
        if (j < 2) s.fine(line(...P(at(i) + 9 + 7 * k, at(j) + 38, 0), ...P(at(i) + 9 + 7 * k, at(j) + 52, 0)));
      }
  for (let k = 0; k < 7; k++) s.fine(poly([P(150, 64 + 4 * k, 0), P(166 + k * 2, 64 + 4 * k, 0), P(170 + k * 2, 68 + 4 * k, 0), P(184, 68 + 4 * k, 0)]));
  for (const [x, y] of [[170, 20], [190, 26], [214, 18], [232, 34], [176, 128], [204, 140], [228, 124], [236, 146], [164, 146]]) {
    s.fine(ell(...P(x, y, 0), 2.6, 1.4));
    s.fine(poly([P(x, y, 0), P(x + R(8, 16), y, 0), P(x + R(18, 26), y + R(-10, 10), 0)]));
  }
  // tiles, far to near
  for (let sum = 0; sum <= 4; sum++)
    for (let i = 0; i < 3; i++) {
      const j = sum - i;
      if (j < 0 || j > 2) continue;
      const x = at(i);
      const y = at(j);
      if (i === 1 && j === 1) {
        box(s, P, x - 3, y - 3, 0, 46, 46, 13, { tint: "wl" });
        s.fine(poly(quad(x + 2, y + 2, 36, 36, 13), true));
        for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) s.fine(ell(...P(x + 9 + a * 11, y + 9 + b * 11, 13), 2, 1.1));
        s.hair(hatch(quad(x + 2, y + 2, 36, 36, 13), 0, 3.2, 0.3));
        continue;
      }
      box(s, P, x, y, 0, 40, 40, 5, { tint: "ws" });
      s.fine(poly(quad(x + 4, y + 4, 32, 32, 5), true));
      for (let k = 0; k < 4; k++) s.hair(line(...P(x + 8, y + 9 + 7 * k, 5), ...P(x + 32, y + 9 + 7 * k, 5)) + line(...P(x + 8 + 8 * k, y + 8, 5), ...P(x + 8 + 8 * k, y + 32, 5)));
      s.fine(ell(...P(x + 6.5, y + 6.5, 5), 1.6, 0.9));
    }
  // the stack: eight thin dies on a base
  box(s, P, 183, 53, 0, 56, 56, 3, { tint: "wg" });
  for (let k = 0; k < 8; k++) box(s, P, 186, 56, 3 + 6 * k, 50, 50, 6, { tint: k % 2 ? "wp" : "wy", g: 2 });
  s.fine(poly(quad(190, 60, 42, 42, 51), true));
  for (let a = 0; a < 5; a++) for (let b = 0; b < 5; b++) s.fine(ell(...P(195 + a * 8, 65 + b * 8, 51), 1.7, 0.9));
  // dimension and callouts
  const [dx, dy] = P(238, 54, 3);
  s.fine(line(dx + 12, dy, dx + 12, dy - 48) + line(dx + 8, dy, dx + 16, dy) + line(dx + 8, dy - 48, dx + 16, dy - 48) + line(dx + 9, dy - 3, dx + 15, dy + 3) + line(dx + 9, dy - 51, dx + 15, dy - 45));
  s.raw(text(dx + 20, dy - 20, "×8", "t"));
  const [mx, my] = P(10, 30, 5);
  s.fine(poly([[mx, my], [58, 62], [22, 62]]));
  s.raw(text(22, 57, "mesh", "t"));
  const [hx, hy] = P(222, 68, 51);
  s.fine(poly([[hx, hy], [430, 44], [462, 44]]));
  s.raw(text(432, 39, "HBM", "t"));
  // a small unlabelled plot: two curves, no numbers
  const px = 382;
  s.ink(poly([[px, 204], [px, 254], [px + 90, 254]]));
  s.fine(poly([[px - 3, 208], [px, 203], [px + 3, 208]]) + poly([[px + 86, 251], [px + 91, 254], [px + 86, 257]]));
  for (let k = 1; k < 6; k++) s.hair(line(px + 14 * k, 254, px + 14 * k, 257) + line(px - 3, 254 - 8 * k, px, 254 - 8 * k));
  s.ink(curve([[px + 2, 250], [px + 18, 240], [px + 38, 228], [px + 60, 220], [px + 88, 216]]));
  s.fine(curve([[px + 2, 252], [px + 20, 247], [px + 42, 233], [px + 62, 214], [px + 86, 208]]));
  for (const [x, y] of [[18, 240], [38, 228], [60, 220], [42, 233], [62, 214]]) s.shape(ell(px + x, y, 2.2), "f");
  s.fine(scribble(px + 14, 264, 56));
  // packets that hop along the mesh while the card is hovered
  let live = "";
  for (const [i, j, vx, vy] of [[0, 0, 1, 0], [1, 0, 0, 1], [2, 1, 0, 1], [0, 2, 1, 0], [1, 2, 1, 0], [0, 1, 0, -1]]) {
    const a = P(at(i) + 20 + vx * 20, at(j) + 20 + vy * 20, 1);
    const b = P(at(i) + 20 + vx * 32, at(j) + 20 + vy * 32, 1);
    live += `<circle class="hop" cx="${f(a[0])}" cy="${f(a[1])}" r="2.6" style="--dx:${f(b[0] - a[0])}px;--dy:${f(b[1] - a[1])}px"/>`;
  }
  return svg("memory", W, H, s.done() + `<g class="live">${live}</g>`);
}

// ErgoTouch: both halves of the split keyboard from above, with its cables and
// the soldering iron that built it.
function ergotouch() {
  reseed(47);
  const s = sheet();
  const stag = [10, 10, 4, 0, 4, 7];
  const taps = [];
  const half = (T) => {
    const pts = (a) => a.map(([x, y]) => T(x, y));
    const outline = [[-8, 2], [46, 2], [46, -4], [71, -4], [71, -8], [96, -8], [96, -4], [121, -4], [121, -1], [181, -1], [183, 100], [177, 143], [80, 125], [76, 92], [-8, 92]];
    // shadow, then the case
    s.hair(hatch(pts(outline.map(([x, y]) => [x + 5, y + 7])), 20, 2.6, 0.3));
    s.shape(poly(pts(outline), true), "b");
    s.fine(poly(pts(outline.map(([x, y]) => [x < 40 ? x + 3 : x > 150 ? x - 3 : x, y < 40 ? y + 3 : y - 3])), true));
    s.wash("wm", poly(pts(outline), true));
    for (const [x, y] of [[-3, 7], [-3, 87], [176, 4], [172, 136], [86, 119]]) s.fine(ell(...T(x, y), 2.2) + line(...T(x - 1.5, y - 1.5), ...T(x + 1.5, y + 1.5)));
    const key = (x, y, w = 22, h = 22, turn = 0, tintc) => {
      const K = (u, v) => {
        const a = (turn * Math.PI) / 180;
        return T(x + w / 2 + (u - w / 2) * Math.cos(a) - (v - h / 2) * Math.sin(a), y + h / 2 + (u - w / 2) * Math.sin(a) + (v - h / 2) * Math.cos(a));
      };
      const m = (a) => a.map(([u, v]) => K(u, v));
      s.shape(poly(m(rr(0, 0, w, h, 3)), true));
      s.fine(poly(m(rr(3, 2, w - 6, h - 7, 3)), true));
      s.hair(line(...K(4, h - 3.4), ...K(w - 4, h - 3.4)) + line(...K(6, 5), ...K(w - 9, 5)));
      s.wash(tintc ?? "wx", poly(m(rr(0, 0, w, h, 3)), true));
      return poly(m(rr(3, 2, w - 6, h - 7, 3)), true);
    };
    for (let c = 0; c < 6; c++)
      for (let r = 0; r < 3; r++) {
        const top = key(c * 25, stag[c] + r * 25, 22, 22, 0, c === 0 && r === 2 ? "wy" : c === 5 && r === 0 ? "wr" : null);
        if ((c === 2 && r === 1) || (c === 4 && r === 2)) taps.push(top);
      }
    key(84, 86, 22, 22, 8, "ws");
    key(110, 91, 22, 22, 14, "ws");
    key(137, 96, 22, 30, 22, "wr");
    // controller board with its chip and USB socket, and the link jack below it
    s.shape(poly(pts(rr(153, 8, 23, 46, 2)), true));
    s.wash("wl", poly(pts(rr(153, 8, 23, 46, 2)), true));
    s.shape(poly(pts(rr(159, 3, 11, 10, 2)), true), "f");
    s.fine(poly(pts(rr(158, 24, 13, 13, 1)), true) + line(...T(160, 8), ...T(160, 13)) + line(...T(169, 8), ...T(169, 13)));
    s.hair(hatch(pts(rectPts(159, 25, 11, 11)), 45, 2.2));
    for (let k = 0; k < 6; k++) s.fine(ell(...T(155.5, 17 + k * 6.4), 1) + ell(...T(173.5, 17 + k * 6.4), 1));
    s.shape(poly(pts(rr(156, 62, 17, 16, 2)), true));
    s.fine(ell(...T(164.5, 70), 4.5) + ell(...T(164.5, 70), 2));
    return { usb: T(164.5, 3), jack: T(164.5, 78) };
  };
  // bench shadow line
  s.hair(line(20, 244, 200, 246) + line(214, 246, 300, 245) + line(312, 245, 462, 243));
  const L = half(xf(34, 66, -7));
  const Rh = half(xf(446, 66, -7, -1));
  // coiled link cable between the halves
  const mid = [];
  for (let k = 0; k <= 26; k++) {
    const t = k / 26;
    const x = L.jack[0] + (Rh.jack[0] - L.jack[0]) * t;
    const y = L.jack[1] + 26 + Math.sin(t * Math.PI) * 40;
    const coil = t > 0.25 && t < 0.75 ? (k % 2 ? 5 : -5) : 0;
    mid.push([x, y + coil]);
  }
  const link = curve([L.jack, [L.jack[0] + 2, L.jack[1] + 14], ...mid, [Rh.jack[0] - 2, Rh.jack[1] + 14], Rh.jack]);
  s.add("wo", link).raw("").add("wi", link);
  // USB cable leaving the top edge
  const usb = curve([L.usb, [L.usb[0] + 3, L.usb[1] - 16], [L.usb[0] + 22, L.usb[1] - 30], [L.usb[0] + 30, 6], [L.usb[0] + 26, -6]]);
  s.raw("").add("wo", usb).raw("").add("wi", usb);
  s.shape(poly(rr(L.usb[0] - 6, L.usb[1] - 14, 13, 14, 2), true), "f");
  // soldering iron resting at the front, with a curl of smoke
  const I = xf(150, 236, -9);
  const ip = (a) => a.map(([x, y]) => I(x, y));
  s.shape(poly(ip(rr(0, -8, 92, 16, 6)), true));
  s.hair(hatch(ip(rectPts(8, -6, 60, 12)), 80, 3.4, 0.3));
  s.wash("wb", poly(ip(rr(0, -8, 92, 16, 6)), true));
  s.shape(poly(ip([[92, -5], [112, -4], [112, 4], [92, 5]]), true));
  s.shape(poly(ip([[112, -2.6], [156, -2], [172, 0], [156, 2], [112, 2.6]]), true), "f");
  s.hair(hatch(ip([[114, -2], [150, -1.6], [150, 1.6], [114, 2]]), 90, 2.2));
  s.ink(curve([I(0, 0), I(-22, 3), I(-44, -8), I(-70, 2), I(-96, -4), I(-130, 12)]));
  // loose parts: a switch, a keycap and two screws
  const P = iso(300, 228, 0.9);
  box(s, P, 0, 0, 0, 22, 22, 9, { tint: "wg" });
  box(s, P, 5, 5, 9, 12, 12, 7, {});
  s.fine(line(...P(8, 11, 16), ...P(14, 11, 16)) + line(...P(11, 8, 16), ...P(11, 14, 16)));
  const Q = iso(352, 222, 0.9);
  box(s, Q, 0, 0, 0, 24, 24, 5, { tint: "wr" });
  box(s, Q, 3, 3, 5, 18, 18, 6, { tint: "wr" });
  for (const [x, y] of [[404, 240], [424, 232]]) s.shape(ell(x, y, 5, 3.4), "f").fine(line(x - 3, y, x + 3, y) + line(x, y + 3.4, x + 3, y + 12) + line(x - 1, y + 3.4, x + 2, y + 12));
  // a few keys travel while the card is hovered
  const live = taps.map((d, i) => `<path class="tap" style="--i:${i}" d="${d}"/>`).join("");
  return svg("ergotouch", W, H, s.done() + `<g class="live">${live}</g>`);
}

// A bike, rebuilt: mountain bike in profile with the mid-drive motor and the
// 48 V pack in the frame triangle.
function bike() {
  reseed(53);
  const s = sheet();
  const rear = [128, 180];
  const front = [352, 180];
  const bb = [214, 186];
  const seat = [196, 92];
  const headT = [316, 88];
  const headB = [323, 118];
  // far hills and ground
  s.fine(curve([[0, 150], [50, 132], [110, 142], [170, 120], [240, 136], [300, 118], [380, 138], [430, 124], [480, 140]]));
  s.hair(hatch([[150, 126], [170, 120], [240, 136], [200, 140]], 70, 3, 0.4) + hatch([[280, 124], [300, 118], [380, 138], [330, 140]], 70, 3, 0.4));
  s.wash("wm", curve([[0, 150], [50, 132], [110, 142], [170, 120], [240, 136], [300, 118], [380, 138], [430, 124], [480, 140]]) + "L480 168L400 160L300 172L180 162L80 174L0 164Z");
  s.ink(line(8, 244, 96, 244) + line(104, 245, 300, 244) + line(310, 244, 472, 245));
  s.hair(hatch(ellPts(128, 250, 58, 6, 14), 4, 2, 0.3) + hatch(ellPts(352, 250, 58, 6, 14), 4, 2, 0.3) + hatch(ellPts(240, 252, 40, 4, 12), 4, 2, 0.3));
  for (let k = 0; k < 9; k++) {
    const x = R(10, 470);
    s.fine(line(x, 248, x - 3, 240) + line(x + 2, 248, x + 3, 239) + line(x + 4, 248, x + 8, 242));
  }
  let live = "";
  const wheel = ([cx, cy], id) => {
    s.shape(ell(cx, cy, 58), "b");
    s.wash("wx", ell(cx, cy, 58));
    for (const [x, y] of ellPts(cx, cy, 1, 1, 40)) {
      const [ux, uy] = [x - cx, y - cy];
      s.ink(line(cx + ux * 57, cy + uy * 57, cx + ux * 62, cy + uy * 62));
    }
    s.ink(ell(cx, cy, 50) + ell(cx, cy, 46.5));
    s.hair(hatch(ellPts(cx, cy, 57, 57, 30).concat(ellPts(cx, cy, 51, 51, 30).reverse()), 40, 2.4, 0.3));
    let spokes = "";
    for (let k = 0; k < 28; k++) {
      const a = (k / 28) * Math.PI * 2;
      const b = a + (k % 2 ? 0.42 : -0.42);
      spokes += line(cx + 5 * Math.cos(a), cy + 5 * Math.sin(a), cx + 46 * Math.cos(b), cy + 46 * Math.sin(b));
    }
    live += `<path class="spin ${id}" d="${spokes}${ell(cx, cy, 46.2)}"/>`;
    s.shape(ell(cx, cy, 17), "f");
    s.fine(ell(cx, cy, 13));
    for (const [x, y] of ellPts(cx, cy, 15, 15, 8)) s.fine(ell(x, y, 1.1));
    s.shape(ell(cx, cy, 6.5));
    s.fine(ell(cx, cy, 2.5));
  };
  wheel(rear, "a");
  wheel(front, "b");
  const bar = (a, b, w, tint = "wb") => {
    s.shape(poly(tube(a, b, w), true));
    s.hair(line(...tube(a, b, w * 0.4)[0], ...tube(a, b, w * 0.4)[1]));
    if (tint) s.wash(tint, poly(tube(a, b, w), true));
  };
  // rear triangle, then chain and gears, then the main frame over them
  bar(rear, [199, 114], 4.5);
  bar(rear, bb, 5.5);
  s.shape(ell(rear[0], rear[1], 11), "f");
  for (const [x, y] of ellPts(rear[0], rear[1], 1, 1, 18)) s.fine(line(rear[0] + (x - rear[0]) * 10.5, rear[1] + (y - rear[1]) * 10.5, rear[0] + (x - rear[0]) * 13, rear[1] + (y - rear[1]) * 13));
  s.fine(ell(rear[0], rear[1], 7.5));
  s.add("dash", line(rear[0] + 2, rear[1] - 12, bb[0], bb[1] - 17) + line(rear[0] - 4, rear[1] + 26, bb[0] - 4, bb[1] + 17));
  s.shape(poly([[rear[0] - 2, rear[1] + 8], [rear[0] + 6, rear[1] + 10], [rear[0] + 2, rear[1] + 30], [rear[0] - 8, rear[1] + 28]], true), "f");
  s.fine(ell(rear[0] + 1, rear[1] + 15, 3.4) + ell(rear[0] - 3, rear[1] + 26, 3.4));
  // motor housing at the cranks
  const M = xf(bb[0], bb[1], -58);
  const mp = (a) => a.map(([x, y]) => M(x, y));
  s.shape(poly(mp(rr(-4, -15, 46, 30, 9)), true));
  for (let k = 0; k < 7; k++) s.fine(line(...M(8 + k * 4.4, -13), ...M(8 + k * 4.4, 13)));
  s.wash("wg", poly(mp(rr(-4, -15, 46, 30, 9)), true));
  s.shape(ell(bb[0], bb[1], 21));
  s.wash("wg", ell(bb[0], bb[1], 21));
  for (const [x, y] of ellPts(bb[0], bb[1], 1, 1, 26)) s.fine(line(bb[0] + (x - bb[0]) * 16, bb[1] + (y - bb[1]) * 16, bb[0] + (x - bb[0]) * 18.6, bb[1] + (y - bb[1]) * 18.6));
  s.ink(ell(bb[0], bb[1], 16));
  s.fine(ell(bb[0], bb[1], 11));
  for (const [x, y] of ellPts(bb[0], bb[1], 7.5, 7.5, 5)) s.fine(ell(x, y, 1.8));
  // frame
  bar(bb, [seat[0] + 1, seat[1] + 4], 6.5);
  bar([198, 104], [317, 97], 6);
  bar(bb, [321, 113], 8);
  // battery pack on the down tube
  const ang = (Math.atan2(113 - bb[1], 321 - bb[0]) * 180) / Math.PI;
  const Bt = xf(bb[0], bb[1], ang);
  const bp = (a) => a.map(([x, y]) => Bt(x, y));
  s.shape(poly(bp(rr(26, -30, 86, 24, 7)), true), "b");
  s.wash("wy", poly(bp(rr(26, -30, 86, 24, 7)), true));
  s.fine(poly(bp(rr(30, -27, 78, 18, 5)), true) + line(...Bt(44, -30), ...Bt(44, -6)) + line(...Bt(48, -30), ...Bt(48, -6)) + line(...Bt(92, -30), ...Bt(92, -6)) + line(...Bt(96, -30), ...Bt(96, -6)));
  for (let k = 0; k < 4; k++) s.fine(ell(...Bt(100 + k * 3.2, -18), 1));
  s.hair(hatch(bp(rectPts(52, -12, 38, 5)), ang + 60, 2.2));
  const [tx, ty] = Bt(54, -15);
  s.raw(text(tx, ty, "48 V", "t", ` transform="rotate(${f(ang)} ${f(tx)} ${f(ty)})"`));
  s.ink(curve([Bt(28, -18), Bt(18, -22), Bt(10, -12), M(30, -12)]));
  s.shape(poly(tube(headT, headB, 9), true));
  s.wash("wb", poly(tube(headT, headB, 9), true));
  // suspension fork
  const fk = [headB[0] + 2, headB[1] + 2];
  const midF = [fk[0] + (front[0] - fk[0]) * 0.48, fk[1] + (front[1] - fk[1]) * 0.48];
  bar(fk, midF, 4.5, null);
  s.hair(hatch(tube(fk, midF, 4.5), 20, 2));
  bar(midF, front, 8, "wg");
  s.shape(poly(tube([fk[0] - 6, fk[1] + 1], [fk[0] + 7, fk[1] - 2], 6), true), "f");
  s.fine(ell(front[0], front[1], 4));
  // cockpit
  bar(headT, [330, 74], 5, "wg");
  s.shape(ell(332, 72, 6.5, 5));
  s.wash("wr", ell(332, 72, 6.5, 5));
  s.ink(curve([[336, 74], [346, 80], [352, 88]]) + curve([[322, 96], [332, 120], [344, 150], [350, 168]]));
  // seat
  bar(seat, [192, 76], 4, "wg");
  const saddle = curve([[170, 73], [182, 69], [198, 70], [214, 68], [218, 72], [206, 76], [186, 77]], true);
  s.shape(saddle);
  s.wash("wr", saddle);
  s.hair(hatch([[176, 74], [212, 71], [206, 76], [186, 77]], 10, 1.8));
  // crank and pedals
  bar(bb, [231, 211], 5, "wg");
  s.shape(rect(222, 209, 20, 6, 2));
  s.fine(line(226, 209, 226, 215) + line(232, 209, 232, 215) + line(238, 209, 238, 215));
  s.shape(ell(bb[0], bb[1], 4));
  // motion and a few pebbles
  s.fine(line(18, 150, 50, 150) + line(8, 170, 44, 170) + line(22, 192, 52, 192) + line(30, 212, 54, 212));
  for (const [x, y] of [[84, 252], [182, 256], [270, 254], [300, 258], [420, 254], [446, 258]]) s.fine(ell(x, y, R(1.5, 3), 1.4));
  return svg("bike", W, H, s.done() + `<g class="live">${live}</g>`);
}

// Logic you can touch: the adder on a breadboard, its two-digit display, and the
// same sum worked by hand.
function logic() {
  reseed(61);
  const s = sheet();
  const col = (i) => 34 + 8 * i;
  // breadboard
  s.hair(hatch([[26, 238], [336, 238], [342, 244], [32, 244]], 0, 1.6) + hatch([[336, 44], [342, 50], [342, 244], [336, 238]], 90, 1.6));
  s.shape(rect(22, 36, 314, 202, 5), "b");
  s.wash("wy", rect(22, 36, 314, 202, 5));
  s.fine(rect(26, 40, 306, 194, 3) + line(28, 68, 330, 68) + line(28, 206, 330, 206));
  s.add("dots", [50, 58, 216, 224].map((y) => line(col(0), y, col(36), y)).join("") + [84, 92, 100, 108, 116, 148, 156, 164, 172, 180].map((y) => line(col(0), y, col(36), y)).join(""));
  s.fine(line(30, 45, 328, 45) + line(30, 63, 328, 63) + line(30, 211, 328, 211) + line(30, 229, 328, 229));
  s.wash("sr", line(30, 45, 328, 45) + line(30, 211, 328, 211)).wash("sb", line(30, 63, 328, 63) + line(30, 229, 328, 229));
  s.ink(line(28, 126, 330, 126) + line(28, 138, 330, 138));
  s.hair(hatch(rectPts(28, 127, 302, 10), 60, 3, 0.4));
  // DIP switch bank for the two 4-bit inputs
  s.shape(rect(col(2) - 5, 80, 74, 30, 2));
  s.wash("wr", rect(col(2) - 5, 80, 74, 30, 2));
  for (let k = 0; k < 8; k++) {
    const up = [1, 0, 1, 1, 0, 1, 0, 0][k];
    s.shape(rect(col(2) + k * 8 - 2.6, 85, 5.2, 16, 1), "f");
    s.add("solid", rect(col(2) + k * 8 - 2.6, up ? 85 : 94, 5.2, 7, 1));
  }
  s.fine(scribble(col(2), 106, 58));
  // three ICs across the trench
  const chip = (c0, n, name) => {
    const x = col(c0) - 5;
    const w = (n - 1) * 8 + 10;
    for (let k = 0; k < n; k++) s.shape(rect(col(c0 + k) - 1.8, 113, 3.6, 6), "f").shape(rect(col(c0 + k) - 1.8, 145, 3.6, 6), "f");
    s.hair(hatch([[x, 147], [x + w, 147], [x + w + 3, 150], [x + 3, 150]], 0, 1.2));
    s.shape(rect(x, 117, w, 30, 2), "b");
    s.wash("wg", rect(x, 117, w, 30, 2));
    s.ink(`M${x} ${127}a5 5 0 0 1 0 10`);
    s.fine(ell(x + 6, 142, 1.6));
    s.hair(hatch(rectPts(x + 2, 119, w - 4, 26), 35, 4, 0.5));
    s.raw(text(x + w / 2 + 2, 136, name, "t mid"));
  };
  chip(3, 7, "7486");
  chip(13, 8, "7483");
  chip(24, 8, "7447");
  // jumper wires
  const wire = (x1, y1, x2, y2, lift, c) => {
    const d = curve([[x1, y1], [x1 + (x2 - x1) * 0.2, y1 - lift], [x1 + (x2 - x1) * 0.8, y2 - lift], [x2, y2]]);
    s.raw("").add("wo", d).raw("").add("wi", d).wash("kx", d).wash(c, d);
    s.fine(ell(x1, y1, 1.6) + ell(x2, y2, 1.6));
  };
  wire(col(1), 50, col(3), 108, 10, "sr");
  wire(col(11), 58, col(9), 156, -8, "sb");
  wire(col(12), 50, col(13), 108, 6, "sr");
  wire(col(22), 58, col(20), 164, -10, "sb");
  wire(col(4), 100, col(14), 100, 16, "sy");
  wire(col(5), 92, col(15), 92, 20, "sm");
  wire(col(7), 100, col(17), 108, 12, "sy");
  wire(col(8), 92, col(18), 84, 18, "sm");
  wire(col(5), 156, col(14), 164, -14, "sy");
  wire(col(7), 164, col(16), 172, -16, "sm");
  wire(col(15), 156, col(25), 156, -12, "sb");
  wire(col(17), 164, col(27), 164, -14, "sy");
  wire(col(18), 172, col(28), 172, -12, "sm");
  wire(col(19), 180, col(29), 180, -10, "sr");
  wire(col(23), 50, col(24), 108, 8, "sr");
  wire(col(34), 58, col(31), 148, -6, "sb");
  // sum LEDs and their resistors
  for (let k = 0; k < 4; k++) {
    const x = col(32 + k);
    s.shape(ell(x, 88, 4.6), "i");
    s.fine(ell(x, 88, 2.4) + line(x - 1.5, 92.4, x - 1.5, 100) + line(x + 1.5, 92.4, x + 1.5, 100));
    s.wash(k % 2 ? "wr" : "wy", ell(x, 88, 4.6));
    s.fine(line(x - 5, 80, x - 7, 77) + line(x, 80, x, 76) + line(x + 5, 80, x + 7, 77));
  }
  for (let k = 0; k < 7; k++) {
    const x = col(24 + k) + 0.5;
    s.fine(line(x, 150, x, 190));
    s.shape(rect(x - 2.6, 160, 5.2, 16, 2), "f");
    s.fine(line(x - 2.6, 164, x + 2.6, 164) + line(x - 2.6, 168, x + 2.6, 168) + line(x - 2.6, 172, x + 2.6, 172));
    s.wash("wp", rect(x - 2.6, 160, 5.2, 16, 2));
  }
  // ribbon to the display board
  for (let k = 0; k < 7; k++) s.fine(curve([[col(24 + k) + 0.5, 190], [col(24 + k) + 6, 204 + k], [330 + k * 2, 196 - k * 6], [372, 150 - k * 4], [388 + k * 1.5, 134 - k * 2]]));
  // two-digit display on its own small board
  s.hair(hatch([[366, 138], [470, 138], [474, 143], [370, 143]], 0, 1.4) + hatch([[470, 30], [474, 35], [474, 143], [470, 138]], 90, 1.4));
  s.shape(rect(362, 26, 108, 112, 3), "b");
  s.wash("wm", rect(362, 26, 108, 112, 3));
  for (const [x, y] of [[368, 32], [464, 32], [368, 132], [464, 132]]) s.fine(ell(x, y, 2.2));
  s.shape(rect(372, 36, 88, 84, 2));
  s.wash("wg", rect(372, 36, 88, 84, 2));
  for (let k = 0; k < 10; k++) s.fine(ell(378 + k * 8.4, 128, 1.5));
  const hex = (x0, y0, x1, y1) =>
    y0 === y1
      ? [[x0, y0], [x0 + 3, y0 - 3], [x1 - 3, y0 - 3], [x1, y0], [x1 - 3, y0 + 3], [x0 + 3, y0 + 3]]
      : [[x0, y0], [x0 + 3, y0 + 3], [x0 + 3, y1 - 3], [x0, y1], [x0 - 3, y1 - 3], [x0 - 3, y0 + 3]];
  const segs = (ox, oy) => {
    const w = 24;
    const h = 58;
    return {
      a: hex(ox + 2, oy, ox + w - 2, oy),
      g: hex(ox + 2, oy + h / 2, ox + w - 2, oy + h / 2),
      d: hex(ox + 2, oy + h, ox + w - 2, oy + h),
      f: hex(ox, oy + 2, ox, oy + h / 2 - 2),
      b: hex(ox + w, oy + 2, ox + w, oy + h / 2 - 2),
      e: hex(ox, oy + h / 2 + 2, ox, oy + h - 2),
      c: hex(ox + w, oy + h / 2 + 2, ox + w, oy + h - 2),
    };
  };
  const glyph = { 0: "abcdef", 1: "bc", 3: "abgcd", 5: "afgcd", 7: "abc", 8: "abcdefg" };
  const digits = [segs(384, 49), segs(424, 49)];
  for (const dgt of digits) s.fine(Object.values(dgt).map((p) => poly(p, true)).join(""));
  // two readings; the card alternates between them on hover
  const reading = (a, b, cls) =>
    `<path class="lit ${cls}" d="${[a, b].map((n, i) => [...glyph[n]].map((k) => poly(digits[i][k], true)).join("")).join("")}"/>`;
  const live = reading(1, 5, "one") + reading(0, 8, "two");
  // the sum worked out by hand on a scrap of paper
  const N = xf(366, 162, -4);
  const np = (a) => a.map(([x, y]) => N(x, y));
  s.hair(hatch(np(rectPts(4, 5, 100, 92)), 35, 2.4, 0.3));
  s.shape(poly(np(rr(0, 0, 100, 92, 2)), true), "b");
  s.wash("wx", poly(np(rr(0, 0, 100, 92, 2)), true));
  [["0111", 22], ["1000", 40], ["1111", 66]].forEach(([bits, y], k) => {
    [...bits].forEach((bit, i) => {
      const [tx, ty] = N(40 + i * 13, y);
      s.raw(text(tx, ty, bit, "t mid", ` transform="rotate(-4 ${f(tx)} ${f(ty)})"`));
    });
    if (k === 1) s.ink(line(...N(14, y - 6), ...N(22, y - 6)) + line(...N(18, y - 10), ...N(18, y - 2)) + line(...N(12, y + 8), ...N(88, y + 8)));
  });
  s.fine(scribble(14, 82, 60, N));
  s.shape(poly(tube(N(70, 96), N(122, 74), 6), true));
  s.wash("wy", poly(tube(N(70, 96), N(122, 74), 6), true));
  s.shape(poly([N(70, 93), N(60, 100), N(71, 99)], true), "f");
  return svg("logic", W, H, s.done() + `<g class="live">${live}</g>`);
}

export const projectsA = { memory: memory(), ergotouch: ergotouch(), bike: bike(), logic: logic() };
