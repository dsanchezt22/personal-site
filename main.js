(() => {
  const root = document.documentElement;
  const entrance = document.querySelector("#entrance");
  const hero = document.querySelector(".hero");
  const motionButton = document.querySelector("#motion");
  const soundButton = document.querySelector("#sound");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(pointer: fine)");
  let motionOn = !reducedMotion.matches;
  let soundOn = false;
  let audio;
  let pendingFrame = 0;
  let closing = false;

  function setMotion() {
    root.classList.toggle("motion-off", !motionOn);
    motionButton.setAttribute("aria-pressed", String(motionOn));
    motionButton.setAttribute(
      "aria-label",
      `Turn motion ${motionOn ? "off" : "on"}`,
    );
    motionButton.querySelector(".control-label").textContent =
      `Motion ${motionOn ? "on" : "off"}`;
    if (!motionOn) {
      root.style.setProperty("--pointer-x", "0px");
      root.style.setProperty("--pointer-y", "0px");
    }
  }

  // Sound starts only after an explicit click and consists of a short glass chime.
  async function chime() {
    if (!soundOn || document.hidden) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) throw new Error("Audio unavailable");
      audio ||= new Audio();
      await audio.resume();
      if (!soundOn || document.hidden) return;
      [523.25, 783.99, 1046.5].forEach((frequency, index) => {
        const tone = audio.createOscillator();
        const gain = audio.createGain();
        const start = audio.currentTime + index * 0.08;
        tone.type = "sine";
        tone.frequency.value = frequency;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.035 / (index + 1), start + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.8);
        tone.connect(gain).connect(audio.destination);
        tone.start(start);
        tone.stop(start + 0.85);
        tone.onended = () => {
          tone.disconnect();
          gain.disconnect();
        };
      });
    } catch {
      soundOn = false;
      paintSound();
      soundButton.setAttribute(
        "aria-label",
        "Sound unavailable in this browser",
      );
      soundButton.querySelector(".control-label").textContent =
        "Sound unavailable";
    }
  }

  function paintSound() {
    soundButton.setAttribute("aria-pressed", String(soundOn));
    soundButton.setAttribute(
      "aria-label",
      `Turn sound ${soundOn ? "off" : "on"}`,
    );
    soundButton.querySelector(".control-label").textContent =
      `Sound ${soundOn ? "on" : "off"}`;
  }

  function leaveEntrance(jumpToWork = false) {
    if (closing || !entrance.open) return;
    closing = true;
    try {
      sessionStorage.setItem("portfolio-entered", "true");
    } catch {
      /* Storage is optional. */
    }
    entrance.classList.add("leaving");
    root.classList.remove("intro-playing");
    root.classList.add("entered");
    const finish = () => {
      entrance.close();
      entrance.classList.remove("leaving");
      closing = false;
      const target = document.querySelector(
        jumpToWork ? "#work-title" : "#hero-title",
      );
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      if (jumpToWork)
        document.querySelector("#work").scrollIntoView({ behavior: "instant" });
    };
    if (motionOn && !jumpToWork) setTimeout(finish, 900);
    else finish();
    chime();
  }

  document
    .querySelector("#enter")
    .addEventListener("click", () => leaveEntrance());
  document
    .querySelector("#enter-quiet")
    .addEventListener("click", () => leaveEntrance(true));
  entrance.addEventListener("cancel", (event) => {
    event.preventDefault();
    leaveEntrance();
  });
  const replay = document.querySelector("#replay");
  replay.addEventListener("click", () => {
    if (closing) return;
    window.scrollTo({ top: 0, behavior: "instant" });
    root.classList.add("intro-playing");
    entrance.showModal();
  });
  motionButton.addEventListener("click", () => {
    motionOn = !motionOn;
    setMotion();
  });
  reducedMotion.addEventListener("change", () => {
    motionOn = !reducedMotion.matches;
    setMotion();
  });
  soundButton.addEventListener("click", () => {
    soundOn = !soundOn;
    paintSound();
    if (soundOn) chime();
    else if (audio) audio.suspend().catch(() => {});
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && audio) audio.suspend().catch(() => {});
  });

  function paintScroll() {
    pendingFrame = 0;
    if (!motionOn || document.hidden) return;
    root.style.setProperty(
      "--scroll",
      String(Math.min(1, scrollY / hero.offsetHeight)),
    );
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!pendingFrame && motionOn)
        pendingFrame = requestAnimationFrame(paintScroll);
    },
    { passive: true },
  );
  hero.addEventListener(
    "pointermove",
    (event) => {
      if (!motionOn || !finePointer.matches || entrance.open) return;
      const bounds = hero.getBoundingClientRect();
      root.style.setProperty(
        "--pointer-x",
        `${(event.clientX / bounds.width - 0.5) * 10}px`,
      );
      root.style.setProperty(
        "--pointer-y",
        `${(event.clientY / bounds.height - 0.5) * 7}px`,
      );
    },
    { passive: true },
  );
  hero.addEventListener("pointerleave", () => {
    root.style.setProperty("--pointer-x", "0px");
    root.style.setProperty("--pointer-y", "0px");
  });
  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => link.addEventListener("click", chime));
  setMotion();
  paintScroll();
  document.querySelector(".experience-controls").hidden = false;
  replay.hidden = false;
  let entered = false;
  try {
    entered = sessionStorage.getItem("portfolio-entered") === "true";
  } catch {
    /* Storage is optional. */
  }
  if (!entered && !location.hash && !reducedMotion.matches) {
    root.classList.add("intro-playing");
    entrance.showModal();
  }
})();
