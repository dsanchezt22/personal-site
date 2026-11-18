# Personal site verification

Updated 2026-11-17 for the drawn site: generated line art, the draggable project board with detail dialogs, the experience circuit, hobbies, and contact links. Earlier evidence for the WebGL scene, tea hero, and bottle versions is historical and does not describe this version.

The acceptance workflow is `npm run verify` plus `.agents/skills/verify-personal-site/SKILL.md` on the built artifact.

`npm run verify` builds dist, syntax-checks main.js, serves the build, and runs scripts/check-site.py. That check covers:

- HTTP 200 with nosniff and no-referrer headers, unique IDs, every local anchor and asset, and served JavaScript and CSS matching dist.
- Every drawing placeholder filled, nine project cards each with a dialog, six experience stops open without JavaScript, and five hobbies.
- X, LinkedIn, email, resume, GitHub, cmux and its two pull requests, Pi, and the Realization Engine links. The served resume matches the source PDF byte for byte.
- Removed content stays out: the WebGL scene and intro, winery demos, plate scanner, course notebook, and private assignment links.

Browser drives (desktop 1440x900, phone 390x844, narrow 320x568, board drag and dialogs, circuit scrolling, console errors) follow features/README.md in the skill. Their screenshots and observations are local and gitignored in docs/qa/runtime.

Coverage limits: Chrome responsive emulation is not physical mobile-device testing. Safari, Firefox, and JavaScript-disabled browsing are not driven end to end. Domain and DNS settings are unchanged; the target remains the existing diego-personal-site Cloudflare Worker.
