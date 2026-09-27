# Brief: Diego Tirado personal website (v1)

## Goal
Build Diego's personal website: recruiting-first portfolio (hardware/computer-architecture + AI/SWE internships, Summer 2027), with a small About section. It must look premium: clean, minimal, lots of whitespace, a primarily white / grey / black palette, and subtle, tasteful background animations.

## Content: real facts only
- Source everything from Diego's vault: ~/SecondBrain/70-OS/profile/career.md, profile/school.md, profile/personal.md, 70-OS/playbooks/career.md, 10-Projects/*, and relevant 30-Knowledge/40-Specs notes (e.g. FS-AI, Duna, DOS/Velvet Console, autonomous dev workflow). Also ~/apps/calorie-tracking-app (Plate Scanner) README/FEATURES.
- NEVER invent facts: no made-up GPAs, dates, employers, metrics, awards, links. If something is unknown (email, LinkedIn URL, headshot, resume PDF), use an obvious placeholder marked `TODO(Diego)` and list every placeholder in the status file.
- Nothing private: no health/fitness/weight, journal, relationships, finances, internal IPs, tailnet hostnames or private URLs. Trus is retired; only mention if the vault frames it as a past project worth showing.
- Sections: Hero (name, one-line positioning), About (short), Projects (3 to 6 cards: what it is, what he built, stack, link placeholder), Experience, Education, Skills (compact), Contact. Resume download link (placeholder if no PDF).

## Design done-bar
- Palette: white/off-white background, near-black text, greys for secondary. At most one very restrained accent, or none. Offer a dark mode that follows the system setting (black/grey) with a toggle.
- Typography: one clean sans (e.g. Inter or similar, self-hosted or system stack), three type sizes max plus the hero, generous line height.
- Background animation: subtle and slow (e.g. drifting grid/dot field, soft noise gradient, or particle lines reacting gently to the cursor) on canvas or CSS. It must never hurt readability, must stay at 60fps on a phone, must pause when the tab is hidden, and must respect `prefers-reduced-motion` (static fallback).
- Light scroll-reveal motion on sections is fine; no gimmicks.
- Fully responsive: 390×844, 375×667, 320×568, 768, 1280, 1440. No text overflow or collisions anywhere.
- Lighthouse-quality: fast (static, no heavy framework needed; plain HTML/CSS/JS or Astro/Vite static build is fine), accessible contrast, semantic HTML, meta/OG tags, favicon.

## Build + preview (do NOT publish publicly)
- Create at ~/apps/personal-site with git. If `gh` is authenticated, create a PRIVATE GitHub repo `personal-site` and push to main. Do not enable GitHub Pages or any public hosting.
- Serve a private preview: a user systemd service `personal-site.service` serving the built site on localhost:8790, then expose it on the tailnet with `tailscale serve --bg --https=8443 http://localhost:8790`. Do NOT touch the existing :443 Serve config (it serves Plate Scanner).
- Visual QA loop: take headless screenshots at every viewport above in light and dark mode, check them yourself, fix and repeat until it truly looks clean and polished. Add an automated overflow check that fails on any overflowing text. Save shots to docs/qa/shots/site-*.png (include at least site-desktop-light.png, site-desktop-dark.png, site-mobile-light.png).

## Finish
Write docs/qa/SITE_STATUS.md with: PASS/FAIL, preview URL, what sections contain and which vault files they came from, every TODO(Diego) placeholder, animation approach, QA results. Commit and push.
