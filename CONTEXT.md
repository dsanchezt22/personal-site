# Personal portfolio

Diego Sanchez Tirado's portfolio at diegosancheztirado.com introduces his Stanford electrical engineering, research, hardware, and software work. GitHub, LinkedIn, and his current resume are prominent. Verdnt Group is one part of his experience, not the site's identity.

On 2026-11-17 Diego asked for the simple hand-drawn look of toryn.bio without its animation: one-word section titles (background, projects, contact) with an objective description line instead of taglines, a draggable project board whose cards open details on click, and X, LinkedIn, Email, and Resume linked. The page is white with black ink and grey line-art SVG; the monogram stays "dst". See docs/adr/004-drawn-simple-site.md, which supersedes the WebGL workspace of ADRs 002 and 003.

He confirmed Verdnt Group as the company name and asked to feature CMUX and Pi coursework for the Modern Software Developer course. He explicitly approved building and verifying directly in Codex after Firstmate startup failed.

Sources: the current Resume_DiegoSanchezTirado.pdf supplied on 2026-10-28; the existing public portfolio; CS146S assignment writeups summarized without private data; confirmed public winery demos; upstream CMUX and Pi repositories. Tool links do not claim authorship or merged contributions. Private course submissions and client internals are not published.

Runtime: static HTML, CSS, and a small main.js bundled by esbuild, with no runtime dependency. Native dialogs hold project details. The project board drags with pointer events at 760px and wider and becomes a plain list below that. X and LinkedIn URLs come from the SOCIALS constant in main.js. Without JavaScript all section text remains readable. The explicit build allowlist excludes source notes and unused artwork from deployment. The existing Cloudflare Worker and domains remain the target.

Acceptance requires dragging a card without opening it, clicking and keyboard-opening every dialog, and checking responsive layouts. See the project verification skill.
