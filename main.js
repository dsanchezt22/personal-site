// Every X/LinkedIn link on the page uses these.
const SOCIALS = {
  x: "https://x.com/hnsmsquidwrd",
  linkedin: "https://www.linkedin.com/in/diego-sanchez-tirado",
};

for (const link of document.querySelectorAll("[data-social]")) {
  link.href = SOCIALS[link.dataset.social];
}

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
hero.addEventListener("pointermove", (event) => {
  const box = hero.getBoundingClientRect();
  hero.style.setProperty("--mx", `${event.clientX - box.left}px`);
  hero.style.setProperty("--my", `${event.clientY - box.top}px`);
});

// Experience circuit: a trace runs past every stop. Scrolling energises it from the
// top, and each stop switches on, showing what is inside, when the signal reaches it.
// With reduced motion the whole trace is live and every stop is on.
const circuit = document.querySelector(".circuit");
const stops = [...circuit.querySelectorAll(".stop")];
const animate = matchMedia("(prefers-reduced-motion: no-preference)").matches;
const wire = document.createElementNS("http://www.w3.org/2000/svg", "svg");
wire.setAttribute("class", "wire");
wire.setAttribute("aria-hidden", "true");
wire.innerHTML = '<path class="co"/><path class="ci"/><path class="hot"/><g></g><circle class="halo" r="11"/><circle class="spark" r="4.5"/>';
circuit.prepend(wire);
circuit.classList.add("wired");
const [copper, core, hot, pads, halo, spark] = wire.children;
let bus = [];
let taps = [];
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
  hot.setAttribute("d", line);
  pads.innerHTML =
    stubs.map((d, i) => `<path class="stub${stops[i].classList.contains("on") ? " lit" : ""}" pathLength="1" d="${d}"/>`).join("") +
    taps.map((tap) => `<circle class="pad" cx="${tap.x}" cy="${tap.y}" r="5"/><circle class="pad" cx="${tap.end}" cy="${tap.y}" r="4"/>`).join("") +
    `<circle class="pad" cx="${mid}" cy="0" r="6"/><path class="gnd" d="M${endX - 11} ${endY + 46}h22M${endX - 7} ${endY + 51}h14M${endX - 3} ${endY + 56}h6"/>`;
  energise();
}

function energise() {
  const end = bus.at(-1)[1];
  const reach = animate ? Math.min(Math.max(innerHeight * 0.62 - circuit.getBoundingClientRect().top, 0), end) : end;
  let done = 0;
  let total = 0;
  let tip = bus[0];
  for (let i = 1; i < bus.length; i++) {
    const [ax, ay] = bus[i - 1];
    const [bx, by] = bus[i];
    const length = Math.hypot(bx - ax, by - ay);
    total += length;
    if (reach >= by) {
      done += length;
      tip = bus[i];
    } else if (reach > ay) {
      const part = (reach - ay) / (by - ay);
      done += length * part;
      tip = [ax + (bx - ax) * part, reach];
    }
  }
  hot.style.strokeDasharray = `${done} ${total}`;
  for (const dot of [halo, spark]) {
    dot.setAttribute("cx", tip[0]);
    dot.setAttribute("cy", tip[1]);
    dot.style.display = animate && reach > 0 && reach < end ? "" : "none";
  }
  stops.forEach((stop, i) => {
    const on = reach >= taps[i].y;
    stop.classList.toggle("on", on);
    pads.children[i].classList.toggle("lit", on);
  });
}
route();
new ResizeObserver(route).observe(circuit);
addEventListener("scroll", energise, { passive: true });

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
  if (!card || !canDrag.matches || event.button !== 0) return;
  const box = board.getBoundingClientRect();
  suppressClick = false;
  drag = {
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
  if (!drag) return;
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

function endDrag() {
  if (!drag) return;
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
