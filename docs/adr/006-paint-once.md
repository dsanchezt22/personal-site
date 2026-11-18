# Filtered drawings are painted once; what moves gets its own layer

2026-11-18. Extends ADR 005.

Diego found the first screen laggy. Traces showed why. The hand wobble is an SVG filter (turbulence plus displacement), and a browser re-runs a filter over its whole area whenever anything in the same layer changes. Three things changed inside filtered drawings:

- the hero's trace pulses (SMIL), on every frame, forever, even with the hero scrolled away;
- the hero's colour spot, a mask position updated on every pointer move;
- the experience trace: its gold length on every scroll frame, its spark's halo continuously, and each tap for a third of a second as a board powered on.

With the CPU slowed 4x at 1440x900 at 2x density, the idle first screen ran at 48 fps on a real GPU and cost 4 s of raster every 5 s without one; moving the pointer over the hero without a GPU ran at 38 fps. The numbers are in the pull request that added this record.

## Decision

A filtered drawing is painted once. Anything that moves is a separate layer, changed only through `transform` or `opacity`.

- Hero pulses are CSS keyframes (translate along the trace's corners, fade in and out) on circles in their own svg, generated in scripts/art/pcb.mjs.
- The hero's colour spot is a round window (`.pcb-spot`) moved by transform, with the wash inside moved back by the same amount. Container query units give the layer the drawing's exact scale.
- The experience trace is three stacked drawings: the copper, which never changes; the gold trace, drawn whole inside a window (`.cut`) whose lower edge is moved to the signal; and the pads and taps on top. The spark is an element of its own.
- In the trace the wobble filter goes on groups inside each svg, not on the svg element. A filter's area is then the group's own box, not the whole section, and it is baked into the layer instead of being re-applied by the compositor. The noise is anchored to the svg's coordinates, so separately filtered groups in drawings of the same size still line up.

scripts/check-site.py refuses SMIL in the page. The verification skill's perf/measure.sh reproduces the traces.

## Consequences

- The picture is unchanged: before and after screenshots of the hero match to within 2/255 per channel, and of the trace to within a one-pixel anti-aliasing fringe.
- A filtered group needs a box with width and height. A group holding only a straight line has neither and is not drawn at all, which is why the gold trace carries an unseen strut and each tap is grouped with its pads.
- Still repainting, by choice: the colour wash fading in as a card first scrolls into view, and the small movement inside a card while it is hovered. Both are short and limited to one drawing. Fixing them means splitting every drawing into an ink svg and a wash svg.
- The paper grain was measured and left alone; removing it changed nothing.
- Not measured in Safari or Firefox. Neither composites animations on svg children, so there the hero pulses repaint their own unfiltered layer, which is cheap; the board below is still painted once.
