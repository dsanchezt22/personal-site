# Simple drawn site with a project board

2026-11-17. Supersedes the WebGL workspace, intro, and motion/sound controls of ADRs 002 and 003.

Diego asked for the simple hand-drawn look of toryn.bio, without its animation: plain one-word section titles with an objective description instead of taglines, a project overview whose items can be dragged and then clicked for detail, and X, LinkedIn, Email, and Resume all linked.

The page is now static white paper with grey line-art SVG (a circuit board in the hero, one small original drawing per project). Three.js, the intro, and the motion and sound controls are removed. Sections are background, projects, and contact. Projects is a board of draggable cards (pointer events, mouse and touch) at 760px and wider; a click opens the existing native dialog. Below 760px the board is a plain list so touch scrolling is never trapped. Cards are buttons in DOM order, so keyboard users get the same list. X and LinkedIn URLs are static hrefs in index.html.
