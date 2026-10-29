import { INTRO_DURATION } from "./journey.js";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const stops = [
  { position: [10, 9, 15], target: [0, 0.6, 0] },
  { position: [-6, 7, 10], target: [-2.3, 0.6, 0.2] },
  { position: [-9, 8, -2], target: [-1.9, 0.8, -2] },
  { position: [5, 6.5, -9], target: [1.6, 1, -1.9] },
  { position: [11, 7, 4], target: [3, 0.8, 1.2] },
  { position: [9, 13, 17], target: [0, 0.6, 0] },
];
const v3 = (values) => new THREE.Vector3(...values);
const cameraPath = new THREE.CatmullRomCurve3(
  stops.map((s) => v3(s.position)),
  false,
  "catmullrom",
  0.45,
);
const targetPath = new THREE.CatmullRomCurve3(
  stops.map((s) => v3(s.target)),
  false,
  "catmullrom",
  0.45,
);
const smooth = (a, b, value) => THREE.MathUtils.smoothstep(value, a, b);

export function createWorld(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "default",
  });

  renderer.setClearColor(0xeef2f5);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeef2f5);
  scene.fog = new THREE.Fog(0xeef2f5, 27, 65);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentMap = pmrem.fromScene(environment, 0.04);
  scene.environment = environmentMap.texture;
  scene.environmentIntensity = 0.65;
  environment.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xe6f5ff, 0xa6b6c9, 1.4));
  const light = new THREE.DirectionalLight(0xfff5e6, 2.2);
  light.position.set(-4, 12, 7);
  light.castShadow = true;
  light.shadow.mapSize.set(2048, 2048);
  Object.assign(light.shadow.camera, {
    left: -12,
    right: 12,
    top: 12,
    bottom: -12,
    near: 1,
    far: 35,
  });
  light.shadow.normalBias = 0.035;
  light.shadow.bias = -0.0002;
  scene.add(light);
  const fill = new THREE.DirectionalLight(0xc7e4ff, 0.8);
  fill.position.set(8, 6, -7);
  scene.add(fill);
  const material = (color, roughness = 0.5, metalness = 0.05) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const paper = material(0xe6e6dd, 0.75),
    ink = material(0x243b51, 0.35, 0.2),
    blue = material(0x6c94bf, 0.32, 0.15),
    copper = material(0xbd805f, 0.32, 0.6),
    cream = material(0xf6f1e5),
    aluminum = material(0xb8c6d2, 0.3, 0.7),
    dark = material(0x263945, 0.55);
  const workbench = new THREE.Group();
  scene.add(workbench);
  function mesh(parent, geometry, mat, x = 0, y = 0, z = 0) {
    const object = new THREE.Mesh(geometry, mat);
    object.position.set(x, y, z);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  }
  function box(parent, w, h, d, mat, x = 0, y = 0, z = 0, r = 0.06) {
    return mesh(
      parent,
      new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 3, h / 3, d / 3)),
      mat,
      x,
      y,
      z,
    );
  }
  function cylinder(parent, radius, height, mat, x = 0, y = 0, z = 0) {
    return mesh(
      parent,
      new THREE.CylinderGeometry(radius, radius, height, 64),
      mat,
      x,
      y,
      z,
    );
  }
  function line(parent, points, color = 0x8198ac, width = 0.016) {
    const path = new THREE.CatmullRomCurve3(points.map(v3));
    return mesh(
      parent,
      new THREE.TubeGeometry(path, 50, width, 6, false),
      material(color, 0.4, 0.3),
    );
  }
  function label(
    parent,
    text,
    w,
    h,
    x,
    y,
    z,
    color = "#364e65",
    background = "#f1f2ee",
  ) {
    const surface = document.createElement("canvas");
    surface.width = 1536;
    surface.height = 512;
    const ctx = surface.getContext("2d");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, 1536, 512);
    ctx.fillStyle = color;
    ctx.font = "600 114px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 768, 270, 1400);
    const texture = new THREE.CanvasTexture(surface);
    texture.colorSpace = THREE.SRGBColorSpace;
    const plane = mesh(
      parent,
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ map: texture }),
      x,
      y,
      z,
    );
    plane.rotation.x = -Math.PI / 2;
    plane.castShadow = false;
    return plane;
  }
  const floor = mesh(
    scene,
    new THREE.PlaneGeometry(180, 180),
    material(0xeef2f5, 0.9),
    0,
    -0.5,
    0,
  );
  floor.rotation.x = -Math.PI / 2;
  cylinder(workbench, 5.7, 0.32, material(0xcbd6e0, 0.75), 0, -0.25, 0);
  cylinder(workbench, 5.64, 0.08, paper, 0, -0.055, 0);
  const edge = mesh(
    workbench,
    new THREE.TorusGeometry(5.58, 0.025, 8, 160),
    aluminum,
    0,
    0,
    0,
  );
  edge.rotation.x = Math.PI / 2;
  for (let i = 0; i < 3; i++) {
    const ring = mesh(
      workbench,
      new THREE.TorusGeometry(5.25 - i * 0.19, 0.009, 4, 150),
      material(0xc2ced7),
      0,
      0.01,
      0,
    );
    ring.rotation.x = Math.PI / 2;
  }
  // One connected tabletop remains in the scene for the entire camera journey.
  line(
    workbench,
    [
      [-3, 0.03, 1.4],
      [-3.8, 0.03, -0.9],
      [-1.5, 0.03, -3.6],
      [2, 0.03, -3.4],
      [4.5, 0.03, -0.2],
      [3.5, 0.03, 2.8],
      [0.5, 0.03, 3.4],
    ],
    0xb68968,
    0.025,
  );

  const notebook = new THREE.Group();
  notebook.position.set(-2.65, 0.1, 0.5);
  notebook.rotation.y = -0.2;
  workbench.add(notebook);
  box(notebook, 2.25, 0.12, 2.9, blue, 0, 0.05, 0);
  box(notebook, 2.13, 0.16, 2.76, cream, 0.025, 0.16, 0, 0.025);
  box(notebook, 2.23, 0.045, 2.87, blue, 0, 0.26, 0, 0.02);
  box(notebook, 0.035, 0.035, 2.7, copper, 0.72, 0.3, 0, 0.01);
  label(
    notebook,
    "DIEGO",
    1.4,
    0.46,
    -0.08,
    0.289,
    -0.68,
    "#eaf1f7",
    "#6c94bf",
  );
  label(
    notebook,
    "STANFORD EE",
    1.55,
    0.32,
    -0.05,
    0.29,
    0.75,
    "#d7e4f1",
    "#6c94bf",
  );
  const pen = mesh(
    notebook,
    new THREE.CylinderGeometry(0.055, 0.055, 2.7, 16),
    ink,
    1.37,
    0.08,
    0.05,
  );
  pen.rotation.x = Math.PI / 2;
  pen.rotation.z = -0.2;
  const clip = box(notebook, 0.05, 0.06, 0.58, copper, 1.4, 0.15, -0.78, 0.02);
  clip.rotation.y = -0.2;

  const hardware = new THREE.Group();
  hardware.position.set(-1.95, 0.05, -2.65);
  hardware.rotation.y = 0.2;
  workbench.add(hardware);
  box(hardware, 2.7, 0.13, 2.4, material(0x507769, 0.5), 0, 0.12, 0);
  const nodes = [];
  for (let row = 0; row < 3; row++)
    for (let col = 0; col < 3; col++) {
      const node = box(
        hardware,
        0.5,
        0.16,
        0.5,
        row === 1 && col === 1 ? copper : ink,
        (col - 1) * 0.74,
        0.27,
        (row - 1) * 0.65,
        0.035,
      );
      nodes.push(node);
      for (let pin = 0; pin < 4; pin++) {
        box(
          hardware,
          0.035,
          0.045,
          0.13,
          aluminum,
          (col - 1) * 0.74 - 0.18 + pin * 0.12,
          0.21,
          (row - 1) * 0.65 + 0.29,
          0.008,
        );
        box(
          hardware,
          0.035,
          0.045,
          0.13,
          aluminum,
          (col - 1) * 0.74 - 0.18 + pin * 0.12,
          0.21,
          (row - 1) * 0.65 - 0.29,
          0.008,
        );
      }
      if (col < 2)
        line(
          hardware,
          [
            [(col - 1) * 0.74, 0.19, (row - 1) * 0.65],
            [col * 0.74, 0.19, (row - 1) * 0.65],
          ],
          0xaec6a9,
          0.014,
        );
      if (row < 2)
        line(
          hardware,
          [
            [(col - 1) * 0.74, 0.19, (row - 1) * 0.65],
            [(col - 1) * 0.74, 0.19, row * 0.65],
          ],
          0xaec6a9,
          0.014,
        );
    }
  for (const x of [-1.18, 1.18])
    for (const z of [-1, 1])
      cylinder(hardware, 0.045, 0.04, copper, x, 0.21, z);

  const keyboard = new THREE.Group();
  keyboard.position.set(-2.45, 0.13, 2.4);
  keyboard.rotation.y = -0.45;
  workbench.add(keyboard);
  for (let half = 0; half < 2; half++) {
    const side = new THREE.Group();
    side.position.x = half ? 0.73 : -0.73;
    side.rotation.y = half ? -0.14 : 0.14;
    keyboard.add(side);
    box(side, 1.32, 0.17, 1.3, aluminum);
    for (let row = 0; row < 4; row++)
      for (let col = 0; col < 4; col++)
        box(
          side,
          0.245,
          0.15,
          0.235,
          row === 0 && col === 0 ? copper : cream,
          (col - 1.5) * 0.29,
          0.16,
          (row - 1.5) * 0.28,
          0.035,
        );
  }
  line(
    keyboard,
    [
      [-0.35, 0.07, -0.8],
      [-0.4, 0.08, -1.1],
      [0.4, 0.08, -1.1],
      [0.35, 0.07, -0.8],
    ],
    0x526b84,
    0.025,
  );

  const laptop = new THREE.Group();
  laptop.position.set(1.85, 0.18, -2.2);
  laptop.rotation.y = Math.PI * 0.78;
  workbench.add(laptop);
  box(laptop, 2.8, 0.15, 1.9, aluminum, 0, 0, 0, 0.05);
  box(laptop, 2.47, 0.035, 0.95, dark, 0, 0.09, -0.28, 0.025);
  for (let row = 0; row < 4; row++)
    for (let col = 0; col < 10; col++)
      box(
        laptop,
        0.19,
        0.035,
        0.16,
        ink,
        (col - 4.5) * 0.232,
        0.123,
        -0.64 + row * 0.225,
        0.015,
      );
  box(laptop, 0.86, 0.014, 0.46, paper, 0, 0.089, 0.59, 0.05);
  const screen = new THREE.Group();
  screen.position.set(0, 0.02, -0.88);
  screen.rotation.x = -0.18;
  laptop.add(screen);
  box(screen, 2.79, 1.85, 0.1, aluminum, 0, 0.97, 0, 0.07);
  box(screen, 2.59, 1.62, 0.013, dark, 0, 0.99, 0.061, 0.035);
  const screenCanvas = document.createElement("canvas");
  screenCanvas.width = 1024;
  screenCanvas.height = 640;
  const c = screenCanvas.getContext("2d");
  c.fillStyle = "#203246";
  c.fillRect(0, 0, 1024, 640);
  c.fillStyle = "#7a92a6";
  c.font = "22px monospace";
  c.fillText("diego / workspace", 58, 52);
  ["#df9474", "#e7c778", "#9bc1a3"].forEach((color, i) => {
    c.fillStyle = color;
    c.beginPath();
    c.arc(920 + i * 28, 42, 7, 0, Math.PI * 2);
    c.fill();
  });
  const code = [
    "$ build && test",
    "",
    "model → build → measure",
    "",
    "  hardware      research",
    "  software      circuits",
    "",
    "✓ build complete",
  ];
  code.forEach((text, i) => {
    c.fillStyle = i === 0 ? "#c1deec" : i === 7 ? "#9bc1a3" : "#91aabe";
    c.font = (i === 0 ? "29" : "25") + "px monospace";
    c.fillText(text, 65, 145 + i * 49);
  });
  const screenTexture = new THREE.CanvasTexture(screenCanvas);
  screenTexture.colorSpace = THREE.SRGBColorSpace;
  const display = mesh(
    screen,
    new THREE.PlaneGeometry(2.5, 1.55),
    new THREE.MeshBasicMaterial({ map: screenTexture }),
    0,
    0.99,
    0.071,
  );
  display.castShadow = false;

  const intelligence = new THREE.Group();
  intelligence.position.set(3.05, 0.05, 1.15);
  intelligence.rotation.y = -0.45;
  workbench.add(intelligence);
  cylinder(intelligence, 1.12, 0.18, cream, 0, 0.1, 0);
  const graphNodes = [];
  const graphPositions = [
    [-0.6, 0.7, -0.4],
    [0.45, 0.95, -0.45],
    [0.72, 0.52, 0.45],
    [-0.4, 0.45, 0.7],
    [0, 1.35, 0.1],
  ];
  graphPositions.forEach((point, i) => {
    const node = mesh(
      intelligence,
      new THREE.IcosahedronGeometry(i === 4 ? 0.25 : 0.15, 2),
      i === 4 ? copper : blue,
      ...point,
    );
    graphNodes.push(node);
    if (i < 4) line(intelligence, [point, [0, 1.35, 0.1]], 0x8babc2, 0.018);
  });
  label(
    intelligence,
    "AI / APPLICATIONS",
    1.55,
    0.26,
    0,
    0.205,
    0.66,
    "#536b7b",
    "#f6f1e5",
  );
  const plant = new THREE.Group();
  plant.position.set(3.3, 0.05, -1.8);
  workbench.add(plant);
  mesh(
    plant,
    new THREE.CylinderGeometry(0.42, 0.32, 0.58, 32),
    material(0xd1baa4, 0.8),
    0,
    0.29,
    0,
  );
  cylinder(plant, 0.37, 0.045, material(0x6c6255), 0, 0.59, 0);
  for (let i = 0; i < 7; i++) {
    const angle = i * 2.4;
    const leaf = mesh(
      plant,
      new THREE.SphereGeometry(1, 16, 12),
      material(i % 2 ? 0x759285 : 0x54796e),
      Math.cos(angle) * 0.24,
      0.94 + i * 0.045,
      Math.sin(angle) * 0.24,
    );
    leaf.scale.set(0.17, 0.56, 0.07);
    leaf.rotation.set(Math.sin(angle) * 0.5, angle, Math.cos(angle) * 0.5);
  }

  // The processor assembles onto the same board used in the research chapter.
  const processor = nodes[4];
  const signalMaterial = new THREE.MeshBasicMaterial({
    color: 0x8c1515, transparent: true, opacity: 0.7,
  });
  const signals = [];
  for (let i = 0; i < 8; i++) {
    const signal = mesh(hardware, new THREE.SphereGeometry(0.035, 8, 6),
      signalMaterial, 0, 0.21, 0);
    signal.castShadow = false;
    signals.push(signal);
  }
  label(hardware, "STANFORD EE", 1.5, 0.25, 0, 0.194, 1.04,
    "#e8efe9", "#507769");

  // Camera-relative layers keep the floating circuits in view along the scroll path.
  const floating = new THREE.Group();
  camera.add(floating);
  scene.add(camera);
  const floaters = [];
  const circuitMaterial = material(0x507769, 0.45, 0.25);
  const traceMaterial = new THREE.LineBasicMaterial({ color: 0x9cb7a9 });
  for (let i = 0; i < 4; i++) {
    const board = new THREE.Group();
    floating.add(board);
    box(board, 0.88, 1.14, 0.045, circuitMaterial);
    box(board, 0.33, 0.36, 0.08, ink, 0, 0, 0.06, 0.02);
    const traces = [];
    for (let pin = 0; pin < 6; pin++) {
      const y = (pin - 2.5) * 0.13;
      for (const sign of [-1, 1]) {
        traces.push(sign * 0.17, y, 0.035, sign * 0.3, y, 0.035,
          sign * 0.3, y, 0.035, sign * 0.38, y + 0.08, 0.035);
        box(board, 0.09, 0.035, 0.02, copper, sign * 0.2, y, 0.06, 0.006);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(traces, 3));
    board.add(new THREE.LineSegments(geometry, traceMaterial));
    board.traverse((object) => { object.castShadow = object.receiveShadow = false; });
    floaters.push({ object: board,
      x: [0.35, 0.82, 0.65, -0.85][i], y: [0.65, 0.56, -0.7, 0.7][i],
      phase: i * 1.8, board: true });
  }
  const digitMaps = ["0", "1"].map((digit) => {
    const surface = document.createElement("canvas");
    surface.width = surface.height = 128;
    const ctx = surface.getContext("2d");
    ctx.fillStyle = "#426585";
    ctx.font = "500 84px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(digit, 64, 68);
    const texture = new THREE.CanvasTexture(surface);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });
  for (let i = 0; i < 28; i++) {
    const digit = new THREE.Sprite(new THREE.SpriteMaterial({
      map: digitMaps[i % 2], transparent: true, opacity: 0.42, depthTest: true,
    }));
    digit.scale.setScalar(0.26 + (i % 3) * 0.035);
    floating.add(digit);
    const angle = i * 2.39996;
    floaters.push({ object: digit, x: Math.cos(angle) * (0.4 + (i % 4) * 0.17),
      y: Math.sin(angle) * (0.5 + (i % 3) * 0.15), phase: i * 0.7 });
  }
  const webPositions = new Float32Array(28 * 4 * 6);
  const webGeometry = new THREE.BufferGeometry();
  webGeometry.setAttribute("position", new THREE.BufferAttribute(webPositions, 3));
  const webMaterial = new THREE.LineBasicMaterial({
    color: 0x6b8ca7, transparent: true, opacity: 0.16, depthTest: true,
  });
  const web = new THREE.LineSegments(webGeometry, webMaterial);
  web.frustumCulled = false;
  floating.add(web);
  const cursor = new THREE.Vector3();
  const settledPointer = new THREE.Vector2();
  let previousTime = 0, shadowProgress = -1, shadowIntro = -1;
  let width = 1,
    height = 1;
  function resize() {
    width = innerWidth;
    height = innerHeight;
    // Native Retina detail, bounded by total pixels on very large displays.
    renderer.setPixelRatio(Math.min(Math.max(devicePixelRatio || 1, 1.5), 3,
      Math.sqrt(12000000 / (width * height))));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  function render(
    progress,
    introTime = INTRO_DURATION,
    pointer = { x: 0, y: 0 },
    animate = true,
    time = 0,
  ) {
    const intro = THREE.MathUtils.clamp(introTime / INTRO_DURATION, 0, 1);
    const pullback = smooth(0.3, 1, intro);
    const story = THREE.MathUtils.clamp(progress, 0, 1);
    const pathPosition = cameraPath.getPoint(story);
    const lookAt = targetPath.getPoint(story);
    camera.position.lerpVectors(
      new THREE.Vector3(-1.4, 3.8, 1.5),
      pathPosition,
      pullback,
    );
    const target = new THREE.Vector3(-1.95, 0.3, -2.65).lerp(lookAt, pullback);
    if (animate) {
      camera.position.x += pointer.x * 0.18 * pullback;
      camera.position.y += pointer.y * 0.12 * pullback;
    }
    const mobile = width <= 800;
    const offset = pullback * (mobile ? 0.18 : -0.19);
    camera.setViewOffset(
      width,
      height,
      mobile ? 0 : width * offset,
      mobile ? height * offset : 0,
      width,
      height,
    );
    if (mobile) {
      camera.position.sub(target).multiplyScalar(1.6).add(target);
    }
    camera.lookAt(target);
    const seat = smooth(0, 0.85, introTime);
    processor.position.y = 0.27 + (1 - seat) * 2
      + Math.max(0, 1 - Math.abs(story - 0.4) * 6) * 0.16;
    processor.rotation.y = (1 - seat) * 0.45;
    nodes.forEach((node, i) => {
      if (node === processor) return;
      node.position.y = 0.27 + (1 - smooth(0.12, 0.95, introTime)) * (0.5 + i * 0.06)
        + Math.max(0, 1 - Math.abs(story - 0.4) * 6) * (0.11 + Math.sin(i * 1.8) * 0.07);
    });
    signalMaterial.opacity = smooth(0.65, 1, introTime) * 0.7;
    signals.forEach((signal, i) => {
      const phase = ((time * 0.6 + i / signals.length) % 1);
      const angle = Math.floor(i / 2) * Math.PI / 2;
      signal.position.set(Math.cos(angle) * phase * 1.2, 0.21,
        Math.sin(angle) * phase * 1.05);
      signal.visible = introTime > 0.65;
    });
    const delta = Math.min(0.05, Math.max(0, time - previousTime));
    previousTime = time;
    settledPointer.lerp(new THREE.Vector2(pointer.active ? pointer.x : 0,
      pointer.active ? pointer.y : 0), 1 - Math.exp(-delta * 9));
    const viewHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 24;
    const viewWidth = viewHeight * camera.aspect;
    cursor.set(pointer.x * viewWidth, -pointer.y * viewHeight, -24);
    floating.position.set(mobile ? 0 : offset * viewWidth,
      mobile ? -offset * viewHeight : 0, 0);
    const floatReveal = smooth(0.35, 0.75, intro);
    floating.visible = floatReveal > 0;
    webMaterial.opacity = 0.16 * floatReveal;
    const mobileFloat = width <= 800 ? 0.6 : 1;
    floaters.forEach((item) => {
      const object = item.object;
      let x = item.x * viewWidth * 0.5 + Math.sin(time * 0.24 + item.phase) * 0.15;
      let y = item.y * viewHeight * 0.5 + Math.cos(time * 0.3 + item.phase) * 0.13;
      const dx = x - cursor.x, dy = y - cursor.y;
      const distance = Math.hypot(dx, dy);
      const push = pointer.active ? Math.max(0, 1 - distance / 2.6) : 0;
      x += dx / Math.max(distance, 0.01) * push * 0.65;
      y += dy / Math.max(distance, 0.01) * push * 0.65;
      object.position.set(x + settledPointer.x * 0.25, y - settledPointer.y * 0.25, -24);
      if (item.board) {
        object.rotation.set(0.2 + settledPointer.y * 0.5,
          Math.sin(time * 0.2 + item.phase) * 0.25 + settledPointer.x * 0.6,
          Math.sin(item.phase) * 0.25);
        object.scale.setScalar(mobileFloat * floatReveal);
      } else {
        object.material.opacity = floatReveal * mobileFloat * (0.35 + push * 0.6);
      }
    });
    let vertex = 0;
    for (let i = 4; i < floaters.length; i++) {
      for (let j = i + 1; j < floaters.length; j++) {
        const a = floaters[i].object.position, b = floaters[j].object.position;
        if (a.distanceTo(b) > 2 || vertex + 6 > webPositions.length) continue;
        a.toArray(webPositions, vertex);
        b.toArray(webPositions, vertex + 3);
        vertex += 6;
      }
    }
    webGeometry.setDrawRange(0, vertex / 3);
    webGeometry.attributes.position.needsUpdate = true;
    graphNodes.forEach((node, i) => {
      node.rotation.y = story * 2 + i;
    });
    renderer.shadowMap.needsUpdate = story !== shadowProgress || introTime !== shadowIntro;
    shadowProgress = story;
    shadowIntro = introTime;
    renderer.render(scene, camera);
    canvas.dataset.progress = story.toFixed(4);
    canvas.dataset.intro = intro < 1 ? "playing" : "complete";
    canvas.dataset.camera = camera.position
      .toArray()
      .map((n) => n.toFixed(3))
      .join(",");
  }
  function dispose() {
    scene.traverse((object) => {
      object.geometry?.dispose();
      if (object.material) {
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        materials.forEach((mat) => {
          mat.map?.dispose();
          mat.dispose();
        });
      }
    });
    environmentMap.dispose();
    renderer.dispose();
  }
  resize();
  return { render, resize, dispose };
}
