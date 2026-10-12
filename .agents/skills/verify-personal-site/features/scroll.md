# Scroll-driven scenes

The opening tea landscape and Verdnt bottle are pinned while scrolling on viewports at least 901px wide and 700px high. The hero zooms while the introduction gives way to "From the lab to the test kitchen." The bottle rotates and fills, and its surrounding signals move. Research rotates the memory mesh; the course notebook moves into place. Text transitions accompany these scenes.

These are continuous, reversible scroll animations. A screenshot of the initial page does not prove this feature. On smaller screens, scenes stay in the normal document flow and their artwork still responds to scrolling. Motion off cancels animations and removes extra pinned-scene space without moving the current content. System reduced motion disables the control and keeps the ordinary static layout.

## Regression check

Open the built page in a real browser at 1440x900, enter, then scroll about 700px. Verify the hero remains at the top while the artwork enlarges and the text changes. Scroll backward and verify the original introduction returns. Use keyboard Tab to verify focused hero links remain visible during this transition.

Navigate to Applied AI, allow the anchor navigation to settle, and run this assert-based check with `tab` bound to the preview through cua_repl. This exercises the original symptom, not just the presence of an event listener:

```js
const before = await tab.playwright.locator('.tea-bottle').evaluate(el => getComputedStyle(el).transform);
await tab.scroll([700, 600], 'down', 0.6);
await tab.getAXState({emit: false});
const after = await tab.playwright.locator('.tea-bottle').evaluate(el => getComputedStyle(el).transform);
if (before === after) throw new Error('Bottle remains static while scrolling');
```

Check the liquid height changes too. Scroll backward and require the earlier pose to return. Repeat the transform comparison for `.memory-mesh` and `.course-notebook` within their sections. Turn Motion off in a pinned scene: its content must retain the same viewport position within 2px. Scroll again and require its transform to remain unchanged. Turn it back on and verify movement returns.

Inspect the completed text transition and artwork at 1440x900, a short desktop at 1440x720, tablet 814x900, phone 390x844, and narrow phone 320x568. No horizontal overflow, clipped text, or overlapping notebook text. Exercise work-category links and replay/skip/Escape again. Record screenshots, before/after transforms, disabled-state observations, and console errors in docs/qa/runtime. Report OS preference emulation and other-browser coverage separately from the manual Motion off control.
