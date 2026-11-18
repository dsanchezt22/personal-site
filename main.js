// TODO(owner): confirm the X and LinkedIn profile URLs. Every X/LinkedIn link on the page uses these.
const SOCIALS = {
  x: "https://x.com/",
  linkedin: "https://www.linkedin.com/in/diego-sanchez-tirado",
};

for (const link of document.querySelectorAll("[data-social]")) {
  link.href = SOCIALS[link.dataset.social];
}

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
    document.getElementById(button.dataset.dialog).showModal();
  });
}
