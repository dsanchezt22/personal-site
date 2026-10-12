(() => {
  const root = document.documentElement;
  const entrance = document.querySelector("#entrance");
  const hero = document.querySelector(".hero");
  const motionButton = document.querySelector("#motion");
  const soundButton = document.querySelector("#sound");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(pointer: fine)");
  const wideScene = matchMedia("(min-width: 901px) and (min-height: 700px)");
  let motionOn = !reducedMotion.matches;
  let soundOn = false;
  let audio;
  let pendingFrame = 0;
  let closing = false;
  let scrollScenes = [];

  function setMotion() {
    if (reducedMotion.matches) motionOn = false;
    root.classList.toggle("motion-off", !motionOn);
    motionButton.disabled = reducedMotion.matches;
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
    buildScrollScenes();
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

  // Paused native animations follow scroll position, so reversing scroll reverses the scene.
  function addScene(selector, motions, pinned = false) {
    const track = document.querySelector(selector);
    const animations = motions.map(
      ([target, keyframes, start = 0, end = 1]) => {
        const animation = track.querySelector(target).animate(keyframes, {
          duration: 1000,
          fill: "both",
        });
        animation.pause();
        return { animation, start, end };
      },
    );
    scrollScenes.push({ track, animations, pinned });
  }

  function buildScrollScenes() {
    const anchor = [
      ...document.querySelectorAll(
        ".hero, .verdnt-main, #work, #research, #developer, #about, #contact",
      ),
    ].find((element) => {
      const bounds = element.getBoundingClientRect();
      return bounds.top <= innerHeight / 2 && bounds.bottom > innerHeight / 2;
    });
    const anchorTop = anchor?.getBoundingClientRect().top;
    const keepReadingPosition = () => {
      if (anchor)
        window.scrollBy({
          top: anchor.getBoundingClientRect().top - anchorTop,
          behavior: "instant",
        });
    };
    scrollScenes.forEach(({ animations }) =>
      animations.forEach(({ animation }) => animation.cancel()),
    );
    scrollScenes = [];
    root.classList.toggle("scroll-motion", motionOn);
    if (!motionOn) {
      keepReadingPosition();
      return;
    }

    addScene(
      ".hero-journey",
      [
        [
          ".hero-scene",
          {
            transform: wideScene.matches
              ? [
                  "translate3d(0, 0, 0) scale(1)",
                  "translate3d(-8%, 6%, 0) scale(1.38)",
                ]
              : [
                  "translate3d(0, -45px, 0) scale(.95)",
                  "translate3d(0, 85px, 0) scale(1.12)",
                ],
          },
        ],
        ...(wideScene.matches
          ? [
              [
                ".hero-copy",
                {
                  transform: ["translateY(0)", "translateY(-110px)"],
                  opacity: [1, 0],
                  pointerEvents: ["auto", "none"],
                },
                0.08,
                0.5,
              ],
              [
                ".hero-chapter",
                {
                  transform: ["translateY(90px)", "translateY(0)"],
                  opacity: [0, 1],
                },
                0.45,
                0.85,
              ],
              [
                ".scene-note",
                { opacity: [1, 0], visibility: ["visible", "hidden"] },
                0.1,
                0.35,
              ],
            ]
          : []),
      ],
      wideScene.matches,
    );

    addScene(
      ".verdnt-journey",
      [
        [
          ".tea-bottle",
          {
            transform: [
              "translateY(55px) rotate(-24deg) scale(.86)",
              "translateY(-20px) rotate(14deg) scale(1.16)",
            ],
          },
        ],
        [
          ".bottle-liquid",
          { transform: ["scaleY(.12)", "scaleY(1)"] },
          0.05,
          0.85,
        ],
        [
          ".orbit-one",
          {
            transform: [
              "rotate(-35deg) scale(.8)",
              "rotate(55deg) scale(1.08)",
            ],
          },
        ],
        [".orbit-two", { transform: ["rotate(30deg)", "rotate(-45deg)"] }],
        [
          ".ingredient-one",
          { transform: ["translate(-45px, 50px)", "translate(15px, -20px)"] },
        ],
        [
          ".ingredient-two",
          { transform: ["translate(35px, 40px)", "translate(-20px, -30px)"] },
        ],
        [
          ".ingredient-three",
          { transform: ["translate(-30px, 20px)", "translate(25px, -25px)"] },
        ],
      ],
      wideScene.matches,
    );

    addScene("#research", [
      [
        ".memory-mesh",
        {
          transform: [
            "rotate(-55deg) skew(10deg, 10deg) scale(.68)",
            "rotate(5deg) skew(10deg, 10deg) scale(1.22)",
          ],
        },
      ],
      [
        ".research-top",
        { transform: ["translateY(75px)", "translateY(0)"], opacity: [0.2, 1] },
        0,
        0.35,
      ],
      [
        ".hardware-list",
        { transform: ["translateY(95px)", "translateY(-15px)"] },
        0.15,
        0.8,
      ],
    ]);
    addScene("#developer", [
      [
        ".course-notebook",
        {
          transform: [
            "translateY(100px) rotate(-7deg) scale(.92)",
            "translateY(-20px) rotate(2deg) scale(1)",
          ],
        },
        0,
        0.75,
      ],
      [
        ".developer-copy",
        { transform: ["translateY(65px)", "translateY(0)"], opacity: [0.2, 1] },
        0,
        0.38,
      ],
    ]);
    addScene("#work", [
      [
        ".section-heading",
        {
          transform: ["translateX(-60px)", "translateX(0)"],
          opacity: [0.2, 1],
        },
        0,
        0.45,
      ],
    ]);
    addScene("#about", [
      [
        ".about-intro",
        { transform: ["translateY(70px)", "translateY(0)"], opacity: [0.2, 1] },
        0,
        0.4,
      ],
    ]);
    addScene("#contact", [
      [
        ".contact-art",
        { transform: ["rotate(-25deg) scale(.6)", "rotate(0deg) scale(1)"] },
        0,
        0.55,
      ],
      [
        "h2",
        { transform: ["translateY(50px)", "translateY(0)"], opacity: [0.2, 1] },
        0,
        0.5,
      ],
    ]);
    keepReadingPosition();
    paintScroll();
  }

  function paintScroll() {
    pendingFrame = 0;
    if (!motionOn || document.hidden) return;
    const frames = scrollScenes.map((scene) => {
      const bounds = scene.track.getBoundingClientRect();
      const progress = scene.pinned
        ? -bounds.top / Math.max(1, bounds.height - innerHeight)
        : (innerHeight - bounds.top) / (innerHeight + bounds.height);
      return { ...scene, progress };
    });
    frames.forEach(({ animations, progress }) => {
      animations.forEach(({ animation, start, end }) => {
        animation.currentTime =
          Math.max(0, Math.min(1, (progress - start) / (end - start))) * 1000;
      });
    });
  }

  function requestScrollFrame() {
    if (!pendingFrame && motionOn)
      pendingFrame = requestAnimationFrame(paintScroll);
  }
  window.addEventListener("scroll", requestScrollFrame, { passive: true });
  window.addEventListener("resize", requestScrollFrame);
  window.addEventListener("pageshow", requestScrollFrame);
  wideScene.addEventListener("change", buildScrollScenes);
  document.fonts.ready.then(requestScrollFrame);
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
