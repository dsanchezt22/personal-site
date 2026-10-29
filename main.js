import { chapterState, INTRO_DURATION } from "./journey.js";

const root = document.documentElement;
const chapters = [...document.querySelectorAll(".chapter")];
const chapterLinks = [...document.querySelectorAll(".chapter-nav a")];
const motionButton = document.querySelector("#motion");
const soundButton = document.querySelector("#sound");
const intro = document.querySelector("#intro");
const canvas = document.querySelector("#world");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const pointer = { x: 0, y: 0, active: false };
let world,
  immersive = false,
  activeIndex = 0,
  progress = 0,
  targetProgress = 0;
let frame = 0,
  lastTime = 0,
  introStarted = 0,
  introPlaying = false;
let lastInteraction = 0;
let soundOn = false,
  audio;
root.classList.add("enhanced");

function requestFrame() {
  if (!frame && !document.hidden) frame = requestAnimationFrame(paint);
}
function scrollProgress() {
  targetProgress = Math.max(
    0,
    Math.min(
      1,
      scrollY /
        Math.max(1, document.documentElement.scrollHeight - innerHeight),
    ),
  );
  if (!immersive) {
    activeIndex = chapters.findLastIndex(
      (chapter) => chapter.offsetTop <= scrollY + innerHeight * 0.4,
    );
    activeIndex = Math.max(0, activeIndex);
    document.querySelector("#chapter-label").textContent =
      chapters[activeIndex].dataset.label;
  }
  requestFrame();
}
function paint(now) {
  frame = 0;
  if (document.querySelector("dialog[open]")) return;
  if (immersive && !introPlaying && Math.abs(targetProgress - progress) < 0.00003
      && now - lastInteraction > 250 && now - lastTime < 32) {
    requestFrame();
    return;
  }
  const elapsed = Math.min(0.05, (now - lastTime) / 1000 || 0.016);
  lastTime = now;
  if (!immersive) return;
  progress += (targetProgress - progress) * (1 - Math.exp(-elapsed * 12));
  if (Math.abs(targetProgress - progress) < 0.00003) progress = targetProgress;
  const state = chapterState(progress, chapters.length);
  activeIndex = state.index;
  const mobile = innerWidth <= 800;
  chapters.forEach((chapter, index) => {
    const current = index === activeIndex;
    chapter.classList.toggle("current", current);
    chapter.inert = !current || introPlaying;
    chapter.setAttribute("aria-hidden", String(!current || introPlaying));
    const copy = chapter.querySelector(".chapter-copy");
    copy.style.opacity = current ? state.opacity : 0;
    copy.style.transform = `translate3d(${-state.offset * (mobile ? 50 : 110)}px, ${mobile ? 0 : -50}%, 0)`;
    chapterLinks[index].setAttribute("aria-current", String(current));
  });
  document.querySelector("#chapter-label").textContent =
    chapters[activeIndex].dataset.label;
  const introTime = introPlaying ? (now - introStarted) / 1000 : INTRO_DURATION;
  world.render(progress, introTime, pointer, true, now / 1000);
  if (introPlaying && introTime >= INTRO_DURATION) finishIntro();
  if (introPlaying || Math.abs(targetProgress - progress) > 0.00003
      || now - lastInteraction < 1500) requestFrame();
}
function finishIntro() {
  introPlaying = false;
  intro.hidden = true;
  root.classList.remove("intro-active");
  try {
    sessionStorage.setItem("portfolio-introduced", "true");
  } catch {}
  requestFrame();
}
function playIntro() {
  if (!immersive) return;
  if (location.hash) history.replaceState(null, "", "#home");
  window.scrollTo({ top: 0, behavior: "instant" });
  progress = targetProgress = 0;
  introPlaying = true;
  introStarted = performance.now();
  intro.hidden = false;
  root.classList.add("intro-active");
  requestFrame();
}
function setImmersive(enabled) {
  const index = activeIndex;
  if (introPlaying) finishIntro();
  immersive = Boolean(enabled && world && !reducedMotion.matches);
  root.classList.toggle("immersive", immersive);
  root.classList.toggle("motion-off", !immersive);
  motionButton.textContent = immersive ? "Motion on" : "Motion off";
  motionButton.setAttribute("aria-pressed", String(immersive));
  motionButton.setAttribute(
    "aria-label",
    reducedMotion.matches
      ? "Motion disabled by system preference"
      : `Turn motion ${immersive ? "off" : "on"}`,
  );
  motionButton.disabled = reducedMotion.matches || !world;
  chapters.forEach((chapter) => {
    chapter.inert = false;
    chapter.removeAttribute("aria-hidden");
    chapter.querySelector(".chapter-copy").removeAttribute("style");
  });
  document.querySelector(".journey-footer").hidden = false;
  document.querySelector(".chapter-nav").hidden = !immersive;
  document.querySelector("#replay").hidden = !immersive;
  if (immersive) world.resize();
  window.scrollTo({ top: chapters[index].offsetTop, behavior: "instant" });
  scrollProgress();
  progress = targetProgress;
}
function navigate(hash, behavior = "smooth") {
  let target = document.querySelector(hash);
  if (!target) return;
  const dialog = target.closest("dialog");
  if (dialog) {
    document.querySelector(`[data-dialog="${dialog.id}"]`).click();
    return;
  }
  target = target.closest(".chapter");
  if (!target) return;
  if (introPlaying) finishIntro();
  activeIndex = chapters.indexOf(target);
  window.scrollTo({
    top: target.offsetTop,
    behavior: immersive ? behavior : "instant",
  });
  scrollProgress();
}
for (const link of document.querySelectorAll('a[href^="#"]')) {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    if (hash === "#content") {
      if (introPlaying) finishIntro();
      if (immersive) setImmersive(false);
      return;
    }
    event.preventDefault();
    history.pushState(null, "", hash);
    navigate(hash);
    chime();
  });
}
window.addEventListener("popstate", () =>
  navigate(location.hash || "#home", "instant"),
);
document.addEventListener("focusin", (event) => {
  const chapter = event.target.closest(".chapter");
  if (immersive && chapter && !introPlaying) {
    window.scrollTo({ top: chapter.offsetTop, behavior: "instant" });
    scrollProgress();
    progress = targetProgress;
  }
});
for (const button of document.querySelectorAll("[data-dialog]")) {
  button.addEventListener("click", () => {
    const dialog = document.getElementById(button.dataset.dialog);
    dialog.showModal();
    dialog.scrollTop = 0;
  });
}
for (const dialog of document.querySelectorAll("dialog")) {
  dialog.addEventListener("close", requestFrame);
  dialog
    .querySelector(".close-dialog")
    .addEventListener("click", () => dialog.close());
}
async function chime() {
  if (!soundOn || document.hidden) return;
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    audio ||= new Audio();
    await audio.resume();
    if (!soundOn) return;
    [523.25, 783.99].forEach((frequency, index) => {
      const tone = audio.createOscillator(),
        gain = audio.createGain(),
        start = audio.currentTime + index * 0.07;
      tone.frequency.value = frequency;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.025, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.7);
      tone.connect(gain).connect(audio.destination);
      tone.start(start);
      tone.stop(start + 0.75);
      tone.onended = () => {
        tone.disconnect();
        gain.disconnect();
      };
    });
  } catch {
    soundOn = false;
    paintSound();
    soundButton.textContent = "Sound unavailable";
  }
}
function paintSound() {
  soundButton.textContent = soundOn ? "Sound on" : "Sound off";
  soundButton.setAttribute("aria-pressed", String(soundOn));
}
soundButton.addEventListener("click", () => {
  soundOn = !soundOn;
  paintSound();
  if (soundOn) chime();
  else audio?.suspend().catch(() => {});
});
motionButton.addEventListener("click", () => setImmersive(!immersive));
reducedMotion.addEventListener("change", () => {
  if (!world && !reducedMotion.matches) start(false);
  else setImmersive(!reducedMotion.matches);
});
document.querySelector("#skip-intro").addEventListener("click", finishIntro);
document.querySelector("#replay").addEventListener("click", playIntro);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && introPlaying) finishIntro();
});
window.addEventListener("scroll", scrollProgress, { passive: true });
window.addEventListener("resize", () => {
  world?.resize();
  if (immersive) {
    window.scrollTo({
      top: progress * (document.documentElement.scrollHeight - innerHeight),
      behavior: "instant",
    });
  }
  scrollProgress();
});
document.addEventListener(
  "pointermove",
  (event) => {
    if (!immersive || event.pointerType === "touch" || document.querySelector("dialog[open]")) return;
    lastInteraction = performance.now();
    pointer.active = true;
    pointer.x = event.clientX / innerWidth - 0.5;
    pointer.y = event.clientY / innerHeight - 0.5;
    requestFrame();
  },
  { passive: true },
);
function releasePointer() {
  pointer.active = false;
  lastInteraction = performance.now();
  requestFrame();
}
document.documentElement.addEventListener("pointerleave", releasePointer);
window.addEventListener("blur", releasePointer);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    audio?.suspend().catch(() => {});
  } else requestFrame();
});
canvas.addEventListener("webglcontextlost", (event) => {
  event.preventDefault();
  setImmersive(false);
  motionButton.disabled = true;
});

async function start(allowIntro = true) {
  try {
    if (reducedMotion.matches) {
      setImmersive(false);
      return;
    }
    const { createWorld } = await import("./world.js");
    world = createWorld(canvas);
    setImmersive(true);
    let introduced = false;
    try {
      introduced = sessionStorage.getItem("portfolio-introduced") === "true";
    } catch {}
    if (location.hash) {
      navigate(location.hash, "instant");
      progress = targetProgress;
    } else if (allowIntro && !introduced) playIntro();
    requestFrame();
  } catch (error) {
    console.warn("Using the readable portfolio view:", error.message);
    world?.dispose();
    world = undefined;
    setImmersive(false);
  } finally {
    root.classList.remove("booting");
  }
}
start();
