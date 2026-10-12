# One continuous scene

One persistent canvas renders the workspace. Native scrolling continuously moves its camera between Home, About, Hardware and research, Software and tools, Applied AI, and Contact. Reversing scroll reverses that path. Copy appears at each viewpoint and fades during travel. Mobile uses the same scene with a higher viewpoint and copy below it. The glass remains part of the workspace across the entire journey.

## Regression check

Open the built page at 1440x900. Let the automatic introduction finish. Capture the Home view. Use actual wheel scrolling, not only anchor clicks, to move between viewpoints and reverse. Confirm the same objects are seen from changing perspectives, with no canvas replacement or isolated section graphics.

With `tab` bound through cua_repl, compare DOM-rendered camera metadata alongside screenshots:

```js
const before = await tab.playwright
  .locator("#world")
  .getAttribute("data-camera");
await tab.scroll([750, 600], "down", 1.4);
await tab.getAXState({ emit: false });
const after = await tab.playwright
  .locator("#world")
  .getAttribute("data-camera");
if (before === after) throw new Error("Camera remains static while scrolling");
if ((await tab.playwright.locator("canvas").count()) !== 1)
  throw new Error("Expected one shared world");
```

Allow smoothing to settle before screenshots. At exact chapter stops, data-progress is approximately index / 5; allow 0.001 for fractional viewport rounding. Reverse and require the preceding chapter and viewpoint to return. Check a midpoint too. Tab into a chapter link during a transition: it must settle to a readable viewpoint. Open the detail dialogs and use close/Escape.

Turn Motion off, scroll to another chapter, and turn it on again. The selected content must be preserved. Check a fresh direct hash and browser Back. Check 1440x900, 1440x720, 814x900, 390x844, and 320x568. Require no horizontal overflow, clipped headings, unreadable text, or controls hidden behind the footer. Record screenshots, camera comparisons, and console errors in docs/qa/runtime. Report real-device, other-browser, no-JavaScript, and OS preference coverage separately from manual motion-off testing.
