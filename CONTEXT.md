# Personal portfolio

Diego Sanchez Tirado's portfolio at diegosancheztirado.com introduces his Stanford electrical engineering, research, hardware, and software work. GitHub, LinkedIn, and his current resume are prominent. Verdnt Group is one part of his experience, not the site's identity.

On 2026-10-12 Diego requested a beverage-inspired introduction and the continuous scroll experience of https://logartis.info. He clarified that separate section animations were insufficient: ice should automatically drop into a glass of water, which becomes the opening of one fluid scene. The current design uses one persistent 3D personal workspace and one reversible camera path through six chapters. The glass remains in that workspace. The previous tea illustration and test-kitchen slogan are removed. The introduction is automatic; Skip and Replay are optional controls. The general headline is "Ideas into things that work."

He confirmed Verdnt Group as the company name and asked to feature CMUX and Pi coursework for the Modern Software Developer course. He explicitly approved building and verifying directly in Codex after Firstmate startup failed.

Sources: the supplied DiegoSanchezTirado_Resume.pdf; the existing public portfolio; CS146S assignment writeups summarized without private data; confirmed public winery demos; upstream CMUX and Pi repositories. Tool links do not claim authorship or merged contributions. Private course submissions and client internals are not published.

Runtime: static HTML and CSS, with Three.js for the shared scene and esbuild for bundled JavaScript. Native document scrolling controls the camera. Native dialogs hold project details. Without JavaScript, all text remains accessible in document order. Motion off, system reduced motion, or unavailable WebGL uses a readable layout. Rendering stops at rest and while the tab is hidden. The explicit build allowlist excludes source notes and unused artwork from deployment. The existing Cloudflare Worker and domains remain the target.

Acceptance requires observing the automatic ice introduction, comparing actual scene viewpoints at different scroll positions, reversing scroll, checking all detail dialogs, and testing readable mode and responsive layouts. See docs/adr/002-continuous-personal-world.md and the project verification skill.
