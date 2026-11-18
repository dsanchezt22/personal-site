# Project board

At 760px and wider, #work is a dotted board of tilted double-bordered cards (one line drawing, one-word category, title, one-line description). Cards drag with mouse or touch inside the board; a drag is not a click and opens nothing. A plain click opens that project's native dialog. Below 760px the board is a plain stacked list with no dragging, so touch scrolling is never trapped.

Cards: Memory for AI inference (Research, #research), ErgoTouch, A bike rebuilt, Logic you can touch (Hardware), Course notebook (Software, #developer), FStea AI (AI, #verdnt), A better winery day, Plate Scanner (AI). The course dialog names CS146S, CMUX, and Pi with three ordered week notes, never the private assignment repository. The winery dialog links both public demos and labels them fictional independent demos.

Drive a real drag (`chrome-devtools-axi drag @card @target`) and confirm the card's `--x/--y` changed and no dialog opened; then click a card and confirm its dialog opens. Tab to a card and press Enter to open it. Close with the Close button, Escape, and a backdrop click; focus returns to the card. Check dialogs at 320 and 390 pixels.
