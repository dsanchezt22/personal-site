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

board.addEventListener("pointermove", (event) => {
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
board.addEventListener("pointerup", endDrag);
board.addEventListener("pointercancel", endDrag);

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
