# Personal workspace verification

Updated 2026-10-12 for the single continuous scene. Earlier tea-hero, bottle, and independent section-animation evidence is historical and does not describe this version.

The current acceptance workflow is `npm run verify` plus `.agents/skills/verify-personal-site/SKILL.md` on the built artifact.

Verified in real Chrome:

- A fresh visit starts the ice-and-water introduction without a click. The camera automatically pulls back into the personal workspace. Skip, Escape, replay, and session reload work. The old headline and hero are absent.
- One canvas persists across all six chapters. Desktop camera positions were recorded at progress 0, .2, .4, .6, .8, and 1. Actual wheel scrolling changes the camera between those stops; reverse scrolling retraces it. Screenshots show the same objects from changing viewpoints.
- A keyboard focus transition from an intermediate camera position settles to readable copy. Native dialogs open, scroll, close with a button or Escape, and return focus to their triggers. All four detail dialogs were driven.
- Motion off restores the readable document. After scrolling from Software to About in that mode, turning motion on retains About. Resizing from a narrow phone to tablet preserves the software chapter at approximately .6001 rather than jumping to another section.
- Responsive layouts were inspected at 1440x900, 1440x720, 814x900, 390x844, and 320x568. All six desktop copy blocks fit above the footer. Phone and tablet layouts show no horizontal overflow or clipped headings. Course notes and project dialogs remain readable at 320 pixels.
- Sound starts off and its on/off controls work without console errors. Audio quality was not evaluated by listening.
- No warnings or errors appeared in the fresh final browser tab.
- Every local link, asset, anchor, and current JavaScript bundle is checked through HTTP, with expected security headers. The served resume matches the supplied PDF: SHA-256 8820fcd0ea3ceb33e77a7b95f49a33dc4a86919b432e7a8b539195463a1a5ae5.
- GitHub, LinkedIn, course, CMUX, Pi, and independent demo destinations are retained. Private assignments and client internals are excluded.

Automated checks cover bounded chapter progress, readable stops, clear travel transitions, reversal, JavaScript syntax, artifact integrity, and the resume. Formatting and Wrangler dry-run packaging are included in release verification.

Screenshots and observations are local and gitignored in docs/qa/runtime, including world-journey.json, world-ice-intro.jpg, world-home.jpg, world-developer.jpg, world-mobile-home.jpg, world-short-desktop.jpg, and world-narrow-research.jpg. Live release checks are recorded there after deployment.

Coverage limits: Chrome responsive emulation is not physical mobile-device testing. Safari, Firefox, OS reduced-motion changes, WebGL context loss, and JavaScript-disabled browsing were not driven end to end. Their fallback paths were inspected in source. Domain and DNS settings are unchanged; the target remains the existing diego-personal-site Cloudflare Worker.
