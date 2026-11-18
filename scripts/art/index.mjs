// All of the site's drawings, keyed by the <!--art:name--> placeholder they fill.
import { pcb } from "./pcb.mjs";
import { projectsA } from "./projects-a.mjs";
import { projectsB } from "./projects-b.mjs";
import { scenes } from "./scenes.mjs";
import { stops } from "./stops.mjs";

// Hand wobble: every stroke is nudged by smooth noise, so no line is ruler-straight.
const wobble = (id, freq, scale) =>
  `<filter id="${id}" x="-3%" y="-3%" width="106%" height="106%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/></filter>`;

export const art = {
  defs: `<svg class="defs" width="0" height="0" aria-hidden="true"><defs>${wobble("ink-hero", 0.018, 3.2)}${wobble("ink", 0.03, 2.6)}${wobble("ink-ui", 0.04, 2.2)}</defs></svg>`,
  hero: pcb(),
  ...projectsA,
  ...projectsB,
  ...scenes,
  ...stops,
};
