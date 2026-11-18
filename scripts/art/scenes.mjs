// Section drawings: the campus strip, the contact still-life, schematic rules
// between sections, and the small marks on the timeline.
import { reseed, R, f, poly, line, rect, ell, rectPts, ellPts, hatch, curve, sheet, text, iso, tube, xf, rr, scribble, svg } from "./kit.mjs";

const on = (T, pts) => pts.map(([x, y]) => T(x, y));

// Background: sandstone arcade, tower and palms, with the foothills behind.
function campus() {
  reseed(131);
  const s = sheet();
  const g = 196; // ground line
  // foothills and the dish
  const hills = [[0, 112], [90, 92], [190, 104], [300, 84], [420, 98], [560, 80], [700, 96], [840, 78], [980, 96], [1120, 84]];
  s.fine(curve(hills));
  s.wash("wm", curve(hills) + "L1120 132L0 132Z");
  for (const [a, b, c] of [[60, 90, 150], [270, 300, 380], [520, 560, 640], [800, 840, 930]]) s.hair(hatch([[a, 104], [b, 86], [c, 100], [b + 20, 112]], 62, 3.2, 0.4));
  s.shape(poly([[84, 92], [92, 74], [96, 92]], true), "f");
  s.shape("M70 70Q90 86 110 66Q92 92 70 70Z", "f");
  s.fine(line(90, 76, 99, 60) + ell(99, 60, 1.8) + line(84, 92, 80, 96) + line(96, 92, 100, 96));
  // clouds and birds
  for (const [x, y, w] of [[180, 40, 90], [470, 30, 70], [880, 46, 96]]) {
    s.fine(curve([[x, y], [x + w * 0.12, y - 9], [x + w * 0.3, y - 8], [x + w * 0.42, y - 16], [x + w * 0.62, y - 13], [x + w * 0.74, y - 6], [x + w * 0.92, y - 7], [x + w, y]]) + `L${x} ${y}`);
    s.hair(line(x + w * 0.1, y + 4, x + w * 0.8, y + 4) + line(x + w * 0.25, y + 8, x + w * 0.6, y + 8));
  }
  s.fine("M600 50q4 -5 8 0q4 -5 8 0M640 38q3 -4 6 0q3 -4 6 0M330 56q3 -4 6 0q3 -4 6 0");
  // tower behind the arcade
  const tx = 742;
  s.shape(rect(tx - 19, 52, 38, 80));
  s.wash("wp", rect(tx - 19, 52, 38, 80));
  s.hair(hatch(rectPts(tx + 6, 54, 12, 76), 78, 2.4, 0.3));
  for (let k = 0; k < 5; k++) s.fine(rect(tx - 12, 62 + k * 13, 4, 8) + rect(tx - 2, 62 + k * 13, 4, 8));
  s.shape(rect(tx - 22, 46, 44, 7));
  s.shape(rect(tx - 16, 28, 32, 18));
  s.wash("wp", rect(tx - 16, 28, 32, 18));
  for (const x of [-11, -3, 5]) s.ink(`M${tx + x} 46V37a3 3 0 0 1 6 0V46`);
  s.shape(rect(tx - 18, 24, 36, 5));
  const dome = `M${tx - 13} 24Q${tx - 13} 8 ${tx} 6Q${tx + 13} 8 ${tx + 13} 24Z`;
  s.shape(dome);
  s.wash("wr", dome);
  s.hair(curve([[tx - 7, 23], [tx - 6, 13], [tx, 7]]) + curve([[tx + 7, 23], [tx + 6, 13], [tx, 7]]) + line(tx, 7, tx, 24));
  s.fine(line(tx, 6, tx, -2) + ell(tx, 0, 1.6));
  // arcade: wall, tiled roof, twelve arches
  const x0 = 250;
  const bay = 52;
  const n = 12;
  const wall = rect(x0 - 8, 118, bay * n + 16, g - 118);
  s.shape(wall);
  s.wash("wp", wall);
  const roof = poly([[x0 - 16, 118], [x0 - 4, 100], [x0 + bay * n + 4, 100], [x0 + bay * n + 16, 118]], true);
  s.shape(roof);
  s.wash("wr", roof);
  s.hair(hatch([[x0 - 12, 117], [x0 - 2, 102], [x0 + bay * n + 2, 102], [x0 + bay * n + 12, 117]], 90, 3.6, 0.25));
  s.fine(line(x0 - 9, 109, x0 + bay * n + 9, 109) + line(x0 - 8, 124, x0 + bay * n + 8, 124));
  for (let i = 0; i < n; i++) {
    const x = x0 + i * bay;
    const arch = `M${x + 7} ${g}V154a19 19 0 0 1 38 0V${g}Z`;
    s.shape(arch);
    s.wash("wx", arch);
    s.hair(hatch([[x + 8, g], [x + 8, 154], [x + 13, 142], [x + 26, 136], [x + 39, 142], [x + 44, 154], [x + 44, 166], [x + 30, 160], [x + 18, 170], [x + 14, g]], 55, 2.3, 0.3));
    s.fine(`M${x + 3} 154a23 23 0 0 1 46 0` + line(x + 22, 131, x + 24, 135) + line(x + 30, 131, x + 28, 135) + line(x + 22, 131, x + 30, 131));
    s.hair(line(x + 14, g - 12, x + 38, g - 12));
  }
  for (let i = 0; i <= n; i++) {
    const x = x0 + i * bay;
    s.shape(rect(x - 4, 156, 8, g - 160), "f");
    s.shape(rect(x - 6.5, 152, 13, 4.5), "f");
    s.shape(rect(x - 6.5, g - 5, 13, 5), "f");
    s.hair(line(x + 1.5, 158, x + 1.5, g - 6));
  }
  // entrance pavilion in the middle
  const cx = x0 + bay * 6;
  const face = poly([[cx - 44, g], [cx - 44, 92], [cx, 66], [cx + 44, 92], [cx + 44, g]], true);
  s.shape(face, "b");
  s.wash("wp", face);
  s.fine(poly([[cx - 38, 94], [cx, 72], [cx + 38, 94]]) + ell(cx, 96, 7) + ell(cx, 96, 4) + line(cx - 44, 108, cx + 44, 108));
  const door = `M${cx - 20} ${g}V140a20 20 0 0 1 40 0V${g}Z`;
  s.shape(door);
  s.wash("wx", door);
  s.hair(hatch([[cx - 19, g], [cx - 19, 140], [cx - 12, 126], [cx, 121], [cx + 12, 126], [cx + 19, 140], [cx + 19, 156], [cx + 4, 150], [cx - 10, 164], [cx - 14, g]], 55, 2.3, 0.3));
  s.fine(`M${cx - 25} 140a25 25 0 0 1 50 0` + rect(cx - 36, 116, 9, 14, 4) + rect(cx + 27, 116, 9, 14, 4) + scribble(cx - 22, 113, 44));
  s.hair(hatch([[cx + 20, g], [cx + 20, 112], [cx + 43, 112], [cx + 43, g]], 80, 3, 0.4));
  // ground, lawn, paths
  s.ink(line(0, g, 236, g) + line(x0 - 10, g, x0 + bay * n + 10, g) + line(x0 + bay * n + 24, g, 1120, g));
  s.wash("wm", `M0 ${g}H1120V214Q560 224 0 214Z`);
  s.hair(hatch([[x0, g + 2], [x0 + bay * n, g + 2], [x0 + bay * n + 30, g + 9], [x0 - 30, g + 9]], 2, 2, 0.3));
  s.fine(curve([[cx - 22, g + 2], [cx - 60, 208], [cx - 130, 218]]) + curve([[cx + 22, g + 2], [cx + 60, 208], [cx + 130, 218]]));
  for (let k = 0; k < 26; k++) {
    const x = R(10, 1110);
    const y = g + R(6, 18);
    if (Math.abs(x - cx) < 110) continue;
    s.hair(line(x, y, x - 2, y - 5) + line(x + 2, y, x + 2.5, y - 6) + line(x + 4, y, x + 7, y - 4));
  }
  // palms
  const palm = (x, h, lean) => {
    const topX = x + lean;
    const topY = g - h;
    const trunk = [[x - 4, g], [x - 3 + lean * 0.4, g - h * 0.5], [topX - 2.5, topY], [topX + 2.5, topY], [x + 3 + lean * 0.4, g - h * 0.5], [x + 5, g]];
    s.shape(curve(trunk, true));
    s.wash("wp", curve(trunk, true));
    for (let k = 1; k < h / 5; k++) {
      const t = k / (h / 5);
      const mx = x + lean * t * t;
      s.hair(line(mx - 3.5 + t, g - h * t, mx + 3.5 - t, g - h * t - 1.5));
    }
    for (let k = 0; k < 11; k++) {
      const a = -Math.PI * 0.08 - (k / 10) * Math.PI * 0.84 + R(-0.06, 0.06);
      const len = h * R(0.36, 0.5);
      const droop = len * (0.35 + 0.5 * Math.abs(Math.cos(a)));
      const tip = [topX + Math.cos(a) * len, topY + Math.sin(a) * len * 0.7 + droop * 0.5];
      const mid = [topX + Math.cos(a) * len * 0.55, topY + Math.sin(a) * len * 0.75];
      s.ink(curve([[topX, topY], mid, tip]));
      for (let j = 1; j < 9; j++) {
        const t = j / 9;
        const px = (1 - t) * (1 - t) * topX + 2 * (1 - t) * t * mid[0] + t * t * tip[0];
        const py = (1 - t) * (1 - t) * topY + 2 * (1 - t) * t * mid[1] + t * t * tip[1];
        s.hair(line(px, py, px + R(-2, 2) - Math.cos(a) * 2, py + 5 + t * 3) + line(px, py, px + Math.cos(a) * 4, py - 3 + t * 5));
      }
      s.wash("sm", curve([[topX, topY], mid, tip]));
    }
    s.shape(ell(topX, topY + 1, 4, 3), "f");
    s.hair(hatch(ellPts(x + 6, g + 3, 16, 3, 10), 3, 1.6));
  };
  palm(56, 118, 6);
  palm(150, 142, -8);
  palm(208, 104, 5);
  palm(928, 112, -6);
  palm(990, 146, 8);
  palm(1070, 120, -4);
  // a bicycle leaning by the arcade
  const b = [900, g - 12];
  s.ink(ell(b[0] - 14, b[1], 11) + ell(b[0] + 16, b[1], 11));
  s.fine(ell(b[0] - 14, b[1], 8.6) + ell(b[0] + 16, b[1], 8.6));
  s.ink(poly([[b[0] - 14, b[1]], [b[0] - 4, b[1] - 14], [b[0] + 10, b[1] - 15], [b[0] + 16, b[1]]]) + poly([[b[0] - 4, b[1] - 14], [b[0] + 1, b[1]], [b[0] - 14, b[1]]]) + line(b[0] + 1, b[1], b[0] + 10, b[1] - 15) + line(b[0] - 6, b[1] - 18, b[0] - 1, b[1] - 18) + poly([[b[0] + 10, b[1] - 15], [b[0] + 9, b[1] - 21], [b[0] + 14, b[1] - 22]]));
  return svg("campus", 1120, 222, s.done(), ' preserveAspectRatio="xMidYMid slice"');
}

// Contact: a stamped envelope, a pen, and a paper plane on its way.
function post() {
  reseed(151);
  const s = sheet();
  // flight path and plane
  s.add("dash2", curve([[40, 196], [110, 150], [150, 96], [110, 70], [84, 100], [130, 134], [220, 110], [300, 58]]));
  const P = xf(318, 44, -24);
  const wing = on(P, [[-26, -3], [34, 0], [-22, 20]]);
  s.shape(poly(on(P, [[-26, -3], [34, 0], [-30, -22]]), true));
  s.shape(poly(wing, true));
  s.shape(poly(on(P, [[-26, -3], [-14, 8], [-22, 20]]), true), "f");
  s.hair(hatch(on(P, [[-24, -1], [28, 0], [-21, 17]]), 6, 2.6, 0.3) + line(...P(-26, -3), ...P(34, 0)));
  s.wash("ws", poly(wing, true));
  s.fine(line(...P(-44, -6), ...P(-34, -5)) + line(...P(-48, 4), ...P(-34, 3)) + line(...P(-42, 12), ...P(-32, 10)));
  // envelope
  const E = xf(258, 92, 5);
  s.hair(hatch(on(E, rectPts(8, 10, 220, 128)), 30, 2.4, 0.3));
  s.shape(poly(on(E, rr(0, 0, 220, 128, 3)), true), "b");
  s.wash("wy", poly(on(E, rr(0, 0, 220, 128, 3)), true));
  s.fine(poly(on(E, [[2, 2], [110, 70], [218, 2]])) + line(...E(2, 126), ...E(82, 52)) + line(...E(218, 126), ...E(138, 52)));
  s.hair(hatch(on(E, [[6, 6], [110, 66], [214, 6], [110, 20]]), 4, 3, 0.4));
  for (let k = 0; k < 3; k++) s.fine(scribble(60, 88 + 11 * k, R(70, 100), E));
  // stamp
  const stamp = on(E, rectPts(166, 12, 40, 46));
  s.shape(poly(stamp, true));
  s.add("perf", poly(stamp, true));
  s.wash("wr", poly(stamp, true));
  s.fine(poly(on(E, rectPts(171, 17, 30, 36)), true));
  const [sx, sy] = E(186, 40);
  s.raw(text(sx, sy, "dst", "t mid stamp", ` transform="rotate(5 ${f(sx)} ${f(sy)})"`));
  s.hair(hatch(on(E, rectPts(172, 44, 28, 8)), 60, 2));
  // postmark
  const [mx, my] = E(140, 30);
  s.fine(ell(mx, my, 19) + ell(mx, my, 14));
  s.hair(scribble(mx - 9, my - 2, 18) + scribble(mx - 7, my + 4, 14));
  for (let k = 0; k < 4; k++) s.fine(curve(on(E, [[86, 16 + k * 7], [98, 13 + k * 7], [110, 19 + k * 7], [122, 15 + k * 7]])));
  // pen
  const N = xf(36, 150, 16);
  s.hair(hatch(on(N, rectPts(4, 6, 150, 6)), 4, 1.6));
  s.shape(poly(on(N, rr(0, -6, 118, 12, 4)), true));
  s.wash("wb", poly(on(N, rr(0, -6, 118, 12, 4)), true));
  s.hair(line(...N(6, -2.5), ...N(112, -2.5)) + hatch(on(N, rectPts(84, -5, 30, 10)), 80, 2.4));
  s.shape(poly(on(N, [[118, -5], [140, -3], [158, 0], [140, 3], [118, 5]]), true));
  s.fine(line(...N(140, -3), ...N(140, 3)) + line(...N(144, 0), ...N(158, 0)) + ell(...N(142.5, 0), 1));
  s.shape(poly(on(N, rr(6, -9, 54, 4, 2)), true), "f");
  s.ink(curve([N(158, 0), [200, 196], [214, 202], [226, 194], [240, 204]]));
  return svg("post", 520, 250, s.done());
}

// A rule between sections, drawn as a line of schematic symbols.
function rule(seedValue) {
  reseed(seedValue);
  const y = 14;
  let d = "";
  let x = 0;
  const wire = (len) => {
    d += line(x, y + R(-0.3, 0.3), x + len, y + R(-0.3, 0.3));
    x += len;
  };
  const parts = [
    () => {
      d += poly([[x, y], [x + 4, y - 6], [x + 12, y + 6], [x + 20, y - 6], [x + 28, y + 6], [x + 36, y - 6], [x + 44, y + 6], [x + 48, y]]);
      x += 48;
    },
    () => {
      d += line(x, y - 9, x, y + 9) + line(x + 6, y - 9, x + 6, y + 9);
      x += 6;
    },
    () => {
      d += poly([[x, y - 7], [x, y + 7], [x + 12, y]], true) + line(x + 12, y - 7, x + 12, y + 7) + line(x + 8, y - 11, x + 14, y - 17) + line(x + 13, y - 9, x + 19, y - 15);
      x += 12;
    },
    () => {
      d += ell(x, y, 2.2) + line(x, y + 2, x, y + 8) + line(x - 6, y + 8, x + 6, y + 8) + line(x - 4, y + 11, x + 4, y + 11) + line(x - 2, y + 14, x + 2, y + 14);
    },
    () => {
      for (let k = 0; k < 4; k++) d += `M${f(x + k * 9)} ${y}a4.5 5 0 0 1 9 0`;
      x += 36;
    },
    () => {
      d += ell(x + 9, y, 9) + poly([[x + 4, y], [x + 7, y - 4], [x + 11, y + 4], [x + 14, y]]);
      x += 18;
    },
  ];
  const order = [0, 1, 3, 2, 4, 5, 3, 0, 1, 2];
  wire(R(60, 110));
  for (let k = 0; k < 7; k++) {
    parts[order[(k + seedValue) % order.length]]();
    wire(R(90, 150));
  }
  wire(Math.max(0, 1120 - x));
  return `<svg class="rule" viewBox="0 0 1120 32" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path d="${d}"/></svg>`;
}

// Timeline marks, one per entry, 44 units square.
const marks = {
  // Verdnt Group: a seedling
  verdnt: (s) => {
    s.ink(curve([[22, 38], [21, 28], [22, 18]]));
    for (const [d, m] of [["M22 26Q8 26 7 12Q21 12 22 26Z", [[22, 26], [10, 15]]], ["M22 20Q36 20 37 6Q23 6 22 20Z", [[22, 20], [34, 9]]]]) {
      s.shape(d);
      s.wash("wm", d);
      s.hair(line(...m[0], ...m[1]));
    }
    s.fine(line(12, 38, 32, 38) + line(16, 41, 28, 41));
  },
  // Robust Systems Group: a memory die
  memory: (s) => {
    for (let k = 0; k < 4; k++) s.fine(line(13 + k * 6, 6, 13 + k * 6, 38) + line(6, 13 + k * 6, 38, 13 + k * 6));
    s.shape(rect(9, 9, 26, 26, 2));
    s.wash("ws", rect(9, 9, 26, 26, 2));
    s.fine(rect(13, 13, 18, 18) + line(19, 13, 19, 31) + line(25, 13, 25, 31) + line(13, 19, 31, 19) + line(13, 25, 31, 25));
    s.hair(hatch(rectPts(13, 13, 6, 6), 45, 1.6) + hatch(rectPts(25, 25, 6, 6), 45, 1.6));
  },
  // Amazon Lab126: a robot arm
  robot: (s) => {
    s.shape(rect(6, 34, 18, 5, 1));
    s.shape(poly(tube([15, 34], [15, 22], 6), true));
    s.shape(poly(tube([15, 22], [29, 12], 5), true));
    s.wash("wy", poly(tube([15, 22], [29, 12], 5), true));
    s.shape(poly(tube([29, 12], [35, 22], 4), true));
    s.shape(ell(15, 22, 4)).shape(ell(29, 12, 3.4));
    s.ink(poly([[32, 22], [31, 28], [33, 30]]) + poly([[38, 22], [39, 28], [37, 30]]) + line(31, 22, 39, 22));
    s.hair(hatch(rectPts(7, 35, 16, 3), 60, 1.8));
  },
  // Code Four: a badge
  badge: (s) => {
    const d = "M22 5L36 10V22Q36 33 22 40Q8 33 8 22V10Z";
    s.shape(d);
    s.wash("wb", d);
    s.fine("M22 9L32 12.500V22Q32 30 22 35.500Q12 30 12 22V12.500Z");
    s.ink(poly(ellPts(22, 22, 1, 1, 10, -Math.PI / 2, Math.PI * 1.5).map(([x, y], i) => [22 + (x - 22) * (i % 2 ? 3 : 7.5), 22 + (y - 22) * (i % 2 ? 3 : 7.5)]), true));
  },
  // Duke research: thin films on a substrate
  films: (s) => {
    const P = iso(22, 12, 0.62);
    const layer = (z, h, tint) => {
      const [A, B, C, D, B0, C0, D0] = [P(0, 0, z + h), P(26, 0, z + h), P(26, 26, z + h), P(0, 26, z + h), P(26, 0, z), P(26, 26, z), P(0, 26, z)];
      s.shape(poly([A, B, B0, C0, D0, D], true));
      s.ink(poly([D, C, B]) + line(...C, ...C0));
      s.wash(tint, poly([A, B, B0, C0, D0, D], true));
      s.hair(hatch([D, C, C0, D0], 90, 2));
    };
    layer(-14, 6, "wg");
    layer(-8, 4, "wl");
    layer(-4, 3, "wp");
    layer(-1, 2, "wm");
    for (const [x, y] of [[6, 6], [14, 10], [20, 18], [8, 18]]) s.fine(ell(...P(x, y, 1), 1.4, 0.8));
  },
  // Stanford: a mortarboard
  cap: (s) => {
    s.shape("M12 22V31Q22 37 32 31V22Z");
    s.hair(hatch([[13, 24], [31, 24], [31, 31], [22, 35], [13, 31]], 90, 2.2));
    const top = poly([[22, 9], [40, 18], [22, 27], [4, 18]], true);
    s.shape(top);
    s.wash("wr", top);
    s.fine(ell(22, 18, 1.6) + curve([[22, 18], [34, 21], [36, 30]]) + line(34.5, 30, 37.5, 30) + line(35, 30, 34.5, 36) + line(37, 30, 37.5, 36));
  },
};
const mark = (name) => {
  reseed(171);
  const s = sheet();
  marks[name](s);
  return svg("mark", 44, 44, s.done());
};

// Social marks, 24 units square: the same glyphs as before with pen detail added.
const social = {
  github: `<path d="M9 19c-4 1.5-4-2-6-2.500m12 5v-3.500c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.200s-1.1-.3-3.5 1.300a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.100a4.2 4.2 0 0 0-.1 3.200A4.6 4.6 0 0 0 4 9.500c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/><path class="h" d="M7 8.500l2 2M8.5 7l2.5 2.500M15 7.500l2 2M13.5 8.500l2 2"/>`,
  x: `<path d="M4 3.500h4.200l11.8 17h-4.200zM19.5 3.500L13 11M11 13.500L4.5 20.5"/><path class="h" d="M6.5 5l10 14M7.8 5l9.8 14"/>`,
  linkedin: `<rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M8 10.500v6.500M8 7v.4M12 17v-6.500m0 3a3 3 0 0 1 6 0v3.5"/><path class="h" d="M15 20.500l5.5-5.500M17.5 20.500l3-3"/>`,
  email: `<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3.5 6.500l8.5 7 8.5-7M3.5 18.500l6-6.500M20.5 18.500l-6-6.5"/><path class="h" d="M5 8.500l3 2.500M6 7.500l4 3.5"/>`,
  resume: `<path d="M14 3H6v18h12V7zM14 3v4h4"/><circle cx="10" cy="10" r="1.8"/><path d="M8 14.500h8M8 17.500h6"/><path class="h" d="M14.5 4.500l2.5 2.500M15.5 4l2 2M13 10h3M13 11.500h3"/>`,
};

export const scenes = {
  campus: campus(),
  post: post(),
  "rule-a": rule(3),
  "rule-b": rule(7),
  "rule-c": rule(12),
  "rule-d": rule(19),
  ...Object.fromEntries(Object.keys(marks).map((k) => [`mark-${k}`, mark(k)])),
  ...Object.fromEntries(Object.entries(social).map(([k, v]) => [`icon-${k}`, `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${v}</svg>`])),
};
