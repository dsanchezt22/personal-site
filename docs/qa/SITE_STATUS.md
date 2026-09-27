# Site status

**PASS**

Private preview only. GitHub Pages is not enabled. The existing Tailscale Serve on port 443 still proxies to Plate Scanner at `127.0.0.1:8765`.

## Preview

| Surface | URL |
| --- | --- |
| Loopback | http://127.0.0.1:8790/ |
| Tailnet | https://diegospc.tail9d2968.ts.net:8443/ |

User service `personal-site.service` is enabled and running (`python3 server.py`, bound to `127.0.0.1:8790`). Tailscale Serve was added with `--https=8443` only.

After that change, `tailscale serve status` still showed `:443` → `http://127.0.0.1:8765` and `:8443` → `http://127.0.0.1:8790`. HTTPS to both ports on this node returned 200. Port 443 still serves the Plate Scanner document. Port 8443 serves this site. This machine’s system resolver did not answer MagicDNS; the check used the node’s Tailscale address with the MagicDNS host name.

## Sections and sources

Facts are only what the vault, the resume rebuild, the Plate Scanner repo, or a verified public page actually say. No GPA, awards, employers, dates, or metrics were added.

| Section | What it contains | Sources |
| --- | --- | --- |
| Hero | Diego Sanchez Tirado. Stanford EE, class of 2029. Positioning for Summer 2027 internships in hardware, memory systems, and AI/SWE. | `70-OS/career/research/rebuild/DiegoSanchezTirado_Resume.tex`; `70-OS/profile/career.md` (class of 2029, Summer 2027 SWE and AI/ML) |
| About | B.S. EE expected May 2029. Lean toward VLSI, chip manufacturing, and circuit design. Research in the Engineering Robust Systems Group with Prof. Subhasish Mitra. Developer at Duna Strategies. Summer 2026 Amazon Lab126 internship (software and humanoid robotics). Shipped Trus v2, now focused on Duna. | Resume; `70-OS/profile/personal.md` (VLSI lean, Duna for SMBs); `70-OS/profile/work.md` (Trus set aside to focus on Duna); `70-OS/profile/career.md` (shipped Trus v2) |
| Work | Six projects: area-scalable memory models; Trus; FStea; Plate Scanner; D.O.S. / Velvet; hardware builds (piezo harvester, split keyboard, free-air ANC). | Resume research, projects, and Duna bullet; `10-Projects/FS-AI-Modules-7-11.md`; `~/personal-os/README.md` (Next.js, FastAPI, Python, event-sourced SQLite, v2); public `dsanchezt22/Generative-Workspace` README (JSON config, trusted component library); `~/apps/calorie-tracking-app/README.md` and `docs/prototype/FEATURES.md`; `40-Specs/2026-08-11-dos-v2-whiteboard-os.md` and `40-Specs/2026-08-18-warden-companion-enforcer.md` (Velvet, deterministic fallback, v3 built); `70-OS/profile/personal.md` (domain agents and chief of staff) |
| Experience | Duna Strategies (Apr 2026–present), Robust Systems Group (Jan 2026–present), Amazon Lab126 software internship and humanoid apprenticeship (June–Sept 2026), Code Four (July–Oct 2025), Duke Pratt & Digi Americas (Mar 2024–July 2025). Numbers match the resume. | Resume; Duna’s public site `https://dunastrategies.com` (verified 2026-09-26; employer name on the resume is Duna Strategies) |
| Education | Stanford B.S. EE, Sept 2025–May 2029. Coursework from the resume plus CS/CME numbers from the school profile. Autumn 2026: EE 101A, EE 100, CS 329Z, ARCHLGY 151. NCSSM courses. FTC RoboKnights 8569, 5th of 390. | Resume; `70-OS/profile/school.md` |
| Skills | Hardware, architecture, languages (including English and Spanish), ML/systems, CAD/tools. | Resume skills block |
| Contact | Email, phone, GitHub, resume PDF, Stanford, CA. | Resume header; GitHub account `dsanchezt22` (profile name Diego Sanchez Tirado) |

The resume download is the vault PDF `70-OS/career/research/rebuild/DiegoSanchezTirado_Resume.pdf`, copied as `Diego-Sanchez-Tirado-Resume.pdf`.

Left off the page on purpose: health and fitness, finance, journal, housing, travel, cofounder notes, tailnet hostnames, and private URLs. Trus is included because `career.md` lists shipped Trus v2 as a lead fact and `work.md` records it as past.

## TODO(Diego)

| Placeholder | Why |
| --- | --- |
| LinkedIn `TODO(Diego)` | No LinkedIn URL in the vault. |
| Headshot `TODO(Diego)` | No photo in the vault. The page is type only. |
| Area-scalable memory, public link `TODO(Diego)` | No public paper or repo in the vault. |
| Trus source `TODO(Diego)` | Canonical repo `personal-os` is private. `trus.dev` is linked because career notes name it. On 2026-09-26 that host returned HTTP 502. |
| FStea collectors `TODO(Diego)` | Production collectors are not in a public repo. The Node cockpit is linked: `https://github.com/dsanchezt22/FSTea`. |
| Plate Scanner, public link `TODO(Diego)` | No public URL. The app repo is private. |
| D.O.S., public link `TODO(Diego)` | Private system. No public URL. |
| Hardware builds, public link `TODO(Diego)` | No public write-up in the vault. |

Not placeholders: email `dsanchezt22@gmail.com`, phone `(984) 895-6386`, GitHub, resume PDF, `trus.dev`, FStea cockpit, Duna Strategies site.

## Animation

A full-viewport canvas draws a slow dot field (`fillRect` only). Dots drift a few pixels per second and, on a fine pointer, ease away from the cursor inside a small radius. Device pixel ratio is capped at 1.5. The loop pauses when `document.hidden` is true. `prefers-reduced-motion: reduce` paints one static frame and does not start the loop. Sections below the hero fade in on scroll; that fade is turned off for reduced motion. Type is self-hosted Inter (400/500/600, latin, SIL OFL in `fonts/OFL.txt`). Sizes are the hero plus 22px, 17px, and 13px.

## QA

Automated check: `node docs/qa/overflow_check.mjs` (headless Chromium). Latest run passed.

| Check | Result |
| --- | --- |
| Horizontal overflow at 320×568, 375×667, 390×844, 768×1024, 1280×800, 1440×900, light and dark | None |
| Contrast, light | Ink 16.0:1, muted 8.0:1 on `#f3f2ee` |
| Contrast, dark | Ink 16.2:1, muted 8.1:1 on `#0e0e0c` |
| Theme | System dark, then toggle to light, then back to dark. Background and button label followed. |
| Reduced motion | Field mode `static`. Frame count did not increase over 600ms. |
| Frame rate proxy | 60 frames in 1s at 390×844, device pixel ratio 2, CPU throttled 4×. Not a physical-phone trace. |
| Resume | `GET /Diego-Sanchez-Tirado-Resume.pdf` → 200, `application/pdf`, 130287 bytes |
| Banned strings on the page | None (`ts.net`, tailnet host, `diegospc`, `localhost`, Janus/Janice, home path) |

Shots are in `docs/qa/shots/`, including `site-desktop-light.png`, `site-desktop-dark.png`, and `site-mobile-light.png`, plus light and dark full pages at every viewport above. Machine-readable output is `docs/qa/overflow-results.json`.

Visual pass: the first screenshots showed dates in a narrow side column breaking so a year or the word “present” sat alone (`Sept 2025 – May` / `2029`, `Jan 2026 –` / `present`). Dates now sit on the title row and do not break mid-range. Rechecked hero, work, experience, education, skills, and contact in light, and the hero and work in dark, including 320, 375, 390, 768, and 1440. Nav and the theme control do not collide at 320. The name fits. Body text stays inside the column. No browser-extension tooling was available; review was headless Chromium plus reading those screenshots.
