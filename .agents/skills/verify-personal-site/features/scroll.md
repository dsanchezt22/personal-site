# One continuous scene

One persistent canvas renders the workspace. Native scrolling continuously moves its camera between Home, About, Hardware and research, Software and tools, Applied AI, and Contact. Reversing scroll reverses that path. Copy appears at each viewpoint and fades during travel. Mobile uses the same scene with a higher viewpoint and copy below it. Floating circuit boards and connected binary digits drift behind the content throughout the journey. On fine-pointer devices they tilt and disperse around the cursor. Motion off hides these layers too.

## Regression check

Open the built page at 1440x900. Let the automatic introduction finish. Capture the Home view. Use actual wheel scrolling, not only anchor clicks, to move between viewpoints and reverse. Confirm the same objects are seen from changing perspectives, with no canvas replacement or isolated section graphics.

Use `chrome-devtools-axi scroll down` and `scroll up`, then compare DOM-rendered camera metadata alongside screenshots:

```bash
chrome-devtools-axi eval '() => ({camera: document.querySelector("#world").dataset.camera, progress: document.querySelector("#world").dataset.progress, canvases: document.querySelectorAll("canvas").length})'
chrome-devtools-axi scroll down
chrome-devtools-axi eval '() => document.querySelector("#world").dataset.camera'
```

Allow smoothing to settle before screenshots. At exact chapter stops, data-progress is approximately index / 5; allow 0.001 for fractional viewport rounding. Reverse and require the preceding chapter and viewpoint to return. Check a midpoint too. Tab into a chapter link during a transition: it must settle to a readable viewpoint. Open the detail dialogs and use close/Escape.

Turn Motion off, scroll to another chapter, and turn it on again. The selected content must be preserved. Check a fresh direct hash and browser Back. Check 1440x900, 1440x720, 814x900, 390x844, and 320x568. Require no horizontal overflow, clipped headings, unreadable text, or controls hidden behind the footer. Record screenshots, camera comparisons, and console errors in docs/qa/runtime. Report real-device, other-browser, no-JavaScript, and OS preference coverage separately from manual motion-off testing.

At desktop, hover across both sides of the scene and inspect board tilt and digit repulsion. Emulate `390x844x3,mobile,touch` and require a 1170x2532 canvas. At desktop DPR 1, require at least 1.5x sampling; large displays remain within 12 million pixels. Verify foreground copy remains readable.

Ambient motion continues at roughly 30fps without cursor input, and pauses behind dialogs and hidden tabs. Expect 10 boards and 64 binary glyphs on desktop, 6 boards and 48 glyphs on phone, with two instanced draw calls for the glyphs. Inspect `data-draw-calls` and `data-triangles` on the canvas when profiling. Geometry batching must preserve the keyboard, laptop, board, shadows, and animated processor. Use the CPU-throttled phone recipe and same hardware for before/after comparisons; emulation does not prove physical phone GPU performance.
