export const INTRO_DURATION = 2.2;

export function chapterState(progress, count) {
  const position = Math.max(0, Math.min(1, progress)) * (count - 1);
  const index = Math.round(position);
  const offset = position - index;
  const opacity = Math.max(0, 1 - Math.abs(offset) * 2.5);
  return { index, offset, opacity: opacity * opacity * (3 - 2 * opacity) };
}

// Accelerate into the socket, then settle with a small damped contact response.
export function chipHeight(time, lift = 2) {
  const contact = 0.56;
  const falling = Math.max(0, Math.min(1, time / contact));
  if (time < contact) return 0.27 + lift * (1 - falling * falling);
  const elapsed = time - contact;
  if (elapsed > 0.3) return 0.27;
  return 0.27 + Math.abs(Math.sin(elapsed * 24)) * Math.exp(-elapsed * 18) * 0.035;
}
