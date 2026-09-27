/* Dot field: one canvas, paused when the tab is hidden.
   prefers-reduced-motion paints a single static frame and stops. */

(function () {
  const root = document.documentElement;
  const button = document.getElementById("theme");
  const header = document.querySelector(".top");
  const canvas = document.getElementById("field");
  const ctx = canvas.getContext("2d", { alpha: true });
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const scheme = window.matchMedia("(prefers-color-scheme: dark)");
  const fine = window.matchMedia("(pointer: fine)");
  const pointer = { x: -9999, y: -9999, on: false };
  let frame = 0;
  let running = false;
  let frames = 0;

  function appearance() {
    if (root.dataset.theme === "dark" || root.dataset.theme === "light") {
      return root.dataset.theme;
    }
    return scheme.matches ? "dark" : "light";
  }

  function paintTheme() {
    const dark = appearance() === "dark";
    button.textContent = dark ? "Light" : "Dark";
    button.setAttribute("aria-pressed", dark ? "true" : "false");
    button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    const themeMeta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (themeMeta) themeMeta.setAttribute("content", dark ? "#0e0e0c" : "#f3f2ee");
  }

  button.addEventListener("click", function () {
    const next = appearance() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch (err) {
      /* private mode */
    }
    paintTheme();
    if (!running) draw(0);
  });

  scheme.addEventListener("change", function () {
    if (!root.dataset.theme) paintTheme();
  });

  paintTheme();

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 4);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  root.classList.add("js");
  if (!motion.matches && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".reveal").forEach(function (el) {
      io.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(t) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    const gap = w < 700 ? 36 : 30;
    const color = getComputedStyle(root).getPropertyValue("--dot").trim() || "rgba(23,23,20,0.2)";
    ctx.fillStyle = color;
    const time = (t || 0) * 0.001;
    const drift = motion.matches ? 0 : time * 7;
    const cols = Math.ceil(w / gap) + 2;
    const rows = Math.ceil(h / gap) + 2;
    const span = rows * gap;
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        let px = x * gap + (y % 2) * gap * 0.5;
        let py = y * gap + drift;
        py = ((py % span) + span) % span;
        if (!motion.matches) px += Math.sin(time * 0.32 + y * 0.45) * 2.5;
        if (pointer.on && !motion.matches) {
          const dx = px - pointer.x;
          const dy = py - pointer.y;
          const reach = 130;
          const d2 = dx * dx + dy * dy;
          if (d2 < reach * reach && d2 > 1) {
            const d = Math.sqrt(d2);
            const push = (1 - d / reach) * 8;
            px += (dx / d) * push;
            py += (dy / d) * push;
          }
        }
        ctx.fillRect(px, py, 1.35, 1.35);
      }
    }
    frames += 1;
  }

  function stop() {
    running = false;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    root.dataset.field = "paused";
  }

  function loop(t) {
    if (!running) return;
    draw(t);
    frame = requestAnimationFrame(loop);
  }

  function start() {
    resize();
    if (motion.matches || document.hidden) {
      draw(0);
      running = false;
      root.dataset.field = motion.matches ? "static" : "paused";
      return;
    }
    if (running) return;
    running = true;
    root.dataset.field = "live";
    frame = requestAnimationFrame(loop);
  }

  if (fine.matches) {
    window.addEventListener(
      "pointermove",
      function (event) {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.on = true;
      },
      { passive: true }
    );
    window.addEventListener("pointerleave", function () {
      pointer.on = false;
    });
  }

  window.addEventListener("resize", function () {
    resize();
    if (!running) draw(0);
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else start();
  });

  motion.addEventListener("change", start);

  root.__fieldFrames = function () {
    return frames;
  };

  start();
})();
