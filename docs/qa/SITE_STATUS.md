# Portfolio verification

Updated 2026-10-12 for the beverage-themed portfolio.

Current checks are `npm run verify` and `.agents/skills/verify-personal-site/SKILL.md`. The previous dot-field/theme screenshots and overflow_check.mjs in this directory are historical artifacts from the earlier design, not current acceptance evidence.

Verified locally on the built artifact:

- Entrance, Step inside, skip-to-work, replay, keyboard Tab and Escape, and focus handoff.
- Motion on/off and optional sound on/off controls, with no browser console errors. Audio quality was not evaluated by listening.
- All section navigation and the course notebook.
- Responsive widths 320, 390, 814, and 1440. A one-pixel decorative-orbit overflow at 320 was reproduced and corrected.
- Every local anchor and linked asset through the real HTTP server, including correct security headers.
- The served resume matches the user's supplied PDF exactly: SHA-256 8820fcd0ea3ceb33e77a7b95f49a33dc4a86919b432e7a8b539195463a1a5ae5.
- GitHub profile, course, CMUX, Pi, and both winery demos return HTTP 200. LinkedIn is the exact URL in the supplied resume.
- JavaScript syntax, formatting, and Wrangler dry-run packaging pass.

Screenshots and machine-readable browser observations are retained locally in docs/qa/runtime (gitignored). The OS reduced-motion preference is implemented using matchMedia and CSS; changing the OS preference was not exercised in this browser session. No JavaScript-disabled browser session was exercised.

The existing Cloudflare Worker is diego-personal-site. Domain and DNS settings are outside this change. Source changes include an automated GitHub Actions check for the built artifact.
