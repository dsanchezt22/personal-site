# Personal portfolio

Diego Sanchez Tirado's public portfolio at diegosancheztirado.com introduces his Stanford electrical engineering, research, hardware, and applied AI work. GitHub, LinkedIn, and the current resume are prominent.

On 2026-10-12 Diego requested a food or beverage theme inspired by https://logartis.info, including its entrance and animations. He confirmed Verdnt Group as the company name and requested CMUX and Pi work in the Modern Software Developer course section. He explicitly approved building and verifying directly in Codex after Firstmate startup failed.

Sources: the supplied DiegoSanchezTirado_Resume.pdf; the existing public portfolio; CS146S assignment writeups summarized without private data; confirmed public winery demos; upstream CMUX and Pi repositories. Tool links do not claim authorship or merged contributions. Private course submissions and client internals are not published.

Runtime: static HTML, CSS, and JavaScript. The build copies an explicit allowlist, fonts, and original artwork to dist. The existing Cloudflare Worker and domain remain the target.

Diego's follow-up identified that light hero parallax did not satisfy the Logartis reference. Scroll position now drives reversible native animations across the hero, beverage, research, and course scenes. The hero and bottle pin on large screens; smaller screens use normal document flow. Acceptance requires comparing actual rendered transforms at different scroll positions, including reversal and motion-off behavior.
