---
name: verify-personal-site
description: Build and verify Diego's personal portfolio, including the entrance, motion and sound controls, responsive layouts, project links, and current resume.
---

# Verify the personal site

## Launch and doctor

Run `npm run verify`. This builds dist, syntax-checks JavaScript, serves the built artifact on loopback port 8791, checks every local link/asset and the exact resume bytes, and stops only its own server. Evidence is in docs/qa/runtime.

For browser work, run `npm run build`, then `python3 server.py`. This serves dist at http://127.0.0.1:8790. `PORT` can select an unused port. Require HTTP 200, X-Content-Type-Options: nosniff, and Referrer-Policy: no-referrer. Rebuild and reload after edits.

## Drive

Follow every entry in features/README.md. Use a fresh tab without a fragment for the first-visit entrance. The entrance is remembered within that tab's session. Deep links and reduced-motion visitors bypass it. Keep evidence for desktop 1440x900, phone 390x844, and narrow 320x568; verify document width does not exceed viewport width. Check all images and fonts load, text is unobscured, and console errors are absent.

## Evidence and cleanup

Store screenshots and observed outcomes in docs/qa/runtime. Read the screenshots, not just dimensions. Stop only the manually launched server PID when finished, unless leaving the preview open for the owner. Never claim the generated chime was listened to from a screenshot or pressed state alone.
