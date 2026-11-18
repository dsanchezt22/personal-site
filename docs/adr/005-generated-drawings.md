# Detailed drawings, generated at build time

2026-11-17. Extends ADR 004.

Diego found the first drawn draft far too plain next to toryn.bio and asked for that level of granular detail, still dynamic. Drawing that density by hand-typing SVG is not maintainable, and copying the reference's art is not an option.

The drawings are original and are produced by code in scripts/art from fixed seeds, so the same source always yields the same picture. index.html marks where each goes with `<!--art:name-->`; scripts/build.mjs inlines them into dist/index.html. Nothing is generated in the browser and no dependency was added.

- The hero board places parts by hand on a 10px grid and a small maze router draws the copper between them, keeping an empty area for the name. The hero copy is sized in the drawing's own unit so the two scale together.
- Every other drawing is built from the same kit: opaque outlined shapes back to front, pencil hatching, and colour washes in a separate layer multiplied over the ink.
- The hand-drawn look is an SVG displacement filter applied to ink and to CSS borders, not jitter baked into the paths, which keeps the markup small.
- Movement is limited to a colour spot that follows the pointer on the hero, pulses on a few traces, one small animation per card on hover, and a fade-in on scroll. All of it is off under reduced motion.

The built page is about 420 kB (about 105 kB compressed), nearly all of it path data. If that needs to shrink, the first move is fewer routed nets and coarser hatching, not a different format.
