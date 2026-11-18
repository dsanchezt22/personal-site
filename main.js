// Reveal styles only apply once this class is set, so the page reads fine without JavaScript.
document.documentElement.classList.add("js");
const seen = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("in");
      seen.unobserve(entry.target);
    }
  },
  { rootMargin: "0px 0px -8% 0px" },
);
for (const item of document.querySelectorAll(".reveal")) seen.observe(item);

// The hero board is coloured only around the pointer.
const hero = document.querySelector(".hero");
const spot = hero.querySelector(".pcb-spot");
hero.addEventListener("pointermove", (event) => {
  const box = hero.getBoundingClientRect();
  spot.style.setProperty("--mx", `${event.clientX - box.left}px`);
  spot.style.setProperty("--my", `${event.clientY - box.top}px`);
});

// Experience circuit: a trace runs past every stop. Scrolling energises it from the
// top, and each stop switches on, showing what is inside, when the signal reaches it.
// With reduced motion the whole trace is live and every stop is on.
const circuit = document.querySelector(".circuit");
const stops = [...circuit.querySelectorAll(".stop")];
const animate = matchMedia("(prefers-reduced-motion: no-preference)").matches;
// The gold trace is drawn whole, once, inside a window (.cut) whose lower edge is
// moved to the signal's position, and the spark is a small element of its own.
// Scrolling then only changes transforms: the wobble filter never runs again.
circuit.insertAdjacentHTML(
  "afterbegin",
  '<svg class="wire" aria-hidden="true"><path class="co"/><path class="ci"/><g></g></svg>' +
    '<div class="cut" aria-hidden="true"><div><svg class="wire"></svg></div></div><i class="spark" hidden></i>',
);
circuit.classList.add("wired");
const [wire, cut, spark] = circuit.children;
const [copper, core, pads] = wire.children;
const gold = cut.firstChild;
const lit = gold.firstChild;
let bus = [];
let taps = [];
let reached = NaN;
if (animate) circuit.classList.add("live");

// Lay the trace out from where the stops actually are.
function route() {
  const box = circuit.getBoundingClientRect();
  const phone = innerWidth < 760;
  const mid = phone ? 12 : box.width / 2;
  taps = stops.map((stop) => {
    const r = stop.getBoundingClientRect();
    const side = r.right - box.left < mid ? -1 : 1;
    return {
      y: r.top - box.top + 37,
      x: mid + (phone ? 0 : side * 12),
      end: side < 0 ? r.right - box.left + 9 : r.left - box.left - 9,
    };
  });
  bus = [[mid, 0]];
  for (const tap of taps) {
    const [x, y] = bus.at(-1);
    const jog = Math.abs(tap.x - x);
    if (jog && tap.y - 26 - jog > y) bus.push([x, tap.y - 26 - jog], [tap.x, tap.y - 26]);
    bus.push([tap.x, tap.y]);
  }
  const [endX, endY] = bus.at(-1);
  bus.push([endX, endY + 46]);
  const line = "M" + bus.map((point) => point.join(" ")).join("L");
  const stubs = taps.map((tap) => `M${tap.x} ${tap.y}H${tap.end}`);
  copper.setAttribute("d", line + stubs.join(""));
  core.setAttribute("d", line + stubs.join(""));
  // Pads and ground sit over the trace, so the gold layer carries its own copy of them.
  const over =
    taps.map((tap) => `<circle class="pad" cx="${tap.x}" cy="${tap.y}" r="5"/><circle class="pad" cx="${tap.end}" cy="${tap.y}" r="4"/>`).join("") +
    `<circle class="pad" cx="${mid}" cy="0" r="6"/><path class="gnd" d="M${endX - 11} ${endY + 46}h22M${endX - 7} ${endY + 51}h14M${endX - 3} ${endY + 56}h6"/>`;
  pads.innerHTML = stubs.map((d, i) => `<path class="stub${stops[i].classList.contains("on") ? " lit" : ""}" pathLength="1" d="${d}"/>`).join("") + over;
  lit.innerHTML = `<path class="hot" d="${line}"/><g>${over}</g>`;
  reached = NaN;
  energise();
}

function energise() {
  const end = bus.at(-1)[1];
  const reach = animate ? Math.min(Math.max(innerHeight * 0.62 - circuit.getBoundingClientRect().top, 0), end) : end;
  if (reach === reached) return;
  reached = reach;
  let tip = bus[0];
  for (let i = 1; i < bus.length; i++) {
    const [ax, ay] = bus[i - 1];
    const [bx, by] = bus[i];
    if (reach >= by) tip = bus[i];
    else if (reach > ay) tip = [ax + ((bx - ax) * (reach - ay)) / (by - ay), reach];
  }
  // At the end the window opens fully, so the trace's rounded end is not cut off.
  const open = reach < end ? `${reach}px` : "100%";
  cut.style.transform = `translateY(calc(${open} - 100%))`;
  gold.style.transform = `translateY(calc(100% - ${open}))`;
  spark.style.transform = `translate(${tip[0]}px, ${tip[1]}px)`;
  spark.hidden = !(animate && reach > 0 && reach < end);
  stops.forEach((stop, i) => {
    const on = reach >= taps[i].y;
    stop.classList.toggle("on", on);
    pads.children[i].classList.toggle("lit", on);
  });
}
route();
new ResizeObserver(route).observe(circuit);
addEventListener("scroll", energise, { passive: true });
// The trace hangs from the viewport, so its reach also changes when the window's height does.
addEventListener("resize", energise);

for (const dialog of document.querySelectorAll("dialog")) {
  dialog.querySelector(".close-dialog").addEventListener("click", () => dialog.close());
  // Clicking the backdrop closes the dialog.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

const board = document.querySelector(".board");
const canDrag = matchMedia("(min-width: 760px)");
let drag = null;
let top = 10;
let suppressClick = false;

board.addEventListener("pointerdown", (event) => {
  const card = event.target.closest(".card");
  if (!card || !canDrag.matches || event.button !== 0 || (drag && drag.id !== event.pointerId)) return;
  const box = board.getBoundingClientRect();
  suppressClick = false;
  drag = {
    id: event.pointerId,
    card,
    box,
    dx: event.clientX - box.left - card.offsetLeft,
    dy: event.clientY - box.top - card.offsetTop,
    startX: event.clientX,
    startY: event.clientY,
    moved: false,
  };
  card.style.zIndex = ++top;
});

addEventListener("pointermove", (event) => {
  if (drag?.id !== event.pointerId) return;
  const { card, box } = drag;
  if (!drag.moved && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 5) return;
  if (!drag.moved) {
    // Capture only once dragging starts; earlier capture retargets a plain click away from the button.
    card.setPointerCapture(event.pointerId);
    card.classList.add("dragging");
    drag.moved = true;
  }
  const x = Math.min(Math.max(event.clientX - box.left - drag.dx, 0), box.width - card.offsetWidth);
  const y = Math.min(Math.max(event.clientY - box.top - drag.dy, 0), box.height - card.offsetHeight);
  // Percentages keep the arrangement when the window is resized.
  card.style.setProperty("--x", `${(x / box.width) * 100}%`);
  card.style.setProperty("--y", `${(y / box.height) * 100}%`);
});

function endDrag(event) {
  if (drag?.id !== event.pointerId) return;
  drag.card.classList.remove("dragging");
  // A drag is not a click: ignore the click that follows pointerup.
  suppressClick = drag.moved;
  drag = null;
}
addEventListener("pointerup", endDrag);
addEventListener("pointercancel", endDrag);

for (const button of board.querySelectorAll("[data-dialog]")) {
  button.addEventListener("click", (event) => {
    const afterDrag = suppressClick && event.detail; // keyboard clicks have detail 0
    suppressClick = false;
    if (afterDrag) return;
    const dialog = document.getElementById(button.dataset.dialog);
    // The detail view opens with the card's drawing at full size.
    if (!dialog.querySelector(".art")) dialog.querySelector(".sheet").prepend(button.querySelector(".art").cloneNode(true));
    dialog.showModal();
  });
}
